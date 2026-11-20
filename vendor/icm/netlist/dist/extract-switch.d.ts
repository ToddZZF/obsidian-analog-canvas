import type { CircuitProject, Instance, SchematicDocument } from "@icm/model";
import { type DeviceDescriptor } from "@icm/devices";
import type { DesignNetlistCell, DesignNetlistInstance, NetlistDiagnostic } from "./ir.js";
import { type ResolvedDesignNetlistAnalysisOptions } from "./extract-common.js";
import { type CellNetContext } from "./extract-nets.js";
/** Phase nodes no drawn Net supplies, per Cell: its pins as a subcircuit. */
export declare const undrivenPhaseNodes: WeakMap<CellNetContext, Set<string>>;
/**
 * A clock phase a Cell took as a pin because nothing in it drives the phase
 * (extractDrawnSwitch) reaches its callers by name, as a clock tree does: each
 * call passes the caller's Net of that name, or, where it has none, the caller
 * takes the phase as a pin of its own. A deck's top is the testbench: there
 * the phase is a node of its name, for the testbench's own text to drive
 * (#1475, #1489).
 */
export declare function bubblePhasePins(cells: DesignNetlistCell[], documentsById: ReadonlyMap<string, SchematicDocument>, options: ResolvedDesignNetlistAnalysisOptions): void;
/** Whether a Symbol is a drawn switch, whose control is read against ground. */
export declare function isDrawnSwitch(symbolId: string, project?: CircuitProject): boolean;
/**
 * The node of the clock a switch's or chopper's label names, or null, with a
 * diagnostic, for a label no node can be named after.
 * A phase names its node the way a Net Label would, so the switch meets the
 * clock drawn on a Net of that name, or a Cell Pin of that name. A phase
 * nothing in the Cell drives becomes a pin of a Cell printed as a subcircuit
 * (see bubblePhasePins); at a deck's top, the testbench, it is a node its text
 * drives.
 */
export declare function switchPhaseNode(document: SchematicDocument, instance: Instance, context: CellNetContext, options: ResolvedDesignNetlistAnalysisOptions, diagnostics: NetlistDiagnostic[]): string | null;
/**
 * A drawn switch as the SPICE `S` card it means: its two switched nodes, then
 * its control against the Cell's ground, closing through the ideal switch. A
 * chopper is the call of the ideal chopper's body on its four pins and the
 * clock its label names.
 */
export declare function extractDrawnSwitch(document: SchematicDocument, instance: Instance, definition: DeviceDescriptor, control: "phase" | "pin" | "chopper", context: CellNetContext, options: ResolvedDesignNetlistAnalysisOptions, diagnostics: NetlistDiagnostic[]): DesignNetlistInstance | null;
