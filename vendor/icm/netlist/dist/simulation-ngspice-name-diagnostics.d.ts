import type { SimulationSourceDiagnostic } from "./simulation-source-graph.js";
import type { SimulationSourceGraph } from "./simulation-source-graph.js";
/**
 * The ASCII spelling ngspice runs authored text under. Greek letters are
 * written as their names, as Canvas netlists write them (`φ1` is `phi1`).
 * Any other character outside ASCII becomes `u` and its code point in hex
 * (`输入` is `u8f93u5165`, `né` is `nu00e9`). ngspice itself reads every such
 * byte as `_`, so two different names of equal byte length (`输入`, `输出`)
 * would merge into one node.
 */
export declare function spellNgspiceAuthoredText(text: string): string;
interface NameReplacement {
    path: string;
    start: number;
    end: number;
    text: string;
}
export interface NgspiceAuthoredNamePreparation {
    diagnostics: SimulationSourceDiagnostic[];
    replacements: NameReplacement[];
}
/**
 * Give every non-ASCII name in authored ngspice source its ASCII spelling
 * (see `spellNgspiceAuthoredText`). Project bytes remain untouched; callers
 * apply these execution-only replacements before parsing run variants. Two
 * names that would still run under one spelling are refused.
 */
export declare function prepareNgspiceAuthoredNames(graph: SimulationSourceGraph): NgspiceAuthoredNamePreparation;
export {};
