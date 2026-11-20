import type { SimulationRunVariant, SimulationSourceInput } from "@icm/model";
import { type VacaskSourceStatement } from "./vacask-source.js";
import type { SourceFileGraph, SimulationSourceDiagnostic } from "./source-file-graph.js";
/** Run-only edits to one reachable root declaration per case-sensitive name.
 * No expression evaluation, persistent variable table or implicit Canvas edits. */
export declare function projectVacaskRunVariables(input: SimulationSourceInput, graph: SourceFileGraph<VacaskSourceStatement>, points: NonNullable<SimulationRunVariant["variables"]>): {
    files: import("./simulation-source-map.js").MappedSimulationFile[];
    diagnostics: SimulationSourceDiagnostic[];
};
