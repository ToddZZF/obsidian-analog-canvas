import { flattenRichText, mirrorScale } from "@icm/model";
import { resolveVisualAnchor } from "./anchor.js";
import { resolveDocumentRoutingGeometry, } from "./resolved-route-geometry.js";
import { formulaExtents, fractionExtraAscentEm, fractionPartScale, measureRichTextDocument, richTextLinePitches, richTextMetrics, wrapRichTextDocument, } from "./rich-text-layout.js";
import { objectStyleProfile, resolveDocumentStyleProfile, } from "./style-profile.js";
import { arrowArtwork, arrowArtworkBounds } from "./arrow-artwork.js";
import { labelInkDescentEm, uprightTextInkBounds, uprightTextInkSpan, } from "./text-ink.js";
const STROKE_PADDING = 6;
/** Breathing room between a boxed label and the rectangle's own stroke. */
const RECT_LABEL_PADDING = 6;
/**
 * The content a drafting text actually lays out.
 *
 * A label anchored to a rectangle is a label *inside a box*, so it wraps to
 * that box instead of running out past its edges. Every other text keeps the
 * author's own lines exactly. The SVG renderer calls this too: one wrapped
 * document for both is what keeps the selection box on the text it frames,
 * rather than two implementations agreeing by luck.
 */
export function draftTextLayoutContent(document, object, metrics) {
    if (object.anchor.kind !== "object")
        return object.content;
    const anchorId = object.anchor.objectId;
    const target = document.drafting?.objects.find((candidate) => candidate.id === anchorId);
    if (target?.kind !== "rectangle")
        return object.content;
    return wrapRichTextDocument(object.content, metrics, target.width - RECT_LABEL_PADDING * 2);
}
const TEXT_PADDING_X = 6;
const TEXT_PADDING_Y = 8;
export function resolveDraftingObjectGeometry(document, resolver, object, resolvedRoutingGeometry) {
    // Resolving this per object rebuilt the whole Document's route geometry once
    // for every drafting object: a Project with 200 of them paid to resolve 1070
    // Routes 200 times, and the Scene build does it in both the bounds pass and
    // the render pass. Callers that already hold the Document's geometry pass it.
    const routingGeometry = resolvedRoutingGeometry ??
        resolveDocumentRoutingGeometry(document, resolver);
    switch (object.kind) {
        case "text":
            return resolveText(document, resolver, object, routingGeometry);
        case "arrow":
            return resolveArrow(document, resolver, object, routingGeometry);
        case "leader":
            return resolveLeader(document, resolver, object, routingGeometry);
        case "callout":
            return resolveCallout(document, resolver, object, routingGeometry);
        case "construction-line":
            return resolveConstructionLine(object);
        case "rectangle":
            return resolveRectangle(object);
        case "circle":
            return resolveCircle(object);
        case "floating-symbol":
            return resolveFloatingSymbol(document, resolver, object, routingGeometry);
    }
}
function resolveAnchorWithRole(document, resolver, anchor, draftingObjectId, anchorRole, routingGeometry) {
    const resolved = resolveVisualAnchor(document, resolver, anchor, routingGeometry);
    const diagnostics = [];
    if (!resolved.resolved && resolved.diagnostic) {
        // P2: propagate the precise code (missing target vs invalid route segment)
        // instead of collapsing every failure into one.
        const code = resolved.diagnostic.code === "DRAFTING_ROUTE_SEGMENT_INVALID"
            ? "DRAFTING_ROUTE_SEGMENT_INVALID"
            : "DRAFTING_ANCHOR_TARGET_MISSING";
        diagnostics.push({
            code,
            severity: "warning",
            draftingObjectId,
            anchorRole,
            targetObjectIds: resolved.diagnostic.objectId
                ? [resolved.diagnostic.objectId]
                : [],
            message: resolved.diagnostic.message,
        });
    }
    return { anchor: resolved, diagnostics };
}
// The resolved rotation is the layout bearing for multipart text notation.
// For a "follow" route anchor the anchor's own rotation composes with the
// object's persisted rotation; for free/object anchors the object rotation
// stands alone. Glyphs and notation strokes themselves remain screen-upright.
function composeRotation(anchorRotation, objectRotation, follow) {
    if (!follow)
        return objectRotation;
    const composed = (anchorRotation + objectRotation) % 360;
    return (((composed % 360) + 360) % 360);
}
function resolveText(document, resolver, object, routingGeometry) {
    return resolveTextWithInk(document, resolver, object, routingGeometry)
        .geometry;
}
/**
 * Free drawing text that draws words: polarity marks, which stand at
 * terminals on purpose, and blank text are left out. Findings about text
 * over a label or a wire look at these (#1323).
 */
