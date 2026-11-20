export interface Schema33To34MigrationReport {
    readonly migratedImportedNameHints: number;
    readonly migratedLegacyNameHints: number;
    readonly materializedGlobalDeclarations: number;
    readonly materializedPowerOwners: number;
    readonly changed: boolean;
}
export interface Schema33To34MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema33To34MigrationReport;
}
/**
 * Schema 34 retires hidden electrical name claims. Imported local spellings
 * become non-electrical round-trip hints; explicit SPICE globals retain their
 * electrical authority through their source declaration, and visible power
 * presentation becomes the owner when an older Project relied on a shadow
 * property for a power rail or marker.
 */
export declare function upgradeSchema33To34WithReport(raw: Record<string, unknown>): Schema33To34MigrationResult;
export declare function upgradeSchema33To34(raw: Record<string, unknown>): Record<string, unknown>;
