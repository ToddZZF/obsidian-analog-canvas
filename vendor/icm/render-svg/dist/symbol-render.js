/**
 * Instance artwork: symbol primitives, signal-flow block frames, instance
 * transforms and visible pin names.
 */
import { razaviTextbookProfile, resolvePrimitiveStrokeWidth, } from "@icm/derived";
import { formatLabelFirstLetter, formatLabelIdentifier, formatLabelSubscripts, inverseTransformPoint, labelTypography, mirrorScale, rewriteRichTextIdentifier, richTextIdentifier, semanticTextDocument, transformPoint, } from "@icm/model";
import { resolveAdaptiveSignalFlowBlockLayout, resolveInstanceSymbol, resolveSignalFlowPinAt, } from "@icm/symbols";
import { renderRichTextDocument } from "./rich-text.js";
import { schematicTextFontSize, schematicTextSizeAttribute, } from "./schematic-text.js";
import { escapeXml, pointList } from "./svg-markup.js";
function primitiveStyle(primitive, profile) {
    const style = primitive.style;
    if (!style)
        return "";
    const strokeWidth = resolvePrimitiveStrokeWidth(profile, style.strokeRole, style.strokeWidth);
    return [
        strokeWidth === undefined ? "" : ` stroke-width="${strokeWidth}"`,
        style.lineCap === undefined ? "" : ` stroke-linecap="${style.lineCap}"`,
        style.lineJoin === undefined ? "" : ` stroke-linejoin="${style.lineJoin}"`,
        style.miterLimit === undefined
            ? ""
            : ` stroke-miterlimit="${style.miterLimit}"`,
    ].join("");
}
function renderPrimitive(primitive, profile, foregroundOverride, orientation) {
    const fg = foregroundOverride ?? profile.foreground;
    const style = primitiveStyle(primitive, profile);
    const rendered = screenUprightPrimitive(primitive, orientation);
    const uprightPart = rendered.part?.startsWith("upright-")
        ? ` data-part="${escapeXml(rendered.part)}"`
        : "";
    switch (rendered.kind) {
        case "line":
            return `<line${uprightPart} x1="${rendered.from.x}" y1="${rendered.from.y}" x2="${rendered.to.x}" y2="${rendered.to.y}"${style}/>`;
        case "polyline":
            return `<polyline points="${pointList(rendered.points)}"${style}/>`;
        case "circle":
            return `<circle cx="${rendered.center.x}" cy="${rendered.center.y}" r="${rendered.radius}"${rendered.fill === undefined ? "" : ` fill="${rendered.fill === "foreground" ? fg : "none"}"`}${rendered.stroke === undefined ? "" : ` stroke="${rendered.stroke === "foreground" ? fg : "none"}"`}${style}/>`;
        case "path":
            return `<path d="${escapeXml(rendered.data)}"${style}/>`;
        case "polygon":
            return `<polygon points="${pointList(rendered.points)}" fill="${rendered.fill === "foreground" ? fg : "none"}"${rendered.stroke === undefined ? "" : ` stroke="${rendered.stroke === "foreground" ? fg : "none"}"`}${style}/>`;
    }
}
/**
 * Polarity marks are notation, not device geometry: they move with a source,
 * but a minus sign remains horizontal on the page. Pre-apply the inverse of
 * the instance orientation around each marked line's centre; the parent SVG
 * transform then restores the centre while cancelling rotation and mirror.
 */
