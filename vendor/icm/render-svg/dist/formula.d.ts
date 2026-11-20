import { type SchematicStyleProfile } from "@icm/derived";
import type { RichTextDocument } from "@icm/model";
/**
 * Render one atomic formula at the same baseline/alignment boundary used by
 * ordinary SVG text. A formula label type can set is drawn as label text;
 * anything else is the typesetter's nested SVG of paths, so the formal SVG,
 * PNG, and vector-PDF pipelines consume one visual artifact either way.
 */
export declare function renderFormulaDocument(document: RichTextDocument, profile: SchematicStyleProfile, options: {
    x: number;
    baselineY: number;
    fontSize: number;
    alignment: "start" | "middle" | "end";
    color?: string;
    bold?: boolean;
    italic?: boolean;
}): string | null;
