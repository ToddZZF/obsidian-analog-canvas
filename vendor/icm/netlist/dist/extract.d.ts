import type { CircuitProject, StableId } from "@icm/model";
import type { DesignNetlistAnalysisResult } from "./ir.js";
import type { NetlistFormat, NetlistNamingProfile } from "./net-name-codec.js";
export interface DesignNetlistAnalysisOptions {
    format?: NetlistFormat;
    namingProfile?: NetlistNamingProfile;
    /** Read-only analysis root. Omission preserves structural-export behavior. */
    rootDocumentId?: StableId;
    /**
     * Whether the root Cell is printed as the deck's own top-level cards rather
     * than as a `.subckt`. It decides one thing about ground, and only one: a
     * Cell printed as a subcircuit states its reference as a `VSS` pin, because
     * whoever instantiates it owns that reference; the Cell printed as the deck
     * itself keeps SPICE's node `0`, because there the deck is the outside and
     * a call passing `0` for a child's `VSS` is what ties the two together.
     */
    rootAsTopLevel?: boolean;
    /**
     * Whether a Cell printed as a `.subckt` states its ground as a `VSS` pin.
     *
     * A block handed to somebody else should say where its reference comes
     * from: `"pin"` gives every such Cell that reaches ground a `VSS` pin
     * beside its supplies, and the one Cell printed as the deck itself keeps
     * node `0`, so its calls tie the two together. `"global"` — the default —
     * leaves SPICE's global node where it was, which is what an imported deck
     * must round-trip to and what a Snapshot reads.
     */
    groundPin?: GroundPinPolicy;
    /**
     * The text of the source files a run puts beside this netlist: its
     * simulation folder's own files. A model they define for a generic name
     * (DIODE, NPN, PNP) is that run's, so its Cells carry no card for it. A
     * design export carries none; it reads only the SPICE the Project was
     * imported from, so another folder's testbench model never leaves it
     * without one.
     */
    deckSources?: readonly string[];
    /**
     * Whether the Cells the root does not reach are printed too, after it, so
     * that a file carries every Cell's drawing (the RNL export, which names
     * the root where a Cell printed beside it calls it).
     */
    uncalledCells?: boolean;
    /** Uncalled Cells not to print, such as one the netlist cannot print. */
    leaveOutCells?: readonly StableId[];
}
/** Ground as the Cell's own pin, or as SPICE's global node. */
export type GroundPinPolicy = "pin" | "global";
/**
 * What a deck this editor runs shares with the netlist it hands out: the same
 * subcircuits, each stating ground as a pin, and one flat root whose node `0`
 * is what ties them to the reference.
 */
export declare const SIMULATION_DECK_GROUND: {
    readonly groundPin: "pin";
    readonly rootAsTopLevel: true;
};
export declare function analyzeDesignNetlist(project: CircuitProject, options?: DesignNetlistAnalysisOptions): DesignNetlistAnalysisResult;
/** Incomplete authoring projection only. Export and execution keep the strict entry above. */
export declare function analyzeDesignNetlistForAuthoring(project: CircuitProject, options?: DesignNetlistAnalysisOptions): DesignNetlistAnalysisResult;
