import type { SpiceBuiltInBody } from "@icm/spice";
import type { NetlistFormat } from "./net-name-codec.js";
/**
 * The library block `symbolId` draws, where a call of `name` is that block
 * as Analog Canvas writes it for `format` without its body: a flip-flop or
 * a signal block in Spectre, whose definition the reader's libraries give.
 * Its ports are in the order the call prints them. Null for any other name
 * or symbol. A netlist alone never says a call is such a block; another
 * reading of the same file must, such as the RNL symbol it is drawn with.
 */
export declare function callOnlyBlock(name: string, symbolId: string, format: NetlistFormat): Omit<SpiceBuiltInBody, "source"> | null;
/**
 * The bodies Analog Canvas writes itself that a netlist source defines (an
 * op-amp's, a logic gate's, an ideal block's, the chopper's, a T-coil's or
 * transformer's, the ideal switch's), for the SPICE / SCS import to bring each card naming one in as
 * the part that wrote it. `text` is the source as the conversion to SPICE
 * takes it: a SPICE source comes back unchanged; in a Spectre one each such
 * body's statements are blanked, its header and parameters kept, so that the
 * conversion never meets a behavioral source it cannot convert, and the
 * ideal switch each Cell defines for its switches goes whole, one empty
 * definition at the end standing for them all. Every line stays where it
 * was.
 */
export declare function findBuiltInBodies(source: string, format: NetlistFormat, path: string): {
    bodies: SpiceBuiltInBody[];
    text: string;
};
