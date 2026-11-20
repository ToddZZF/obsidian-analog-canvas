export type NetlistDialect = "spice" | "ngspice" | "spectre";
export interface NetlistConversionIssue {
    line: number;
    code: string;
    message: string;
    statement: string;
}
export interface NetlistConversionOptions {
    text: string;
    source: NetlistDialect;
    target: NetlistDialect;
    /** A structural include does not acquire a SPICE .end deck terminator. */
    fragment?: boolean;
    /** Owned include files converted in the same operation; external libraries
     * retain their actual language rather than being relabelled. */
    ownedIncludes?: readonly string[];
    subcircuitNames?: readonly string[];
    /** Calls classified by a separate reading of the native circuit. */
    externalSubcircuitNames?: readonly string[];
    /** Masters whose calls are subcircuit calls whatever the letter of their
     * names: a foundry design's `M1 (d g s b) pch_mac`, drawn with the PDK's
     * own artwork, calls the PDK's subcircuit. */
    externalSubcircuitCalls?: readonly string[];
    /** Execution projections can retain native owners without reverse-writing
     * converted text. Entries are 1-based input lines; 0 is a generated header. */
    withLineOrigins?: boolean;
    /** A Spectre source's SPICE sections pass through untranslated; set, they
     * do not count toward the size and statement limits (#1933). The editor's
     * import sets it; the public endpoint bounds the whole text. */
    uncountedSpiceSections?: boolean;
    /** A native MOS model this converter does not translate (`bsim3v3`,
     * `psp103`, …) is kept out of the SPICE text and reported by name with the
     * device type its `type=` gives, so an import can draw its instances
     * without its parameters. Only the editor's import sets it. */
    externalNativeModels?: boolean;
    /** A local import reads a whole design, however large: no size or
     * statement limit. The public endpoint keeps both, which protect the
     * service, not the conversion. Only the editor's import sets it. */
    unbounded?: boolean;
}
export interface ExternalNativeModel {
    name: string;
    type: "nmos" | "pmos";
    /** The native model kind as written, such as `bsim3v3`. */
    native: string;
    /** 1-based input line of its model statement. */
    line: number;
}
export type NetlistConversionResult = {
    status: "converted";
    text: string;
    source: NetlistDialect;
    target: NetlistDialect;
    issues: NetlistConversionIssue[];
    lineOrigins?: number[];
    /** Set with `externalNativeModels`. */
    externalModels?: ExternalNativeModel[];
} | {
    status: "blocked";
    issues: NetlistConversionIssue[];
};
export declare const MAX_CONVERSION_BYTES: number;
export declare const isNetlistDialect: (value: unknown) => value is NetlistDialect;
/** File references from the same logical statements the converter reads. */
export declare function spectreSourceIncludes(text: string): {
    path: string;
    line: number;
}[];
export declare function convertNetlist(options: NetlistConversionOptions): NetlistConversionResult;
