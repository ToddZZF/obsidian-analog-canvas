export interface Schema29To30MigrationReport {
    /**
     * Schema 30 adds an optional atomic formula run to RichText. Existing
     * schema-29 data is already valid and is not rewritten.
     */
    readonly changed: false;
}
export interface Schema29To30MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema29To30MigrationReport;
}
export declare function upgradeSchema29To30WithReport(raw: Record<string, unknown>): Schema29To30MigrationResult;
export declare function upgradeSchema29To30(raw: Record<string, unknown>): Record<string, unknown>;
