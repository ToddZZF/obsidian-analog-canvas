import type { NetlistDiagnostic } from "./ir.js";
import type { SimulationSourceDiagnostic } from "./source-file-graph.js";
/** Preserve native electrical evidence across both simulation compilers. */
export declare function simulationNetlistDiagnostic(item: NetlistDiagnostic): SimulationSourceDiagnostic;
