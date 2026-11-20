import type { CircuitProject } from "@icm/model";
import { type DesignNetlistAnalysisOptions } from "./extract.js";
/**
 * The name a design netlist writes one Net under, such as `net12` for an
 * unnamed one (2026-10-14): what the editor calls a clicked wire, so it reads
 * as the Netlist panel does. A drawing that does not extract yet answers with
 * its draft's names, as the panel's draft shows them; a Net the netlist
 * leaves out answers null.
 */
export declare function designNetlistNetName(project: CircuitProject, documentId: string, netId: string, options?: Pick<DesignNetlistAnalysisOptions, "format" | "namingProfile">): string | null;
/** Read the selected Nets' names with one analysis of the Cell per mode. */
export declare function designNetlistNetNames(project: CircuitProject, documentId: string, netIds: readonly string[], options?: Pick<DesignNetlistAnalysisOptions, "format" | "namingProfile">): ReadonlyMap<string, string>;
/**
 * The pins a design netlist writes for one Cell printed as a subcircuit, in
 * order: the Cell's own Pins, each by its first Net, and those the export
 * adds, such as ground's pin or a default supply; `supply` marks the ones
 * the export puts before the signals (#2177). A drawing that does not
 * extract yet answers with its draft's pins; one with no draft, null.
 */
export declare function designNetlistCellPorts(project: CircuitProject, documentId: string): readonly {
    id: string;
    name: string;
    supply: boolean;
}[] | null;
