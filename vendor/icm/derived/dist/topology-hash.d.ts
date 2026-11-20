import type { CircuitProject } from "@icm/model";
/** Synchronous SHA-256 without a Node-only runtime dependency. */
export declare function sha256Hex(value: string): string;
/**
 * Compute a lowercase SHA-256 electrical topology hash for a Project. Two
 * Projects with identical electrical facts (instances, ports, Nets, explicit
 * NoConnect declarations and document identity) produce the same hash regardless of
 * placement, routing geometry, annotations, or drafting.
 */
export declare function electricalTopologyHash(project: Pick<CircuitProject, "id" | "topDocumentId" | "documents">): string;
