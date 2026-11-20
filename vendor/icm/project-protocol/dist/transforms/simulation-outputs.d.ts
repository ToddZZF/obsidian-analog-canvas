export interface Schema42To43MigrationReport {
    readonly changed: boolean;
    readonly migratedOutputIds: readonly string[];
}
export interface Schema42To43MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema42To43MigrationReport;
}
/** Replace persisted primitive probes with the canonical output-expression form. */
export declare function upgradeSchema42To43WithReport(raw: Record<string, unknown>): Schema42To43MigrationResult;
export declare function upgradeSchema42To43(raw: Record<string, unknown>): Record<string, unknown>;
