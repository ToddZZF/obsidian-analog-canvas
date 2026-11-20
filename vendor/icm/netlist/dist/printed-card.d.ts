import type { DesignNetlistInstance, DesignNetlistParameter } from "./ir.js";
import type { PrintedNetlistField } from "./printed-netlist.js";
import type { NetlistFormat } from "./net-name-codec.js";
import { type IndependentSourceWaveform } from "./source-waveform.js";
type Field = Omit<PrintedNetlistField, "documentId" | "instanceId">;
/**
 * The name a Spectre card prints an independent source's field under, the
 * source set to `waveform`; null for a field of another waveform, which the
 * card does not print; undefined for a parameter that is no waveform's field
 * (an extra assignment, which prints under its own name).
 */
export declare function spectreSourceFieldName(field: string, waveform: IndependentSourceWaveform): string | null | undefined;
/**
 * The field of an independent source a Spectre card's name stands for, the
 * source set to `waveform` (as the editor keeps it, any case): its own
 * waveform's first, then another's, `mag` and `phase` AC's under every
 * waveform; undefined for a name no field prints under.
 */
export declare function spectreSourceField(printed: string, waveform: string | undefined): string | undefined;
/**
 * Whether a Spectre card prints an independent source from the SPICE text
 * its dc keeps (AC, PULSE, SIN or PWL after its value), as plain text that
 * no authored parameter owns.
 */
export declare function spectreSourceFromText(parameters: readonly DesignNetlistParameter[]): boolean;
/** Single card emission: field provenance travels with the existing tokens,
 * through assignments, compound waveform tokens and SPICE line wrapping.
 * It is never inferred from equal-looking node/model/parameter strings. */
export declare function printInstanceCard(instance: DesignNetlistInstance, format: NetlistFormat, locations?: boolean): {
    text: string;
    lines: string[];
    fields: Field[];
};
export {};
