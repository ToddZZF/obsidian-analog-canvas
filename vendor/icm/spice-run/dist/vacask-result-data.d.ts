import type { SimulationDataReading, SimulationProbe } from "./result-data.js";
/** Ephemeral collection mapping, not another saved experiment configuration. */
export type VacaskPlotProjection = {
    artifactPath: string;
    plotOrdinal: number;
    postprocessor?: {
        logLine: number;
    };
    /** Required vectors and units: source-proven for solver records, author-declared
     * for postprocessor records. Other vectors stay visible, untyped. */
    probes?: readonly SimulationProbe[];
} & ({
    analysis: "op";
} | {
    analysis: "dc";
    axis: SimulationProbe;
} | {
    analysis: "ac";
    axis: string;
} | {
    analysis: "tran";
    axis: string;
} | {
    analysis: "noise";
    axis: string;
    outputPsd: string;
    powerGain: string;
    inputQuantity: "voltage" | "current";
});
/**
 * Native records -> the same numerical contract used by charts, CSV and MCP.
 * Caller retains the original artifacts. No filenames, plot titles, column
 * positions or vector spellings are interpreted as acquisition semantics.
 * A readable partial result is not a successful Run: errors remain diagnostics
 * for the execution verdict. Outer sweeps still need explicit projections.
 */
export declare function readVacaskSimulationData(artifacts: readonly {
    path: string;
    text: string;
}[], projections: readonly VacaskPlotProjection[]): SimulationDataReading;
