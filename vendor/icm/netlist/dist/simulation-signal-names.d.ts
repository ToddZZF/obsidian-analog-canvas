import type { CircuitProject, SimulationSourceInput, SimulationCircuitScope } from "@icm/model";
export interface SimulationSignalTarget {
    rootDocumentId: string;
    documentId: string;
    netId: string;
    occurrence: string[];
    /** Present for a terminal-current vector; the Net address is still available. */
    terminal?: {
        instanceId: string;
        pinName: string;
    };
}
/** Run-local display metadata. Native vector spelling and electrical identity never change. */
export declare function simulationSignalNames(project: CircuitProject, input: SimulationSourceInput): Record<string, string>;
/** Native vectors and Canvas addresses share the same resolved traversal. */
export declare function simulationSignals(project: CircuitProject, input: SimulationSourceInput, requestedScope?: SimulationCircuitScope): Record<string, {
    label: string;
    targets: SimulationSignalTarget[];
}>;
