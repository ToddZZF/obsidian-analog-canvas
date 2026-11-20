import type { DerivedPoint, GridPoint, Net, RouteEndpoint, SchematicDocument } from "@icm/model";
import { type SymbolResolver } from "@icm/symbols";
import { type ResolvedDocumentLogicalNets } from "./logical-net.js";
export interface EndpointRoutingGeometry {
    /** Exact transformed artwork contact used by render and pointer hit. */
    contactPoint: DerivedPoint;
    /** Persistable page-grid point used by every routing mutator. */
    gridLanding: GridPoint;
    /** Read-only contact-to-grid lead; empty when contact and landing coincide. */
    escapePath: readonly DerivedPoint[];
    /** Transformed terminal direction; Junctions have no outward direction. */
    outward: DerivedPoint | null;
}
export interface EndpointConnection extends EndpointRoutingGeometry {
    endpoint: RouteEndpoint;
}
export interface EndpointObjectLookup {
    readonly instancesById: ReadonlyMap<string, SchematicDocument["instances"][number]>;
    readonly junctionsById: ReadonlyMap<string, SchematicDocument["junctions"][number]>;
    /**
     * Optional, and only read for a variant-hidden MOS bulk pin. That path asks
     * the bulk policy, which resolves the whole Document's Logical Nets when it
     * is not handed them — once per endpoint, which is what made a commit spend
     * seconds deciding whether a body lead is visible. A builder that resolves
     * them once per index sets this.
     */
    readonly logicalNetResolution?: ResolvedDocumentLogicalNets;
}
/** One raw lookup for this exact model value, including hidden MOS body policy. */
export declare function buildEndpointObjectLookup(document: SchematicDocument): EndpointObjectLookup & {
    readonly logicalNetResolution: ResolvedDocumentLogicalNets;
};
/**
 * Resolve one endpoint across the symbol/derived/grid boundary. This is the
 * only entry point mutation planners may use for terminal geometry: artwork
 * contact remains exact, while every persisted Junction or waypoint uses the
 * grid landing.
 */
export declare function resolveEndpointConnection(document: SchematicDocument, resolver: SymbolResolver, endpoint: RouteEndpoint, lookup?: EndpointObjectLookup): EndpointConnection | null;
export declare function endpointKey(endpoint: RouteEndpoint): string;
/**
 * Returns whether an endpoint participates in the visible wiring graph.
 * Electrical Net membership is intentionally not consulted or mutated here.
 * A variant-hidden pin is an implicit presentation terminal, unless the
 * variant moves it elsewhere on its art. A base `conditional` pin stays
 * visible until a context-aware policy explicitly proves that hiding it is
 * safe.
 */
export declare function isVisibleEndpoint(document: SchematicDocument, resolver: SymbolResolver, endpoint: RouteEndpoint, lookup?: EndpointObjectLookup): boolean;
export declare function resolveEndpointPoint(document: SchematicDocument, resolver: SymbolResolver, endpoint: RouteEndpoint, lookup?: EndpointObjectLookup): DerivedPoint | null;
export declare function resolveEndpointOutwardDirection(document: SchematicDocument, resolver: SymbolResolver, endpoint: RouteEndpoint, lookup?: EndpointObjectLookup): DerivedPoint | null;
export declare function endpointBelongsToNet(document: SchematicDocument, net: Net, endpoint: RouteEndpoint): boolean;
export declare function netEndpoints(document: SchematicDocument, net: Net): RouteEndpoint[];
