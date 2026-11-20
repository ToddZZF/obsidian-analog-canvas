import { type ProjectModelSource, type CircuitProject, type ProjectSimulationFolder, type SimulationExperimentConfig, type SimulationRunVariant } from "@icm/model";
import { type SimulationFileSourceMap } from "./simulation-source-map.js";
import type { CompiledSimulationDeviceOperatingPoint, CompiledSimulationOutput, CompiledSimulationVector } from "./simulation-compile.js";
import { simulationSignals } from "./simulation-signal-names.js";
import type { PrintedNetlistParameter, PrintedNetlistInstance } from "./printed-netlist.js";
import { inspectVacaskSourceGraph } from "./vacask-source.js";
import type { SimulationSourceDiagnostic } from "./source-file-graph.js";
import { type ProjectModelSourceLocation } from "./project-model-source.js";
export interface GeneratedSimulationFile {
    bindingId: string;
    path: string;
    text: string;
    parameters: PrintedNetlistParameter[];
    instances: PrintedNetlistInstance[];
    modelSources?: ProjectModelSourceLocation[];
}
export type SourceSimulationCompilation = {
    ok: false;
    diagnostics: SimulationSourceDiagnostic[];
} | {
    ok: true;
    language: "vacask";
    config: SimulationExperimentConfig;
    authority: "code";
    authoredFiles: {
        path: string;
        text: string;
    }[];
    files: {
        path: string;
        text: string;
    }[];
    entry: string;
    generated: GeneratedSimulationFile[];
    /** External model/master names required by the generated electrical IR. */
    requiredModels: string[];
    vectors: CompiledSimulationVector[];
    signals: ReturnType<typeof simulationSignals>;
    outputs: CompiledSimulationOutput[];
    deviceOperatingPoints: CompiledSimulationDeviceOperatingPoint[];
    warnings: SimulationSourceDiagnostic[];
    reachedDocumentIds: string[];
    electricalHash: string;
    sourceMaps: SimulationFileSourceMap[];
    includes: ReturnType<typeof inspectVacaskSourceGraph>["includes"];
    modelSources?: ProjectModelSource[];
};
/** Public native compilation. Source owns analysis/control; Canvas owns the
 * generated electrical IR. No old executable compiler or syntax fallback. */
export declare function compileSourceSimulation(project: CircuitProject, folder: ProjectSimulationFolder, variant?: SimulationRunVariant): SourceSimulationCompilation;
