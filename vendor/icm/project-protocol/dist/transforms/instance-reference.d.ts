export interface Schema34To35MigrationReport {
    readonly unifiedReferences: number;
    readonly renamedConflictingReferences: number;
    readonly materializedSchematicLabels: number;
    readonly migratedReferenceBindings: number;
    readonly retiredMasterBindings: number;
    readonly removedMarkerReferences: number;
    readonly migratedImportProvenance: number;
    readonly changed: boolean;
}
export interface Schema34To35MigrationResult {
    readonly project: Record<string, unknown>;
    readonly report: Schema34To35MigrationReport;
}
/**
 * Schema 35 gives an Instance exactly one authored Reference. The former
 * canvas-only Reference and emitted netlist Reference cannot survive as
 * parallel mutable authorities. User RichText labels become ordinary attached
 * Annotation content, while master/value/reference labels remain live bound
 * projections.
 */
export declare function upgradeSchema34To35WithReport(raw: Record<string, unknown>): Schema34To35MigrationResult;
export declare function upgradeSchema34To35(raw: Record<string, unknown>): Record<string, unknown>;
