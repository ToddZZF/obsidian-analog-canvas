import { type CircuitProject, type LegacyProjectSimulationSetup, type ProjectSimulationFolder } from "@icm/model";
export interface SimulationSourceMigration {
    folder: ProjectSimulationFolder;
    warnings: string[];
}
/** Offline, one-way conversion. No simulator, model files or async hashing. */
export declare function migrateSimulationSetupToSource(project: CircuitProject, folder: LegacyProjectSimulationSetup): SimulationSourceMigration;
