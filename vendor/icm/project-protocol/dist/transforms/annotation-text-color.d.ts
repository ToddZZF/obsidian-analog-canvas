export interface Schema31To32MigrationReport {
    /**
     * Schema 32 adds optional presentation-only `Annotation.textColor`. Existing
     * projects already have the intended inherited-text behavior, so no payload
     * field is rewritten or backfilled.
     */
    readonly changed: false;
}
export interface Schema31To32MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema31To32MigrationReport;
}
/** Upgrade schema 31 to 32 without materializing any color override. */
export declare function upgradeSchema31To32WithReport(raw: Record<string, unknown>): Schema31To32MigrationResult;
export declare function upgradeSchema31To32(raw: Record<string, unknown>): Record<string, unknown>;
