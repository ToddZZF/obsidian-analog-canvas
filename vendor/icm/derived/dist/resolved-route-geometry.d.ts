import type { Point, SegmentMode, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import { type EndpointConnection, type EndpointObjectLookup } from "./endpoint.js";
/** A segment address is valid only for the current document revision. */
export interface RouteSegmentAddress {
    routeId: string;
    legId: string;
    /** Revision-scoped ordered traversal index; never persisted identity. */
    segmentIndex: number;
}
export interface ResolvedRouteSegment {
    address: RouteSegmentAddress;
    from: Point;
    to: Point;
    mode: SegmentMode;
}
export type ResolvedRouteVertexKind = "terminal" | "junction" | "bend" | "route-anchor";
export interface ResolvedRouteVertex {
    index: number;
    point: Point;
    kind: ResolvedRouteVertexKind;
}
export type EndpointJoin = {
    kind: "terminal-miter";
    routeId: string;
    at: Point;
    pinOutward: Point;
    routeDirection: Point;
} | {
    kind: "junction-miter";
    junctionId: string;
    at: Point;
    directions: readonly [Point, Point];
};
export interface ResolvedRouteGeometry {
    routeId: string;
    netId: string;
    centerline: readonly Point[];
    segments: readonly ResolvedRouteSegment[];
    vertices: readonly ResolvedRouteVertex[];
    endpointJoins: readonly EndpointJoin[];
    endpointConnections: Readonly<{
        from: EndpointConnection;
        to: EndpointConnection;
    }>;
}
/** Complete pure routing read model for one Document. */
export interface ResolvedDocumentRoutingGeometry {
    documentId: string;
    documentRevision: number;
    routes: ReadonlyMap<string, ResolvedRouteGeometry>;
    endpointJoins: readonly EndpointJoin[];
}
export declare function resolveRouteGeometry(document: SchematicDocument, resolver: SymbolResolver, route: SchematicDocument["routes"][number], endpointConnections?: ReadonlyMap<string, EndpointConnection>, lookup?: EndpointObjectLookup): ResolvedRouteGeometry | null;
/**
 * One object index for a Document's endpoint resolution.
 *
 * `resolveRouteGeometry` resolves both of a Route's endpoints, and without a
 * lookup `resolveEndpointConnection` falls back to scanning
 * `document.instances` and `document.junctions`. Deriving that per Route made
 * a Document's routing geometry quadratic in Route count times instance
 * count: a 1070-Route / 432-instance Project spent about two seconds here on
 * every semantic drag step, because a projected Document has no cached
 * geometry to reuse. This is the index, not a pre-resolved result, so an
 * endpoint that legitimately resolves to nothing is still answered once and
 * cheaply.
 */
export declare function resolveDocumentRoutingGeometry(document: SchematicDocument, resolver: SymbolResolver, endpointConnections?: ReadonlyMap<string, EndpointConnection>): ResolvedDocumentRoutingGeometry;
