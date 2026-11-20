import type { CircuitProject, SimulationSourceInput } from "@icm/model";
import type { SimulationSignalTarget } from "./simulation-signal-names.js";
import type { DesignNetlistCell, DesignNetlistInstance } from "./ir.js";
import type { NativeSimulationDevice } from "./simulation-native-devices.js";
import type { SimulationSourceDiagnostic } from "./source-file-graph.js";
import { type TerminalCurrentInstrumentation } from "./terminal-current-instrumentation.js";
export interface NativeCurrentSense extends TerminalCurrentInstrumentation {
    reference: string;
    vector: string;
    save: string;
    collision: boolean;
}
/** A compiler-owned native branch identity, stable under device/output reorder.
 * Never renumber on collision: old source must not silently measure another pin. */
export declare function nativeCurrentSenses(cell: DesignNetlistCell, instance: DesignNetlistInstance, path: readonly string[], occupied: ReadonlySet<string>): NativeCurrentSense[];
/** Native save statements are the sole request authority. No private directive
 * or persisted selection list. Physical sensing exists only in derived IR. */
export declare function nativeCurrentInstrumentation(input: SimulationSourceInput, devices: readonly NativeSimulationDevice[]): {
    instrumentations: Map<string, TerminalCurrentInstrumentation>;
    diagnostics: SimulationSourceDiagnostic[];
};
export declare function nativeTerminalCurrent(device: NativeSimulationDevice, pinName: string): {
    ok: true;
    vectors: string[];
    directives: string[];
} | {
    ok: false;
    message: string;
};
/** Captured display/navigation evidence. Model output parameters are deliberately
 * absent: only a proven terminal-total branch has this meaning. */
export declare function nativeTerminalSignals(project: CircuitProject, input: SimulationSourceInput, devices: readonly NativeSimulationDevice[], instrumentations: ReadonlyMap<string, TerminalCurrentInstrumentation>): Record<string, {
    label: string;
    targets: SimulationSignalTarget[];
}>;
