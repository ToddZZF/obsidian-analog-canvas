import { resolveCommittedDocumentLogicalNets } from "@icm/derived";
import type { SchematicDocument } from "@icm/model";
/** The formal pin name a Cell's ground takes, matching the Block libraries. */
export declare const GROUND_PORT_NAME = "VSS";
/**
 * Whether a Cell meets ground at all — its own node `0`, or any Cell it
 * instantiates that does.
 *
 * The answer has to be the same on both sides of a hierarchy call, and both
 * sides compute it from the Documents alone rather than from whichever cell
 * happened to be extracted first. A Cell that only passes ground through to a
 * child still needs the pin: otherwise the child's reference would have
 * nowhere to come from.
 */
export declare function cellReachesGround(document: SchematicDocument, documentsById: Map<string, SchematicDocument>, seen?: Set<string>): boolean;
/**
 * Whether a Cell printed as a subcircuit adds a ground pin of its own
 * making: it meets ground, and its author gave ground no pin. A caller passes
 * its ground only to such a pin. A call to a Cell whose author's GNDA was its
 * ground carried one node more than the Cell had pins.
 */
export declare function addsGroundPin(document: SchematicDocument, documentsById: Map<string, SchematicDocument>, seen?: Set<string>): boolean;
/**
 * The name of the ground pin a Cell adds: VSS, as the Block libraries write
 * it, unless the Cell gives that name to another Net or Pin (#1353). A Cell
 * with ± supplies draws ground and a Port VSS, its negative supply; two pins
 * named VSS shorted the two inside the Cell and in every caller. Then GND, or
 * GND__2 and on, as an imported name is told apart from an authored one.
 * `taken` is the author's spelling of the name that was in the way. Both the
 * Cell and its callers read it from the Document.
 */
export declare function groundPinName(document: SchematicDocument): {
    name: string;
    taken?: string;
};
/**
 * Where the ground pin sits in a Cell's interface: after the supplies the
 * author declared, so every Cell reads `VDD VSS …` the way the Block library
 * already writes it, and before the first signal.
 */
export declare function groundPortIndex(document: SchematicDocument, ports: readonly {
    id: string;
    name?: string;
}[]): number;
/**
 * Where a port of a Cell printed as a subcircuit sorts: its positive supply
 * first (0), then ground (1), then the signals (2) in the Cell's own order.
 * `logical` reads the Cell with the netlist's power-marker claims. Cell
 * properties shows the same order, the supplies locked in place (#2177).
 */
export declare function supplyPortRank(logical: ReturnType<typeof resolveCommittedDocumentLogicalNets>, port: {
    id: string;
    name: string;
}): 0 | 1 | 2;
/**
 * Whether the export sorts a Cell's ports by {@link supplyPortRank}. A Cell
 * read from a netlist file (it keeps the import's reference) prints its
 * ports in its own order, as the file declared them, so it writes again as
 * it was read and every positional call stays the file's; a ground pin the
 * export adds still goes after its VDD ports.
 */
export declare const sortsSupplyPorts: (document: SchematicDocument) => boolean;
