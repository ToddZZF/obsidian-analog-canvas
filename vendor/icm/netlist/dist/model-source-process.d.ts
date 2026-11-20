import type { ProjectModelSource } from "@icm/model";
import type { SimulationSourceDiagnostic } from "./source-file-graph.js";
export type ModelSourceProcess = "abstract" | "sky130" | "sg13g2" | "custom";
/** Called with the canonical SPICE projection; never reads host model files. */
export declare function inspectSpiceModelProcess(source: ProjectModelSource): ModelSourceProcess;
/** Refuse an ambiguous transformation before touching any owned bytes. */
export declare function replaceSpiceModelProcess(source: ProjectModelSource, target: ModelSourceProcess): {
    ok: true;
    source: ProjectModelSource;
} | {
    ok: false;
    diagnostic: SimulationSourceDiagnostic;
};
