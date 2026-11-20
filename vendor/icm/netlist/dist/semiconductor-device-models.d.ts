import type { DesignNetlistCell } from "./ir.js";
import type { NetlistFormat } from "./net-name-codec.js";
/**
 * The textbook equivalent circuits of the switching devices SPICE has no
 * card for, each a body of primitive cards its call names, on the generic
 * cards' parameters under names of the body's own (a model inside a
 * subcircuit is that subcircuit's, so a Project's DIODE, NPN or PNP never
 * reaches it):
 *
 * - `ujt` (`e b1 b2`): the base bar split at the emitter junction, rbb·eta
 *   to B1 and rbb·(1 − eta) to B2, and the emitter diode onto that point.
 *   It fires at the peak point eta·V(B2, B1) plus a diode drop; there is no
 *   conductivity modulation, so no negative resistance past it.
 * - `put` (`a g k`): the two-transistor thyristor, a PNP from the anode
 *   with its base on the anode gate and an NPN to the cathode collecting
 *   from that gate, each driving the other's base. 1 MΩ from the inner
 *   (cathode) gate to K keeps that node defined while both are off, and
 *   10 pF across it gives the regenerative switch a finite speed a
 *   transient can follow. It fires once the anode is a diode drop above G.
 * - `shockley` (`a k`): the same two transistors with the gate inside, and
 *   the centre junction's avalanche as a diode behind a source of
 *   vbo − 1.9 V, so the anode breaks over at about vbo: through Q1's
 *   emitter, that diode and 1 kΩ from the inner p gate to K, until Q2
 *   turns on and the pair latches. It holds at about 0.8 V down to about
 *   0.8 mA; 10 pF across the 1 kΩ, as in the PUT.
 */
export declare function semiconductorDeviceCell(target: string, format: NetlistFormat): DesignNetlistCell | null;
