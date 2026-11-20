import type { DeviceParameterDefinition } from "./contract.js";
import { type ParameterOwner, type InstanceParameterContract } from "./instance-parameters.js";
/** Project-owned parameter lookup shared by presentation consumers. */
export interface InstanceParameterResolver {
    readonly resolveParameters?: ((instance: ParameterOwner) => InstanceParameterContract | undefined) | undefined;
}
export interface ParameterDisplayContract {
    readonly definitions: readonly DeviceParameterDefinition[];
    readonly individual: readonly DeviceParameterDefinition[];
    readonly summary: "value" | "mos" | "geometry" | "none";
    readonly magnetic: boolean;
}
/** Model selection owns the fields; artwork only selects established typography. */
export declare function parameterDisplayContract(instance: ParameterOwner, resolver?: InstanceParameterResolver): ParameterDisplayContract;