function screenUprightLine(line, orientation) {
    const center = {
        x: (line.from.x + line.to.x) / 2,
        y: (line.from.y + line.to.y) / 2,
    };
    const canonicalCoordinate = (value) => {
        const rounded = Math.round(value * 1_000_000) / 1_000_000;
        return Object.is(rounded, -0) ? 0 : rounded;
    };
    const inverseVector = (point) => {
        const unrotated = inverseTransformPoint({ x: point.x - center.x, y: point.y - center.y }, { x: 0, y: 0 }, orientation);
        return {
            x: canonicalCoordinate(center.x + unrotated.x),
            y: canonicalCoordinate(center.y + unrotated.y),
        };
    };
    return {
        ...line,
        from: inverseVector(line.from),
        to: inverseVector(line.to),
    };
}
function screenUprightPrimitive(primitive, orientation) {
    if (primitive.kind !== "line" ||
        !primitive.part?.startsWith("upright-") ||
        orientation === undefined) {
        return primitive;
    }
    return screenUprightLine(primitive, orientation);
}
function signalFlowFramePoints(body) {
    const right = body.x + body.width;
    const bottom = body.y + body.height;
    const taper = body.height / 4;
    return `${body.x},${body.y} ${right},${body.y + taper} ${right},${bottom - taper} ${body.x},${bottom}`;
}
export function renderAdaptiveSignalFlowFrame(adaptive, attributes) {
    const { body, shape } = adaptive;
    return shape === "right-tapered-trapezoid"
        ? `<polygon ${attributes} points="${signalFlowFramePoints(body)}"/>`
        : `<rect ${attributes} x="${body.x}" y="${body.y}" width="${body.width}" height="${body.height}"/>`;
}
export function renderSymbolDefinitionBody(definition, hiddenPrimitiveParts = [], additionalPrimitives = [], profile = razaviTextbookProfile, foregroundOverride, signalFlowParameters, orientation) {
    const adaptive = resolveAdaptiveSignalFlowBlockLayout(definition, signalFlowParameters);
    if (adaptive) {
        const { body, pinSpan } = adaptive;
        const center = definition.formulaPresentation.center;
        const left = center.x - pinSpan;
        const right = center.x + pinSpan;
        const bodyLeft = body.x;
        const bodyRight = body.x + body.width;
        const frame = renderAdaptiveSignalFlowFrame(adaptive, `data-role="signal-flow-frame" data-part="body" fill="none" stroke-width="${profile.strokes.emphasis}" stroke-linecap="butt" stroke-linejoin="miter"`);
        return [
            `<line data-part="input-a-lead" x1="${left}" y1="${center.y}" x2="${bodyLeft}" y2="${center.y}"/>`,
            frame,
            `<line data-part="output-y-lead" x1="${bodyRight}" y1="${center.y}" x2="${right}" y2="${center.y}"/>`,
        ].join("");
    }
    const hidden = new Set(hiddenPrimitiveParts);
    return [...definition.primitives, ...additionalPrimitives]
        .filter((primitive) => !primitive.part || !hidden.has(primitive.part))
        .map((primitive) => renderPrimitive(primitive, profile, foregroundOverride, orientation))
        .join("");
}
export function instanceTransform(instance) {
    const placement = instance.placement;
    if (!placement) {
        throw new Error(`Cannot render unplaced instance: ${instance.id}`);
    }
    const scale = mirrorScale(placement.mirror);
    const mirror = scale.x === 1 && scale.y === 1 ? "" : ` scale(${scale.x} ${scale.y})`;
    return `translate(${placement.position.x} ${placement.position.y})${mirror} rotate(${placement.rotation})`;
}
/**
 * The symbol artwork of the named instances as bare geometry: no colour of
 * our choosing, no pin names, no formula text.
 *
 * A caller that wants to mark a component by tracing the component's own
 * lines — rather than by drawing a box around it — paints this layer beneath
 * the scene and styles it entirely in CSS. Leaving the markup unstyled is the
 * point: the copy in the scene above keeps whatever colour the instance
 * overrides to, so marking a component never repaints it.
 */
