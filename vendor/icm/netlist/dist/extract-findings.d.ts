import { type PlacedMosBodies } from "@icm/derived";
import type { SchematicDocument } from "@icm/model";
import type { DesignNetlistCell, DesignNetlistInstance, NetlistDiagnostic } from "./ir.js";
import type { CellNetContext } from "./extract-nets.js";
/**
 * The hidden p-substrate terminals left on ground in a Cell that draws a
 * negative supply (#1530): an NPN's S, a poly resistor's or varactor's B, an
 * inductor's SUB. The PDK ties them all to the one p-substrate, which belongs
 * on the lowest supply. An NPN whose collector swings below ground then
 * forward-biases its collector-substrate junction, and a run counts a current
 * no circuit draws. The Process binds them to that rail while the Cell's
 * NMOS body default is unset or ground; one bound before the rail was drawn
 * is on ground, and is named here. Each one's Substrate Net moves it; when
 * ground is the NMOS default, so does setting that default, which moves them
 * all with the bodies. A SKY130 PNP has no such terminal: its wrapper ties
 * the substrate to its collector.
 */
export declare function reportSubstratesAboveNegativeSupply(document: SchematicDocument, context: CellNetContext, instances: readonly DesignNetlistInstance[], diagnostics: NetlistDiagnostic[]): void;
/** `M1`, `M1 and M2`, `M1, M2 and M3`; a long list ends in a count. */
export declare function partList(names: readonly string[]): string;
/**
 * Which MOS bodies took a supply this export added to the Cell, and which pin
 * that supply became (#1302). A body with no Net takes the conventional VDD or
 * ground, and a Cell that draws neither gets it as a new Cell Pin, VDD and
 * VSS together. That is the documented default, yet it added a fourth
 * terminal nobody drew without a word: an LDO's pass device got a VDD pin
 * where its body was meant to be the input. Information, as a generated Net
 * name is: the netlist and every gate stay as they were.
 */
export declare function reportDefaultBodySupplies(document: SchematicDocument, context: CellNetContext, ports: DesignNetlistCell["ports"], diagnostics: NetlistDiagnostic[]): void;
/**
 * A MOS whose body follows a default onto one supply while its source is on
 * another supply of the same domain (#1336): a level shifter's VDDH PMOS with
 * its body on the Cell's PMOS default VDDL, forward-biased when VDDH is the
 * higher supply. The drawing holds no voltages, and most such bodies sit on
 * the higher supply on purpose, so this is a question, not a warning; a body
 * wired explicitly is the answer and is never asked about. A body with no Net
 * is asked about the same way: a Cell with two supplies has no default to
 * give it, and the conventional VDD or ground it takes then need not be its
 * source's.
 */
export declare function reportBodiesOffSourceSupply(document: SchematicDocument, context: CellNetContext, placedBodies: PlacedMosBodies | undefined, diagnostics: NetlistDiagnostic[]): void;
