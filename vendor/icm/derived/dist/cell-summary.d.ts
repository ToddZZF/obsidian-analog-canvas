import type { CircuitProject } from "@icm/model";
export interface CellCallerSummary {
    readonly documentId: string;
    readonly documentName: string;
    readonly instanceId: string;
}
export interface ProjectCellSummary {
    readonly id: string;
    readonly name: string;
    readonly isTop: boolean;
    readonly portCount: number;
    readonly callers: readonly CellCallerSummary[];
}
/** Read-only hierarchy inventory shared by management and future Agent views. */
export declare function summarizeProjectCells(project: CircuitProject): readonly ProjectCellSummary[];
