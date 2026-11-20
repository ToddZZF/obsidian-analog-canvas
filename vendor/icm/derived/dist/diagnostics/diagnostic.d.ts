import type { ProjectConnectivityIndex } from "../connectivity-index.js";
import { type ObjectLocator } from "../object-locator.js";
import type { VisualDiagnostic } from "../visual.js";
import type { CircuitProject, DerivedPoint } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
/**
 * Unified diagnostic envelope and aggregation (Net connectivity rationale). Distinct producer domains — schema, spice, erc, routing, visual —
 * share one envelope so the diagnostic UI can group, filter, and navigate them
 * uniformly. Visual observations and electrical ERC never collapse into one
 * "error count": a visual observation is never proof of electrical correctness.
 */
export type DiagnosticDomain = "schema" | "spice" | "erc" | "routing" | "visual";
export type DiagnosticSeverity = "error" | "warning" | "info";
export interface Diagnostic {
    id: string;
    domain: DiagnosticDomain;
    code: string;
    severity: DiagnosticSeverity;
    confidence: "high" | "medium" | "low";
    gateEligible: boolean;
    message: string;
    primary: ObjectLocator;
    related: readonly ObjectLocator[];
    point?: DerivedPoint;
    parameters: Readonly<Record<string, string | number | boolean>>;
}
export interface DiagnosticDocumentRevision {
    documentId: string;
    revision: number;
}
/**
 * Ephemeral evidence for the current Project only. The stamp lets every
 * consumer prove which Document revisions were evaluated without persisting
 * diagnostics or confusing them with an import/operation report.
 */
export interface LiveDiagnosticSnapshot {
    source: "live";
    projectId: string;
    documentRevisions: readonly DiagnosticDocumentRevision[];
    diagnostics: readonly Diagnostic[];
}
export type DiagnosticPresentationGroup = "actionable" | "observation";
/**
 * Electrical findings and structural gate failures are actionable by default.
 * Non-gating routing/visual heuristics remain available as observations, but
 * must not look like unresolved electrical failures in the default UI.
 */
export declare function diagnosticPresentationGroup(diagnostic: Diagnostic): DiagnosticPresentationGroup;
/**
 * Adapt a `VisualDiagnostic` (current document-scoped observation) into the
 * unified envelope as `domain: "visual"`. Its `objectIds` are resolved to
 * `primary`/`related` locators via the project object index.
 */
export declare function adaptVisualDiagnostic(visual: VisualDiagnostic, documentId: string, index: ProjectConnectivityIndex): Diagnostic;
/** Merge diagnostic groups from distinct producers into one deterministically sorted list. */
export declare function mergeDiagnostics(...groups: readonly (readonly Diagnostic[])[]): readonly Diagnostic[];
/** Select producers before executing them. Omission keeps the full Agent contract. */
export interface DiagnosticDomainOptions {
    domains?: readonly ("erc" | "visual")[];
}
/** Collect raw visual evidence once so canvas markers need no second check. */
export declare function collectProjectDiagnosticEvidence(project: CircuitProject, resolver: SymbolResolver, index?: ProjectConnectivityIndex, options?: DiagnosticDomainOptions): {
    diagnostics: readonly Diagnostic[];
    visualByDocument: ReadonlyMap<string, readonly VisualDiagnostic[]>;
};
/** Canonical Project diagnostic evidence consumed by the GUI and Agent API. */
export declare function diagnoseProject(project: CircuitProject, resolver: SymbolResolver, index?: ProjectConnectivityIndex, options?: DiagnosticDomainOptions): readonly Diagnostic[];
/**
 * Build one revision-stamped, non-persisted snapshot of current evidence.
 * @internal Tests read a Project's diagnostics through it.
 */
export declare function diagnoseProjectSnapshot(project: CircuitProject, resolver: SymbolResolver, index?: ProjectConnectivityIndex, options?: DiagnosticDomainOptions): LiveDiagnosticSnapshot;
