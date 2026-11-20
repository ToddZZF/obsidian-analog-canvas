import type { RichTextDocument, SchematicDocument } from "@icm/model";
import type { SymbolDefinition, SymbolFormulaPresentation, SymbolPin } from "./schema.js";
export interface SignalFlowLayoutParameters {
    readonly formula?: string | undefined;
    /** The author's look for `formula`, drawn in place of the compact syntax. */
    readonly formulaFormat?: RichTextDocument | undefined;
    readonly coefficient?: string | undefined;
    /** Optional user-authored minimum body width. */
    readonly bodyWidth?: number | undefined;
    /** Optional user-authored minimum body height. */
    readonly bodyHeight?: number | undefined;
}
export interface SignalFlowFractionParts {
    readonly numerator: string;
    readonly denominator: string;
}
export interface SignalFlowFormulaLayout {
    readonly formula: string;
    /** The author's look, when one is stored for authored text. */
    readonly format: RichTextDocument | undefined;
    readonly coefficient: string | undefined;
    readonly fraction: SignalFlowFractionParts | null;
    readonly fontSize: number;
    readonly formulaWidth: number;
    readonly coefficientWidth: number;
    readonly coefficientGap: number;
    readonly contentWidth: number;
    readonly contentHeight: number;
    readonly formulaX: number;
    readonly coefficientX: number;
    readonly inlineBaseline: number;
    readonly fractionBarY: number;
    readonly numeratorBaseline: number;
    readonly denominatorBaseline: number;
    readonly bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export interface AdaptiveSignalFlowBlockLayout {
    readonly formula: SignalFlowFormulaLayout;
    readonly shape: "rectangle" | "right-tapered-trapezoid";
    readonly body: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    readonly pinSpan: number;
    readonly bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
/** Normalise visual Unicode spellings without mutating persisted input. */
export declare function normalizeSignalFlowFormula(value: string): string;
/** Parse one top-level division; all other input remains safe literal text. */
export declare function parseSignalFlowFraction(value: string): SignalFlowFractionParts | null;
export type SignalFlowInlinePart = {
    readonly kind: "text";
    readonly value: string;
} | {
    readonly kind: "superscript" | "subscript";
    readonly value: string;
};
/**
 * Read one line of compact formula syntax: `^` raises the next term, and a
 * single `_` lowers it (`g_m`); a longer script groups in parentheses or
 * braces (`g_(m1)`, `g_{m1}`); anything else is literal text.
 */
export declare function parseSignalFlowInline(value: string): SignalFlowInlinePart[];
/**
 * The compact spelling of RichText — `^` and `_` for scripts, `/` for a sole
 * fraction — ignoring slant and weight, which the Symbol's own look supplies.
 * Null when the text has no compact spelling that reads back the same: an
 * overbar, a formula, a line break, a fraction beside other text, or scripts
 * mixed with the characters that mark them.
 */
export declare function signalFlowFormulaSource(document: RichTextDocument): string | null;
export declare function resolveSignalFlowFormulaLayout(presentation: SymbolFormulaPresentation | undefined, parameters: SignalFlowLayoutParameters | undefined): SignalFlowFormulaLayout | undefined;
/**
 * Whether a Symbol's body word draws in the drawing's label typography, as a
 * converter's ADC or a lettered amplifier's A do, rather than upright as the
 * transfer function of a Signal Flow block.
 */
export declare function signalFlowBodyUsesLabelTypography(presentation: SymbolFormulaPresentation): boolean;
/**
 * A body word drawn in the drawing's label typography, when it is one. As in
 * textbook notation, a single-letter quantity (an amplifier's A, A_v) slants
 * like a label, while a word or abbreviation (ADC, DAC, LPF) stands upright.
 */
export declare function signalFlowBodyWordDocument(formula: string, drawing: SchematicDocument["presentation"]): RichTextDocument | undefined;
/**
 * The body text as the RichText it draws as, so it edits like any label: the
 * author's stored look, a body word in label typography, or a transfer
 * function read from its compact syntax into scripts and a fraction, upright
 * at the math weight.
 */
export declare function signalFlowBodyTextDocument(presentation: SymbolFormulaPresentation | undefined, parameters: SignalFlowLayoutParameters | undefined, drawing: SchematicDocument["presentation"]): RichTextDocument | undefined;
export declare function resolveAdaptiveSignalFlowBlockLayout(definition: Pick<SymbolDefinition, "formulaPresentation">, parameters: SignalFlowLayoutParameters | undefined): AdaptiveSignalFlowBlockLayout | undefined;
/** The named outline drives the frame; explicitly marked other bodies keep their artwork. */
export declare function drawnAdaptiveBodyParts(definition: Pick<SymbolDefinition, "primitives">, hiddenParts: readonly string[] | undefined, additionalPrimitives?: readonly SymbolDefinition["primitives"][number][]): {
    frameVisible: boolean;
    frameFillable: boolean;
    extraBodies: ({
        kind: "line";
        from: {
            x: number;
            y: number;
        };
        to: {
            x: number;
            y: number;
        };
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "polyline";
        points: {
            x: number;
            y: number;
        }[];
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "circle";
        center: {
            x: number;
            y: number;
        };
        radius: number;
        fillableBody?: true | undefined;
        fill?: "foreground" | "none" | undefined;
        stroke?: "foreground" | "none" | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "rectangle";
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        fillableBody?: true | undefined;
        fill?: "foreground" | "none" | undefined;
        stroke?: "foreground" | "none" | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "path";
        data: string;
        fillableBody?: true | undefined;
        bounds?: {
            x: number;
            y: number;
            width: number;
            height: number;
        } | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "polygon";
        points: {
            x: number;
            y: number;
        }[];
        fillableBody?: true | undefined;
        fill: "foreground" | "none";
        stroke?: "foreground" | "none" | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    })[];
};
/**
 * The supply leads an adaptive block draws (#1941): each north or south pin's
 * whose lead part the variant does not hide, resolved on its grown body.
 */
export declare function adaptiveSignalFlowSupplyLeads(definition: Pick<SymbolDefinition, "formulaPresentation" | "pins" | "primitives">, layout: AdaptiveSignalFlowBlockLayout, hiddenPrimitiveParts?: readonly string[]): {
    part: string;
    from: {
        x: number;
        y: number;
    };
    to: {
        x: number;
        y: number;
    };
}[];
/** The input and output strokes on an adaptive frame, before placement. */
export declare function adaptiveSignalFlowSignalLeads(definition: Pick<SymbolDefinition, "formulaPresentation">, layout: AdaptiveSignalFlowBlockLayout, hiddenPrimitiveParts?: readonly string[]): {
    input: {
        part: string;
        from: {
            x: number;
            y: number;
        };
        to: {
            x: number;
            y: number;
        };
    } | undefined;
    output: {
        part: string;
        from: {
            x: number;
            y: number;
        };
        to: {
            x: number;
            y: number;
        };
    } | undefined;
};
/** An adaptive block's extent, with the supply leads its variant draws. */
export declare function adaptiveSignalFlowBounds(definition: Pick<SymbolDefinition, "formulaPresentation" | "pins" | "primitives">, layout: AdaptiveSignalFlowBlockLayout, hiddenPrimitiveParts?: readonly string[]): AdaptiveSignalFlowBlockLayout["bounds"];
/** Resolve presentation-driven pin geometry while retaining pin identity. */
export declare function resolveSignalFlowPinAt(definition: Pick<SymbolDefinition, "formulaPresentation">, pin: Pick<SymbolPin, "at" | "direction">, parameters: SignalFlowLayoutParameters | undefined): {
    x: number;
    y: number;
};
