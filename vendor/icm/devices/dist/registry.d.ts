import type { CircuitProject, ComponentDefinition } from "@icm/model";
import type { BuiltInSubcircuitDescriptor, DeviceDescriptor, DeviceRegistry } from "./contract.js";
export declare const deviceRegistry: DeviceRegistry;
/** Registry tests validate every built-in descriptor. */
export declare const builtInDeviceDescriptors: readonly DeviceDescriptor[];
export declare function deviceDescriptor(symbolId: string, project?: Pick<CircuitProject, "componentDefinitions">): DeviceDescriptor | undefined;
export declare const builtInSubcircuitDescriptors: readonly BuiltInSubcircuitDescriptor[];
export declare function subcircuitDescriptor(symbolId: string, project?: Pick<CircuitProject, "componentDefinitions">): BuiltInSubcircuitDescriptor | undefined;
/** Recognize an inherited black-box contract, rather than only its Symbol ID.
 * Formal aliases, order and retargeting remain authorable; generated bodies
 * independently check their fixed positional interface during netlist export. */
export declare function hasBuiltInSubcircuitInterface(component: ComponentDefinition): boolean;
