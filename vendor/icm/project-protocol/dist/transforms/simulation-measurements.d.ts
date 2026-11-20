export interface Schema44To45MigrationReport {
    readonly changed: false;
}
export interface Schema44To45MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema44To45MigrationReport;
}
/**
 * Schema 45 permits authored measurement rules on structured Simulation
 * setups. Existing Projects have no such intent, so migration advances only
 * the protocol version and deliberately invents no measurements.
 */
export declare function upgradeSchema44To45WithReport(raw: Record<string, unknown>): Schema44To45MigrationResult;
export declare function upgradeSchema44To45(raw: Record<string, unknown>): Record<string, unknown>;
