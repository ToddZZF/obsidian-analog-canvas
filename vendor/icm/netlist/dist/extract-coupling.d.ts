import type { SchematicDocument } from "@icm/model";
import type { DesignNetlistCell, DesignNetlistCoupling, DesignNetlistInstance, NetlistDiagnostic } from "./ir.js";
import type { NetlistFormat } from "./net-name-codec.js";
/**
 * The Cell's couplings, with each coupled inductor's card turned to start at
 * its dotted node. An inductor in several couplings is turned by its first
 * one; a later coupling dotting the other end prints its k negated, which
 * reads the same to SPICE.
 */
export declare function extractInductorCouplings(document: SchematicDocument, instances: DesignNetlistInstance[], diagnostics: NetlistDiagnostic[]): DesignNetlistCoupling[];
/**
 * Give each coupling its printed name once the dialect has named the cards:
 * SPICE reads a `K` element, so a name that does not start with K gains one;
 * Spectre names the instance as written. Never one a card already uses.
 */
export declare function projectCouplingReferences(cell: DesignNetlistCell, format: NetlistFormat): void;
/** k as printed: the authored text, negated when the dots disagree. */
export declare function printedCouplingValue(coupling: DesignNetlistCoupling, format: NetlistFormat): string;
