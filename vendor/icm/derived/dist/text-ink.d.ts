import type { DerivedRect, RichTextDocument } from "@icm/model";
import { type RichTextMetrics } from "./rich-text-layout.js";
import type { SchematicStyleProfile } from "./style-profile.js";
/** Height of the label font's capitals and figures, in em. */
export declare const LABEL_CAP_HEIGHT_EM = 0.72;
/**
 * How far a label's ink reaches below its baseline, in em of its font: a
 * subscript's or a fraction's figures, a descender (g, p, y), or nothing.
 */
export declare function labelInkDescentEm(content: RichTextDocument, typography: SchematicStyleProfile["typography"]): number;
/**
 * Where upright text's glyphs reach across when each of its lines stands on
 * `x` by `alignment`, as the renderer anchors them: from the first glyph's
 * outline to the last one's, in the label advance tables (measureLabelText).
 * An end-aligned value's first figure stands where the served face draws it.
 * Null for text that draws nothing.
 */
export declare function uprightTextInkSpan(content: RichTextDocument, metrics: RichTextMetrics, alignment: "start" | "middle" | "end", x: number): {
    left: number;
    width: number;
} | null;
/**
 * What upright text whose first line stands on `baseline` draws: from its
 * capitals, or a stacked fraction's numerator `fractionAscent` above them,
 * down `descentEm` (in em) under its last line, and across `left` to
 * `left + width` (uprightTextInkSpan). `layoutHeight` is the measured height
 * of all its lines. Labels and free drawing text share it, so a finding about
 * one is measured as a finding about the other.
 */
export declare function uprightTextInkBounds(text: {
    left: number;
    width: number;
    baseline: number;
    fontSize: number;
    fractionAscent: number;
    descentEm: number;
    layoutHeight: number;
}): DerivedRect;
