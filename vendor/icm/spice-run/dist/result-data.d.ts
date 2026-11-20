/**
 * The numeric half of a simulation result.
 *
 * A run's provenance — what was submitted, where it ran — is settled by
 * `SimulationRunMetadata`. This is the other half: the numbers, in the shape
 * the analysis actually produced them.
 *
 * Three commitments shape it.
 *
 * **The sweep axis is the file's, never a reconstruction.** A transient run
 * carries the timesteps ngspice chose, which are not evenly spaced and in the
 * measured fixture span a factor of eight million within one run. Nothing here
 * derives a point's position from its index.
 *
 * **An AC point keeps its real and imaginary parts.** No magnitude, no phase,
 * and above all no "gain": a magnitude is a magnitude, and what it means
 * depends on a testbench this layer never sees. A consumer that wants decibels
 * can compute decibels and label them itself.
 *
 * **There is one reader.** A chart and a CSV export are two views of one
 * parse, because two readers of one format are two chances to disagree about
 * what the file said.
 */
import type { SimulationDiagnostic } from "./index.js";
/**
 * One measured quantity in a result.
 *
 * `quantity` is ngspice's own word, unedited, for the same reason a diagnostic
 * keeps ngspice's own text. `unit` is the SI symbol when the quantity is one we
 * recognise and `null` when it is not: an unrecognised quantity gets no
 * invented unit, because a wrong unit on a chart axis is worse than no unit.
 */
export interface SimulationProbe {
    /** Exact simulator vector name. Consumers must not case-fold identities;
     * native VACASK may contain both Out and out with different values. */
    readonly name: string;
    readonly quantity: string;
    readonly unit: string | null;
}
/** A DC operating point: one number per probe, and no sweep. */
export interface OperatingPointProbe extends SimulationProbe {
    readonly value: number;
}
/** Combine these zero-based ordinals with the Run and its collected raw artifact identity. */
export interface SimulationRawPlotOrigin {
    /** Author-declared postprocessing, not a solver-produced quantity or verified unit. */
    readonly postprocessor?: {
        readonly logLine: number;
    } | undefined;
    /** Optional only for archived results created before native multi-record support. */
    readonly rawPlotOrdinals?: readonly number[] | undefined;
    /** Explicit short vectors of length one, never inferred from a flat waveform. */
    readonly scalars?: readonly CapturedScalar[] | undefined;
}
export interface CapturedScalar extends SimulationProbe {
    readonly value: number;
    readonly imaginary?: number | undefined;
}
export interface OperatingPointResult extends SimulationRawPlotOrigin {
    readonly analysis: "op";
    readonly plotName: string;
    readonly probes: readonly OperatingPointProbe[];
}
/** A one-dimensional DC transfer curve, with the simulator's own sweep axis. */
export interface DcSweepProbe extends SimulationProbe {
    readonly value: readonly number[];
}
export interface DcSweepResult extends SimulationRawPlotOrigin {
    readonly analysis: "dc";
    readonly plotName: string;
    readonly sweep: SimulationProbe & {
        readonly values: readonly number[];
    };
    readonly probes: readonly DcSweepProbe[];
}
/** An AC point, kept as it was solved: a complex number per frequency. */
export interface AcProbe extends SimulationProbe {
    readonly real: readonly number[];
    readonly imag: readonly number[];
}
export interface AcResult extends SimulationRawPlotOrigin {
    readonly analysis: "ac";
    readonly plotName: string;
    /** The swept frequencies, in hertz, exactly as the file recorded them. */
    readonly frequencyHz: readonly number[];
    readonly probes: readonly AcProbe[];
}
export interface TransientProbe extends SimulationProbe {
    /**
     * Named `value` to match the frozen result contract in
     * `docs/specs/simulation.md`, where an operating point's scalar and a
     * transient's series carry the same field name and the analysis tag is what
     * distinguishes them.
     */
    readonly value: readonly number[];
}
export interface TransientResult extends SimulationRawPlotOrigin {
    readonly analysis: "tran";
    readonly plotName: string;
    /**
     * The simulator's own timesteps, in seconds. Not a start and a stride:
     * ngspice chooses these, and in the measured fixture they run from 10 ps to
     * 80 µs inside a single run.
     */
    readonly timeSeconds: readonly number[];
    readonly probes: readonly TransientProbe[];
}
/**
 * Small-signal noise, normalized to amplitude per square-root hertz. The
 * input-referred unit follows the selected source (voltage or current).
 * Integrals may be simulator-reported, or explicitly labelled sampled-PSD
 * estimates. Native PSDs and contributions can coexist without replacing them.
 */
