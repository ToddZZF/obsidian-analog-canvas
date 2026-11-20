import { type SimulationResultData } from "./result-data.js";
import type { SimulationDiagnostic, SimulationOutcome } from "./contract.js";
/**
 * Read ngspice's output into diagnostics.
 *
 * The exit status is deliberately not the input. Measured against ngspice
 * 44: a deck whose resistor line is malformed exits **0** while printing
 * "Warning: 'r1 in out' is not a valid resistor instance line, ignored!" and
 * then solving the circuit that remains. Trusting the status there would
 * report a clean success for numbers describing a circuit the author never
 * drew.
 *
 * `sources` are the run's own source texts: the deck and every file submitted
 * with it, Canvas-generated ones included. The Profile's model library is
 * not among them. When they are given, a parameter ngspice ignored on a model
 * card none of them defines is no longer dropped input: the qualified SKY130
 * NPN card prints `unrecognized parameter (dcap) - ignored` on every run
 * (#1313), and its author cannot change it. The line stays, as information.
 * Without them, every ignored line still counts, since a card in an unknown
 * file cannot be told apart from the author's own.
 */
export declare function readNgspiceDiagnostics(output: string, sources?: readonly string[]): SimulationDiagnostic[];
/**
 * The diagnostic a non-zero exit deserves, or null when the exit says nothing.
 *
 * ngspice's exit status is not a verdict on the circuit. Version 39 exits
 * non-zero after a batch pass that has already run the author's `.control`
 * block and printed every value asked for, because that pass then finds no
 * `.plot`/`.print`/`.fourier` card and says so; version 46 exits 0 for the
 * identical deck. So the status varies with the build, not with the run.
 *
 * It is still worth reporting. A caller that ignored it entirely would hide
 * the one clue available when a run goes wrong in a way nothing printed.
 *
 * The benefit of the doubt is only for a run that looks complete. With no
 * data, or with data and an error already reported (a transient that gave up
 * part-way), the status is stated plainly.
 */
export declare function describeExitStatus(exitCode: number | null, options?: {
    hasData?: boolean;
    afterErrors?: boolean;
}): SimulationDiagnostic | null;
/**
 * The outcome, from the diagnostics rather than the exit status — except for
 * a timeout, which only the caller can know about.
 *
 * The exit status was once enough on its own to fail a run, which discarded
 * correct answers: on 2026-09-04 every simulation the hosted container ran
 * came back `failed` with an empty `diagnostics` array while the response
 * carried the right values, including a five-transistor OTA whose operating
 * point matched ngspice 46 with a full PDK to every digit (#568). Nothing had
 * gone wrong; ngspice 39 exits non-zero for its own reasons.
 *
 * This remains the small final reduction from diagnostics to a terminal
 * outcome. `evaluateSimulationRun` below owns the stronger evidence policy:
 * it first proves that the run produced what its deck requested, then calls
 * this function. Consumers must use that evaluator rather than treating this
 * reduction as a complete run policy.
 */
export declare function classifySimulationOutcome(diagnostics: readonly SimulationDiagnostic[], options: {
    timedOut: boolean;
    timeoutMs: number;
}): SimulationOutcome;
/** Facts observed after the simulator process stopped. No field is a verdict. */
export interface SimulationExecutionObservation {
    /** Human-readable combined output retained by the public result contract. */
    readonly log: string;
    /** Separate streams when the harness supplies them; optional during rollout. */
    readonly stdout?: string;
    readonly stderr?: string;
    readonly exitCode: number | null;
    readonly signal: string | null;
    readonly timedOut: boolean;
    readonly durationMs: number;
    readonly rawfile: string | null;
    readonly rawfileFormat: "ascii" | "binary" | null;
    readonly rawfileTruncated: boolean;
}
/** What the submitted deck promised to produce for this run. */
export interface SimulationRunExpectations {
    readonly rawfile: "required" | "not-required";
}
/** The policy-owned part of a SimulationResult, before metadata is attached. */
export interface EvaluatedSimulationRun {
    readonly outcome: SimulationOutcome;
    readonly diagnostics: readonly SimulationDiagnostic[];
    readonly data?: SimulationResultData;
}
/**
 * Evidence that ngspice at least accepted and entered a batch run.
 *
 * This is deliberately a fallback for decks that requested no rawfile. A
 * readable rawfile is stronger evidence and does not need a console banner.
 * Keep the test narrow: arbitrary non-empty stderr is not proof that a deck
 * ran, which is the exact hole recorded by #613.
 */
export declare function hasNgspiceExecutionEvidence(output: string): boolean;
/**
 * Turn one execution observation into the only product terminal verdict.
 *
 * Success is positive evidence, not the absence of a recognised error line:
 * a deck that requested vectors must return readable vectors; a deck that did
 * not must at least show that ngspice accepted the deck. The exit code remains
 * diagnostic because supported ngspice builds can exit non-zero after
 * producing every requested result. `sources` are the run's own source texts;
 * `readNgspiceDiagnostics` says what they change.
 */
export declare function evaluateSimulationRun(expectations: SimulationRunExpectations, observation: SimulationExecutionObservation, options: {
    timeoutMs: number;
    sources?: readonly string[] | undefined;
}): EvaluatedSimulationRun;
