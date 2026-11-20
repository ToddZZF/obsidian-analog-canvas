import type { ProjectModelSource } from "@icm/model";
import { type SpiceStatement } from "@icm/spice";
import { type SimulationSourceDiagnostic } from "./source-file-graph.js";
type ModelSourceStatement = SpiceStatement & {
    sourceLanguage?: ProjectModelSource["language"];
};
/** Spectre declaration inspection shares a lexical reader, not a VACASK executor.
 * Native bodies remain opaque and retain their original text and locations. */
export declare function inspectModelSourceFile(language: ProjectModelSource["language"], path: string, text: string): {
    statements: ModelSourceStatement[];
    diagnostics: SimulationSourceDiagnostic[];
};
export declare function inspectModelSourceGraph(source: ProjectModelSource): import("./source-file-graph.js").SourceFileGraph<ModelSourceStatement>;
/** A library section takes its case rule from its real declaration. */
export declare function modelSourceSectionKey(source: ProjectModelSource, path: string, name: string, declaration?: {
    start: {
        offset: number;
    };
}): string;
export {};
