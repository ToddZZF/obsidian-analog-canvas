import type { Align, Alphabet, AtomClass, Style } from "./label-formula-nodes.js";
/**
 * Greek letters as the label editor spells them, so `\phi` is the same φ in
 * a formula as in a label. The variant commands have no label spelling of
 * their own; each takes its Unicode variant, or the label's letter where
 * that is the same letter.
 */
export declare const GREEK: Record<string, string>;
export declare const SYMBOLS: Record<string, [string, AtomClass]>;
/** A relation struck through by \not, as its own Unicode character. */
export declare const NEGATIONS: Record<string, string>;
/** Operator names, upright; the second marks limits above and below. */
export declare const FUNCTIONS: Record<string, [string, boolean]>;
/** Large operators: a sum's limits stack in display style, an integral's do not. */
export declare const LARGE_OPERATORS: Record<string, [string, "sum" | "integral"]>;
export declare const ACCENTS: Record<string, {
    mark: string;
    wide?: boolean;
    arrow?: boolean;
}>;
/** \big and its kin: height in em, and the class a suffix gives. */
export declare const BIG_DELIMITERS: Record<string, [number, AtomClass | null]>;
export declare const ENVIRONMENTS: Record<string, {
    left?: string;
    right?: string;
    align: Align | "rl" | "spec";
    cellStyle: Style;
    gaps: "matrix" | "cases" | "aligned";
}>;
export declare const SPACES: Record<string, number>;
export declare const IGNORED: Set<string>;
export declare const STYLES: Record<string, Style>;
export declare function alphabetCharacter(char: string, alphabet: Alphabet): string;
