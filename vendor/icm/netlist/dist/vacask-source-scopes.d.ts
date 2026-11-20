import type { SimulationCircuitBinding } from "@icm/model";
import type { DesignNetlistIR } from "./ir.js";
import type { ResolvedNativeModelLibrarySymbols } from "./vacask-model-symbols.js";
import { type AuthoredCircuitEvent } from "./authored-circuit-scopes.js";
import type { SourceFileGraph } from "./source-file-graph.js";
import type { VacaskSourceStatement } from "./vacask-source.js";
/** Only statically declared circuit facts feed Canvas acquisition mapping.
 * Native control/evaluation stays simulator-owned; conditional calls remain
 * runnable but do not acquire a guessed Canvas identity. */
export declare function vacaskCircuitScopes(graph: SourceFileGraph<VacaskSourceStatement>, binding: SimulationCircuitBinding, circuit: DesignNetlistIR, libraries?: readonly ResolvedNativeModelLibrarySymbols[]): {
    resolve: (scope: import("@icm/model").SimulationCircuitScope) => import("./authored-circuit-scopes.js").ResolvedAuthoredScope;
    list: () => import("@icm/model").SimulationCircuitScope[];
    primitiveModels: (master: string, conditionalCandidates?: boolean) => import("./authored-circuit-scopes.js").ModelPrimitive[];
};
/** Shared literal circuit facts for occurrence resolution and authoring helpers.
 * Control programs are never evaluated to guess an instance or node identity. */
export declare function vacaskAuthoredCircuitEvents(graph: SourceFileGraph<VacaskSourceStatement>, libraries?: readonly ResolvedNativeModelLibrarySymbols[]): AuthoredCircuitEvent[];
