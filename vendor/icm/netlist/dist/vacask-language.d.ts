import { type VacaskSourceToken } from "./vacask-source.js";
export type NativeLanguageContext = "circuit" | "control";
export interface NativeParameterHint {
    label: string;
    key?: string;
    choices?: readonly string[];
    optional?: boolean;
    repeat?: boolean;
    symbols?: "node" | "instance" | "vector";
}
export interface NativeLanguageHelp {
    name: string;
    context: NativeLanguageContext;
    signature: string;
    summary: string;
    section: string;
    group: string;
    keywords?: string;
    parameters?: readonly NativeParameterHint[];
    analysisType?: string;
    primitive?: "vsource" | "isource" | "resistor" | "capacitor" | "inductor";
}
export declare const VACASK_LANGUAGE_REFERENCE = "https://codeberg.org/arpadbuermen/VACASK/src/commit/c1a1c84f1b2b9aa71c0cddf06e555441434db7b7/docs/";
/** Shared authoring catalogue, not an executor allow-list. Native commands not
 * described here remain editable and pass through to the selected runtime. */
export declare const nativeLanguageHelp: readonly NativeLanguageHelp[];
export declare function lookupNativeHelp(name: string, context: NativeLanguageContext): NativeLanguageHelp | undefined;
/** Map a native voltage acquisition selector back to its raw node identity.
 * Quoting is syntax, case is identity; never lowercase hierarchical names. */
export declare function nativeVoltageSelectorNode(selector: string): string | undefined;
/** Small proven authoring errors only; never a whitelist for native programs. */
export declare function inspectNativeLanguage(path: string, text: string, entry?: boolean): {
    statements: import("./vacask-source.js").VacaskSourceStatement[];
    diagnostics: import("./source-file-graph.js").SimulationSourceDiagnostic[];
    comments: {
        start: number;
        end: number;
        sourceRef: import("@icm/model").SourceSpan;
    }[];
};
export declare function nativeControlContext(text: string, entry?: boolean): boolean;
/** Balanced native fields; whitespace surrounding '=' does not split an
 * assignment, and quoted nodes, vectors and expressions keep exact spelling. */
export declare function nativeArgumentFields(text: string, tokens: readonly VacaskSourceToken[]): {
    from: number;
    to: number;
    value: string;
}[];
export declare function nativeSourceHints(module: string | undefined, type: string | undefined): readonly NativeParameterHint[];
/** Conservative root-only suggestions, not circuit connectivity or elaboration.
 * Conditional/local definitions are not advertised as available root symbols. */
export declare function nativeLanguageSymbols(sources: readonly {
    text: string;
    entry: boolean;
}[]): {
    nodes: Set<string>;
    instances: Map<string, string | undefined>;
    models: Map<string, string | undefined>;
};
/** Deterministic skeleton. Only the new analysis identity is supplied; no
 * bias, frequency, temperature or timestep is silently selected. */
export declare function nativeHelpInsertion(help: NativeLanguageHelp, text: string, entry?: boolean): string;
/** Read-only view of the same helper catalogue used by Code. Skeleton identities
 * are examples, not edits against a Project; callers own insertion and revision guards. */
export declare function nativeAuthoringHelp(filter?: {
    name?: string | undefined;
    context?: NativeLanguageContext | undefined;
}): {
    name: string;
    context: NativeLanguageContext;
    signature: string;
    summary: string;
    reference: string;
    source: string;
}[];
