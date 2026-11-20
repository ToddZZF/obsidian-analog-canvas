import "@mathjax/src/js/input/tex/ams/AmsConfiguration.js";
import "@mathjax/src/js/input/tex/cases/CasesConfiguration.js";
import "@mathjax/src/js/input/tex/configmacros/ConfigMacrosConfiguration.js";
import "@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif.js";
import type { FormulaRequest, FormulaTypesetResult } from "./cache.js";
export { ANALOG_CANVAS_MATH_PROFILE_ID, FORMULA_MAX_LATEX_LENGTH, validateFormulaSource, } from "./profile.js";
export { CANONICAL_FORMULA_FONT_SIZE, formulaSourceHash, validateFormulaRequest, } from "./cache.js";
export type { FormulaArtifact, FormulaDiagnostic, FormulaDiagnosticCode, FormulaRequest, FormulaTypesetResult, } from "./cache.js";
export type { FormulaProfileDiagnostic } from "./profile.js";
declare const fontFileModules: {
    "double-struck": () => Promise<typeof import("@mathjax/mathjax-newcm-font/js/svg/dynamic/double-struck.js")>;
    calligraphic: () => Promise<typeof import("@mathjax/mathjax-newcm-font/js/svg/dynamic/calligraphic.js")>;
    script: () => Promise<typeof import("@mathjax/mathjax-newcm-font/js/svg/dynamic/script.js")>;
    fraktur: () => Promise<typeof import("@mathjax/mathjax-newcm-font/js/svg/dynamic/fraktur.js")>;
    monospace: () => Promise<typeof import("@mathjax/mathjax-newcm-font/js/svg/dynamic/monospace.js")>;
    math: () => Promise<typeof import("@mathjax/mathjax-newcm-font/js/svg/dynamic/math.js")>;
    shapes: () => Promise<typeof import("@mathjax/mathjax-newcm-font/js/svg/dynamic/shapes.js")>;
    arrows: () => Promise<typeof import("@mathjax/mathjax-newcm-font/js/svg/dynamic/arrows.js")>;
};
/** A MathJax glyph file that loads only when a formula reaches one of its glyphs. */
export type FormulaFontFile = keyof typeof fontFileModules;
/** The default loader; tests wrap it to observe or fail loads. */
export declare function loadFormulaFontFile(file: FormulaFontFile): Promise<void>;
/** Tests replace the loader to observe or fail font file loads. */
export interface FormulaTypesetterOptions {
    loadFontFile?: (file: FormulaFontFile) => Promise<void>;
}
export interface FormulaTypesetter {
    typeset(request: FormulaRequest): Promise<FormulaTypesetResult>;
}
export declare function createFormulaTypesetter(options?: FormulaTypesetterOptions): FormulaTypesetter;
/** Typesets one formula, loading the glyph files it uses before it resolves. */
export declare function typesetFormula(request: FormulaRequest): Promise<FormulaTypesetResult>;
