import type { SchematicStyleProfile } from "@icm/derived";
import type { RichTextDocument } from "@icm/model";
/** Render only canonical RichText AST runs. */
export declare function renderRichTextDocument(document: RichTextDocument, profile: SchematicStyleProfile, options?: {
    lineOriginX?: number;
    fontSize?: number;
    defaultItalic?: boolean;
    defaultBold?: boolean;
}): string;
