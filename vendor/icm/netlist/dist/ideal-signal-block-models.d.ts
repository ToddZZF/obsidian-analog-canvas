import { type BehavioralModel } from "./behavioral-model.js";
/**
 * Every subcircuit target this module gives a body.
 * @internal Tests hold every signal model contract to a body.
 */
export declare const IDEAL_SIGNAL_TARGETS: readonly string[];
/** The `.subckt` text of one block, ready for an ngspice file. */
export declare function idealSignalModel(target: string): BehavioralModel;
/** @internal Tests read each printed body. */
export declare function spiceIdealSignalSubcircuit(target: string): string[];
