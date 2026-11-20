import type { SchematicStyleProfile } from "@icm/derived";
import type { SchematicDocument } from "@icm/model";
import type { SignalFlowLayoutParameters, SymbolDefinition } from "@icm/symbols";
/** Renderer-owned presentation metadata for a Transfer Function block. */
export type FormulaPresentation = NonNullable<SymbolDefinition["formulaPresentation"]>;
export interface SignalFlowFormulaRenderOptions {
    /** Body names use explicit script marks and drawing typography; expressions stay formulas. */
    labels?: {
        presentation: SchematicDocument["presentation"];
        profile: SchematicStyleProfile;
    };
    /** Instance foreground overrides apply to renderer-owned presentation too. */
    foreground: string;
    profile: SchematicStyleProfile;
}
/** Render ordinary formula text plus true SVG super/subscript tspans. */
export declare function renderSignalFlowInlineFormula(value: string): string;
/** Formula bounds consumed by formal export crop and adaptive frame layout. */
export declare function signalFlowFormulaLocalBounds(presentation: FormulaPresentation | undefined, parameters: SignalFlowLayoutParameters | undefined): {
    x: number;
    y: number;
    width: number;
    height: number;
} | undefined;
/**
 * Render renderer-owned formula text. Every preset and custom expression uses
 * one font size; fractions expand the frame rather than shrinking their text.
 */
export declare function renderSignalFlowFormula(presentation: FormulaPresentation | undefined, parameters: SignalFlowLayoutParameters | undefined, options: SignalFlowFormulaRenderOptions): string;
/**
 * Render Symbol body text at its transformed centre without transforming the
 * glyphs themselves. A mirrored or quarter-turned Symbol still moves its
 * label with the body, while letters, signs, scripts, and fraction bars stay
 * readable in screen coordinates.
 */
export declare function renderUprightSignalFlowFormula(presentation: FormulaPresentation | undefined, parameters: SignalFlowLayoutParameters | undefined, placement: NonNullable<SchematicDocument["instances"][number]["placement"]>, options: SignalFlowFormulaRenderOptions): string;
