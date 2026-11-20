export interface Schema41To42MigrationReport {
    readonly changed: boolean;
    readonly migratedSetupCount: number;
}
export interface Schema41To42MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema41To42MigrationReport;
}
/** Schema 42 replaces the optional singleton setup with a named collection. */
export declare function upgradeSchema41To42WithReport(raw: Record<string, unknown>): Schema41To42MigrationResult;
export declare function upgradeSchema41To42(raw: Record<string, unknown>): Record<string, unknown>;