export function drawnFreeTexts(document) {
    return (document.drafting?.objects ?? []).filter((object) => object.kind === "text" &&
        !object.polarity &&
        flattenRichText(object.content).trim() !== "");
}
/**
 * What a free text's words draw, capitals to subscripts, as a label's
 * inkBounds: its line box's empty ascent and descent left out. Text with
 * polarity marks, a formula or a turn keeps its bounds.
 */
export function resolveDraftingTextInkBounds(document, resolver, object, routingGeometry) {
    return resolveTextWithInk(document, resolver, object, routingGeometry).ink();
}
function resolveTextWithInk(document, resolver, object, routingGeometry) {
    // Text anchors may be free/object/route; route anchors reuse the shared route
    // math via resolveVisualAnchor.
    const resolved = resolveVisualAnchor(document, resolver, object.anchor, routingGeometry);
    const diagnostics = [];
    if (!resolved.resolved && resolved.diagnostic) {
        const code = resolved.diagnostic.code === "DRAFTING_ROUTE_SEGMENT_INVALID"
            ? "DRAFTING_ROUTE_SEGMENT_INVALID"
            : "DRAFTING_ANCHOR_TARGET_MISSING";
        diagnostics.push({
            code,
            severity: "warning",
            draftingObjectId: object.id,
            anchorRole: "anchor",
            targetObjectIds: resolved.diagnostic.objectId
                ? [resolved.diagnostic.objectId]
                : [],
            message: resolved.diagnostic.message,
        });
    }
    const position = resolved.position;
    const follow = object.anchor.kind === "route" && object.anchor.orientation === "follow";
    const rotation = composeRotation(resolved.rotation, object.rotation, follow);
    const profile = objectStyleProfile(resolveDocumentStyleProfile(document.presentation), object);
    const metrics = richTextMetrics(profile, object.typographyToken, object.styleOverride?.sizeScale, {
        bold: object.styleOverride?.weight !== "normal",
        italic: object.styleOverride?.italic === true,
    });
    const content = draftTextLayoutContent(document, object, metrics);
    const polarity = object.polarity
        ? resolvePolarityTextGeometry(position, object.polarity, content, metrics, rotation, object.alignment)
        : null;
    const textPosition = polarity?.textPosition ?? position;
    // As the renderer places it: text on an object or between polarity marks
    // is centered on its anchor, any other text stands on it by its baseline.
    const resolvedTextBounds = object.anchor.kind === "object" || object.polarity
        ? textBounds(textPosition, object.alignment, 0, content, metrics)
        : baselineTextBounds(textPosition, object.alignment, content, metrics, profile);
    const barePolarity = object.polarity === "positive" || object.polarity === "negative";
    const bounds = polarity
        ? unionRects([
            ...(barePolarity ? [] : [resolvedTextBounds]),
            paddedBounds(unionBounds(polarity.lines.flatMap((line) => [line.from, line.to])), STROKE_PADDING / 2),
        ])
        : resolvedTextBounds;
    // Measured only when asked for: the drawing and the Snapshot never need it.
    const ink = () => {
        if (polarity || rotation !== 0 || formulaExtents(content, metrics))
            return bounds;
        const fontSize = metrics.fontSize;
        const layout = measureRichTextDocument(content, metrics);
        const width = Math.max(fontSize * 0.6, layout.width);
        const span = uprightTextInkSpan(content, metrics, object.alignment, textPosition.x);
        return uprightTextInkBounds({
            left: span?.left ??
                (object.alignment === "start"
                    ? textPosition.x
                    : object.alignment === "end"
                        ? textPosition.x - width
                        : textPosition.x - width / 2),
            width: span?.width ?? width,
            baseline: object.anchor.kind === "object"
                ? centeredFirstBaselineY(content, textPosition.y, fontSize, profile)
                : textPosition.y,
            fontSize,
            fractionAscent: fontSize *
                fractionPartScale(profile.typography.subscriptScale) *
                fractionExtraAscentEm(content, profile.typography),
            descentEm: labelInkDescentEm(content, profile.typography),
            layoutHeight: layout.height,
        });
    };
    return {
        geometry: {
            kind: "text",
            position,
            textPosition,
            rotation,
            polarityLines: polarity?.lines ?? [],
            bounds,
            diagnostics,
        },
        ink,
    };
}
export function resolvePolarityTextGeometry(position, polarity, content, metrics, rotation, alignment = "middle") {
    const layout = measureRichTextDocument(content, metrics);
    const markerHalfArm = metrics.fontSize * 0.23;
    // The text stays upright while its marks turn with the rotation, so each
    // mark clears the text by the text's own reach toward it: half its height
    // above or below it, and its width from the anchor to either side. Marks
    // beside a long name move out with it instead of running into it.
    const left = alignment === "start"
        ? 0
        : alignment === "end"
            ? layout.width
            : layout.width / 2;
    const reach = (dx, dy) => (dx >= 0 ? dx * (layout.width - left) : -dx * left) +
        Math.abs(dy) * (layout.height / 2);
    const radians = (rotation * Math.PI) / 180;
    // The marks' axis: + sits toward -axis, − toward +axis.
    const axis = { x: -Math.sin(radians), y: Math.cos(radians) };
    const separation = (dx, dy) => reach(dx, dy) + markerHalfArm + metrics.fontSize * 0.18;
    let positiveOffset = null;
    let negativeOffset = null;
    if (polarity === "both") {
        positiveOffset = -separation(-axis.x, -axis.y);
        negativeOffset = separation(axis.x, axis.y);
    }
    else if (polarity === "positive") {
        positiveOffset = 0;
    }
    else {
        negativeOffset = 0;
    }
    const lines = [];
    const markerCenter = (offsetY) => ({
        x: position.x - offsetY * Math.sin(radians),
        y: position.y + offsetY * Math.cos(radians),
    });
    if (positiveOffset !== null) {
        const center = markerCenter(positiveOffset);
        lines.push({
            role: "positive-horizontal",
            from: { x: center.x - markerHalfArm, y: center.y },
            to: { x: center.x + markerHalfArm, y: center.y },
        }, {
            role: "positive-vertical",
            from: { x: center.x, y: center.y - markerHalfArm },
            to: { x: center.x, y: center.y + markerHalfArm },
        });
    }
    if (negativeOffset !== null) {
        const center = markerCenter(negativeOffset);
        lines.push({
            role: "negative",
            from: { x: center.x - markerHalfArm, y: center.y },
            to: { x: center.x + markerHalfArm, y: center.y },
        });
    }
    return {
        textPosition: position,
        lines,
    };
}
function resolveArrow(document, resolver, object, routingGeometry) {
    const from = resolveAnchorWithRole(document, resolver, object.from, object.id, "from", routingGeometry);
    const to = resolveAnchorWithRole(document, resolver, object.to, object.id, "to", routingGeometry);
    const fromPoint = from.anchor.position;
    const toPoint = to.anchor.position;
    const points = [
        fromPoint,
        ...(object.waypoints ?? []).map((point) => ({ ...point })),
        toPoint,
    ];
    return {
        kind: "arrow",
        from: fromPoint,
        to: toPoint,
        points,
        vertices: points.map((point) => ({ ...point })),
        curveControls: Array.from({ length: points.length - 1 }, (_, index) => object.curveControls?.[index] ? { ...object.curveControls[index] } : null),
        center: {
            x: (fromPoint.x + toPoint.x) / 2,
            y: (fromPoint.y + toPoint.y) / 2,
        },
        bounds: arrowArtworkBounds(arrowArtwork(object, points, object.curveControls ?? [], objectStyleProfile(resolveDocumentStyleProfile(document.presentation), object))),
        diagnostics: [...from.diagnostics, ...to.diagnostics],
    };
}
function resolveLeader(document, resolver, object, routingGeometry) {
    const anchor = resolveAnchorWithRole(document, resolver, object.anchor, object.id, "anchor", routingGeometry);
    const target = resolveAnchorWithRole(document, resolver, object.target, object.id, "target", routingGeometry);
    const anchorPoint = anchor.anchor.position;
    const targetPoint = target.anchor.position;
    return {
        kind: "leader",
        anchor: anchorPoint,
        target: targetPoint,
        bounds: paddedBounds(unionBounds([anchorPoint, targetPoint]), STROKE_PADDING),
        diagnostics: [...anchor.diagnostics, ...target.diagnostics],
    };
}
function resolveCallout(document, resolver, object, routingGeometry) {
    const anchor = resolveAnchorWithRole(document, resolver, object.anchor, object.id, "anchor", routingGeometry);
    const target = resolveAnchorWithRole(document, resolver, object.target, object.id, "target", routingGeometry);
    const textPos = anchor.anchor.position;
    const targetPoint = target.anchor.position;
    const follow = object.anchor.kind === "route" && object.anchor.orientation === "follow";
    const rotation = composeRotation(anchor.anchor.rotation, object.rotation, follow);
    const textBox = textBounds(textPos, object.alignment, rotation, object.content, richTextMetrics(objectStyleProfile(resolveDocumentStyleProfile(document.presentation), object), object.typographyToken, object.styleOverride?.sizeScale, {
        bold: object.styleOverride?.weight !== "normal",
        italic: object.styleOverride?.italic === true,
    }));
    const leaderBox = paddedBounds(unionBounds([textPos, targetPoint]), STROKE_PADDING);
    return {
        kind: "callout",
        textPosition: textPos,
        target: targetPoint,
        rotation,
        textBounds: textBox,
        bounds: unionRects([textBox, leaderBox]),
        diagnostics: [...anchor.diagnostics, ...target.diagnostics],
    };
}
function resolveConstructionLine(object) {
    return {
        kind: "construction-line",
        points: object.points,
        vertices: object.points.map((point) => ({ ...point })),
        curveControls: Array.from({ length: object.points.length - 1 }, (_, index) => object.curveControls?.[index]
            ? { ...object.curveControls[index] }
            : null),
        bounds: paddedBounds(unionBounds(object.points), STROKE_PADDING),
        diagnostics: [],
    };
}
function resolveRectangle(object) {
    const radians = (object.rotation * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const halfWidth = object.width / 2;
    const halfHeight = object.height / 2;
    const corners = [
        { x: -halfWidth, y: -halfHeight },
        { x: halfWidth, y: -halfHeight },
        { x: halfWidth, y: halfHeight },
        { x: -halfWidth, y: halfHeight },
    ].map((point) => ({
        x: object.center.x + point.x * cos - point.y * sin,
        y: object.center.y + point.x * sin + point.y * cos,
    }));
    return {
        kind: "rectangle",
        center: { ...object.center },
        width: object.width,
        height: object.height,
        rotation: object.rotation,
        corners,
        bounds: paddedBounds(unionBounds(corners), STROKE_PADDING),
        diagnostics: [],
    };
}
function resolveCircle(object) {
    return {
        kind: "circle",
        center: { ...object.center },
        radius: object.radius,
        bounds: paddedBounds({
            x: object.center.x - object.radius,
            y: object.center.y - object.radius,
            width: object.radius * 2,
            height: object.radius * 2,
        }, STROKE_PADDING),
        diagnostics: [],
    };
}
function resolveFloatingSymbol(document, resolver, object, routingGeometry) {
    const anchor = resolveAnchorWithRole(document, resolver, object.anchor, object.id, "anchor", routingGeometry);
    const resolvedSymbol = resolver.resolve(object.symbolId);
    const diagnostics = [...anchor.diagnostics];
    if (!resolvedSymbol) {
        diagnostics.push({
            code: "DRAFTING_SYMBOL_UNRESOLVED",
            severity: "warning",
            draftingObjectId: object.id,
            anchorRole: "anchor",
            targetObjectIds: [object.symbolId],
            message: `Floating symbol ${object.symbolId} is unresolved; using anchor fallback bounds.`,
        });
    }
    const position = anchor.anchor.position;
    const rotation = object.transform.rotation;
    const viewBox = resolvedSymbol?.definition.viewBox;
    let bounds = {
        x: position.x - 12,
        y: position.y - 12,
        width: 24,
        height: 24,
    };
    if (viewBox) {
        // P1: apply the same transform the SVG renderer uses
        // (translate(position) scale(mirror) rotate(rotation)) to all
        // four viewBox corners and take the AABB, so the bounds match the rendered
        // symbol for any rotation/mirror combination.
        const corners = [
            { x: viewBox.x, y: viewBox.y },
            { x: viewBox.x + viewBox.width, y: viewBox.y },
            { x: viewBox.x, y: viewBox.y + viewBox.height },
            { x: viewBox.x + viewBox.width, y: viewBox.y + viewBox.height },
        ].map((corner) => transformSymbolCorner(corner, position, rotation, object.transform.mirror));
        bounds = unionBounds(corners);
    }
    return {
        kind: "floating-symbol",
        position,
        rotation,
        bounds,
        diagnostics,
    };
}
// Mirrors the SVG transform order in drafting-render.ts: rotate around the
// local origin, apply independent screen-space mirror axes, then translate.
function transformSymbolCorner(corner, position, rotation, mirror) {
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rotated = {
        x: corner.x * cos - corner.y * sin,
        y: corner.x * sin + corner.y * cos,
    };
    const scale = mirrorScale(mirror);
    return {
        x: position.x + rotated.x * scale.x,
        y: position.y + rotated.y * scale.y,
    };
}
// --- bounds helpers -------------------------------------------------------
function unionBounds(points) {
    if (points.length === 0)
        return { x: 0, y: 0, width: 0, height: 0 };
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
function paddedBounds(bounds, padding) {
    return {
        x: bounds.x - padding,
        y: bounds.y - padding,
        width: bounds.width + padding * 2,
        height: bounds.height + padding * 2,
    };
}
function unionRects(rects) {
    const nonEmpty = rects.filter((rect) => rect.width > 0 || rect.height > 0);
    if (nonEmpty.length === 0)
        return { x: 0, y: 0, width: 0, height: 0 };
    const minX = Math.min(...nonEmpty.map((rect) => rect.x));
    const minY = Math.min(...nonEmpty.map((rect) => rect.y));
    const maxX = Math.max(...nonEmpty.map((rect) => rect.x + rect.width));
    const maxY = Math.max(...nonEmpty.map((rect) => rect.y + rect.height));
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
// P1: rich-text layout bounds approximated from the document structure and a
// per-token font size (the caller passes the size; derived cannot depend on the
// renderer's style profile). Line breaks split the text into lines, so
// multi-line content gets its full height, and nested spans are
// flattened recursively rather than as a fixed "XX".
function textBounds(position, alignment, rotation, content, metrics) {
    const layout = measureRichTextDocument(content, metrics);
    const width = layout.width + TEXT_PADDING_X * 2;
    const height = layout.height + TEXT_PADDING_Y * 2;
    const left = alignment === "start"
        ? position.x - TEXT_PADDING_X
        : alignment === "end"
            ? position.x - width + TEXT_PADDING_X
            : position.x - width / 2;
    const top = position.y - height / 2;
    const box = { x: left, y: top, width, height };
    if (rotation === 0)
        return box;
    return rotatedRectBounds(box, position, rotation);
}
/**
 * The box of text drawn with its first baseline on its anchor: free text and
 * text on a wire. It is measured as a label's is — from an ascent above the
 * baseline down past the last line — so it sits on the glyphs. A box centered
 * on the baseline, as for text centered on its anchor, left half of itself
 * hanging empty below the words.
 */
function baselineTextBounds(position, alignment, content, metrics, profile) {
    const alignedLeft = (width) => alignment === "start"
        ? position.x
        : alignment === "end"
            ? position.x - width
            : position.x - width / 2;
    // A formula stands on the baseline by its own extent: a stacked fraction
    // rises well above a line of text and hangs below it.
    const formula = formulaExtents(content, metrics);
    if (formula)
        return {
            x: alignedLeft(formula.width),
            y: position.y - formula.ascent,
            width: formula.width,
            height: formula.ascent + formula.descent,
        };
    const layout = measureRichTextDocument(content, metrics);
    const fontSize = metrics.fontSize;
    // A stacked fraction raises its numerator past the plain first-line ascent.
    const fractionAscent = fontSize *
        fractionPartScale(profile.typography.subscriptScale) *
        fractionExtraAscentEm(content, profile.typography);
    const width = Math.max(fontSize * 0.6, layout.width);
    const height = Math.max(fontSize * 1.35, layout.height) + fractionAscent;
    const left = alignment === "start"
        ? position.x
        : alignment === "end"
            ? position.x - width
            : position.x - width / 2;
    return {
        x: left,
        y: position.y - fontSize * 1.05 - fractionAscent,
        width,
        height,
    };
}
/** Glyph cap height is ~0.7 em; dropping the baseline by 0.35 em sits the
 * capitals optically centered on a line's vertical center. */
const CENTERED_CAP_BASELINE_RATIO = 0.35;
/**
 * First-line baseline that centers the painted line grid on `centerY`. Line
 * breaks step a constant `lineHeight` em (see the renderer's renderRuns), so
 * the painted grid spans (lineCount - 1) steps regardless of inline fraction
 * extents.
 */
export function centeredFirstBaselineY(content, centerY, fontSize, profile) {
    // The lines stand about the centre by the distances they are set apart.
    const span = richTextLinePitches(content, {
        fontSize,
        lineHeight: profile.typography.lineHeight,
        subscriptScale: profile.typography.subscriptScale,
        subscriptBaselineShiftEm: profile.typography.subscriptBaselineShiftEm,
        subscriptHorizontalGapEm: profile.typography.subscriptHorizontalGapEm,
    }).reduce((sum, pitch) => sum + pitch, 0);
    return centerY - span / 2 + CENTERED_CAP_BASELINE_RATIO * fontSize;
}
function rotatedRectBounds(rect, origin, rotation) {
    const radians = (rotation * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return unionBounds([
        { x: rect.x, y: rect.y },
        { x: rect.x + rect.width, y: rect.y },
        { x: rect.x, y: rect.y + rect.height },
        { x: rect.x + rect.width, y: rect.y + rect.height },
    ].map((point) => {
        const dx = point.x - origin.x;
        const dy = point.y - origin.y;
        return {
            x: origin.x + dx * cos - dy * sin,
            y: origin.y + dx * sin + dy * cos,
        };
    }));
}
