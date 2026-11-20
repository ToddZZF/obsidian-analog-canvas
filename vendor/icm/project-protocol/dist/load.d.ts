import type { CircuitProject } from "@icm/model";
import { type ProjectLoadResult, type ProjectParseResult } from "./diagnostics.js";
export declare function tryValidateProject(input: unknown): ProjectLoadResult;
/** Canonical read path; the model alone owns immutable validation provenance. */
export declare function validateProjectReadSnapshot(input: unknown): CircuitProject;
export declare function validateProject(input: unknown): CircuitProject;
export declare function tryParseProjectWithMetadata(serialized: string): ProjectLoadResult;
export declare function parseProjectWithMetadata(serialized: string): ProjectParseResult;
export declare function parseProject(serialized: string): CircuitProject;
