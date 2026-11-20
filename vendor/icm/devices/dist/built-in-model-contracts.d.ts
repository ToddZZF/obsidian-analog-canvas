import type { BuiltInSubcircuitPort, DeviceParameterDefinition } from "./contract.js";
import { type IdealComparatorBody } from "./ideal-comparator.js";
import { type IdealOpampBody } from "./ideal-opamp.js";
export type ModelBackend = "spice" | "spectre" | "vacask";
/** Implementation selectors contain no equations or backend syntax. */
export type BuiltInModelRecipe = {
    readonly family: "linear";
    readonly implementation: "opamp_differential" | "voltage_amplifier" | "transconductance" | "differential_transconductance" | "adder";
} | {
    readonly family: "logic";
    readonly implementation: "inverter" | "buffer" | "and" | "nand" | "or" | "nor" | "xor" | "xnor" | "delay" | "flip-flop";
} | {
    readonly family: "signal";
    readonly implementation: "multiplier" | "quantizer" | "differential-input-quantizer" | "differential-output-quantizer";
} | {
    readonly family: "comparator";
    readonly implementation: "comparator";
} | {
    readonly family: "passive";
    readonly implementation: "crystal" | "potentiometer";
} | {
    readonly family: "opamp";
    readonly implementation: "opamp";
} | {
    readonly family: "semiconductor";
    readonly implementation: "ujt" | "put" | "shockley";
};
export type BuiltInModelContract = BuiltInModelRecipe & {
    readonly target: string;
    /** Canonical built-in interface, not a Project-local replacement. */
    readonly symbolId: string;
    readonly ports: readonly BuiltInSubcircuitPort[];
    readonly parameters: readonly DeviceParameterDefinition[];
    /** A call-only export still needs the author's external definition. */
    readonly backends: Readonly<Record<ModelBackend, "included" | "external" | "unsupported">>;
};
/** Model facts, not artwork or Project state. Family factories consume these defaults. */
export declare const builtInModelContracts: readonly BuiltInModelContract[];
export declare function builtInModelContract(target: string): BuiltInModelContract | undefined;
export declare function builtInModelDefaults(target: string): Record<string, string>;
/** One generated ideal comparator body: what its equation reads and declares. */
export interface IdealComparatorBodyContract {
    readonly name: IdealComparatorBody;
    /** Its high level is V(VDD), in place of a `vhigh` parameter. */
    readonly readsSupply: boolean;
    /** The comparator interface's ports the body takes, in order. */
    readonly ports: readonly BuiltInSubcircuitPort[];
    /** The parameters the body declares, with the defaults it prints. */
    readonly parameters: readonly {
        readonly name: string;
        readonly defaultValue: string;
    }[];
}
/** The ideal comparator's model facts as one of its bodies takes them. */
export declare function idealComparatorBodyContract(body: IdealComparatorBody): IdealComparatorBodyContract;
/** One generated ideal op-amp body: what its equation reads and declares. */
export interface IdealOpampBodyContract {
    readonly name: IdealOpampBody;
    /** Its high limit is V(VDD), in place of a `vhigh` parameter. */
    readonly readsVdd: boolean;
    /** Its low limit is V(VSS), in place of a `vlow` parameter. */
    readonly readsVss: boolean;
    /** Every body takes the op-amp's whole interface, in order. */
    readonly ports: readonly BuiltInSubcircuitPort[];
    /** The parameters the body declares, with the defaults it prints. */
    readonly parameters: readonly {
        readonly name: string;
        readonly defaultValue: string;
    }[];
}
/**
 * The ideal op-amp's model facts as one of its bodies takes them. A numeric
 * limit's default is the level an op-amp with no supply of its own reads.
 */
export declare function idealOpampBodyContract(body: IdealOpampBody): IdealOpampBodyContract;
