import type { CircuitProject, SimulationCircuitBinding, SimulationSourceInput, ProjectModelSource } from "@icm/model";
import { type DeviceParameterDefinition } from "@icm/devices";
import { type PrintedParameterConversion } from "./parameter-projection.js";
import { type ProjectModelSourceLocation } from "./project-model-source.js";
import type { PrintedNetlistParameter, PrintedNetlistInstance } from "./printed-netlist.js";
import type { NetlistDiagnostic } from "./ir.js";
import type { SimulationSourceDiagnostic } from "./source-file-graph.js";
interface EditableSourceBody {
    documentId: string;
    instanceId: string;
    documentRevision: number;
    startOffset: number;
    endOffset: number;
    rawValue: string;
    sourceParameters: Record<string, string>;
}
export interface EditableCircuitParameter extends PrintedNetlistParameter {
    descriptor: DeviceParameterDefinition;
    originalValue: string;
    conversion: PrintedParameterConversion;
    documentRevision: number;
}
export interface GeneratedCircuitSource {
    engine?: "ngspice" | "vacask";
    binding: SimulationCircuitBinding;
    text: string;
    parameters: EditableCircuitParameter[];
    sourceBodies?: EditableSourceBody[];
    instances: PrintedNetlistInstance[];
    reachedDocuments: {
        id: string;
        revision: number;
    }[];
    modelLocations?: ProjectModelSourceLocation[];
    modelSnapshots?: ProjectModelSource[];
}
/** Editable Circuit view uses persisted values, never a prepared variable/Batch projection. */
export declare function generateCircuitSource(project: CircuitProject, binding: SimulationCircuitBinding, input?: SimulationSourceInput, engine?: "ngspice" | "vacask"): {
    ok: true;
    source: GeneratedCircuitSource;
    warnings: NetlistDiagnostic[];
} | {
    ok: false;
    diagnostics: NetlistDiagnostic[];
    sourceDiagnostics?: SimulationSourceDiagnostic[];
};
export interface CircuitParameterChange {
    documentId: string;
    expectedRevision: number;
    instanceId: string;
    parameter: string;
    value: string;
    unset?: true;
}
/** Plan exact parameter-only changes. The service checks the generation digest and commits typed edits atomically. */
export declare function planCircuitSourceEdit(source: GeneratedCircuitSource, nextText: string): {
    ok: true;
    changes: CircuitParameterChange[];
    modelUpdates?: ProjectModelSource[];
} | {
    ok: false;
    code: string;
    message: string;
    range?: {
        from: number;
        to: number;
    };
};
export {};
