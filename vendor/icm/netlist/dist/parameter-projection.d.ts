import type { DesignNetlistInstance } from "./ir.js";
/** Internal value projection, not an editable-policy or persisted contract. */
export type PrintedParameterConversion = "identity" | "sky130-micrometres" | "spectre-number";
/**
 * A number as Spectre writes it, where Analog Canvas holds it as SPICE does:
 * the digits as written, the scale in Spectre's spelling (SPICE's Meg is
 * Spectre's M, and SPICE's M milli), and no unit after it, which Spectre
 * does not read (100fF as 100f, 1MegΩ as 1M). A SPICE {expression} loses its
 * braces, which Spectre does not read, and is parenthesized where it has
 * spaces, which would end a Spectre value; anything else, such as a bare
 * name, as it is.
 */
export declare function spectreNumber(raw: string): string;
export declare function printedParameterConversion(instance: Pick<DesignNetlistInstance, "reviewedExternalBindingId">, parameter: string): PrintedParameterConversion;
/** Native syntax decoding/validation belongs to the caller. Ordinary Netlist
 * also accepts authored SI literals; Circuit keeps its plain-um input policy. */
export declare function restorePrintedParameter(value: string, conversion: PrintedParameterConversion, allowSiLiteral?: boolean): string;
