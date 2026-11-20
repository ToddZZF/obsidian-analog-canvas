export interface Schema43To44MigrationReport {
    readonly changed: boolean;
    readonly migratedOutputIds: readonly string[];
}
export interface Schema43To44MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema43To44MigrationReport;
}
/** Add the terminal identity omitted by schema-43 source-current outputs. */
export declare function upgradeSchema43To44WithReport(raw: Record<string, unknown>): Schema43To44MigrationResult;
export declare function upgradeSchema43To44(raw: Record<string, unknown>): Record<string, unknown>;
