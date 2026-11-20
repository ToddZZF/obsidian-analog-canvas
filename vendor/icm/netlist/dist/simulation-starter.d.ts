import { createSimulationFolder, type CircuitProject } from "@icm/model";
export interface SimulationStarterDut {
    name: string;
    ports: string[];
}
export type SimulationStarterResult = {
    ok: true;
    folder: ReturnType<typeof createSimulationFolder>;
    dut?: SimulationStarterDut;
} | {
    ok: false;
    message: string;
};
/** Resolve the interface through the same printer IR as the generated DUT. */
export declare function createSimulationStarter(project: CircuitProject, options: {
    id: string;
    name: string;
    /** None for an author's Testbench, run outside Canvas (#2110). */
    profileId?: string | undefined;
    engine?: "ngspice" | "vacask";
    documentId?: string;
    mode: "circuit" | "dut" | "text";
    template?: "op" | "ac" | "tran" | "testbench";
}): SimulationStarterResult;
/**
 * How a new experiment runs its Cell, for the Agent's `simulation_folder`
 * create and the GUI's new-experiment form alike (#1489). A simulation's top
 * is always a testbench: a Cell with drawn pins is a DUT, which a
 * testbench.spice shell calls (`XDUT … dut`, its ports in order) for the
 * Agent or author to drive; a Cell with none draws its own sources and is the
 * testbench, run as the deck's top.
 */
export declare function newFolderCellRole(project: CircuitProject, documentId: string): "dut" | "testbench";
/** An advertised simulation Profile, as far as a new folder's default reads it. */
export interface AdvertisedSimulationProfile {
    readonly id: string;
    /** Exact model or wrapper names the Profile qualifies. */
    readonly devices?: readonly string[] | undefined;
    readonly cellLibraries?: readonly {
        readonly cells: string;
        readonly masters?: readonly string[] | undefined;
    }[] | undefined;
}
export type NewFolderProfile = {
    ok: true;
    profileId: string;
} | {
    ok: false;
    message: string;
    candidates: string[];
};
/**
 * The Profile a new simulation folder starts from when the author names none
 * (#1349), for the Agent's `simulation_folder` and the GUI's new-experiment
 * dialog alike: the one Profile whose devices and cell libraries qualify
 * every reviewed PDK device and gate in the Cell and its sub-Cells, or failing
 * that the one that does once its library's high-voltage DMOS devices count
 * (#1485). A folder without a Cell uses no PDK device. A Profile
 * that lists neither devices nor cell libraries is never the default. With
 * several such Profiles, or none, the author names one of the candidates.
 */
export declare function newFolderProfile(profiles: readonly AdvertisedSimulationProfile[], cell?: {
    project: CircuitProject;
    documentId: string;
}): NewFolderProfile;
