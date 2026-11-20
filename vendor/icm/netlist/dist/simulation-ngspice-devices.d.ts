import type { CircuitProject, SimulationCircuitScope, SimulationSourceInput } from "@icm/model";
import type { DesignNetlistInstance } from "./ir.js";
export interface NativeSimulationDevice {
    documentId: string;
    instanceId: string;
    occurrence: string[];
    circuit: SimulationCircuitScope;
    reference: string;
    card: DesignNetlistInstance;
    /** ngspice's flattened primitive identity, not the display reference. */
    nativeDevice?: string;
    polarity?: "nmos" | "pmos";
}
/** Derived from the same authored call scopes and Canvas IR as voltage naming. */
export declare function ngspiceSimulationDevices(project: CircuitProject, input: SimulationSourceInput): NativeSimulationDevice[];
export declare const NATIVE_MOS_OP_PARAMETERS: readonly ["id", "vgs", "vds", "vbs", "gm", "gds", "gmbs", "vth", "vdsat"];
export declare function nativeDeviceOpVectors(device: NativeSimulationDevice): string[];
export declare function nativeDeviceOpFields(device: NativeSimulationDevice): Array<{
    parameter: (typeof NATIVE_MOS_OP_PARAMETERS)[number];
    vector: string;
}>;
export declare function nativeTerminalCurrent(device: NativeSimulationDevice, pinName: string): {
    ok: true;
    vectors: string[];
    directives: string[];
} | {
    ok: false;
    message: string;
};
