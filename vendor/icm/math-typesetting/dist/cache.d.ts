import { ANALOG_CANVAS_MATH_PROFILE_ID } from "./profile.js";
export { ANALOG_CANVAS_MATH_PROFILE_ID } from "./profile.js";
export declare const CANONICAL_FORMULA_FONT_SIZE = 100;
export interface FormulaRequest {
    latex: string;
    display: "inline" | "block";
    profileId: typeof ANALOG_CANVAS_MATH_PROFILE_ID;
    /** Drawing text defaults: bold sans-serif, upright unless explicitly italic. */
    bold?: boolean;
    italic?: boolean;
}
export interface FormulaArtifact {
    svg: string;
    width: number;
    height: number;
    baseline: number;
    sourceHash: string;
}
export type FormulaDiagnosticCode = "FORMULA_INVALID_REQUEST" | "FORMULA_DISALLOWED_COMMAND" | "FORMULA_PARSE_ERROR" | "FORMULA_RENDER_ERROR"
/** A glyph file failed to load; the next request loads it again. */
 | "FORMULA_FONT_UNAVAILABLE";
export interface FormulaDiagnostic {
    code: FormulaDiagnosticCode;
    message: string;
    command?: string;
}
export type FormulaTypesetResult = {
    ok: true;
    artifact: FormulaArtifact;
} | {
    ok: false;
    diagnostic: FormulaDiagnostic;
};
export declare function formulaSourceHash(request: FormulaRequest): string;
export declare function validateFormulaRequest(request: FormulaRequest): FormulaDiagnostic | undefined;
/** Protects one active render/export working set from background LRU eviction. */
export declare function retainFormulaArtifacts(requests: readonly FormulaRequest[]): () => void;
export declare function cachedFormulaResult(request: FormulaRequest): FormulaTypesetResult | undefined;
export declare function prepareFormula(request: FormulaRequest): Promise<FormulaTypesetResult>;
/** @internal Tests start each case from an empty formula cache. */
export declare function clearFormulaArtifactCacheForTests(): void;
