import { identifierTextDocument } from "./identifier-text.js";
function span(children, style) {
    return { kind: "span", style, children };
}
function mathBase(value) {
    return span([span([{ kind: "text", value }], "bold")], "italic");
}
function uprightMathSubscript(value) {
    return span([span([{ kind: "text", value }], "bold")], "subscript");
}
function uprightMathSuffix(value, placement, suffixCase) {
    const bold = span([{ kind: "text", value }], "bold");
    const cased = suffixCase === "preserve" ? bold : span([bold], suffixCase);
    return placement === "subscript" ? span([cased], "subscript") : cased;
}
/**
 * House style for an authored identifier: the leading character is the symbol
 * and everything after it defaults to its subscript. Both halves stay editable
 * afterwards. Styling must never rewrite the semantic identifier: punctuation
 * and letter case are preserved exactly.
 *
 * Whitespace marks prose rather than an identifier — a drafting note must not
 * be swallowed into one long subscript — so a multi-word value keeps its
 * authored spelling and stays a single upright-size run.
 */
function symbolRuns(value) {
    if (/\s/u.test(value))
        return [mathBase(value)];
    const head = value.slice(0, 1);
    const tail = value.slice(1);
    return tail.length > 0
        ? [mathBase(head), uprightMathSubscript(tail)]
        : [mathBase(head)];
}
/** Construct the initial Razavi-style RichText for a free drafting label. */
export function defaultDraftTextDocument(value) {
    if (value.length === 0)
        return { runs: [{ kind: "line-break" }] };
    return { runs: symbolRuns(value) };
}
/**
 * Construct RichText for a name that is a word rather than an identifier.
 *
 * The subscript rule above reads its input as a symbol carrying an index —
 * right for `M1` or `V_out`, and wrong for anything whose characters are just
 * spelling. A Cell name is spelling: `sky130_fd_pr__nfet_01v8` has no leading
 * symbol and no index, and setting it that way leaves one italic `s` above a
 * shrunken remainder. Such names stay upright and whole, at the weight the
 * surrounding instance text uses.
 */
export function plainNameDocument(value) {
    if (value.length === 0)
        return { runs: [{ kind: "line-break" }] };
    return { runs: [span([{ kind: "text", value }], "bold")] };
}
/**
 * Presentation for generated voltage-node names such as Vin, Vout and VB1.
 *
 * The electrical name stays ordinary identifier text. Only its visual
 * projection follows the conventional math spelling: a bold italic leading V
 * followed by a smaller bold upright subscript. Both use the same established
 * Razavi house typeface as other schematic labels. Letter case is authored
 * content, not presentation, so both halves preserve it exactly.
 */
export function voltageNodeTextDocument(value) {
    if (value.length === 0)
        return { runs: [{ kind: "line-break" }] };
    const head = value.slice(0, 1);
    const tail = value.slice(1);
    if (head.toLowerCase() !== "v" || /\s/u.test(value)) {
        return { runs: [{ kind: "text", value }] };
    }
    return {
        runs: [
            mathBase(head),
            ...(tail.length > 0 ? [uprightMathSubscript(tail)] : []),
        ],
    };
}
/**
 * Presentation for a current's name such as Iout, IREF or I1, read the way a
 * voltage node's is: a bold italic leading I over a smaller bold upright
 * subscript, with letter case kept exactly.
 */
export function currentNodeTextDocument(value) {
    const head = value.slice(0, 1);
    const tail = value.slice(1);
    if (head.toLowerCase() !== "i" || tail.length === 0 || /\s/u.test(value))
        return { runs: [{ kind: "text", value }] };
    return { runs: [mathBase(head), uprightMathSubscript(tail)] };
}
/**
 * Presentation for a device Reference written as letters followed by an
 * index, such as M1 or R12: bold italic letters over a smaller bold upright
 * index subscript. Any other spelling stays the name itself.
 */
export function deviceReferenceTextDocument(value) {
    const match = /^(\p{L}+)(\p{N}+)$/u.exec(value);
    if (!match)
        return { runs: [{ kind: "text", value }] };
    return { runs: [mathBase(match[1]), uprightMathSubscript(match[2])] };
}
/**
 * Presentation for a device Reference that starts with its device letter,
 * written the way textbooks write R_L1, C_L, R_FB or M_N1: the letter in bold
 * italic over a smaller bold upright subscript of everything after it. For
 * a plain index this is the same look as `deviceReferenceTextDocument` (M₁).
 */
export function deviceLetterReferenceTextDocument(value) {
    const match = /^(\p{L})([\p{L}\p{N}]+)$/u.exec(value);
    if (!match)
        return { runs: [{ kind: "text", value }] };
    return { runs: [mathBase(match[1]), uprightMathSubscript(match[2])] };
}
/**
 * Letters over a subscript, split at a given place: the letters in bold
 * italic over a smaller bold upright subscript, the look each standard name
 * form above takes at its own split.
 */
export function nameOverSubscriptTextDocument(base, subscript) {
    return { runs: [mathBase(base), uprightMathSubscript(subscript)] };
}
const DEFAULT_PORT_LABEL_FORMAT = {
    suffixCase: "preserve",
    suffixPlacement: "subscript",
};
/**
 * Canonical presentation applied by the explicit "format all Ports" action.
 *
 * Unlike the automatic formal-Port default, this applies to every Port name:
 * its first character uses the established bold italic face, while the
 * remaining characters use the same bold upright face. The default preserves
 * authored case and uses a subscript; an explicit batch-format choice may
 * project the suffix in upper/lower case or at the baseline without changing
 * the electrical identity or netlist spelling.
 */
export function canonicalPortTextDocument(value, options = DEFAULT_PORT_LABEL_FORMAT) {
    if (value.length === 0)
        return { runs: [{ kind: "line-break" }] };
    const [head, ...tailCharacters] = Array.from(value);
    const tail = tailCharacters.join("");
    return {
        runs: [
            mathBase(head),
            ...(tail.length > 0
                ? [uprightMathSuffix(tail, options.suffixPlacement, options.suffixCase)]
                : []),
        ],
    };
}
/** Construct current-authoring RichText for a conventional semantic label. */
export function semanticTextDocument(value, kind) {
    if (value.length === 0)
        return { runs: [{ kind: "line-break" }] };
    if (kind === "route-marker")
        return { runs: symbolRuns(value) };
    return identifierTextDocument(value);
}
