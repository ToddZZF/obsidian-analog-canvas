export interface Schema32To33MigrationReport {
    /**
     * Schema 33 removes ownerless `explicit-equivalence` records. A schema-32
     * Project without one already has canonical schema-33 connectivity, so the
     * version stamp is the only change.
     */
    readonly changed: false;
}
export interface Schema32To33MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema32To33MigrationReport;
}
/**
 * Upgrade schema 32 to 33 without guessing what an ownerless electrical union
 * meant. Such a record cannot be converted safely into physical topology,
 * owner-addressed naming, or hierarchy, so the file boundary rejects it at
 * its exact location instead of silently changing connectivity.
 */
export declare function upgradeSchema32To33WithReport(raw: Record<string, unknown>): Schema32To33MigrationResult;
export declare function upgradeSchema32To33(raw: Record<string, unknown>): Record<string, unknown>;
