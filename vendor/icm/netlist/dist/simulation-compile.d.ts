/**
 * Compiling a structured `SimulationFolderInput` into one simulation request.
 *
 * A folder names a Testbench root, the analyses to run, and the outputs to
 * record (`docs/specs/simulation.md`, "Canvas compilation"). This turns that into
 * the two texts `/api/simulate` already consumes -- the design netlist of
 * everything the root reaches, and the root itself as a top-level deck -- plus
 * the one thing a rawfile reader cannot recover on its own: which ngspice
 * vector name each probe's number will arrive under.
 *
 * That mapping is produced here and nowhere else. The spec is explicit that a
 * probe binding is "produced at compile time and never inferred from result
 * text", because a name matched back out of a rawfile is a guess, and a guess
 * about which node a number belongs to is the most expensive kind of wrong
 * answer this product can give.
 *
 * ## The deck this writes
 *
 * The shapes below were taken from ngspice 46 runs, not from the manual.
 *
 * **Analyses are control-block commands, not deck cards.** A deck carrying
 * both `.op` and `.ac` and a single `run` fails: ngspice 46 answers
 * `doAnalyses: not found` / `run simulation(s) aborted`, exits 1, and leaves
 * only one plot behind. Issuing `op` and `ac ...` as commands inside
 * `.control` runs both and exits 0. This is also the convention the hosted
 * smoke deck already uses (`scripts/preview-simulation-smoke.mjs`).
 *
 * **Each analysis writes, and `set appendwrite` keeps the earlier plot.**
 * `write` saves the current plot only, and truncates the file it writes. Two
 * plain `write` calls therefore leave the second plot alone in the file. With
 * `set appendwrite` the rawfile holds both plots back to back, which is
 * exactly what the rawfile reader already parses. Naming the plot in the
 * vector expression instead (`op1.mid`) does keep both plots in one `write`,
 * but ngspice then records the variable as `v(op1.mid)`, so every probe name
 * would carry a plot ordinal that depends on how many analyses ran. It does
 * not, here: the names stay `v(mid)`.
 *
 * `appendwrite` needs a working directory where `out.raw` does not already
 * exist, which the hosted harness guarantees -- it makes a private directory
 * immediately before each run and removes it whole afterwards. It is emitted
 * only when there is more than one analysis, so a single-analysis deck keeps
 * `write`'s truncating behaviour and cannot append to a stale file at all.
 *
 * ## The vector names this promises
 *
 * All confirmed against ngspice 46 rawfiles:
 *
 * - a Net in the root prints `v(<net>)`, lowercased -- ngspice folds case on
 *   the way into the rawfile, so `V(MidNode)` comes back as `v(midnode)`;
 * - a Net inside a hierarchy occurrence prints `v(<x1>.<x2>.<net>)`, one
 *   lowercased Instance reference per occurrence step;
 * - current entering any selected Instance terminal is measured through a
 *   compiler-owned zero-volt source inserted in series with that terminal;
 * - a root sense source prints `i(vicmprb###)`, while one inside an occurrence
 *   prints `i(v.<x1>.<x2>.vicmprb###)`.
 *
 * Instrumentation is applied only to the extracted, ephemeral simulation IR.
 * The authored Project and ordinary structural export are never changed.
 */
import type { CircuitProject, SimulationMeasurementSpec, LegacySimulationSetup as SimulationFolderInput, StableId } from "@icm/model";
import type { SimulationAnalysis, SimulationRequest } from "@icm/spice-run";
import { type TerminalCurrentInstrumentation } from "./terminal-current-instrumentation.js";
export type { TerminalCurrentInstrumentation } from "./terminal-current-instrumentation.js";
import type { DesignNetlistIR, NetlistDiagnostic } from "./ir.js";
/** One probe's binding to the vector its number will arrive under. */
export interface CompiledSimulationVector {
    readonly probeId: string;
    /** ngspice's own spelling, e.g. `v(mid)`, `v(x1.out)`, `i(v1)`. */
    readonly vector: string;
    readonly quantity: "voltage" | "current" | "native";
}
/** Exact extracted electrical address, before a simulator spells a raw vector.
 * Transient compilation evidence only; never persisted in the Project or inferred
 * back from lowercased legacy result names. */
