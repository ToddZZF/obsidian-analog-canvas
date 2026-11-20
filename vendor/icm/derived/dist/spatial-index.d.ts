import type { Point, Rect, SchematicDocument } from "@icm/model";
import type { ResolvedDocumentRoutingGeometry } from "./resolved-route-geometry.js";
export interface SpatialEntry<T> {
    readonly bounds: Rect;
    readonly value: T;
}
export interface BoundsSpatialIndex<T> {
    readonly size: number;
    queryBounds(bounds: Rect): readonly T[];
    queryPoint(point: Point): readonly T[];
}
export interface IndexedRouteSegment {
    readonly routeId: string;
    readonly netId: string;
    readonly segmentIndex: number;
    readonly from: Point;
    readonly to: Point;
    readonly bounds: Rect;
    readonly orientation: "horizontal" | "vertical" | "other";
}
export interface DocumentSpatialIndex {
    readonly documentId: string;
    readonly documentRevision: number;
    readonly routeSegments: BoundsSpatialIndex<IndexedRouteSegment>;
    /** Short segments need the exact point predicate, not a fixed-distance box. */
    readonly shortRouteSegments?: readonly IndexedRouteSegment[];
}
/**
 * Small deterministic broad-phase index. It only removes impossible pairs;
 * callers retain their existing exact geometry predicates. Results preserve
 * input order so diagnostic identity and ordering never depend on buckets.
 */
export declare function buildBoundsSpatialIndex<T>(entries: readonly SpatialEntry<T>[], cellSize: number): BoundsSpatialIndex<T>;
export declare function buildDocumentSpatialIndex(document: SchematicDocument, routingGeometry: ResolvedDocumentRoutingGeometry): DocumentSpatialIndex;
