import { type CircuitProject, type ProjectSimulationFolder, type SimulationExperimentConfig, type SimulationRunVariant, type ProjectModelSource, type SimulationRawDependency } from "@icm/model";
import { type ProjectModelSourceLocation } from "./project-model-source.js";
import { type SimulationFileSourceMap } from "./simulation-source-map.js";
import { type CompiledSimulationDeviceOperatingPoint, type CompiledSimulationOutput, type CompiledSimulationVector } from "./simulation-compile.js";
import type { PrintedNetlistParameter as PrintedSpiceParameter } from "./printed-netlist.js";
import type { PrintedNetlistInstance } from "./printed-netlist.js";
import { type SimulationSourceDiagnostic, type SimulationSourceGraph } from "./simulation-source-graph.js";
export interface NgspiceGeneratedSimulationFile {
    bindingId: string;
    path: string;
    text: string;
    parameters: PrintedSpiceParameter[];
    instances: PrintedNetlistInstance[];
    modelSources?: ProjectModelSourceLocation[];
}
export type NgspiceSourceSimulationCompilation = {
    ok: false;
    diagnostics: SimulationSourceDiagnostic[];
} | {
    ok: true;
    config: SimulationExperimentConfig;
    authority: "code" | "legacy-config";
    /** Original source bytes remain separate from the execution projection. */
    authoredFiles: {
        path: string;
        text: string;
    }[];
    files: {
        path: string;
        text: string;
    }[];
    entry: string;
    generated: NgspiceGeneratedSimulationFile[];
    vectors: CompiledSimulationVector[];
    outputs: CompiledSimulationOutput[];
    deviceOperatingPoints: CompiledSimulationDeviceOperatingPoint[];
    warnings: SimulationSourceDiagnostic[];
    reachedDocumentIds: string[];
    /** Includes object identities/parameters but excludes drawing-only changes. */
    electricalHash: string;
    sourceMaps: SimulationFileSourceMap[];
    includes: SimulationSourceGraph["includes"];
    modelSources?: ProjectModelSource[];
    modelDependencies?: SimulationRawDependency[];
};
/** Author text stays native. Canvas extraction, instrumentation and output math remain shared. */
export declare function compileNgspiceSourceSimulation(project: CircuitProject, folder: ProjectSimulationFolder, variant?: SimulationRunVariant): NgspiceSourceSimulationCompilation;
