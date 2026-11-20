export interface Schema30To31MigrationReport {
    /**
     * Schema 31 adds optional per-instance Signal Flow metadata. Existing data
     * remains valid because the field is additive and independent from netlist
     * authority.
     */
    readonly changed: false;
}
export interface Schema30To31MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema30To31MigrationReport;
}
/**
 * Upgrade schema 30 to 31. Signal Flow parameters are additive, so every
 * valid schema-30 project is already valid schema-31 data.
 */
export declare function upgradeSchema30To31WithReport(raw: Record<string, unknown>): Schema30To31MigrationResult;
export declare function upgradeSchema30To31(raw: Record<string, unknown>): Record<string, unknown>;
