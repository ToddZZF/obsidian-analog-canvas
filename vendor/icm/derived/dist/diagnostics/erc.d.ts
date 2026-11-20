import type { CircuitProject } from "@icm/model";
import { type SymbolResolver } from "@icm/symbols";
import type { ProjectConnectivityIndex } from "../connectivity-index.js";
import type { Diagnostic } from "./diagnostic.js";
/**
 * Electrical checks share endpoint assessment and the Diagnostic envelope.
 * Electrical findings remain distinct from visual observations; observation
 * counts are not evidence of electrical correctness (Net connectivity rationale).
 */
/** Compatibility alias for ERC consumers; its protocol is Diagnostic. */
export type ErcDiagnostic = Diagnostic & {
    domain: "erc";
};
export declare function runErcChecks(project: CircuitProject, index: ProjectConnectivityIndex, resolver: SymbolResolver): readonly ErcDiagnostic[];
