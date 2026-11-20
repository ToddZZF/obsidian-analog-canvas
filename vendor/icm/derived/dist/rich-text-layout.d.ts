import type { RichTextDocument, RichTextRun } from "@icm/model";
import type { SchematicStyleProfile } from "./style-profile.js";
import { type SchematicTextFace } from "./fraction-text-metrics.js";
import { type LabelFormulaLayout } from "./label-formula.js";
/** A formula set in label type at these metrics, when its LaTeX allows. */
export declare function labelFormulaLayout(latex: string, display: "inline" | "block", metrics: RichTextMetrics): LabelFormulaLayout | null;
/**
 * The extent of a formula-only document about its baseline: set in label
 * type when it can be, else as MathJax typeset it. Null for other content,
 * or a formula not typeset yet.
 */
export declare function formulaExtents(document: RichTextDocument, metrics: RichTextMetrics): {
    width: number;
    ascent: number;
    descent: number;
} | null;
export interface RichTextMetrics {
    fontSize: number;
    lineHeight: number;
    subscriptScale: number;
    subscriptBaselineShiftEm: number;
    subscriptHorizontalGapEm: number;
    /** Shared proportional geometry for a fraction and all its companions. */
    fractionText?: boolean;
    bold?: boolean;
    italic?: boolean;
    /** The face text is measured in; Metropolis when absent (#1725). */
    face?: SchematicTextFace;
}
export interface RichTextLayout {
    width: number;
    height: number;
    lineWidths: number[];
    lineHeights: number[];
}
/** Where a line's glyphs put ink across, from where the line starts. */
export interface TextInk {
    readonly left: number;
    readonly right: number;
}
/** One line of label text, as measureLabelText sets it. */
export interface LabelTextLine {
    /** The line's advance: what start, middle and end alignment place. */
    readonly width: number;
    /** Null for a line that draws nothing. */
    readonly ink: TextInk | null;
}
export declare function richTextAdvanceEm(value: string): number;
/**
 * Shared geometry of an inline stacked fraction. All offsets are in em of
 * the PART font (the fraction parts render at `fractionPartScale`), so the
 * block grows with the parts and the bar always lands where the metrics say.
 * At the reference subscript scale (0.76) these reproduce the original
 * base-font offsets (bar 0.3, numerator rise 0.6, denominator drop 0.42,
 * overhang 0.08, gap 0.26, ascent 0.12).
 */
export declare const fractionGeometry: {
    /** Fraction parts render one A+ level (10%) above the profile subscript scale. */
    readonly partScaleMultiplier: 1.1;
    /** Fraction bar height above the anchor baseline, em of the part font. */
    readonly barRiseEm: 0.395;
    /** Numerator baseline above the anchor baseline, em of the part font. */
    readonly numeratorBaselineRiseEm: 0.789;
    /** Denominator baseline below the anchor baseline, em of the part font. */
    readonly denominatorBaselineDropEm: 0.553;
    /** Fraction bar overhang beyond the widest part, per side, em of the part font. */
    readonly barOverhangEm: 0.105;
    /** Vertical allowance between the two part lines, em of the part font. */
    readonly barGapEm: 0.342;
    /** Ascent a fraction adds beyond the plain first-line ascent heuristic, em of the part font. */
    readonly extraAscentEm: 0.52;
    /** Capitals and digits of the part face (DejaVu Sans Bold, 1493/2048 em). */
    readonly capHeightEm: 0.729;
};
/**
 * Baselines of a fraction's two parts, in em of the part font. A subscript
 * hangs below the numerator's baseline and a superscript rises above the
 * denominator's capitals, both toward the bar. Such a part moves away from the
 * bar just far enough that its script keeps the clearance a plain
 * denominator's capitals keep below it, so the bar stays centered between the
 * two parts' nearest ink.
 */
export declare function fractionPartBaselines(fraction: Extract<RichTextRun, {
    kind: "fraction";
}>, typography: {
    subscriptScale: number;
    subscriptBaselineShiftEm: number;
}): {
    numeratorRiseEm: number;
    denominatorDropEm: number;
};
/**
 * Ascent a document's fractions add beyond the plain first-line ascent
 * heuristic, em of the part font: the plain allowance plus the most any
 * numerator is lifted for its subscript. Zero without a fraction.
 */
export declare function fractionExtraAscentEm(document: RichTextDocument, typography: {
    subscriptScale: number;
    subscriptBaselineShiftEm: number;
}): number;
/**
 * Fraction part font scale relative to the base font: one A+ level above the
 * profile subscript scale. The single knob behind every fraction render and
 * measure keeps labels, hit bounds, and exported SVG in agreement.
 */
export declare function fractionPartScale(subscriptScale: number): number;
export declare function containsFractionRun(document: RichTextDocument): boolean;
export declare function typographyFontSize(token: "caption" | "body" | "label", profile: SchematicStyleProfile): number;
export declare function richTextMetrics(profile: SchematicStyleProfile, token?: "caption" | "body" | "label", sizeScale?: number, style?: {
    bold?: boolean;
    italic?: boolean;
}): RichTextMetrics;
/** Deterministic layout shared by editor hits, export bounds, and snapshots. */
export declare function measureRichTextDocument(document: RichTextDocument, metrics: RichTextMetrics): RichTextLayout;
/**
 * The distance from each line's baseline to the next one's, one per line
 * break in document order (2026-10-15). Plain lines keep the profile's line
 * height, so drawings of plain text stay as they were. A line with a script,
 * a CJK character or a formula, or one under such a line, moves down until
 * its ink clears the ink above: a subscript no longer runs into the line
 * below it.
 */
export declare function richTextLinePitches(document: RichTextDocument, metrics: RichTextMetrics): number[];
/**
 * Label text in Metropolis with DejaVu symbol fallback: each run advances
 * by the label advance tables
 * (schematicTextAdvanceEm) in its own weight, a script after its gap at the
 * script scale, and each line's ink runs from its first glyph's outline to
 * its last one's, side bearings included. A bar, a fraction or a formula
 * inks its whole box. Label clearance measures with it, and so can anything
 * that needs a label's extent before it is drawn. Standalone SVG viewers
 * without these fonts may use another face.
 */
export declare function measureLabelText(document: RichTextDocument, metrics: RichTextMetrics): {
    width: number;
    lines: LabelTextLine[];
};
/**
 * Break a document's lines so none is wider than `maxWidth`.
 *
 * The result is an ordinary RichTextDocument with `line-break` runs inserted,
 * which is why this is the whole of the feature: every consumer — measurement,
 * bounds, the SVG renderer, export — already lays out explicit line breaks, so
 * a wrapped document draws and measures the same everywhere by construction
 * rather than by two implementations agreeing.
 *
 * Wrapping is by word. A single word wider than the box overflows rather than
 * being cut mid-glyph, because a broken identifier reads as a different one.
 * A script stack is indivisible, so `V` never comes apart from its subscript,
 * while an ordinary styling span is descended into and reopened on each line —
 * the house text style wraps a whole sentence in one italic span, so a wrapper
 * that only split bare text runs would never break anything a person typed.
 * Authored breaks are kept as they are.
 */
export declare function wrapRichTextDocument(document: RichTextDocument, metrics: RichTextMetrics, maxWidth: number): RichTextDocument;
