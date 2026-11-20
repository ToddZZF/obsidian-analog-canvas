import type { CircuitProject } from "@icm/model";
import { type DesignNetlistAnalysisOptions } from "./extract.js";
import type { NetlistDiagnostic } from "./ir.js";
import type { DesignNetlistLocations, PrintedNetlistInstance } from "./printed-netlist.js";
export interface DraftNetlistPreview {
    text: string;
    locations: DesignNetlistLocations;
    /** Printed cards of the parts a finding names: where the ? are. */
    flagged: PrintedNetlistInstance[];
    diagnostics: NetlistDiagnostic[];
}
/**
 * The netlist a drawing that does not extract yet would have, for reading
 * only. Every part prints as soon as it is placed. An unconnected pin, a
 * missing model and a missing required value print as `?`, and a part with
 * no netlist form is named in a closing comment. A `?` is no identifier in
 * either format, so a draft never passes for a netlist a simulator could
 * take. Export, copy and the Gallery's mark keep asking the strict export,
 * which still refuses.
 */
export declare function createDraftNetlistPreview(project: CircuitProject, options?: DesignNetlistAnalysisOptions): DraftNetlistPreview | null;
