/** One Greek letter and its name as LaTeX types it. */
export interface GreekLetter {
    readonly glyph: string;
    /** Capitalised for a capital letter (Φ Phi), lower case otherwise (φ phi),
     * as the LaTeX commands `\Phi` and `\phi` spell it. A netlist writes the
     * letter through `spellGreekLetters` instead (Φ PHI). */
    readonly name: string;
    /** LaTeX has a `\name` command for it; capitals that look like Latin letters
     * (Α, Β, Ε …) and omicron have none, so they are typed as those letters. */
    readonly latex: boolean;
}
/** Every Greek letter, in alphabetical order, lower case then capitals. */
export declare const GREEK_LETTERS: readonly GreekLetter[];
/**
 * Write each Greek letter as its standard name, in its own case, so a Net
 * drawn as φ₁ (name `φ1`) is written `phi1`, Φ₁ is written `PHI1` and Ω is
 * written `OMEGA`. Netlist formats read only ASCII names; everything else is
 * left as it is.
 */
export declare function spellGreekLetters(text: string): string;
