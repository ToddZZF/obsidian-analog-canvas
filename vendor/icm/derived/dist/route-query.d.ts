import type { Point, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import type { DocumentSpatialIndex } from "./spatial-index.js";
import type { ResolvedDocumentRoutingGeometry, ResolvedRouteGeometry, ResolvedRouteSegment, RouteSegmentAddress } from "./resolved-route-geometry.js";
export interface RouteSegmentHit {
    address: RouteSegmentAddress;
    point: Point;
    t: number;
    distanceSquared: number;
}
export interface Crossing {
    routeAId: string;
    routeBId: string;
    netAId: string;
    netBId: string;
    point: Point;
    kind: "crossing" | "overlap";
}
export declare function projectPointToRouteSegment(point: Point, segment: ResolvedRouteSegment): RouteSegmentHit | null;
export declare function nearestRouteSegment(geometry: ResolvedRouteGeometry, point: Point): RouteSegmentHit | null;
/**
 * Preserve the editor's bend-first route hit behavior. A bend belongs to the
 * preceding segment; otherwise the nearest in-tolerance segment
 * wins, with the lower segment index as the deterministic tie-break.
 */
export declare function resolveRouteTap(geometry: ResolvedRouteGeometry, pointer: Point, tolerance: number): RouteSegmentHit | null;
/**
 * Every Route segment the point lies on.
 *
 * `spatialIndex` is optional. Without it this scans every segment of the
 * Document, which is what a multi-select delete does tens of thousands of
 * times. With it the box query is only a broad phase; the exact predicate
 * below still decides.
 *
 * The exact predicate tolerates cross/dot products, not coordinate distances.
 * At length >= 2, each coordinate's tolerance is bounded by
 * sqrt(2) * SEGMENT_EPSILON / length. A 2*epsilon box is conservative there;
 * shorter segments are always checked exactly. Older/custom indexes lacking
 * the short-segment list use the original scan.
 */
export declare function findRouteSegmentsAtPoint(geometry: ResolvedDocumentRoutingGeometry, point: Point, spatialIndex?: DocumentSpatialIndex): RouteSegmentAddress[];
export declare function deriveCrossings(document: SchematicDocument, resolver: SymbolResolver, routingGeometry?: ResolvedDocumentRoutingGeometry): Crossing[];
