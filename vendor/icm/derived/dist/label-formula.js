import { layout } from "./label-formula-layout.js";
import { Unsupported } from "./label-formula-nodes.js";
import { parse } from "./label-formula-parser.js";
/** Lay out `latex` in label type, or null when it uses LaTeX label type does not set. */
export function layoutLabelFormula(latex, options) {
    try {
        const nodes = parse(latex);
        if (nodes.length === 0)
            return null;
        return layout(nodes, options);
    }
    catch {
        return null;
    }
}
/**
 * Why `latex` cannot be set in label type, for the formula editor to say
 * before it inserts it; null when it can.
 */
export function labelFormulaProblem(latex) {
    try {
        const nodes = parse(latex);
        if (nodes.length === 0)
            return "The formula is empty";
        layout(nodes, {
            fontSize: 15,
            bold: true,
            display: "block",
            subscriptScale: 0.76,
            subscriptBaselineShiftEm: 0.44,
            subscriptHorizontalGapEm: 0.046,
        });
        return null;
    }
    catch (error) {
        if (!(error instanceof Unsupported))
            return "This formula cannot be set";
        const what = error.message;
        if (what === "&")
            return "& separates columns only inside a matrix, cases or aligned block";
        if (what === "\\\\")
            return "\\\\ starts a new row only inside a matrix, cases or aligned block";
        if (what.startsWith("\\"))
            return `${what} is not supported in formulas`;
        return `The formula is incomplete (${what})`;
    }
}
