import type { DeviceDescriptor, DeviceParameterDefinition } from "./contract.js";
/** The forms a quantity takes besides a SPICE number, as its definition says. */
export type QuantityForms = Pick<DeviceParameterDefinition, "keywords" | "expressions">;
export type DeviceParameterIssue = {
    kind: "unknown";
    name: string;
    /** The known name it most likely meant, if one is close. */
    suggestion?: string;
} | {
    kind: "duplicate";
    name: string;
    previousName: string;
} | {
    kind: "select";
    name: string;
    value: string;
    allowed: readonly string[];
} | {
    kind: "decimal";
    name: string;
    value: string;
} | {
    /** A quantity in none of the forms it takes. */
    kind: "number";
    name: string;
    value: string;
    /** The words it takes besides a number, such as a comparator's `VDD`. */
    keywords?: readonly string[];
    /** False when it takes no expression in braces either. */
    expressions?: false;
};
/**
 * "1MΩ" written for a megohm (#1409): SPICE reads M as milli in either case,
 * so an upper-case M before a unit is refused. This is how SPICE reads such
 * a value and how to write each reading, for a refusal to say after it:
 * "reads as 1 mΩ in SPICE (M is milli): write 1MegΩ for mega or 1mΩ for
 * milli". Meg and mil are SPICE's own spellings; a bare "1M" is left alone.
 */
export declare function milliScaleReading(value: string): string | undefined;
/** Whether a value, as typed, is one of these words: trimmed, in any case. */
export declare function isKeyword(value: string, keywords?: readonly string[]): boolean;
/**
 * The forms a quantity takes, as a refusal names them: a SPICE number, an
 * expression in braces unless it takes none, and the words it takes, such
 * as a comparator's VDD.
 */
export declare function quantityForms(forms: QuantityForms): string;
/**
 * Validate the authored parameter slots owned by a device's model.
 *
 * Values remain strings because they are passed to the selected simulator, but
 * editor metadata still defines which names and scalar forms the GUI accepts.
 * The returned issues are deliberately data-only so clients and diagnostics can
 * present the same failure without mutating a document. An `open` model (an
 * unreviewed external or hierarchical subcircuit) takes names beyond its known
 * slots, so only the known ones are checked; see `instanceParameterContract`.
 */
export declare function validateDeviceParameters(descriptor: Pick<DeviceDescriptor, "parameters">, parameters: Readonly<Record<string, string>>, options?: {
    open?: boolean;
}): readonly DeviceParameterIssue[];
/**
 * The parameters as they are stored: a choice typed in another spelling its
 * option accepts, such as the Unicode minus for an adder's `-`, becomes the
 * option's value. Names match as validation matches them, ignoring case;
 * every other value is kept as given.
 */
export declare function canonicalParameterValues(descriptor: Pick<DeviceDescriptor, "parameters">, parameters: Readonly<Record<string, string>>): Record<string, string>;
