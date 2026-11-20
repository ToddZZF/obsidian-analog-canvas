import type { CircuitProject, SimulationSourceInput } from "@icm/model";
export interface NgspiceSignalTarget {
    rootDocumentId: string;
    documentId: string;
    netId: string;
    occurrence: string[];
}
/** Run-local display metadata. Native vector spelling and electrical identity never change. */
export declare function ngspiceSignalNames(project: CircuitProject, input: SimulationSourceInput): Record<string, string>;
/** Native vectors and Canvas addresses share the same resolved traversal. */
export declare function ngspiceSignals(project: CircuitProject, input: SimulationSourceInput, selectedScope?: import("@icm/model").SimulationCircuitScope): Record<string, {
    label: string;
    targets: NgspiceSignalTarget[];
}>;
