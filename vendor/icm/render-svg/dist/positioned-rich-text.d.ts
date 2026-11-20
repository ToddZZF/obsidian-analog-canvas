import type { SchematicStyleProfile } from "@icm/derived";
import type { RichTextDocument } from "@icm/model";
export interface PositionedOverbarScript {
    tspans: string;
    decorations: string;
    width: number;
}
/**
 * Position the expression shape that SVG inline text cannot represent: a
 * barred name whose bar spans a base with attached sub/superscripts, and
 * every such name on the line (I_N & EV, each under its own single bar).
 * Each proportional-font segment receives an explicit deterministic width,
 * so Chromium and Resvg share the same attachment column and line endpoints.
 */
export declare function renderPositionedOverbarScriptDocument(document: RichTextDocument, profile: SchematicStyleProfile, options: {
    x: number;
    y: number;
    fontSize: number;
    alignment: "start" | "middle" | "end";
    /** Paint for explicit decorations that cannot inherit from SVG text. */
    color?: string;
    defaultItalic?: boolean;
    defaultBold?: boolean;
}): PositionedOverbarScript | null;
