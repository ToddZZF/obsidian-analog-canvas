import type { DesignNetlistCell, DesignNetlistIR, DesignNetlistMagneticSubcircuit } from "./ir.js";
import type { NetlistFormat } from "./net-name-codec.js";
import type { DesignNetlistLocations, PrintedNetlistInstance, PrintedNetlistParameter } from "./printed-netlist.js";
export type { NetlistFormat } from "./net-name-codec.js";
export interface NetlistFileDescriptor {
    extension: ".spi" | ".scs";
    mediaType: "application/x-spice" | "application/x-spectre";
    text: string;
}
/** A Cell's own model cards, each `.model NAME TYPE(PARAM=VALUE …)`. */
/** A model a Cell carries, as the SPICE card its body holds. */
export declare function spiceModelCard(model: NonNullable<DesignNetlistCell["models"]>[number]): string;
/**
 * A model a Cell carries, as Spectre's model statement: a MOS stand-in is
 * Spectre's own BSIM4, as SPICE's is level 54; the classic junction and
 * Gummel-Poon stand-ins, and the junction FETs' Spectre `jfet`, keep the
 * parameters the SPICE card states.
 * Extraction omits the latter from Spectre runs. Null for a switch's model,
 * which Spectre writes as a behavioral definition.
 */
export declare function spectreModelCard(model: NonNullable<DesignNetlistCell["models"]>[number]): string | null;
/**
 * One Cell's instances as top-level SPICE cards, without a `.subckt` wrapper.
 *
 * A simulation root is instantiated rather than defined: its devices are the
 * deck's own cards. This shares `spiceInstance` with `spiceCell` so a
 * testbench card can never drift from the `.subckt` card the structural
 * export writes for the same Instance — same tokens, same wrapping, same
 * order. Net markers still print nothing.
 */
export declare function printSpiceCellInstances(cell: DesignNetlistCell): string[];
/** The same printer supplies locations; no parser guesses IDs from printed refs. */
export declare function printSpiceWithLocations(ir: DesignNetlistIR, rootAsTopLevel?: boolean): {
    text: string;
    parameters: PrintedNetlistParameter[];
    instances: PrintedNetlistInstance[];
};
export declare function printSpiceNetlist(ir: DesignNetlistIR, rootAsTopLevel?: boolean): string;
/** A drawn magnetic device's coupled windings, as a file holds them. */
export declare function printMagneticSubcircuit(subcircuit: DesignNetlistMagneticSubcircuit, format: NetlistFormat): string[];
/** A Cell the netlist generates, an ideal block's body, as a file holds it. */
export declare function printGeneratedCell(cell: DesignNetlistCell, format: NetlistFormat): string[];
export declare function printSpectreNetlist(ir: DesignNetlistIR, rootAsTopLevel?: boolean): string;
/**
 * A design netlist file. `rootAsTopLevel` prints the root Cell as the file's
 * own cards rather than as a subcircuit, as the file it was read from held
 * them.
 */
export declare function printDesignNetlist(format: NetlistFormat, ir: DesignNetlistIR, rootAsTopLevel?: boolean): NetlistFileDescriptor;
/** Both dialects emit their text and field provenance in the same pass. */
export declare function printDesignNetlistWithLocations(format: NetlistFormat, ir: DesignNetlistIR, rootAsTopLevel?: boolean): {
    file: NetlistFileDescriptor;
    locations: DesignNetlistLocations;
};
/** Presentation adds/removes only a leading title; coordinates remain UTF-16
 * string offsets, matching CodeMirror and every existing source consumer. */
export declare function shiftDesignNetlistLocations(locations: DesignNetlistLocations, offset: number): DesignNetlistLocations;
