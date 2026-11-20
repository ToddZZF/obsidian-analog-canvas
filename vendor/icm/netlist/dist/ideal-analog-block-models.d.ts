import { type BuiltInSubcircuitDescriptor } from "@icm/devices";
import type { DesignNetlistCell } from "./ir.js";
import type { NetlistFormat } from "./net-name-codec.js";
/**
 * The master a built-in block's call names. An authored target wins: any
 * subcircuit the author retargeted the block to. A comparator bound to the
 * ideal comparator, under either body's name, calls the body its high level
 * chooses: the one reading its own VDD, or the numeric one. An adder left on
 * its own body calls the body its input signs choose, whatever the Project
 * defines (#1928). An invalid sign leaves the adder on `adder`, for export
 * to refuse.
 */
export declare function builtInBlockCallTarget(instance: {
    readonly netlist?: {
        readonly binding?: {
            readonly kind?: unknown;
            readonly name?: unknown;
        } | undefined;
        readonly parameters?: Readonly<Record<string, string>> | undefined;
    } | null | undefined;
}, descriptor: BuiltInSubcircuitDescriptor): string;
/**
 * Idealized, frequency-independent E/G-source macros. VDD/VSS stay in the
 * reviewed block interface for existing drawings, but deliberately do not
 * limit or power this model. The ground-referenced output can therefore
 * exceed those rails. The single-ended op-amp is limited and has bodies of
 * its own (generated-models.ts); the fully differential op-amp's outputs sit
 * about `vocm` (ground by default), held there as an ideal CMFB holds them.
 * A unijunction, PUT or Shockley diode is a body of primitive cards the
 * same way (semiconductor-device-models.ts).
 */
export declare function idealAnalogBlockCell(target: string, format: NetlistFormat): DesignNetlistCell | null;
