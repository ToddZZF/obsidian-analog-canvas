interface Point {
    readonly x: number;
    readonly y: number;
}
/**
 * Path data for the Routes that hop, keyed by Route id; every other Route
 * draws its plain centerline. A crossing hops when a horizontal run of a
 * hopping Route passes through the middle of a vertical run of any drawn
 * Route: at least two radii from the horizontal run's ends, one radius
 * inside the vertical run's, and clear of every contact point. The arc
 * rises above the wire; a hop that would overlap the one before it on the
 * same run stays a plain crossing. Display only: connectivity never reads
 * it.
 */
export declare function wireHopPaths(centerlines: ReadonlyMap<string, readonly Point[]>, hopping: ReadonlySet<string>, contacts: readonly Point[]): Map<string, string>;
export {};
