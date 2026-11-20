import type { DesignNetlistModel } from "./ir.js";
import { type BehavioralModel } from "./behavioral-model.js";
/** The unchanged electrical contract of every drawn open/closed/controlled switch. */
export declare const IDEAL_SWITCH_MODEL: DesignNetlistModel;
/** Hard, non-hysteretic conductance. No hidden smoothing or parasitics. */
export declare function switchBehavioralDefinition(model: DesignNetlistModel): BehavioralModel;
/** The ideal chopper's body (#1641): four ideal switches on one clock. */
export declare const IDEAL_CHOPPER_TARGET = "ideal_chopper";
/**
 * The ideal chopper for Spectre and VACASK: each path the ideal switch's hard
 * conductance, the straight pair closed while V(CK) is above the switch
 * threshold and the crossed pair while it is not, so one pair conducts at a
 * time. The crossed pair's complement is the part's own, not a signal the
 * netlist invents.
 */
export declare function chopperBehavioralDefinition(): BehavioralModel;
/**
 * The ideal chopper for SPICE: the same four paths as native S cards, as a
 * drawn switch is. The crossed pair reads its control reversed against the
 * negated threshold, so it closes below the threshold the straight pair
 * closes above. `name` writes it under another name, where an author's
 * definition has its own (#1928).
 */
export declare function spiceChopperBody(name?: string): string[];
