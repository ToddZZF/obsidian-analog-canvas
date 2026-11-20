import type { RichTextDocument } from "./schema.js";
export type LinearControlledSourceKind = "vcvs" | "vccs" | "cccs" | "ccvs";
export declare const LINEAR_CONTROLLED_SOURCE_KINDS: Set<string>;
/** Drawing-only copy; neither its spelling nor its formatting binds a Net. */
export declare function defaultControlledSourceExpression(kind: LinearControlledSourceKind, ordinal?: string): string;
/** The same RichText spans and subscript renderer used by other canvas labels. */
export declare function controlledSourceExpressionDocument(source: string): RichTextDocument;
/** Expose a script-aware JSON spelling for directly edited RichText. */
export declare function controlledSourceExpressionSource(content: RichTextDocument): string;
