import type { Point } from "@icm/model";
/**
 * Shared, read-only facts about a Route segment.  This deliberately does not
 * encode an authoring policy: a persisted Route is a polyline, while the edit
 * engine decides which headings a particular command is allowed to create.
 */
export type SegmentHeading = "horizontal" | "vertical" | "diagonal-positive" | "diagonal-negative" | "other" | "zero";
export type RouteGeometryConstraint = "orthogonal" | "octilinear" | "any-angle";
export interface SegmentProjection {
    point: Point;
    t: number;
    distanceSquared: number;
}
/**
 * The tolerance `pointOnSegment` accepts by default. Exported because a
 * bounding-box broad phases must account for its cross/dot-product units;
 * it is not a coordinate-distance tolerance.
 */
export declare const SEGMENT_EPSILON = 1e-9;
export declare function samePoint(left: Point, right: Point): boolean;
export declare function classifySegment(from: Point, to: Point): SegmentHeading;
export declare function isSegmentAllowed(from: Point, to: Point, constraint: RouteGeometryConstraint): boolean;
export declare function polylineSatisfiesConstraint(points: readonly Point[], constraint: RouteGeometryConstraint): boolean;
/** Unit direction is intentionally normalized for accurate render joins. */
export declare function unitDirection(from: Point, to: Point): Point | null;
export declare function segmentLength(from: Point, to: Point): number;
export declare function areCollinear(first: Point, middle: Point, last: Point): boolean;
export declare function projectPointToSegment(point: Point, from: Point, to: Point): SegmentProjection | null;
export declare function pointOnSegment(point: Point, from: Point, to: Point, options?: {
    interior?: boolean;
    epsilon?: number;
}): boolean;
export interface SegmentIntersection {
    point: Point;
    kind: "crossing" | "overlap";
}
/**
 * Generic finite-segment intersection.  Collinear overlap reports its first
 * deterministic point; callers only use that point as a diagnostic anchor.
 */
export declare function intersectSegments(a: Point, b: Point, c: Point, d: Point): SegmentIntersection | null;
