import type { CircuitProject } from "@icm/model";
import { type DesignNetlistAnalysisOptions } from "./extract.js";
import type { DesignNetlistIR, NetlistDiagnostic } from "./ir.js";
import { type BodyPortOrder } from "./body-port-order.js";
import { type NetlistFileDescriptor } from "./printers.js";
import type { NetlistPortCase } from "./net-name-codec.js";
import type { DesignNetlistLocations } from "./printed-netlist.js";
export type DesignNetlistExportResult = {
    diagnostics: NetlistDiagnostic[];
} & ({
    status: "blocked";
} | {
    status: "ready";
    file: NetlistFileDescriptor;
    locations: DesignNetlistLocations;
    cellCount: number;
    externalMasterCount: number;
    /** The IR the file was printed from, when `includeIr` asks for it. */
    ir?: DesignNetlistIR;
});
/**
 * Whether this Cell extracts far enough to write a netlist file.
 *
 * Missing model targets and required device parameters are blocking errors.
 * A structural netlist never substitutes an undefined token for an electrical
 * fact. One definition serves the editor, the Gallery badge and any report, so
 * a circuit is never called extractable in one place and not in another.
 */
/**
 * What answer `designExtractsNetlist` is currently giving.
 *
 * A stored mark is only as good as the rule that produced it, and the rule
 * moves: a body that now follows the drawn supply, a dead-end node that now
 * refuses, a Block supply that is now declared. Bump this whenever a change
 * can turn a stored answer stale, and everything that keeps marks can find
 * the ones it has to ask again.
 *
 * 3 answers with logic Blocks carrying a subcircuit interface, persisted
 * bindings read for every circuit, a Cell stating its ground as its own VSS
 * pin, and a stranded MOS body read as residue.
 * 4 also resolves unconnected schematic MOS bodies without supply symbols.
 * 5 refuses missing model targets and required parameters instead of emitting
 * placeholder identifiers.
 * 6 writes Greek letters in Net, Pin, device and Cell names as their standard
 * names, so a circuit named with them now extracts.
 * 7 writes drawn switches as SPICE `S` cards on the phase their label names,
 * so a switched-capacitor circuit whose switches carry phases now extracts.
 * 8 writes drawn T-coils and transformers as calls on built-in coupled-winding
 * subcircuits, so a circuit drawn with them now extracts.
 * 9 recognizes an explicit Zener BV as a local diode model and a new ideal
 * comparator target as a signal-only ngspice subcircuit.
 * 10 refuses built-in subcircuit targets without an emitted or external
 * definition, including the reviewed logic-symbol set.
 * 11 writes ideal bodies for the logic gates and flip-flops, the adder,
 * multiplier and converters, and ties the unused supplies of an ideal block
 * that never reads them to node 0, so circuits drawn with them now extract.
 * Version 10 had marked those circuits "no netlist" while they still failed.
 * 12 writes a bus bit's brackets as `_` in SPICE (`D<3>` is `D_3_`) and reads
 * full-width characters as their ASCII forms, so a circuit naming Nets or
 * Pins with them now extracts; and a Block whose body reads its supplies, in a
 * Cell that draws none, takes the default an unconnected MOS body takes, so a
 * logic figure drawn without supplies now extracts.
 * 13 reads a Var Cap bound to the SKY130 varactor as the ideal Var Cap it now
 * opens as (#1298): a circuit that part alone blocked extracts when it kept a
 * value.
 * 14 refuses invalid portable component interfaces and calls that contradict
 * a generated built-in model's fixed port order or pin mapping (#1393).
 * 15 refuses unimplemented external placeholders and unverified legacy
 * declarations whose original model bodies are absent from the Project.
 * 16 exports a pulse, sine or AC source without a DC value (#2100): circuits
 * that alone blocked, about 40 of them, extract.
 * 17 no longer calls the tap of a SKY130 spiral drawn as a 2-pin inductor a
 * dead end: its device floats it by design, so a circuit it alone blocked
 * extracts.
 */
export declare const NETLIST_MARK_RULE_VERSION = 17;
export declare function designExtractsNetlist(project: CircuitProject, options?: DesignNetlistAnalysisOptions): boolean;
/**
 * Export the circuit exactly as its persisted netlist bindings describe it.
 * Missing device values or models block output; this path never substitutes a
 * different process, model target or device invocation kind.
 */
export declare function createDesignNetlistExport(project: CircuitProject, options?: DesignNetlistAnalysisOptions & {
    portCase?: NetlistPortCase;
    /** Only interactive source editors need field-level locations. */
    includeLocations?: boolean;
    /**
     * Print the bodies the netlist writes itself with their ports in another
     * order (`withBodyPortOrder`). Only the RNL export modes ask for it.
     */
    bodyPortOrder?: BodyPortOrder;
    /** Return the IR the file was printed from, with its printed names. */
    includeIr?: boolean;
    /**
     * Print a call of an external subcircuit whose body the Project does not
     * hold, as the file it came from did, and report it rather than refuse:
     * an interchange file (the RNL modes) calls a foundry's library as its
     * source did; a netlist handed out to run keeps refusing.
     */
    callsWithoutBodies?: boolean;
}): DesignNetlistExportResult;
/**
 * The findings that say "this drawing is not finished" after strict extraction
 * has otherwise succeeded. Surfaces that hand a netlist to somebody — the
 * editor's export and the Gallery's mark — refuse on these; a preview of what
 * the drawing currently says need not.
 */
export declare function unfinishedDrawingDiagnostics(diagnostics: readonly NetlistDiagnostic[]): NetlistDiagnostic[];
