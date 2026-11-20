import type { RichTextDocument, RichTextRun } from "./schema.js";
export type RichTextMathRun = Extract<RichTextRun, {
    kind: "math";
}>;
export declare function soleRichTextMathRun(document: RichTextDocument): RichTextMathRun | undefined;
/** Lossy plain-text projection for search and accessibility only. */
export declare function flattenRichText(document: RichTextDocument): string;
/** Canonicalize text-run boundaries recursively before structural equality. */
export declare function normalizeRichText(document: RichTextDocument): RichTextDocument;
/**
 * Whether any subscript or superscript is drawn italic. A script is drawn
 * upright unless an italic span sits inside it.
 */
export declare function hasItalicScripts(document: RichTextDocument): boolean;
/**
 * Whether text writes more than italic and bold: a subscript or superscript,
 * a bar, a case change, a formula, a fraction or a line break. That is the
 * author's notation, which a label's standard look would not keep.
 */
export declare function richTextWritesNotation(document: RichTextDocument): boolean;
/**
 * The same text with every subscript and superscript upright: an italic span
 * inside a script is removed, and every other style is kept.
 */
export declare function uprightScripts(document: RichTextDocument): RichTextDocument;
/**
 * Whether two presentations draw the same characters with the same styles,
 * regardless of how their spans happen to be nested or split.
 */
export declare function sameStyledText(left: RichTextDocument, right: RichTextDocument): boolean;
/**
 * Replace the plain-text value of a semantic RichText projection while
 * retaining the authored style of every unchanged character and the nearest
 * replaced character. This is the shared bridge between an authoritative
 * semantic name and its independently editable RichText presentation.
 */
export declare function rewriteRichTextPlainText(document: RichTextDocument, replacement: string): RichTextDocument;
/** Content-only editing of prose preserves authored spans, including unbold.
 * Formulas/fractions require an explicit RichText replacement, never flattening.
 */
export declare function rewriteRichTextContent(document: RichTextDocument, replacement: string): RichTextDocument | undefined;
