import type { Point, Rect } from "@icm/model";
import type { FilledRegion } from "./drawing-scene.js";
export declare function rectangleCorners({ x, y, width, height }: Rect): Point[];
type Segment = Readonly<{
    from: Point;
    to: Point;
}>;
/** Candidate points on the segment, to be checked by actual fill containment. */
export declare function regionSegmentEvidence(region: FilledRegion, { from, to }: Segment): Point[];
/** A center and outline samples. Concave regions and holes still need containment checks. */
export declare function regionAreaEvidence(region: FilledRegion): Point[];
export {};
