import type { CircuitProject } from "@icm/model";
import type { DeviceParameterDefinition } from "./contract.js";
import { type BuiltInModelContract } from "./built-in-model-contracts.js";
/**
 * The part of an Instance this needs. Structural, so an Agent Snapshot's
 * Instance qualifies as well as a Project's.
 */
export interface ParameterOwner {
    readonly symbolId: string;
    readonly netlist?: {
        readonly binding?: {
            readonly kind?: unknown;
            readonly definitionId?: unknown;
            readonly name?: unknown;
            readonly childDocumentId?: unknown;
        } | undefined;
    } | null | undefined;
}
/** The parameters an Instance's model owns. */
export interface InstanceParameterContract {
    readonly definitions: readonly DeviceParameterDefinition[];
    /** Implementation availability belongs to the selected master, not its artwork. */
    readonly model?: BuiltInModelContract;
    /**
     * The model takes parameters beyond `definitions`: an external or
     * hierarchical subcircuit no one has reviewed. Its other names are the
     * author's to choose, not errors.
     */
    readonly open: boolean;
}
/** Explicit authored bindings win over the Symbol's default black-box master. */
export declare function instanceBuiltInSubcircuit(project: Partial<Pick<CircuitProject, "componentDefinitions">>, instance: ParameterOwner): import("./contract.js").BuiltInSubcircuitDescriptor | undefined;
/**
 * Which parameters an Instance may carry, decided the way export decides it.
 *
 * - A reviewed PDK binding owns its parameters: a SKY130 resistor takes `w`,
 *   `l` and `mult`, not the built-in resistor's `value`.
 * - An external subcircuit or Cell offers its declared formal parameters and
 *   remains open to additional authored names.
 * - An unresolved registered master offers the shared built-in model facts;
 *   an unknown target does not inherit model facts from its artwork.
 * - Any other Instance has its built-in descriptor.
 *
 * Undefined when nothing describes the Instance's parameters: a custom,
 * imported or PDK symbol outside the registry.
 */
export declare function instanceParameterContract(project: Partial<Pick<CircuitProject, "componentDefinitions" | "externalSubcircuitDefinitions" | "documents">>, instance: ParameterOwner): InstanceParameterContract | undefined;
