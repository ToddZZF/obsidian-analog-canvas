import type { DeviceDescriptor } from "./contract.js";
/**
 * How a drawn switch is controlled: a two-terminal switch by the clock phase
 * its label names, a single-ended switch by its CTRL pin, and a chopper by
 * the clock its label names, straight while it is high and crossed while it
 * is low (#1641). All are read against ground. Switches bound to a model of
 * their own, and selectors SPICE has no primitive for, are not drawn
 * switches.
 */
export declare function drawnSwitchControl(definition: DeviceDescriptor): "phase" | "pin" | "chopper" | null;
