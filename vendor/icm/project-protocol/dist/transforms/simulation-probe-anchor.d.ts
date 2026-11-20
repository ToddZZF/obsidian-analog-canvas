export interface Schema39To40MigrationReport {
    readonly changed: boolean;
    readonly migratedProbeIds: readonly string[];
    readonly baseNetProbeIds: readonly string[];
}
export interface Schema39To40MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema39To40MigrationReport;
}
/** Upgrade saved Net representatives to concrete voltage-probe anchors. */
export declare function upgradeSchema39To40WithReport(raw: Record<string, unknown>): Schema39To40MigrationResult;
export declare function upgradeSchema39To40(raw: Record<string, unknown>): Record<string, unknown>;
