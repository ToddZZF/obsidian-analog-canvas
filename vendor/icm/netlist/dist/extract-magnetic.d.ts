import type { Instance, SchematicDocument } from "@icm/model";
import { type DeviceDescriptor, type DrawnMagneticNetwork } from "@icm/devices";
import type { DesignNetlistInstance, DesignNetlistMagneticSubcircuit, NetlistDiagnostic } from "./ir.js";
import { type CellNetContext } from "./extract-nets.js";
/**
 * A drawn T-coil or transformer as the call it means: an `X` card on the
 * library's coupled-winding subcircuit, its pins in the Symbol's pin order,
 * passing the Instance's own inductances, coupling and bridge capacitance.
 * The subcircuit declares exactly those parameters, so a value it cannot
 * take is refused here rather than by the simulator.
 */
export declare function extractDrawnMagnetic(document: SchematicDocument, instance: Instance, definition: DeviceDescriptor, network: DrawnMagneticNetwork, context: CellNetContext, diagnostics: NetlistDiagnostic[]): DesignNetlistInstance | null;
/**
 * The coupled-winding subcircuit a drawn magnetic device calls, written from
 * its network with the library's own values as defaults.
 */
export declare function magneticSubcircuit(network: DrawnMagneticNetwork, definition: DeviceDescriptor): DesignNetlistMagneticSubcircuit;
