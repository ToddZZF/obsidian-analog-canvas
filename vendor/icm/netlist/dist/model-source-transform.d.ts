import type { ProjectModelSource } from "@icm/model";
import type { SimulationSourceDiagnostic } from "./source-file-graph.js";
import { type ModelSourceProcess } from "./model-source-process.js";
/** GUI draft shortcuts and Agent Apply use this same bounded native operation. */
export declare function transformProjectModelSource(source: ProjectModelSource, target: {
    language?: ProjectModelSource["language"] | undefined;
    process?: ModelSourceProcess | undefined;
}): {
    ok: true;
    source: ProjectModelSource;
} | {
    ok: false;
    diagnostic: SimulationSourceDiagnostic;
};
/** Process is a projection of real owned calls and dependencies, not a label. */
export declare function inspectProjectModelProcess(source: ProjectModelSource): ModelSourceProcess;