export function renderInstanceOutlineGeometry(document, resolver, instanceIds, profile = razaviTextbookProfile) {
    const wanted = new Set(instanceIds);
    return document.instances
        .filter((instance) => wanted.has(instance.id) && instance.placement !== null)
        .map((instance) => {
        const resolved = resolveInstanceSymbol(resolver, instance);
        // Decoration must not take the canvas down: the scene is the layer
        // that decides what an unresolved symbol means.
        if (!resolved)
            return "";
        const primitives = renderSymbolDefinitionBody(resolved.definition, resolved.variant?.hiddenPrimitiveParts, resolved.variant?.additionalPrimitives, profile, undefined, instance.signalFlowParameters, instance.placement ?? undefined);
        return `<g data-object-id="${escapeXml(instance.id)}"><g transform="${instanceTransform(instance)}">${primitives}</g></g>`;
    })
        .join("");
}
function transformedDirection(direction, placement) {
    const vectors = {
        north: { x: 0, y: -1 },
        east: { x: 1, y: 0 },
        south: { x: 0, y: 1 },
        west: { x: -1, y: 0 },
    };
    return transformPoint(vectors[direction], { x: 0, y: 0 }, placement);
}
export function renderVisiblePinNames(definition, hiddenPinNames, instance, profile, foregroundOverride, presentation) {
    const hierarchyVerticalPinNameInset = 10;
    const placement = instance.placement;
    if (!placement)
        return "";
    const hidden = new Set(hiddenPinNames);
    return definition.pins
        .filter((pin) => pin.presentation.showName === true &&
        pin.presentation.visibility === "visible" &&
        !hidden.has(pin.name))
        .map((pin) => {
        const anchor = transformPoint(resolveSignalFlowPinAt(definition, pin, instance.signalFlowParameters), placement.position, placement);
        const outward = transformedDirection(pin.direction, placement);
        const distance = (pin.presentation.leadLength ?? 0) + 4;
        const x = anchor.x - outward.x * distance;
        // A north/south label's baseline otherwise lands on, or nearly on, the
        // Cell body border. Hierarchy labels are always automatic, so keep this
        // as derived renderer geometry rather than a second persisted setting.
        const hierarchyVerticalInset = definition.hierarchicalBlock && outward.y !== 0
            ? hierarchyVerticalPinNameInset
            : 0;
        // SVG text y is a baseline, not an ink edge. Keep the established
        // baseline correction, then move non-hierarchical north/south labels
        // inward by a font-relative cap-height margin. This keeps both rows of
        // a quarter-turned DFF clear of the body without pretending symmetric
        // baselines have symmetric glyph bounds.
        const pinFontSize = schematicTextFontSize("pin-name", profile) *
            (pin.presentation.textSizeScale ?? 1);
        const verticalInkInset = !definition.hierarchicalBlock && outward.y !== 0
            ? pinFontSize * 0.3
            : 0;
        // An overbar extends above the glyph box reported for the label. When a
        // complemented output is on a north-facing edge, that decoration faces
        // the body border, so reserve its own cap-height clearance instead of
        // treating Q and Q-bar as having identical ink bounds.
        const outwardOverbarInset = pin.role === "output-complement" && outward.y < 0
            ? pinFontSize * 0.16
            : 0;
        const y = anchor.y -
            outward.y * (distance + verticalInkInset + outwardOverbarInset) +
            4 -
            outward.y * hierarchyVerticalInset;
        const alignment = outward.x < 0 ? "start" : outward.x > 0 ? "end" : "middle";
        const sizeAttribute = schematicTextSizeAttribute("pin-name", profile, pin.presentation.textSizeScale);
        const displayName = pin.presentation.displayName ?? pin.name;
        const mathSymbolRuns = [
            {
                kind: "span",
                style: "italic",
                children: [
                    {
                        kind: "span",
                        style: "bold",
                        children: [{ kind: "text", value: displayName }],
                    },
                ],
            },
        ];
        const content = definition.hierarchicalBlock
            ? (pin.presentation.nameContent ??
                semanticTextDocument(displayName, "formal-port"))
            : pin.presentation.textStyle === "math-symbol"
                ? {
                    runs: pin.role === "output-complement"
                        ? [
                            {
                                kind: "span",
                                style: "overbar",
                                children: mathSymbolRuns,
                            },
                        ]
                        : mathSymbolRuns,
                }
                : { runs: [{ kind: "text", value: displayName }] };
        const typography = presentation && labelTypography(presentation);
        // Pin names are fixed identifiers, not instance designators: the
        // drawing's after-first-letter rule must not turn CK into C sub K or
        // RST into R sub ST. Keep explicit underscores and complement bars.
        const pinIdentifier = richTextIdentifier(content);
        const scripted = typography &&
            ((displayName.includes("_") &&
                (!pin.presentation.nameContent ||
                    presentation.labelUnderscoreSubscript === true)) ||
                presentation.labelUnderscoreSubscript === false)
            ? rewriteRichTextIdentifier(content, formatLabelIdentifier(pinIdentifier, {
                ...typography,
                subscriptAfterFirst: false,
            }), {
                underscoreSubscript: typography.underscoreSubscript,
            })
            : content;
        const formatted = pin.presentation.nameContent
            ? content
            : typography
                ? formatLabelFirstLetter(formatLabelSubscripts(scripted, {
                    case: presentation.labelSubscriptCase,
                    italic: presentation.labelSubscriptItalic,
                }), presentation.labelFirstLetterItalic ?? true)
                : content;
        const colorStyle = foregroundOverride
            ? ` style="fill:${escapeXml(foregroundOverride)}"`
            : "";
        return `<text data-pin-name="${escapeXml(pin.name)}" x="${x}" y="${y}" text-anchor="${alignment}"${sizeAttribute}${colorStyle}>${renderRichTextDocument(formatted, profile, { fontSize: schematicTextFontSize("pin-name", profile) })}</text>`;
    })
        .join("");
}
