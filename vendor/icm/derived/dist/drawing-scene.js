import { drawingOrderKey, inverseTransformPoint, resolveClosedSymbolPath, resolveDrawingOrder, transformPoint, } from "@icm/model";
import { drawnAdaptiveBodyParts, resolveAdaptiveSignalFlowBlockLayout, resolveInstanceSymbol, } from "@icm/symbols";
import { resolveDraftingObjectGeometry } from "./drafting-geometry.js";
import { regionAreaEvidence, regionSegmentEvidence, } from "./filled-region-evidence.js";
import { pointOnSegment } from "./segment-geometry.js";
function fillableRegions(symbol, parameters) {
    const adaptive = resolveAdaptiveSignalFlowBlockLayout(symbol.definition, parameters);
    if (adaptive) {
        const parts = drawnAdaptiveBodyParts(symbol.definition, symbol.variant?.hiddenPrimitiveParts, symbol.variant?.additionalPrimitives);
        return [
            ...(parts.frameFillable ? [adaptiveFrameRegion(adaptive)] : []),
            ...parts.extraBodies.flatMap(primitiveFillRegions),
        ];
    }
    const hidden = new Set(symbol.variant?.hiddenPrimitiveParts);
    return [
        ...symbol.definition.primitives,
        ...(symbol.variant?.additionalPrimitives ?? []),
    ]
        .filter((primitive) => !primitive.part || !hidden.has(primitive.part))
        .flatMap(primitiveFillRegions);
}
function primitiveFillRegions(primitive) {
    if (primitive.kind === "circle" && primitive.fillableBody)
        return [
            { kind: "circle", center: primitive.center, radius: primitive.radius },
        ];
    if (primitive.kind === "polygon" && primitive.fillableBody)
        return [{ kind: "polygon", points: primitive.points }];
    if (primitive.kind === "rectangle" && primitive.fillableBody)
        return [{ kind: "rectangle", bounds: primitive.bounds }];
    if (primitive.kind === "path" && primitive.fillableBody) {
        const path = filledPathRegion(primitive);
        return path ? [path] : [];
    }
    return [];
}
const filledPathRegions = new WeakMap();
function filledPathRegion(primitive) {
    if (Object.isFrozen(primitive) && filledPathRegions.has(primitive))
        return filledPathRegions.get(primitive);
    const result = resolveClosedSymbolPath(primitive.data);
    const region = result.ok
        ? { kind: "path", data: primitive.data, ...result.geometry }
        : undefined;
    if (Object.isFrozen(primitive))
        filledPathRegions.set(primitive, region);
    return region;
}
/** Bounds for the same marked paths the scene draws and uses for occlusion. */
export function closedSymbolPathBounds(primitive) {
    return primitive.fillableBody
        ? filledPathRegion(primitive)?.bounds
        : undefined;
}
export function closedSymbolPathInk(primitive) {
    return primitive.fillableBody
        ? filledPathRegion(primitive)?.outlineEvidence()
        : undefined;
}
/** Resolve capability independently of whether the instance is already filled. */
export function instanceSupportsBodyFill(instance, resolver) {
    const symbol = resolveInstanceSymbol(resolver, instance);
    return (!!symbol &&
        fillableRegions(symbol, instance.signalFlowParameters).length > 0);
}
/** A declaration can survive a variant that hides all of its regions. */
export function symbolDeclaresBodyFill(symbol) {
    return [
        symbol.primitives,
        ...symbol.variants.map((variant) => variant.additionalPrimitives ?? []),
    ].some((primitives) => primitives.some((primitive) => "fillableBody" in primitive && primitive.fillableBody === true));
}
export function adaptiveFrameRegion(layout) {
    const { x, y, width, height } = layout.body;
    const right = x + width;
    const bottom = y + height;
    const taper = height / 4;
    return layout.shape === "right-tapered-trapezoid"
        ? {
            kind: "polygon",
            points: [
                { x, y },
                { x: right, y: y + taper },
                { x: right, y: bottom - taper },
                { x, y: bottom },
            ],
        }
        : { kind: "rectangle", bounds: layout.body };
}
function resolvedInstanceFill(instance, resolver) {
    const { bodyFill, styleOverride } = instance;
    if (!instance.placement || (!bodyFill && !styleOverride?.background))
        return undefined;
    const symbol = resolveInstanceSymbol(resolver, instance);
    if (!symbol)
        return undefined;
    if (bodyFill)
        return {
            regions: fillableRegions(symbol, instance.signalFlowParameters),
            color: bodyFill.kind === "background" ? "background" : bodyFill.color,
            legacy: false,
        };
    const adaptive = resolveAdaptiveSignalFlowBlockLayout(symbol.definition, instance.signalFlowParameters);
    return {
        regions: [
            adaptive
                ? adaptiveFrameRegion(adaptive)
                : { kind: "rectangle", bounds: symbol.definition.viewBox },
        ],
        color: styleOverride.background,
        legacy: true,
        ...(adaptive ? { adaptive: true } : {}),
    };
}
function contourWinding(points, point) {
    let winding = 0;
    for (const [index, from] of points.entries()) {
        const to = points[(index + 1) % points.length];
        if (!to)
            continue;
        if (pointOnSegment(point, from, to))
            return undefined;
        const side = (to.x - from.x) * (point.y - from.y) -
            (point.x - from.x) * (to.y - from.y);
        if (from.y <= point.y && to.y > point.y && side > 0)
            winding++;
        else if (from.y > point.y && to.y <= point.y && side < 0)
            winding--;
    }
    return winding;
}
function regionContains(region, point) {
    switch (region.kind) {
        case "circle":
            return ((point.x - region.center.x) ** 2 + (point.y - region.center.y) ** 2 <=
                region.radius ** 2);
        case "rectangle": {
            const { x, y, width, height } = region.bounds;
            return (x <= point.x &&
                point.x <= x + width &&
                y <= point.y &&
                point.y <= y + height);
        }
        case "polygon":
            // The SVG default is nonzero winding. Edges are visible ink.
            return contourWinding(region.points, point) !== 0;
        case "path":
            return (regionContains({ kind: "rectangle", bounds: region.bounds }, point) &&
                region.contains(point));
    }
}
function occluderPoint(point, { placement }) {
    return placement
        ? inverseTransformPoint(point, placement.position, placement)
        : point;
}
function drawingPoint(point, { placement }) {
    return placement
        ? transformPoint(point, placement.position, placement)
        : point;
}
function occluderContains(occluder, point) {
    const local = occluderPoint(point, occluder);
    return occluder.regions.some((region) => regionContains(region, local));
}
export class ResolvedDrawingScene {
    order;
    instanceFills;
    #ranks;
    #occluders;
    constructor(
    /** The actual order of paint items, from back to front. */
    order, instanceFills, ranks, occluders) {
        this.order = order;
        this.instanceFills = instanceFills;
        this.#ranks = ranks;
        this.#occluders = [...occluders].sort((left, right) => right.rank - left.rank);
    }
    rank(entry) {
        return this.#ranks.get(drawingOrderKey(entry)) ?? -1;
    }
    get hasOcclusion() {
        return this.#occluders.length > 0;
    }
    isEndpointVisibleAt(endpoint, point) {
        return this.isVisibleAt(endpoint.kind === "terminal"
            ? { kind: "instance", id: endpoint.instanceId }
            : { kind: "electrical" }, point);
    }
    /** True when no later opaque region covers the document-space point. */
    isVisibleAt(entry, point) {
        return this.occluderAt(entry, point) === undefined;
    }
    /** The frontmost opaque drawing object covering this point above entry. */
    occluderAt(entry, point) {
        const index = this.rank(entry);
        for (const occluder of this.#occluders) {
            if (occluder.rank <= index)
                break;
            if (occluderContains(occluder, point))
                return occluder.entry;
        }
        return undefined;
    }
    /** Finds evidence in real rear ink, with the foreground object that covers it. */
    occlusionOf(entry, { points = [], segments = [] }) {
        const index = this.rank(entry);
        const foremost = this.#occluders[0];
        if (!foremost || foremost.rank <= index)
            return undefined;
        const rearFill = this.#occluders.find(({ rank }) => rank === index);
        const rearArea = rearFill ? fillEvidence(rearFill) : [];
        for (const front of this.#occluders) {
            if (front.rank <= index)
                break;
            let point = points.find((candidate) => occluderContains(front, candidate));
            point ??= rearArea.find((candidate) => occluderContains(front, candidate));
            if (!point && rearFill)
                point = fillEvidence(front).find((candidate) => occluderContains(rearFill, candidate));
            point ??= findSegmentEvidence(front, segments);
            if (point)
                return { front: this.occluderAt(entry, point) ?? front.entry, point };
        }
        return undefined;
    }
}
function fillEvidence(occluder) {
    return occluder.regions.flatMap((region) => regionAreaEvidence(region)
        .filter((point) => regionContains(region, point))
        .map((point) => drawingPoint(point, occluder)));
}
function findSegmentEvidence(occluder, segments) {
    for (const { from, to } of segments) {
        const local = {
            from: occluderPoint(from, occluder),
            to: occluderPoint(to, occluder),
        };
        for (const region of occluder.regions) {
            const point = regionSegmentEvidence(region, local).find((candidate) => regionContains(region, candidate));
            if (point)
                return drawingPoint(point, occluder);
        }
    }
    return undefined;
}
export function drawingHasOpaqueFill(document) {
    return (document.instances.some((instance) => instance.placement &&
        (instance.bodyFill || instance.styleOverride?.background)) ||
        (document.drafting?.objects ?? []).some((object) => object.styleOverride?.fillColor));
}
/** The formal scene and all interaction targets use this same composition. */
export function resolveDrawingScene(document, resolver, objectIds) {
    const order = resolveDrawingOrder(document);
    const ranks = new Map(order.map((entry, index) => [drawingOrderKey(entry), index]));
    const rank = (entry) => ranks.get(drawingOrderKey(entry)) ?? -1;
    const instanceFills = new Map();
    const occluders = [];
    for (const instance of document.instances) {
        if (objectIds && !objectIds.has(instance.id))
            continue;
        const fill = resolvedInstanceFill(instance, resolver);
        const placement = instance.placement;
        if (!fill || !placement)
            continue;
        instanceFills.set(instance.id, fill);
        if (fill.regions.length)
            occluders.push({
                entry: { kind: "instance", id: instance.id },
                rank: rank({ kind: "instance", id: instance.id }),
                regions: fill.regions,
                placement,
            });
    }
    for (const object of document.drafting?.objects ?? []) {
        if (objectIds && !objectIds.has(object.id))
            continue;
        if (!object.styleOverride?.fillColor)
            continue;
        // Closed drafting shapes own their geometry directly; no wire lookup is
        // needed to place the face even when its separately drawn label is bound.
        if (object.kind !== "circle" && object.kind !== "rectangle")
            continue;
        const geometry = resolveDraftingObjectGeometry(document, resolver, object);
        if (geometry.kind !== "rectangle" && geometry.kind !== "circle")
            continue;
        const region = geometry.kind === "rectangle"
            ? { kind: "polygon", points: geometry.corners }
            : { kind: "circle", center: geometry.center, radius: geometry.radius };
        occluders.push({
            entry: { kind: "drafting", id: object.id },
            rank: rank({ kind: "drafting", id: object.id }),
            regions: [region],
        });
    }
    return new ResolvedDrawingScene(order, instanceFills, ranks, occluders);
}
