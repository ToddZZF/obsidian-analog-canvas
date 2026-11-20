import type { CircuitProject, Instance, RichTextDocument } from "@icm/model";
import { type InstanceParameterResolver, type ParameterOwner, type DeviceParameterDefinition } from "@icm/devices";
export type InstanceValueDisplay = {
    readonly kind: "displayable";
    readonly content: RichTextDocument;
} | {
    readonly kind: "undisplayable";
    readonly reason: string;
};
/**
 * Structural input: a full Instance satisfies it, and callers can project a
 * not-yet-committed parameter draft without inventing netlist fields the
 * formatter never reads.
 */
export interface InstanceValueSource extends ParameterOwner {
    readonly symbolId: string;
    readonly netlist?: {
        readonly parameters: Record<string, string>;
        readonly binding?: NonNullable<ParameterOwner["netlist"]>["binding"];
    } | undefined;
}
/** Whether the actual model has a summary, even when its values are still empty. */
export declare function instanceSupportsValueAnnotation(instance: ParameterOwner, resolver?: InstanceParameterResolver): boolean;
export declare function magneticDisplayParameters(symbolId: string): readonly DeviceParameterDefinition[];
export declare function instanceDisplayParameters(instance: ParameterOwner, resolver?: InstanceParameterResolver): readonly DeviceParameterDefinition[];
/** Preserve authored values and units while identifying which parameter is shown. */
export declare function displayableInstanceParameter(instance: InstanceValueSource, name: string, options?: {
    showValue?: boolean;
}, resolver?: InstanceParameterResolver): InstanceValueDisplay;
/**
 * Whether this Instance gets a reference designator, by the policy that
 * names it. A placed Cell's block is derived per Project, so its Symbol has
 * no designator of its own, yet the Cell instance is X1 in the netlist; a
 * person probing `v(xdut.x1.net0)` needs to show it (#1317).
 */
export declare function instanceCarriesReference(instance: Instance, project?: Pick<CircuitProject, "componentDefinitions">): boolean;
/**
 * Whether a part's value prints this parameter as its ×m: a MOS's W/L does
 * (#752), so its own ×m label is wanted only while the W/L is hidden.
 */
export declare function valuePrintsMultiplier(instance: ParameterOwner | undefined, parameterName: string, resolver?: InstanceParameterResolver): boolean;
/**
 * The multiplier a part's W/L prints after its fraction once it has W and
 * L, or undefined. A parallel multiplier changes the device the drawing
 * stands for, so it is part of the value rather than a hidden parameter.
 * One is the implicit default and stays unwritten.
 */
export declare function printedValueMultiplier(instance: InstanceValueSource, resolver?: InstanceParameterResolver): string | undefined;
export declare function displayableInstanceValue(instance: InstanceValueSource, resolver?: InstanceParameterResolver): InstanceValueDisplay;