export type CircuitAcquisitionAddress = {
    readonly kind: "voltage";
    readonly path: readonly string[];
    readonly node: string;
} | {
    readonly kind: "current";
    readonly path: readonly string[];
    readonly senseReference: string;
};
export type CompiledSimulationExpression = {
    readonly kind: "acquisition";
    readonly acquisitionId: string;
    readonly quantity: "voltage" | "current" | "native";
} | {
    readonly kind: "constant";
    readonly value: number;
    /** Physical unit assigned by compilation; authored constants default to 1. */
    readonly unit?: string | undefined;
} | {
    readonly kind: "negate" | "magnitude" | "db20" | "phase" | "real" | "imaginary" | "absolute";
    readonly operand: CompiledSimulationExpression;
} | {
    readonly kind: "add" | "subtract" | "multiply" | "divide";
    readonly left: CompiledSimulationExpression;
    readonly right: CompiledSimulationExpression;
};
export interface CompiledSimulationOutput {
    readonly id: string;
    readonly label: string;
    readonly expression: CompiledSimulationExpression;
}
export type SimulationDeviceOperatingPointParameter = "vgs" | "vds" | "vbs" | "id" | "gm" | "gds" | "gmbs" | "vth" | "vdsat";
export interface CompiledSimulationDeviceOperatingPointValue {
    readonly parameter: SimulationDeviceOperatingPointParameter;
    readonly label: string;
    readonly unit: "V" | "A" | "S";
    readonly expression: CompiledSimulationExpression;
}
/** Compile-time mapping for one authored MOS occurrence, never Project data. */
export interface CompiledSimulationDeviceOperatingPoint {
    readonly id: string;
    readonly documentId: StableId;
    readonly instanceId: StableId;
    readonly occurrence: readonly StableId[];
    readonly reference: string;
    readonly polarity: "nmos" | "pmos";
    readonly values: readonly CompiledSimulationDeviceOperatingPointValue[];
}
export type CompiledSimulation = {
    readonly ok: true;
    readonly request: SimulationRequest;
    readonly vectors: ReadonlyArray<CompiledSimulationVector>;
    readonly outputs: ReadonlyArray<CompiledSimulationOutput>;
    readonly deviceOperatingPoints: ReadonlyArray<CompiledSimulationDeviceOperatingPoint>;
    readonly measurements: ReadonlyArray<SimulationMeasurementSpec>;
    /** Derived ingredients shared by source composition and offline migration. */
    readonly circuit: DesignNetlistIR;
    /** Native emitters consume these addresses, not legacy vector strings. */
    readonly acquisitionAddresses: Readonly<Record<string, CircuitAcquisitionAddress>>;
    readonly captureVectors: readonly string[];
    readonly terminalInstrumentations: readonly TerminalCurrentInstrumentation[];
    readonly commands: readonly {
        kind: SimulationAnalysis;
        command: string;
    }[];
    readonly diagnostics: readonly [];
    /**
     * Everything the extraction reported that did not stop the compile --
     * a generated Net name, a normalised spelling. The structural export
     * blocks on these until an author has read them, so they are carried
     * rather than dropped; they are deliberately not in `diagnostics`,
     * which stays empty on a successful compile.
     */
    readonly warnings: readonly NetlistDiagnostic[];
} | {
    readonly ok: false;
    readonly diagnostics: readonly NetlistDiagnostic[];
};
export interface CompileStructuredSimulationOptions {
    /** Source bindings may emit their root as a subcircuit, not a flat deck. */
    readonly rootAsTopLevel?: boolean;
    /** Wall-clock ceiling for the simulator process; the runner clamps it. */
    readonly timeoutMs?: number;
    /** Native commands remain author-owned; do not reject measurements from an incomplete static analysis list. */
    readonly nativeControl?: boolean;
    /** Shared ephemeral instrumentation when multiple generated bindings reuse Cells. */
    readonly terminalInstrumentations?: readonly TerminalCurrentInstrumentation[];
    /** The run's own source text; a model it defines replaces a stand-in card. */
    readonly deckSources?: readonly string[];
}
/**
 * Compile one structured folder into the netlist, testbench, analyses, and
 * probe-to-vector bindings a simulation run needs.
 *
 * Deterministic: the same Project and folder produce byte-identical texts, in
 * the extraction's own Cell and Instance order, with probes in the order the
 * author wrote them.
 * @internal Tests compile a structured folder through it.
 */
export declare function compileStructuredSimulation(project: CircuitProject, folder: SimulationFolderInput, options?: CompileStructuredSimulationOptions): Promise<CompiledSimulation>;
/** Pure planning; neither execution nor asynchronous hashing belongs to migration. */
export declare function buildSimulationPlan(project: CircuitProject, folder: SimulationFolderInput, options?: CompileStructuredSimulationOptions): CompiledSimulation;
