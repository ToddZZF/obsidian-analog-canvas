export declare class ProjectMigrationError extends Error {
    readonly path: readonly (string | number)[];
    constructor(path: readonly (string | number)[], message: string);
}
type CellTerminalDirection = "input" | "output" | "inout" | "passive";
/** One schema-25 authoring record produced from a schema-24 Cell terminal. */
export interface MigratedIndependentCellPin {
    readonly documentId: string;
    readonly sourceTerminalId: string;
    readonly terminalId: string;
    readonly interfaceInstanceId: string;
    readonly name: string;
    readonly direction: CellTerminalDirection;
    readonly netId: string;
    readonly retainedSourceTerminalId: boolean;
}
export interface PreservedLegacySharedNet {
    readonly documentId: string;
    readonly sourceTerminalId: string;
    readonly netId: string;
}
export interface Schema24To25MigrationReport {
    readonly independentCellPins: readonly MigratedIndependentCellPin[];
    readonly splitRepeatedTerminalCount: number;
    readonly createdTerminalIds: readonly string[];
    readonly reboundAnnotationIds: readonly string[];
    /** Legacy physical topology intentionally preserved without guessing a cut. */
    readonly preservedLegacySharedNets: readonly PreservedLegacySharedNet[];
}
export interface Schema24To25MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema24To25MigrationReport;
}
/**
 * Schema 25 makes every canvas Cell Pin an independent authoring record.
 * Schema-24 terminals that owned several visual markers are split into
 * singleton terminal records. Existing physical topology is authoritative and
 * therefore remains byte-for-byte unchanged; the migration never guesses how
 * to partition a Base Net, Route, or Junction.
 */
export declare function upgradeSchema24To25WithReport(raw: Record<string, unknown>): Schema24To25MigrationResult;
export declare function upgradeSchema24To25(raw: Record<string, unknown>): Record<string, unknown>;
export {};
