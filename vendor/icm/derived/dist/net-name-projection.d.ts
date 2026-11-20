import type { CircuitProject } from "@icm/model";
export interface ProjectedNetName {
    documentId: string;
    logicalNetId: string;
    baseNetIds: readonly string[];
    scope: "local" | "global";
    spellings: readonly string[];
    preferredSpelling?: string;
}
export interface ProjectNetNameProjection {
    byDocumentId: ReadonlyMap<string, ReadonlyMap<string, ProjectedNetName>>;
}
/**
 * Pure revision-scoped spelling projection. It never changes Base Nets,
 * owner-addressed evidence, or source provenance.
 */
export declare function deriveProjectNetNameProjection(project: CircuitProject): ProjectNetNameProjection;
