import type { DeviceDescriptor, DeviceDescriptorIssue, DeviceRegistry, DeviceSymbolContract } from "./contract.js";
export declare function validateDeviceDescriptors(descriptors: readonly DeviceDescriptor[]): DeviceDescriptorIssue[];
/** @internal The parity test holds the registry to the Symbols. */
export declare function validateDeviceRegistry(registry: DeviceRegistry, symbols: readonly DeviceSymbolContract[]): DeviceDescriptorIssue[];
