import { z } from "zod";
export type RichTextStyle = "italic" | "bold" | "subscript" | "superscript" | "overbar" | "lowercase" | "uppercase";
export type RichTextRun = {
    kind: "text";
    value: string;
} | {
    kind: "line-break";
} | {
    kind: "math";
    latex: string;
    display: "inline" | "block";
} | {
    kind: "span";
    style: RichTextStyle;
    children: RichTextRun[];
} | {
    kind: "fraction";
    numerator: RichTextDocument;
    denominator: RichTextDocument;
};
export interface RichTextDocument {
    runs: RichTextRun[];
}
export declare const RichTextDocumentSchema: z.ZodType<RichTextDocument>;
