import { type CircuitProject } from "@icm/model";
import { type PlacedMosBodies } from "@icm/derived";
import type { DesignNetlistAnalysisOptions } from "./extract.js";
import type { NetlistFormat } from "./net-name-codec.js";
/**
 * The supplies a built-in body reads. The ideal amplifiers and the adder in
 * either format, and the multiplier and the numeric ideal comparator in
 * SPICE, read neither: that comparator's call has no supply nodes at all,
 * yet a flash ADC drawn with ground and no VDD gained a VDD Cell Pin that
 * nothing inside used. The ideal comparator whose high level is its own VDD
 * reads that supply alone. The ideal op-amp reads its supplies only once a
 * drawn or selected VDD powers it (ideal-opamp.ts), so an undrawn supply
 * takes no default. The crystal has no supply ports. Every other body reads
 * both.
 */
export declare function bodySupplies(target: string, format: NetlistFormat): readonly ("VDD" | "VSS")[];
/**
 * The Net {@link withImplicitMosSupplies} adds to a Cell for a conventional
 * supply it had to supply itself, VDD or ground (`0`). Extraction reads it
 * back to say which bodies took that supply and which pin it became.
 */
export declare function implicitSupplyNetId(documentId: string, supply: "VDD" | "0"): string;
export interface ImplicitMosSupplyProjection {
    project: CircuitProject;
    /**
     * The MOS bodies with no Net that the projection placed, by Document ID:
     * a placed body is a member of its Net in `project` and reads as wired
     * there, so whoever reports on bodies asks here how it came to be.
     */
    placedBodies: ReadonlyMap<string, PlacedMosBodies>;
}
/** A read-only electrical projection for schematic MOS bodies with no authored
 * connection. Supply symbols are not required to express the default substrate.
 * Existing body wiring, Cell defaults and explicit NoConnect remain authoritative.
 */
export declare function withImplicitMosSupplies(source: CircuitProject, options: DesignNetlistAnalysisOptions): ImplicitMosSupplyProjection;
