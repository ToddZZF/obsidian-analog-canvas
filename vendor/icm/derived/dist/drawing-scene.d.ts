import type { DerivedPoint, DerivedRect, DrawingObjectEntry, DrawingOrderEntry, Instance, RouteEndpoint, SchematicDocument, SymbolPrimitive } from "@icm/model";
import { resolveAdaptiveSignalFlowBlockLayout } from "@icm/symbols";
import type { SymbolDefinition, SymbolResolver } from "@icm/symbols";
export type FilledRegion = {
    readonly kind: "polygon";
    readonly points: readonly DerivedPoint[];
} | {
    readonly kind: "path";
    readonly data: string;
    readonly bounds: DerivedRect;
    readonly contains: (point: DerivedPoint) => boolean;
    readonly segmentWitness: (from: DerivedPoint, to: DerivedPoint) => DerivedPoint | undefined;
    readonly outlineEvidence: () => Required<DrawingInkEvidence>;
} | {
    readonly kind: "circle";
    readonly center: DerivedPoint;
    readonly radius: number;
} | {
    readonly kind: "rectangle";
    readonly bounds: DerivedRect;
};
export interface ResolvedInstanceFill {
    readonly regions: readonly FilledRegion[];
    readonly color: string | "background";
    readonly legacy: boolean;
    readonly adaptive?: boolean;
}
/** Bounds for the same marked paths the scene draws and uses for occlusion. */
export declare function closedSymbolPathBounds(primitive: Extract<SymbolPrimitive, {
    kind: "path";
}>): DerivedRect | undefined;
export declare function closedSymbolPathInk(primitive: Extract<SymbolPrimitive, {
    kind: "path";
}>): Required<DrawingInkEvidence> | undefined;
/** Resolve capability independently of whether the instance is already filled. */
export declare function instanceSupportsBodyFill(instance: Instance, resolver: SymbolResolver): boolean;
/** A declaration can survive a variant that hides all of its regions. */
export declare function symbolDeclaresBodyFill(symbol: SymbolDefinition): boolean;
export declare function adaptiveFrameRegion(layout: NonNullable<ReturnType<typeof resolveAdaptiveSignalFlowBlockLayout>>): FilledRegion;
type Occluder = {
    readonly entry: DrawingObjectEntry;
    readonly rank: number;
    readonly regions: readonly FilledRegion[];
    readonly placement?: NonNullable<Instance["placement"]>;
};
export interface DrawingInkEvidence {
    readonly points?: readonly DerivedPoint[];
    readonly segments?: readonly {
        readonly from: DerivedPoint;
        readonly to: DerivedPoint;
    }[];
}
interface DrawingOcclusionWitness {
    readonly front: DrawingObjectEntry;
    readonly point: DerivedPoint;
}
export declare class ResolvedDrawingScene {
    #private;
    /** The actual order of paint items, from back to front. */
    readonly order: readonly DrawingOrderEntry[];
    readonly instanceFills: ReadonlyMap<string, ResolvedInstanceFill>;
    constructor(
    /** The actual order of paint items, from back to front. */
    order: readonly DrawingOrderEntry[], instanceFills: ReadonlyMap<string, ResolvedInstanceFill>, ranks: ReadonlyMap<string, number>, occluders: readonly Occluder[]);
    rank(entry: DrawingOrderEntry): number;
    get hasOcclusion(): boolean;
    isEndpointVisibleAt(endpoint: RouteEndpoint, point: DerivedPoint): boolean;
    /** True when no later opaque region covers the document-space point. */
    isVisibleAt(entry: DrawingOrderEntry, point: DerivedPoint): boolean;
    /** The frontmost opaque drawing object covering this point above entry. */
    occluderAt(entry: DrawingOrderEntry, point: DerivedPoint): DrawingObjectEntry | undefined;
    /** Finds evidence in real rear ink, with the foreground object that covers it. */
    occlusionOf(entry: DrawingOrderEntry, { points, segments }: DrawingInkEvidence): DrawingOcclusionWitness | undefined;
}
export declare function drawingHasOpaqueFill(document: SchematicDocument): boolean;
/** The formal scene and all interaction targets use this same composition. */
export declare function resolveDrawingScene(document: SchematicDocument, resolver: SymbolResolver, objectIds?: ReadonlySet<string>): ResolvedDrawingScene;
export {};
