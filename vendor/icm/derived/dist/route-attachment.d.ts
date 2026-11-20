import type { Point, Rotation, RouteAnnotationAttachment } from "@icm/model";
import type { ResolvedRouteGeometry } from "./resolved-route-geometry.js";
export interface ResolvedRouteAttachment {
    conductorPoint: Point;
    labelPoint: Point;
    rotation: Rotation;
}
/** Resolve a persisted route attachment against canonical route geometry. */
export declare function resolveRouteAttachment(geometry: ResolvedRouteGeometry, attachment: RouteAnnotationAttachment): ResolvedRouteAttachment | null;
/**
 * The normal offset that puts a Net Label on its wire's standard side,
 * whichever way the wire was drawn. The label goes above a horizontal
 * segment and right of a vertical one. A slanted segment counts as the
 * nearer of the two. `resolveRouteAttachment` places the label at
 * conductor + normal × offset, with normal = (−dy, dx) / length.
 */
export declare function netLabelSideOffset(from: Point, to: Point, distance: number): number;
/** Whether a segment runs closer to vertical than to horizontal. */
export declare function isNearVerticalSegment(from: Point, to: Point): boolean;
