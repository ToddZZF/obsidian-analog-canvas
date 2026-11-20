import type { SimulationSourceInput } from "@icm/model";
import { type SpiceStatement } from "@icm/spice";
import { type SourceFileGraph } from "./source-file-graph.js";
export type { SimulationSourceDiagnostic } from "./source-file-graph.js";
export type SimulationSourceGraph = SourceFileGraph<SpiceStatement>;
export type SourceStatement = SimulationSourceGraph["statements"][number];
/** Existing SPICE source adapter. Native VACASK replaces this adapter at the
 * compiler boundary, not the virtual-file ownership and traversal contract. */
export declare function inspectSimulationSourceGraph(input: SimulationSourceInput): SimulationSourceGraph;
