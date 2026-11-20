import type { RichTextDocument } from "./schema.js";
/** Whether any nonblank character is drawn under an overbar. */
export declare function hasRichTextOverbar(content: RichTextDocument): boolean;
/** Electrical spelling of a styled identifier: subscripts introduce `_`, and
 * an overbar marks the whole identifier with a trailing `_bar`. Weight,
 * slant, color and superscripts remain presentation. */
export declare function richTextIdentifier(content: RichTextDocument): string;
/** Whether a display spells `name`: its visible characters are the name, or
 * the name with the `_` before a subscript left out. The schema holds every
 * stored display of a bound label to this, and the Agent's restyles test it.
 * Legacy explicit formatting can omit the separator; never reinterpret its
 * stored source name merely by opening a historical drawing. */
export declare function richTextPresentsIdentifier(content: RichTextDocument, name: string): boolean;
/** A terminal `_bar` becomes an overbar; the first remaining underscore
 * introduces the default subscript. No spelling is guessed from leading letters. */
export declare function identifierTextDocument(name: string, options?: {
    underscoreSubscript?: boolean | undefined;
}): RichTextDocument;
/** Rename while retaining authored non-name typography. Reconstruct script
 * boundaries and the overbar from the actual name. */
export declare function rewriteRichTextIdentifier(content: RichTextDocument, name: string, options?: {
    underscoreSubscript?: boolean | undefined;
}): RichTextDocument;
export type LabelSubscriptCase = "preserve" | "uppercase" | "lowercase";
/** Change only explicit subscript runs, leaving baseline text and other styles
 * intact. Script spans reset inherited slant in the shared SVG/text renderers. */
export declare function formatLabelSubscripts(content: RichTextDocument, options: {
    case?: LabelSubscriptCase | undefined;
    italic?: boolean | undefined;
}): RichTextDocument;
export declare function identifierSubscriptCase(name: string, mode: LabelSubscriptCase): string;
