import type { Point, Rect, SchematicDocument } from "@icm/model";
import type { ResolvedSymbol, SignalFlowLayoutParameters, SymbolResolver } from "@icm/symbols";
import { type EndpointConnection } from "./endpoint.js";
import { type ResolvedDocumentRoutingGeometry } from "./resolved-route-geometry.js";
import { type DocumentContactEvidence } from "./contact.js";
import type { ResolvedDocumentLogicalNets } from "./logical-net.js";
import { type DocumentSpatialIndex } from "./spatial-index.js";
export interface VisualDiagnostic {
    code: string;
    severity: "error" | "warning" | "info";
    category: "structural" | "observation";
    confidence: "high" | "medium" | "low";
    gateEligible: boolean;
    message: string;
    objectIds: readonly string[];
    bounds?: Rect;
    point?: Point;
    parameters?: Readonly<Record<string, string | number | boolean>>;
}
export interface VisualDiagnosticOptions {
    minimumSegmentLength?: number;
    pageBounds?: Rect;
    /** Revision-scoped routing read model supplied by a shared caller. */
    routingGeometry?: ResolvedDocumentRoutingGeometry;
    /** Contact evidence paired with `routingGeometry`; never persisted. */
    contactEvidence?: DocumentContactEvidence;
    /** Revision-scoped broad-phase geometry supplied by a shared caller. */
    spatialIndex?: DocumentSpatialIndex;
    /** Logical-Net resolution paired with this immutable Document revision. */
    logicalNetResolution?: ResolvedDocumentLogicalNets;
    /** Resolved terminal/junction geometry shared with routing and contact. */
    endpointConnections?: ReadonlyMap<string, EndpointConnection>;
    /** @internal Exact-output comparison hook retained for optimization parity. */
    candidateSearch?: "indexed" | "legacy";
}
/**
 * Tight bounds of the symbol geometry actually drawn on the canvas.
 *
 * This deliberately excludes interaction tolerance. Use it for visual
 * relationships such as label clearance; callers that need a forgiving hit or
 * diagnostic envelope must use `visibleSymbolLocalBounds` below.
 */
export declare function visibleSymbolInkBounds(resolved: ResolvedSymbol, signalFlowParameters?: SignalFlowLayoutParameters): Rect;
/**
 * Forgiving envelope used for pointer interaction and visual diagnostics.
 * It must not be used to position visible text: doing so turns its padding
 * into an unintended extra label gap when the result is snapped to the grid.
 */
export declare function visibleSymbolLocalBounds(resolved: ResolvedSymbol, signalFlowParameters?: SignalFlowLayoutParameters): Rect;
export declare function visibleInstanceBounds(document: SchematicDocument, resolver: SymbolResolver): Array<{
    id: string;
    bounds: Rect;
}>;
/** The name an author knows a part by: its Reference, the name of the Cell
 * Pin it marks, or, for an unnamed marker such as a ground, its symbol. */
export declare function partName(document: SchematicDocument, instanceId: string): string;
export declare function diagnoseVisualQuality(document: SchematicDocument, resolver: SymbolResolver, options?: VisualDiagnosticOptions): readonly VisualDiagnostic[];
export declare function hasBlockingVisualDiagnostics(diagnostics: readonly VisualDiagnostic[]): boolean;
export declare function isVisualDiagnosticGateFailure(diagnostic: VisualDiagnostic, configuredCodes?: ReadonlySet<string>): boolean;
