/**
 * The names netlists usually give a differential-input part's inputs and
 * outputs, which a Cell implementing the part may use for its Pins (#2350).
 * Each set is read as a whole so a sign is never guessed: INP and INN are
 * IN+ and IN-, VOUT is OUT.
 */
export interface PartPinNameSet {
    /** The part's own pins, in the order of each set's names. */
    readonly pins: readonly string[];
    readonly names: readonly (readonly string[])[];
    /** How a refusal lists the sets, and what it asks to rename. */
    readonly spoken: string;
    readonly rename: string;
}
/**
 * The name sets a part's pins take: those of a part with inputs IN+ and IN-
 * whose pins the set names. Without the part's pins, every set: a reading
 * that only asks whether a pin can meet a Pin.
 */
export declare function partPinNameSets(partPins?: readonly string[]): readonly PartPinNameSet[];
/**
 * The part pins a Cell's Pins take by a usual name (#2350), by folded Pin
 * name, and the first set whose names the Pins spell more than one way. A set
 * applies only while the Cell names none of its pins by the part's own name,
 * and only one of its name pairs is complete.
 */
export declare function cellPinsByUsualName(portNames: readonly string[], partPins?: readonly string[]): {
    readonly byName: ReadonlyMap<string, string>;
    readonly ambiguous?: {
        readonly set: PartPinNameSet;
        readonly portNames: readonly string[];
    };
};
