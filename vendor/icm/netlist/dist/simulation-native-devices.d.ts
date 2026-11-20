import type { CircuitProject, SimulationCircuitScope, SimulationSourceInput } from "@icm/model";
import type { CompiledSimulationDeviceOperatingPoint, CompiledSimulationVector } from "./simulation-compile.js";
import type { DesignNetlistInstance } from "./ir.js";
import { type NativeCurrentSense } from "./simulation-native-current.js";
export { nativeTerminalCurrent } from "./simulation-native-current.js";
import { type NativeModelLibrarySymbols } from "./vacask-model-symbols.js";
export interface NativeSimulationDevice {
    documentId: string;
    instanceId: string;
    occurrence: string[];
    circuit: SimulationCircuitScope;
    reference: string;
    card: DesignNetlistInstance;
    /** Exact native primitive path, never a guessed primitive inside a wrapper. */
    nativeDevice?: string;
    modelPrimitives: {
        reference: string;
        module: string;
    }[];
    currentSenses: NativeCurrentSense[];
    polarity?: "nmos" | "pmos";
}
/** Derived from the same authored call scopes and Canvas IR as voltage naming. */
export declare function nativeSimulationDevices(project: CircuitProject, input: SimulationSourceInput, libraries?: readonly NativeModelLibrarySymbols[]): NativeSimulationDevice[];
/** Raw model output selectors. No sign, multiplicity, or terminal-gm aliasing.
 * sp_bsim4v8 output names are declared by the pinned spice/bsim4v8 OSDI model;
 * similarly named modules and opaque PDK dependencies are not interchangeable. */
export declare function nativeDeviceOpAcquisitions(device: NativeSimulationDevice): {
    parameter: "gds" | "gm" | "gmbs" | "id" | "vbs" | "vds" | "vdsat" | "vgs" | "vth";
    reference: string;
    vector: string;
    save: string;
    semantics: "model-native";
}[];
/** Potential mappings only: Code owns saves, and the result reader displays
 * only quantities actually returned by an OP record. Each wrapper primitive
 * keeps its own model values; never sum gm/id or infer terminal semantics. */
export declare function compileNativeDeviceOperatingPoints(devices: readonly NativeSimulationDevice[]): {
    vectors: CompiledSimulationVector[];
    deviceOperatingPoints: CompiledSimulationDeviceOperatingPoint[];
};
