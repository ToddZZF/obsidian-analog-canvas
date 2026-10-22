/**
 * A stub for the MathJax typesetter.
 *
 * The typesetter itself needs MathJax, which is far too heavy for a plugin
 * that draws schematics. The plugin therefore does not ship it: a formula
 * that is set in a label is laid out by Analog Canvas itself, and a formula
 * that needs the typesetter is reported as unavailable instead of breaking
 * the drawing.
 *
 * This file stands in for the real module, which the cache loads lazily and
 * only when a formula is asked for.
 */

export async function typesetFormula() {
    return {
        ok: false,
        diagnostic: {
            code: "FORMULA_FONT_UNAVAILABLE",
            message: "This formula needs the MathJax typesetter, which the Obsidian plugin does not ship.",
        },
    };
}
