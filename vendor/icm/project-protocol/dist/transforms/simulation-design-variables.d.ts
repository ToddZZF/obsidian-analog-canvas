export interface Schema47To48MigrationReport {
    readonly migratedSetups: number;
}
export interface Schema47To48MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema47To48MigrationReport;
}
/**
 * Schema 48 gives every structured Setup an explicit variable table and saved
 * Run Plan. Existing Setups retain their exact nominal behaviour.
 */
export declare function upgradeSchema47To48WithReport(raw: Record<string, unknown>): Schema47To48MigrationResult;
export declare function upgradeSchema47To48(raw: Record<string, unknown>): Record<string, unknown>;
