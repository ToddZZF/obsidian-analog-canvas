import { type CircuitProject } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
export declare const LARGE_PERFORMANCE_FIXTURE_COUNTS: {
    readonly instances: 260;
    readonly nets: 176;
    readonly routes: 580;
    readonly junctions: 232;
    readonly annotations: 264;
};
/**
 * Deterministic synthetic load matching the current large user-project order
 * of magnitude. It is intentionally generated instead of storing a megabyte
 * of opaque fixture JSON and contains no user circuit data.
 */
export declare function createLargePerformanceFixture(resolver: SymbolResolver, counts?: {
    [K in keyof typeof LARGE_PERFORMANCE_FIXTURE_COUNTS]: number;
}): CircuitProject;
