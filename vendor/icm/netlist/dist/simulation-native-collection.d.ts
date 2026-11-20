import type { SimulationSourceGraph, SimulationSourceDiagnostic } from "./simulation-source-graph.js";
/** The current executor collects one ASCII rawfile; its name comes from Code. */
export declare function nativeSourceCollection(graph: SimulationSourceGraph): {
    collection: {
        rawfile: string | null;
    };
    diagnostics: SimulationSourceDiagnostic[];
};
