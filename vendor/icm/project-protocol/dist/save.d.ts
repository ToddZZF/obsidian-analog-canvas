import type { CircuitProject } from "@icm/model";
export declare function serializeProject(project: CircuitProject): string;
export declare function serializeCompactProject(project: CircuitProject): string;
/** Reformat encoded Project JSON without changing its file schema. */
export declare function formatProjectFile(projectText: string, layout?: "readable" | "compact"): string;
