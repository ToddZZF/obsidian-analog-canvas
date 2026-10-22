import { buildProjectConnectivityIndex } from "../connectivity-index.js";
import { directObjectLocator } from "../object-locator.js";
import { diagnoseVisualQuality } from "../visual.js";
import { runErcChecks } from "./erc.js";
import { assessImportReference } from "../import-reference.js";
/**
 * Electrical findings and structural gate failures are actionable by default.
 * Non-gating routing/visual heuristics remain available as observations, but
 * must not look like unresolved electrical failures in the default UI.
 */
export function diagnosticPresentationGroup(diagnostic) {
    return (diagnostic.domain === "routing" || diagnostic.domain === "visual") &&
        !diagnostic.gateEligible
        ? "observation"
        : "actionable";
}
const SEVERITY_RANK = {
    error: 0,
    warning: 1,
    info: 2,
};
const DOMAIN_ORDER = [
    "schema",
    "spice",
    "erc",
    "routing",
    "visual",
];
const ROUTING_VISUAL_CODES = new Set([
    "VISUAL_WIRE_THROUGH_SYMBOL",
    "VISUAL_ROUTE_OVERLAP",
    "VISUAL_TERMINAL_DEPARTURE",
    "VISUAL_SHORT_SEGMENT",
    "VISUAL_AMBIGUOUS_JUNCTION",
]);
function locatorFromIndex(index, documentId, objectId) {
    return (index.objectIndex.resolve(documentId, objectId) ?? {
        ...directObjectLocator(documentId, "document", documentId),
    });
}
function visualDiagnosticIdentity(visual) {
    return JSON.stringify({
        objectIds: visual.objectIds,
        parameters: Object.entries(visual.parameters ?? {}).sort(([left], [right]) => left.localeCompare(right, "en")),
        point: visual.point ?? null,
        bounds: visual.bounds ?? null,
    });
}
/**
 * Adapt a `VisualDiagnostic` (current document-scoped observation) into the
 * unified envelope as `domain: "visual"`. Its `objectIds` are resolved to
 * `primary`/`related` locators via the project object index.
 */
export function adaptVisualDiagnostic(visual, documentId, index) {
    const [primaryId, ...relatedIds] = visual.objectIds;
    const primary = primaryId
        ? locatorFromIndex(index, documentId, primaryId)
        : directObjectLocator(documentId, "document", documentId);
    const related = relatedIds
        .map((objectId) => locatorFromIndex(index, documentId, objectId))
        .filter((locator) => locator.objectId !== documentId || locator.kind !== "document");
    return {
        id: `visual:${documentId}:${visual.code}:${visualDiagnosticIdentity(visual)}`,
        domain: ROUTING_VISUAL_CODES.has(visual.code) ? "routing" : "visual",
        code: visual.code,
        severity: visual.severity,
        confidence: visual.confidence,
        gateEligible: visual.gateEligible,
        message: visual.message,
        primary,
        related,
        parameters: visual.parameters ?? {},
    };
}
/** Merge diagnostic groups from distinct producers into one deterministically sorted list. */
export function mergeDiagnostics(...groups) {
    return groups
        .flat()
        .sort((left, right) => DOMAIN_ORDER.indexOf(left.domain) -
        DOMAIN_ORDER.indexOf(right.domain) ||
        SEVERITY_RANK[left.severity] - SEVERITY_RANK[right.severity] ||
        left.primary.documentId.localeCompare(right.primary.documentId, "en") ||
        left.code.localeCompare(right.code, "en") ||
        left.primary.objectId.localeCompare(right.primary.objectId, "en"));
}
/** Collect raw visual evidence once so canvas markers need no second check. */
export function collectProjectDiagnosticEvidence(project, resolver, index = buildProjectConnectivityIndex(project, resolver), options = {}) {
    const wanted = options.domains ?? ["erc", "visual"];
    const visualByDocument = new Map();
    const visual = (wanted.includes("visual") ? project.documents : []).flatMap((document) => {
        const documentIndex = index.documents.get(document.id);
        const findings = diagnoseVisualQuality(document, resolver, {
            ...(documentIndex
                ? {
                    routingGeometry: documentIndex.routingGeometry,
                    contactEvidence: documentIndex.contactEvidence,
                    spatialIndex: documentIndex.spatialIndex,
                    logicalNetResolution: documentIndex.logicalNetResolution,
                    endpointConnections: documentIndex.endpointConnections,
                }
                : {}),
        });
        visualByDocument.set(document.id, findings);
        return findings.map((diagnostic) => adaptVisualDiagnostic(diagnostic, document.id, index));
    });
    return {
        diagnostics: mergeDiagnostics(wanted.includes("erc") ? runErcChecks(project, index, resolver) : [], wanted.includes("visual")
            ? project.documents.flatMap((document) => assessImportReference(document, resolver, index.documents.get(document.id)).issues.map((issue, ordinal) => ({
                id: `import-reference:${document.id}:${issue.code}:${ordinal}`,
                domain: "routing",
                code: issue.code,
                severity: issue.code === "IMPORT_REFERENCE_UNAVAILABLE" ||
                    issue.code === "IMPORT_REFERENCE_UNPLACED"
                    ? "info"
                    : "warning",
                confidence: "high",
                gateEligible: false,
                message: issue.message,
                primary: issue.instanceIds[0] &&
                    document.instances.some((i) => i.id === issue.instanceIds[0])
                    ? directObjectLocator(document.id, "instance", issue.instanceIds[0])
                    : directObjectLocator(document.id, "document", document.id),
                related: [],
                parameters: { comparisonScope: "cell-definition" },
            })))
            : [], visual),
        visualByDocument,
    };
}
/** Canonical Project diagnostic evidence consumed by the GUI and Agent API. */
export function diagnoseProject(project, resolver, index = buildProjectConnectivityIndex(project, resolver), options = {}) {
    return collectProjectDiagnosticEvidence(project, resolver, index, options)
        .diagnostics;
}
/**
 * Build one revision-stamped, non-persisted snapshot of current evidence.
 * @internal Tests read a Project's diagnostics through it.
 */
export function diagnoseProjectSnapshot(project, resolver, index = buildProjectConnectivityIndex(project, resolver), options = {}) {
    return {
        source: "live",
        projectId: project.id,
        documentRevisions: project.documents
            .map((document) => ({
            documentId: document.id,
            revision: document.revision,
        }))
            .sort((left, right) => left.documentId.localeCompare(right.documentId, "en")),
        diagnostics: diagnoseProject(project, resolver, index, options),
    };
}
