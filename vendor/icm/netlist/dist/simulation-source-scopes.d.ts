import type { SimulationCircuitBinding, SimulationCircuitScope } from "@icm/model";
import type { DesignNetlistIR } from "./ir.js";
import type { SimulationSourceGraph } from "./simulation-source-graph.js";
import { type ResolvedAuthoredScope } from "./authored-circuit-scopes.js";
/** Existing source adapter; traversal is shared with native VACASK. */
export declare function listAuthoredCircuitScopes(graph: SimulationSourceGraph, binding: SimulationCircuitBinding, circuit: DesignNetlistIR): SimulationCircuitScope[];
export type AuthoredScope = Exclude<ResolvedAuthoredScope, {
    ok: true;
}> | (Extract<ResolvedAuthoredScope, {
    ok: true;
}> & {
    vector(name: string): string;
});
export declare function resolveAuthoredCircuitScope(graph: SimulationSourceGraph, binding: SimulationCircuitBinding, circuit: DesignNetlistIR, scope: SimulationCircuitScope): AuthoredScope;
