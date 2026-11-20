import type { SchematicStyleProfile } from "@icm/derived";
import type { RichTextDocument } from "@icm/model";
interface FractionTextOptions {
    x: number;
    y: number;
    fontSize: number;
    alignment: "start" | "middle" | "end";
    color: string;
    bold?: boolean;
    italic?: boolean;
}
/** Mixed text needs sibling SVG text and line elements to keep every fraction bar. */
export declare function renderFractionText(content: RichTextDocument, profile: SchematicStyleProfile, options: FractionTextOptions): string | null;
export {};
