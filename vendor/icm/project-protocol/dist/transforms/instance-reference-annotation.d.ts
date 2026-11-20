export interface Schema35To36MigrationReport {
    readonly repairedReferenceAnnotations: number;
    readonly retainedAttachedLabels: number;
    readonly changed: boolean;
}
export interface Schema35To36MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema35To36MigrationReport;
}
export declare function upgradeSchema35To36WithReport(raw: Record<string, unknown>): Schema35To36MigrationResult;
export declare function upgradeSchema35To36(raw: Record<string, unknown>): Record<string, unknown>;
