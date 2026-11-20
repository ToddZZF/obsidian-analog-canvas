import type { SimulationSourceInput } from "@icm/model";
import { type ModelPrimitive } from "./authored-circuit-scopes.js";
export interface NativeMasterSymbol {
    name: string;
    primitives: ModelPrimitive[];
}
/** Read-only Profile evidence derived from a specific dependency and section.
 * Never Project data, executable text, or a claim of electrical qualification. */
export interface NativeModelLibrarySymbols {
    dependencyId: string;
    sha256: string;
    section?: string | undefined;
    masters: NativeMasterSymbol[];
}
export interface ResolvedNativeModelLibrarySymbols {
    mountPath: string;
    section?: string | undefined;
    masters: NativeMasterSymbol[];
}
/** Offline/runtime provisioning reads the actual library files. The same
 * scope table handles local shadows, ambiguous models and conditional calls. */
export declare function inspectNativeModelLibrarySymbols(input: SimulationSourceInput, names: readonly string[]): {
    masters: {
        name: string;
        primitives: ModelPrimitive[];
    }[];
    diagnostics: import("./source-file-graph.js").SimulationSourceDiagnostic[];
};
/** A summary without a matching declared content digest is not evidence. */
export declare function resolveNativeModelLibraries(input: SimulationSourceInput, libraries: readonly NativeModelLibrarySymbols[]): ResolvedNativeModelLibrarySymbols[];
