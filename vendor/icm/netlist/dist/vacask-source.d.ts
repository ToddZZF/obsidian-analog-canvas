import type { SimulationSourceInput, SourceSpan } from "@icm/model";
import { type SimulationSourceDiagnostic } from "./source-file-graph.js";
export interface VacaskSourceToken {
    kind: "word" | "string" | "symbol";
    /** Decoded string/identifier, case preserved. Original spelling lives in text. */
    value: string;
    start: number;
    end: number;
}
export interface VacaskSourceStatement {
    rawText: string;
    sourceRef: SourceSpan;
    tokens: VacaskSourceToken[];
}
/** Lexical inspection, not a second simulator grammar or expression evaluator.
 * Unknown native statements stay available for the simulator to interpret.
 * Based on pinned VACASK input-overview/identifiers/strings and dfllexer.l. */
export declare function inspectVacaskSource(path: string, text: string, entry?: boolean): {
    statements: VacaskSourceStatement[];
    diagnostics: SimulationSourceDiagnostic[];
    comments: {
        start: number;
        end: number;
        sourceRef: SourceSpan;
    }[];
};
/** Native includes use the same ownership graph as the existing compiler.
 * No SPICE-to-native fallback, extension-based language guessing or host reads. */
export declare function inspectVacaskSourceGraph(input: SimulationSourceInput, options?: {
    includeComments?: boolean;
}): import("./source-file-graph.js").SourceFileGraph<VacaskSourceStatement>;
