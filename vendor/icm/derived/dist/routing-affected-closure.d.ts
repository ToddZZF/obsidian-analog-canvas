import type { SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
export interface RoutingSelectionSeed {
    readonly instanceIds: readonly string[];
    readonly routeIds: readonly string[];
    readonly junctionIds: readonly string[];
    readonly annotationIds?: readonly string[];
}
export interface RoutingAffectedClosure {
    readonly instances: readonly string[];
    readonly internalRoutes: readonly string[];
    readonly boundaryRoutes: readonly string[];
    readonly externalRoutes: readonly string[];
    readonly internalJunctions: readonly string[];
    readonly boundaryJunctions: readonly string[];
    readonly electricalAnnotationIds: readonly string[];
    readonly protectedObjectIds: readonly string[];
}
export interface RoutingAffectedClosureOptions {
    readonly resolver?: SymbolResolver | undefined;
    /**
     * Expand selected Instances to Route components whose terminal endpoints
     * are all selected. Move/delete use that connected-subgraph behavior. An
     * explicit clipboard selection disables it so unselected Wire never enters
     * a copy merely because it ends at a selected part.
     */
    readonly includeImplicitInstanceRoutes?: boolean;
}
/**
 * Derive the electrical closure of one visual selection without inspecting
 * pointer geometry. A marquee may seed stable object IDs, but a Route merely
 * passing through it never becomes selected by this read model.
 */
export declare function deriveRoutingAffectedClosure(document: SchematicDocument, seed: RoutingSelectionSeed, options?: RoutingAffectedClosureOptions): RoutingAffectedClosure;
