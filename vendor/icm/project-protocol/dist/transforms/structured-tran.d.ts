export interface Schema37To38MigrationReport {
    /** Schema 38 extends SimulationSetup with TRAN; existing setups need no rewrite. */
    readonly changed: false;
}
export interface Schema37To38MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema37To38MigrationReport;
}
/** Upgrade schema 37 to 38 without inventing a transient analysis. */
export declare function upgradeSchema37To38WithReport(raw: Record<string, unknown>): Schema37To38MigrationResult;
export declare function upgradeSchema37To38(raw: Record<string, unknown>): Record<string, unknown>;
