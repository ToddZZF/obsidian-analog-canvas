import type { Point } from "@icm/model";
/**
 * True when a visible wire segment is neither orthogonal nor a standard 45°
 * diagonal. Degenerate segments are handled by route normalization and are
 * deliberately excluded from this visual-quality classification.
 */
export declare function isNonStandardWireAngle(from: Point, to: Point): boolean;
