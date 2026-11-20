export interface MigratedRouteLegPath {
    readonly documentId: string;
    readonly routeId: string;
    readonly legIds: readonly string[];
    readonly bendIds: readonly string[];
    readonly reboundAnnotationIds: readonly string[];
}
export interface Schema25To26MigrationReport {
    readonly routes: readonly MigratedRouteLegPath[];
}
export interface Schema25To26MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema25To26MigrationReport;
}
/** Upgrade schema 25's parallel Route arrays to stable schema-26 legs. */
export declare function upgradeSchema25To26WithReport(raw: Record<string, unknown>): Schema25To26MigrationResult;
export declare function upgradeSchema25To26(raw: Record<string, unknown>): Record<string, unknown>;
