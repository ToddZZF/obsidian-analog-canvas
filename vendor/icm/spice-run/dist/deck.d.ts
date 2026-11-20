import type { SimulationRequest, ModelLibrarySelection } from "./contract.js";
/**
 * The ceiling a request gets when it names none. Loading the Sky130 `tt`
 * corner alone costs about 16 s of CPU on a fast core (measured 2026-09-04
 * with ngspice 46 on a resistor divider), so a circuit that needs models
 * cannot fit a 30 s ceiling on a shared container core.
 */
export declare const DEFAULT_SIMULATION_TIMEOUT_MS = 60000;
/**
 * The ceiling a request cannot exceed. A container bills for the time it is
 * awake, not the time it computes, so an unbounded analysis is an unbounded
 * bill as well as a user waiting on nothing.
 */
export declare const MAX_SIMULATION_TIMEOUT_MS = 120000;
export declare function resolveTimeoutMs(requested: number | undefined): number;
/**
 * Whether a deck needs the environment's device-model library at all.
 *
 * Loading the Sky130 corner is the single most expensive thing a run does:
 * about 16 s of CPU for the `tt` section alone, before any analysis. A
 * resistor divider or an RC network has no model card to look up, so it
 * pays that cost for nothing. The library is added when the deck contains a
 * semiconductor device card (MOSFET, diode, BJT, JFET) or names a Sky130
 * model anywhere; passives, sources, and dependent sources run without it.
 * Comments and continuation lines are skipped so a remark cannot trigger it.
 */
export declare function deckNeedsModelLibrary(text: string): boolean;
/**
 * Whether a prepared deck promises a numeric rawfile.
 *
 * This is an execution expectation, not an attempt to understand SPICE. The
 * harness makes the same observation before collecting output; the Worker
 * uses this copy to decide what result the submitted deck promised. Keeping
 * the expectation beside the result evaluator prevents each consumer from
 * inventing its own meaning for an absent file.
 */
export declare function deckRequestsRawfile(deck: string): boolean;
/**
 * The deck handed to ngspice: the circuit, then the author's testbench, in
 * that order and with nothing added between them.
 *
 * The model library line is the one thing we contribute, because the author
 * cannot know the container's paths. Everything after it is theirs verbatim.
 */
/**
 * The one Sky130 library this product simulates against, at the path the
 * pinned container image puts it.
 *
 * There is deliberately no search. A machine with a volare or ciel checkout
 * has the BINNED model set, which is a different library: its widest
 * `nfet_01v8` bin stops at 100 um, so the benchmark suite's own reference
 * devices do not resolve at all, and the circuits that do resolve answer
 * differently -- on the five-transistor OTA the unity-gain bandwidth moves
 * 11% (#551). Falling back to whatever a machine happens to have would mean
 * two runs of the same circuit disagreeing with no way to tell which library
 * answered, which is worse than not running.
 *
 * `SKY130_LIB_PATH` overrides it for a host that mounts the same library
 * somewhere else. It is not a way to select a different one.
 */
export declare const SKY130_LIBRARY_PATH = "/opt/sky130/continuous/sky130.lib.spice";
export declare function buildSimulationDeck(request: Pick<SimulationRequest, "netlist" | "testbench">, modelLibrary: ModelLibrarySelection | null): string;
export declare function formatModelLibrarySelection(selection: ModelLibrarySelection): string;
