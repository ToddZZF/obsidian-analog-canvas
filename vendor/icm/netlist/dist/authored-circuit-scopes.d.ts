import type { SimulationCircuitBinding, SimulationCircuitScope } from "@icm/model";
import type { DesignNetlistIR } from "./ir.js";
/** Transient topology facts, not a saved project protocol or full language AST. */
export type AuthoredCircuitEvent = {
    kind: "definition";
    name: string;
    ports: string[];
    conditional?: boolean;
} | {
    kind: "end";
} | {
    kind: "opaque-master";
    name: string;
    module?: string;
    primitives?: ModelPrimitive[];
} | {
    kind: "globals";
    names: string[];
} | {
    kind: "call";
    name: string;
    nodes: string[];
    master?: string;
    conditional?: boolean;
};
export interface ModelPrimitive {
    path: string[];
    module: string;
}
export type ResolvedAuthoredScope = {
    ok: true;
    prefix: string[];
    node(name: string): string;
    instance(name: string): string;
} | {
    ok: false;
    message: string;
};
/** A source-only query of the same declaration table used by Canvas scopes. */
export declare function authoredModelSymbols(events: readonly AuthoredCircuitEvent[], names: readonly string[], syntax: {
    key(name: string): string;
    flatDefinitions?: boolean;
}): {
    name: string;
    primitives: ModelPrimitive[];
}[];
/** One resolver owns enumeration and explicit resolution, including formal-port
 * substitution. Adapters own lexical identity and simulator path spelling. */
export declare function authoredCircuitScopes(events: readonly AuthoredCircuitEvent[], binding: SimulationCircuitBinding, circuit: DesignNetlistIR, syntax: {
    key(name: string): string;
    separator: string;
    flatDefinitions?: boolean;
}): {
    resolve: (scope: SimulationCircuitScope) => ResolvedAuthoredScope;
    list: () => SimulationCircuitScope[];
    primitiveModels: (master: string, conditionalCandidates?: boolean) => ModelPrimitive[];
};