export interface NoiseResult extends SimulationRawPlotOrigin {
    readonly analysis: "noise";
    readonly plotName: "Noise Analysis";
    readonly frequencyHz: readonly number[];
    readonly outputNoiseDensity: readonly number[];
    /** Null where input referral is undefined (for example, zero transfer gain). */
    readonly inputNoiseDensity: readonly (number | null)[];
    /** Absent when the captured spectrum cannot support a finite integral. */
    readonly integratedOutputNoise?: number | undefined;
    readonly integratedInputNoise?: number | undefined;
    /** Native simulator totals have no derived integration method. */
    readonly integrationMethod?: "trapezoidal-psd" | undefined;
    /** Preserve native PSD, transfer and device-contribution vectors unchanged. */
    readonly probes?: readonly DcSweepProbe[] | undefined;
    readonly units: {
        readonly outputDensity: "V/sqrt(Hz)";
        readonly inputDensity: "V/sqrt(Hz)" | "A/sqrt(Hz)";
        readonly integratedOutput: "V";
        readonly integratedInput: "V" | "A";
    };
}
export type SimulationAnalysisResult = OperatingPointResult | DcSweepResult | AcResult | TransientResult | NoiseResult;
export interface SimulationResultData {
    readonly schemaVersion: 1;
    /** Never empty. A result with nothing in it is reported `unusable`. */
    readonly analyses: readonly SimulationAnalysisResult[];
    /** Header inventory, including records not projected into qualified numerical results. */
    readonly rawPlots?: readonly {
        readonly ordinal: number;
        /** Native multi-file collection; ordinals remain run-local. */
        readonly artifactPath?: string | undefined;
        readonly artifactPlotOrdinal?: number | undefined;
        readonly plotName: string;
        readonly pointCount: number;
        readonly variables: readonly string[];
        readonly analysisIndex?: number | undefined;
    }[] | undefined;
}
/**
 * What reading a rawfile produced.
 *
 * `unusable` is the case that matters. A simulator can exit 0, print a
 * plausible log, and leave behind a rawfile with no vectors in it — an
 * analysis that solved nothing, a `write` that saved an empty plot. Reported
 * as a success with an empty result, that reaches the author as a blank chart
 * and no explanation. So there is no such thing here as a reading that
 * succeeded with nothing in it: either there are analyses, or there is a
 * diagnostic saying why there are none.
 */
export type SimulationDataReading = {
    readonly status: "read";
    readonly data: SimulationResultData;
    /** Anything the file held that this protocol does not name. */
    readonly diagnostics: readonly SimulationDiagnostic[];
} | {
    readonly status: "unusable";
    /** Always at least one, and always says what to go look at. */
    readonly diagnostics: readonly SimulationDiagnostic[];
};
/**
 * Read one rawfile into the analyses it holds.
 *
 * Pass the file's text; pass `""` when the run left no rawfile at all, which
 * is reported as unusable rather than as an empty success.
 */
export declare function readSimulationData(rawfile: string): SimulationDataReading;
/**
 * One analysis as CSV, derived from the same parse a chart is drawn from.
 *
 * The shape follows the analysis rather than one universal table: an operating
 * point is a list of scalars, so it is one row per probe; a swept analysis is
 * one row per point. An AC row carries a real and an imaginary column per
 * probe and never a magnitude, because deriving one is the reader's decision
 * to make and to label.
 */
export declare function simulationAnalysisToCsv(analysis: SimulationAnalysisResult): string;
