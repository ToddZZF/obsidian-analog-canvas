import type { DeviceDescriptor } from "@icm/devices";
/** One winding of a drawn magnetic device. */
export interface DrawnMagneticWinding {
    /** The inductor's name inside the subcircuit. */
    readonly element: string;
    /**
     * The port at the end the Symbol marks with its polarity dot. SPICE and
     * Spectre both read an inductor's first node as its dot, so the winding is
     * written from here.
     */
    readonly dotted: string;
    readonly undotted: string;
    /** The Instance parameter that sets its inductance. */
    readonly parameter: string;
}
/**
 * The network a drawn T-coil or transformer stands for.
 *
 * Both are one Symbol on the canvas, but what a simulator reads is coupled
 * windings: two inductors, the coupling between them, and for a T-coil its
 * bridge capacitor. A netlist writes that network once, as a subcircuit, and
 * every Instance calls it with its own values.
 */
export interface DrawnMagneticNetwork {
    /** The subcircuit every Instance of the Symbol calls. */
    readonly subcircuit: string;
    /** The subcircuit's ports, one per Symbol pin, in pin order. */
    readonly ports: readonly {
        readonly pinName: string;
        readonly port: string;
    }[];
    readonly windings: readonly [DrawnMagneticWinding, DrawnMagneticWinding];
    /** The coupling between the two windings and the parameter giving k. */
    readonly coupling: {
        readonly element: string;
        readonly parameter: string;
    };
    readonly capacitors: readonly {
        readonly element: string;
        readonly from: string;
        readonly to: string;
        readonly parameter: string;
    }[];
}
/** Every parameter a network reads, in the order its subcircuit declares them. */
export declare function drawnMagneticParameters(network: DrawnMagneticNetwork): readonly string[];
/**
 * The coupled network a device lowers to, or null for every other device.
 * The T-coil, transformer and centre-tap inductor qualify, including the copies a saved Project
 * carries of them, while they still have the library's identity, its pins in
 * its order, its parameters, and no netlist target of their own. Which end of
 * a winding is dotted belongs to the pins, as the library draws them.
 */
export declare function drawnMagneticNetwork(definition: DeviceDescriptor): DrawnMagneticNetwork | null;
