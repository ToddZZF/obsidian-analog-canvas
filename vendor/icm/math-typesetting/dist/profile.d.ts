export declare const ANALOG_CANVAS_MATH_PROFILE_ID: "analog-canvas-math-v1";
export type FormulaProfileDiagnostic = {
    code: "FORMULA_INVALID_REQUEST";
    message: string;
} | {
    code: "FORMULA_DISALLOWED_COMMAND";
    message: string;
    command: string;
};
export declare const FORMULA_MAX_LATEX_LENGTH = 2048;
export declare function validateFormulaSource(latex: string): FormulaProfileDiagnostic | undefined;
