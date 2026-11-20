import type { GridPoint, RouteBranch, RouteEndpoint, RoutePresentation, RouteStyleOverride, SegmentMode, StableId, StyleOverrides, Junction } from "./schema.js";
export interface NewRoutePath {
    readonly id: StableId;
    readonly netId: StableId;
    readonly start: RouteEndpoint;
    readonly end: RouteEndpoint;
    readonly bends: readonly GridPoint[];
    readonly modes: readonly SegmentMode[];
    readonly presentation?: RoutePresentation;
    readonly styleOverride?: RouteStyleOverride;
    readonly documentStyle?: StyleOverrides;
    readonly members?: RouteBranch["members"];
}
/**
 * The Leg and Bend IDs `createRoutePath` allocates for a Route of `legCount`
 * legs. They derive from the Route ID, but split Routes keep their original
 * children, so a freed Route ID's children may still exist elsewhere. Callers
 * choosing a new Route ID check these against the Document as well.
 */
export declare function createdRouteChildIds(routeId: string, legCount: number): string[];
/**
 * Construct a new canonical Route path and allocate deterministic child IDs.
 * Existing Routes must be edited with identity-preserving Route operations,
 * never reconstructed through this creation-only factory.
 */
export declare function createRoutePath(input: NewRoutePath): RouteBranch;
export declare function routeEnd(route: RouteBranch): RouteEndpoint;
export declare function routeEndpoints(route: RouteBranch): readonly [RouteEndpoint, RouteEndpoint];
/** One scalar graph edge per lane. Geometric aggregate anchors never form an edge. */
export declare function routeElectricalConnections(route: RouteBranch): Array<{
    netId: string;
    memberId?: string;
    endpoints: readonly [RouteEndpoint, RouteEndpoint];
}>;
export declare function junctionElectricalEndpoints(junction: Junction): Array<{
    netId: string;
    endpoint: RouteEndpoint;
}>;
export declare function routeBends(route: RouteBranch): GridPoint[];
export declare function routeModes(route: RouteBranch): SegmentMode[];
