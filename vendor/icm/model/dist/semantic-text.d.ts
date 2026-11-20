import type { RichTextDocument } from "./schema.js";
/**
 * Semantic text emitted by current authoring for standardized schematic names.
 *
 * An underscore starts a visible subscript; the underlying bound name retains
 * that separator. Electrical readers must read the binding, not flatten this
 * presentation. RichText carries later formatting independently of the name.
 */
export type SemanticTextKind = "default-instance" | "instance-label" | "formal-port" | "net-label" | "power-label" | "route-marker";
/** Construct the initial Razavi-style RichText for a free drafting label. */
export declare function defaultDraftTextDocument(value: string): RichTextDocument;
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
export declare function plainNameDocument(value: string): RichTextDocument;
/**
 * Presentation for generated voltage-node names such as Vin, Vout and VB1.
 *
 * The electrical name stays ordinary identifier text. Only its visual
 * projection follows the conventional math spelling: a bold italic leading V
 * followed by a smaller bold upright subscript. Both use the same established
 * Razavi house typeface as other schematic labels. Letter case is authored
 * content, not presentation, so both halves preserve it exactly.
 */
export declare function voltageNodeTextDocument(value: string): RichTextDocument;
/**
 * Presentation for a current's name such as Iout, IREF or I1, read the way a
 * voltage node's is: a bold italic leading I over a smaller bold upright
 * subscript, with letter case kept exactly.
 */
export declare function currentNodeTextDocument(value: string): RichTextDocument;
/**
 * Presentation for a device Reference written as letters followed by an
 * index, such as M1 or R12: bold italic letters over a smaller bold upright
 * index subscript. Any other spelling stays the name itself.
 */
export declare function deviceReferenceTextDocument(value: string): RichTextDocument;
/**
 * Presentation for a device Reference that starts with its device letter,
 * written the way textbooks write R_L1, C_L, R_FB or M_N1: the letter in bold
 * italic over a smaller bold upright subscript of everything after it. For
 * a plain index this is the same look as `deviceReferenceTextDocument` (M₁).
 */
export declare function deviceLetterReferenceTextDocument(value: string): RichTextDocument;
/**
 * Letters over a subscript, split at a given place: the letters in bold
 * italic over a smaller bold upright subscript, the look each standard name
 * form above takes at its own split.
 */
export declare function nameOverSubscriptTextDocument(base: string, subscript: string): RichTextDocument;
export type PortLabelSuffixCase = "preserve" | "uppercase" | "lowercase";
export type PortLabelSuffixPlacement = "subscript" | "baseline";
export interface PortLabelFormatOptions {
    suffixCase: PortLabelSuffixCase;
    suffixPlacement: PortLabelSuffixPlacement;
}
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
export declare function canonicalPortTextDocument(value: string, options?: PortLabelFormatOptions): RichTextDocument;
/** Construct current-authoring RichText for a conventional semantic label. */
export declare function semanticTextDocument(value: string, kind: SemanticTextKind): RichTextDocument;
