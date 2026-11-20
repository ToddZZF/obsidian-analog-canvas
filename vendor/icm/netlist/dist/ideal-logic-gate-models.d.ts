import { type BehavioralModel } from "./behavioral-model.js";
/**
 * Every subcircuit target this module gives a body.
 * @internal Tests hold every logic model contract to a body.
 */
export declare const IDEAL_LOGIC_TARGETS: readonly string[];
/** The `.subckt` text of one gate or flip-flop, ready for an ngspice file. */
export declare function idealLogicModel(target: string): BehavioralModel;
/**
 * Existing SPICE consumer API, projected from the shared recipe.
 * @internal Tests run each printed body in ngspice.
 */
export declare function spiceIdealLogicSubcircuit(target: string): string[];
