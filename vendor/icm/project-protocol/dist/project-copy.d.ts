import type { CircuitProject } from "@icm/model";
/** Copy through the canonical protocol so every persisted field travels together.
 * Storage, publication and recovery bindings live outside the Project. */
export declare function createIndependentProject(project: CircuitProject, id: string, name?: string): CircuitProject;
