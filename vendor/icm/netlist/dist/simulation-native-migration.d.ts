import { type CircuitProject, type ProjectSimulationFolder } from "@icm/model";
/**
 * Explicit, non-destructive migration boundary. Never silently erase a legacy
 * binding, sweep, measurement or label that cannot be represented losslessly.
 */
export declare function migrateSimulationConfigToNative(project: CircuitProject, folder: ProjectSimulationFolder): {
    ok: true;
    folder: ProjectSimulationFolder;
} | {
    ok: false;
    message: string;
};
