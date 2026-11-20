import { CircuitProjectSchema } from "./schema/project.js";
import type { CircuitProject } from "./schema/types.js";
/** Validate the public, mutable transaction result and retain its provenance. */
export declare function validateProjectResult(input: unknown): ReturnType<typeof CircuitProjectSchema.safeParse>;
/** Fully validate incoming models; reuse only immutable snapshots owned here. */
export declare function validateProjectSnapshot(input: unknown, previous?: CircuitProject): ReturnType<typeof CircuitProjectSchema.safeParse>;
/** Reuse equal immutable facts without revalidating the same owned result. */
export declare function shareProjectSnapshot(before: CircuitProject, after: CircuitProject): CircuitProject;
export declare function parseProjectSnapshot(input: unknown, previous?: CircuitProject): CircuitProject;
