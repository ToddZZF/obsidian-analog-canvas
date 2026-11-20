/**
 * Reading the ASCII rawfile ngspice writes.
 *
 * The format is not self-describing enough to guess at. Two properties of it
 * decide the shape of this reader, and both were taken from files ngspice 46
 * actually wrote rather than from a description of the format:
 *
 * **Points are separated by a blank line, not by a line count.** One point is
 * an indexed line followed by one line per remaining variable, then a blank
 * line. A reader that advances a fixed number of lines per point happens to
 * work on a real-valued file and silently misreads a complex one, because the
 * two have the same line stride and different meanings. So the value section
 * is split on the blank line and the recovered count is checked against the
 * header's `No. Points`; a mismatch is an error, never a shorter result.
 *
 * **A missing number is never filled in.** A short point block, a truncated
 * file, a `nan`, or an `inf` produces a diagnostic naming the line and the
 * variable. Nothing here substitutes a zero, an interpolation, or a previous
 * value, because a fabricated number is indistinguishable from a measured one
 * once it reaches a chart.
 */
/** One vector's identity as ngspice declared it in the `Variables:` block. */
export interface RawfileVariable {
    readonly index: number;
    /** ngspice's own vector name, unedited: `v(out)`, `i(v1)`, `time`. */
    readonly name: string;
    /** ngspice's own word for the quantity: `voltage`, `current`, `time`. */
    readonly quantity: string;
    /** Anything ngspice appended after the quantity, such as `grid=3`. */
    readonly qualifiers: readonly string[];
}
/**
 * One variable's values across every point of a plot.
 *
 * `imag` is present exactly when the plot's flags say `complex`; a real plot
 * reports `null` rather than an array of zeros, so a consumer cannot mistake
 * an absent imaginary part for a measured one.
 */
export interface RawfileVector {
    readonly variable: RawfileVariable;
    readonly real: readonly number[];
    readonly imag: readonly number[] | null;
}
export interface RawfilePlot {
    /** ngspice echoes the deck's first line here, lowercased and truncated. */
    readonly title: string;
    readonly date: string;
    /** The `Command:` header, which names the simulator build that wrote this. */
    readonly command: string;
    /** `Operating Point`, `AC Analysis`, `Transient Analysis`, ... */
    readonly plotName: string;
    readonly flags: readonly string[];
    readonly complex: boolean;
    readonly pointCount: number;
    readonly vectors: readonly RawfileVector[];
}
export type RawfileErrorCode = 
/** Nothing to read: no file, or only whitespace. */
"empty-file"
/** A binary rawfile, or something that is not a rawfile at all. */
 | "unsupported-format"
/** The file stops before a plot is completely described. */
 | "header-incomplete"
/** A header line is present but unreadable, or a required one is missing. */
 | "header-invalid"
/** A line in the `Variables:` block does not declare a variable. */
 | "variable-line-invalid"
/** A point block has the wrong number of lines, or no index. */
 | "point-block-invalid"
/** The recovered point count disagrees with the header's `No. Points`. */
 | "point-count-mismatch"
/** A value is not a number. */
 | "value-malformed"
/** A value is a number the arithmetic cannot use: `nan`, `inf`, overflow. */
 | "value-not-finite";
export interface RawfileError {
    readonly code: RawfileErrorCode;
    /** Written for the author of the circuit, and names what to go look at. */
    readonly message: string;
    /** 1-based line in the rawfile, when the fault is at one. */
    readonly line: number | null;
}
export type RawfileParse = {
    readonly ok: true;
    readonly plots: readonly RawfilePlot[];
} | {
    readonly ok: false;
    readonly error: RawfileError;
};
/**
 * The rawfile ngspice writes is one or more plots back to back: a header, a
 * `Variables:` block, then a `Values:` block, then the next plot's `Title:`.
 */
export declare function parseNgspiceRawfile(text: string): RawfileParse;
