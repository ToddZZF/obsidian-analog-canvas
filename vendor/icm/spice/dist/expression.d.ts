export interface SpiceNumber {
    raw: string;
    coefficient: number;
    suffix: string | null;
    trailingUnit: string;
    value: number;
}
/** What a SPICE scale suffix multiplies by (`m` 1e-3, `mil` 25.4e-6). */
export declare function spiceScaleFactor(suffix: string): number | undefined;
export declare function parseSpiceNumber(raw: string): SpiceNumber | null;
/** Exact identity for literal comparison, not floating-point evaluation.
 * Share the evaluator's grammar, suffixes and ignored trailing unit text.
 * Keep decimal powers symbolic: even 1e400 never allocates 400 zeroes.
 * Over-budget literals are uncheckable, never rounded into an equality. */
export declare function canonicalSpiceNumber(raw: string): string | null;
export declare function evaluateSpiceExpression(raw: string, symbols?: ReadonlyMap<string, number> | Record<string, number>): number | null;
export declare function expressionIsStructurallyValid(raw: string): boolean;
