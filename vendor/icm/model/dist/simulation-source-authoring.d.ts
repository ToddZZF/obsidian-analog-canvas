import { type ProjectSimulationFolder, type SimulationExperimentConfig } from "./schema.js";
/**
 * The same small starter text for a human or Agent; no hidden analyses writer.
 * Without a Profile the folder has no configuration file and SPICE syntax: it
 * is the author's Testbench, run with their own simulator (#2110).
 */
export declare function createSimulationFolder(options: {
    id: string;
    name: string;
    profileId?: string | undefined;
    /** Resolved from the selected environment; not a second persisted authority. */
    engine?: "ngspice" | "vacask" | undefined;
    documentId?: string | undefined;
    /**
     * `testbench` is one entry file holding the DUT call, with no run steps;
     * the others are hosted-run starters.
     */
    template?: "op" | "ac" | "tran" | "testbench" | undefined;
    /** Supplied from the canonical netlist interface when authoring a textual TB. */
    dut?: {
        name: string;
        ports: string[];
    } | undefined;
}): ProjectSimulationFolder;
/** Broken JSON is normal authoring state, not a thrown error or a fallback configuration. */
export declare function readSimulationExperimentConfig(folder: ProjectSimulationFolder): {
    ok: true;
    config: SimulationExperimentConfig;
    authority: "code" | "legacy-config";
} | {
    ok: false;
    message: string;
    path: string;
    fields: Array<{
        field: string;
        message: string;
    }>;
};
/** Pure helper: caller commits the returned source through the normal File/Project transaction. */
export declare function replaceSimulationExperimentConfig(folder: ProjectSimulationFolder, config: SimulationExperimentConfig): ProjectSimulationFolder;
