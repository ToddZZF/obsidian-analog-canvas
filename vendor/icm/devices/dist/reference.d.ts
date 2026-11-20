import type { CircuitProject, Instance, SchematicDocument } from "@icm/model";
export type ReferencePolicy = {
    readonly kind: "none";
} | {
    readonly kind: "required";
    readonly prefix: string;
};
export declare const hierarchyReferencePolicy: ReferencePolicy;
export interface ReferenceIssue {
    readonly code: "MISSING_REFERENCE" | "WRONG_REFERENCE_PREFIX" | "DUPLICATE_REFERENCE";
    readonly instanceId: string;
    readonly reference?: string;
    readonly otherInstanceId?: string;
    /** The prefix a wrong-prefix Reference should start with. */
    readonly expectedPrefix?: string;
}
export interface ReferenceIndex {
    readonly byReference: ReadonlyMap<string, readonly string[]>;
    readonly occupiedSuffixesByPrefix: ReadonlyMap<string, ReadonlySet<number>>;
    readonly policyByInstanceId: ReadonlyMap<string, ReferencePolicy>;
    readonly issues: readonly ReferenceIssue[];
}
export interface ReferenceAllocationOptions {
    /** First suffix considered; defaults to the lowest legal suffix (1). */
    readonly startAt?: number;
    /** References reserved by a multi-instance plan that is not yet in the Cell. */
    readonly reservedReferences?: ReadonlySet<string>;
}
export declare function referencePolicyForInstance(instance: Instance, project?: Pick<CircuitProject, "componentDefinitions">): ReferencePolicy;
export declare function referencePolicyForSymbol(symbolId: string): ReferencePolicy;
/**
 * The letter a device's References are written from — R, C, L, M, Q, D, V,
 * I… — which a Reference label shows in italic over a subscript of the rest
 * (R_L1, C_L). Subcircuit calls, whose X says how SPICE invokes them rather
 * than what they are, and devices without a one-letter prefix have none.
 */
export declare function referenceDeviceLetter(symbolId: string, project?: Pick<CircuitProject, "componentDefinitions">): string | undefined;
export declare function referenceSuffixForPolicy(reference: string, policy: ReferencePolicy): number | null;
/** One per-Cell, case-folded reference authority for allocation and diagnosis. */
export declare function createReferenceIndex(document: SchematicDocument, project?: Pick<CircuitProject, "componentDefinitions">): ReferenceIndex;
export declare function nextReference(index: ReferenceIndex, policy: ReferencePolicy, options?: ReferenceAllocationOptions): string | undefined;
export declare function referenceIssuesForInstance(index: ReferenceIndex, instanceId: string): readonly ReferenceIssue[];
