import type { SchematicDocument } from "@icm/model";
export type LogicalNetConflictCode = "name-conflict" | "scope-conflict" | "power-domain-conflict" | "formal-global-conflict";
export type LogicalNetPowerDomain = "none" | "vdd" | "ground" | "conflict";
export interface ResolvedLogicalNet {
    /**
     * Deterministic representative Base-Net ID for this Document revision.
     * Split, merge, pruning, or Evidence edits may change or remove it; derived
     * Logical-Net groups and their representatives are never persisted.
     */
    id: string;
    baseNetIds: readonly string[];
    name?: string;
    scope?: "local" | "global";
    powerDomain: LogicalNetPowerDomain;
    evidenceIds: readonly string[];
    formalTerminalIds: readonly string[];
    sourceNetIds: readonly string[];
    conflicts: readonly LogicalNetConflictCode[];
}
export interface ResolvedDocumentLogicalNets {
    groups: readonly ResolvedLogicalNet[];
    byId: ReadonlyMap<string, ResolvedLogicalNet>;
    byBaseNetId: ReadonlyMap<string, ResolvedLogicalNet>;
}
export type LogicalNetContractIssue = {
    code: "CONFLICTING_LOGICAL_NET_NAME" | "CONFLICTING_LOGICAL_NET_SCOPE" | "CONFLICTING_LOGICAL_NET_POWER_DOMAIN" | "FORMAL_PORT_GLOBAL_NET_CONFLICT";
    netIds: readonly string[];
};
export declare function logicalNetContractIssueKey(issue: LogicalNetContractIssue): string;
/**
 * Resolve Document-local logical identity from owner-addressed scoped names
 * and formal Cell-Pin names.
 * Physical Base Nets remain intact; this pure result is the only electrical
 * folding implementation used by editor and netlist consumers. `spice-source`
 * and `net-name-hint` evidence are provenance, not electrical equivalence: a
 * user cut must not remain connected merely because both resulting components
 * came from the same source Net or retained the same source spelling.
 */
export declare function resolveDocumentLogicalNets(document: SchematicDocument): ResolvedDocumentLogicalNets;
/**
 * Reuse Logical-Net resolution for an immutable, committed Document revision.
 *
 * This is deliberately separate from {@link resolveDocumentLogicalNets}.
 * Edit-engine transactions mutate one draft object through several edits
 * before advancing its revision. Only an owned immutable snapshot enters
 * this cache; mutable callers always use the raw resolver, even when their
 * revision has not changed.
 */
export declare function resolveCommittedDocumentLogicalNets(document: SchematicDocument): ResolvedDocumentLogicalNets;
/** Electrical naming invariants evaluated on the one resolved semantic view. */
export declare function validateLogicalNetContract(document: SchematicDocument): readonly LogicalNetContractIssue[];
