import type { DerivedPoint, DerivedRect } from "./schema/types.js";
interface ClosedSymbolPath {
    readonly bounds: DerivedRect;
    contains(point: DerivedPoint): boolean;
    segmentWitness(from: DerivedPoint, to: DerivedPoint): DerivedPoint | undefined;
    /** Actual straight edges and on-curve samples of the authored outline. */
    outlineEvidence(): {
        readonly points: readonly DerivedPoint[];
        readonly segments: readonly {
            from: DerivedPoint;
            to: DerivedPoint;
        }[];
    };
}
type PathResult = {
    readonly ok: true;
    readonly geometry: ClosedSymbolPath;
} | {
    readonly ok: false;
    readonly message: string;
};
/** Validate and prepare the same closed path that the formal SVG draws. */
export declare function resolveClosedSymbolPath(data: string): PathResult;
export {};
