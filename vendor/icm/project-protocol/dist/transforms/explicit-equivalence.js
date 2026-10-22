import { ProjectMigrationError } from "./project.js";
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
 * Upgrade schema 32 to 33 without guessing what an ownerless electrical union
 * meant. Such a record cannot be converted safely into physical topology,
 * owner-addressed naming, or hierarchy, so the file boundary rejects it at
 * its exact location instead of silently changing connectivity.
 */
export function upgradeSchema32To33WithReport(raw) {
    const project = structuredClone(raw);
    const documents = Array.isArray(project.documents) ? project.documents : [];
    for (const [documentIndex, document] of documents.entries()) {
        if (!isRecord(document) || !Array.isArray(document.connectivityEvidence)) {
            continue;
        }
        for (const [evidenceIndex, evidence,] of document.connectivityEvidence.entries()) {
            if (isRecord(evidence) && evidence.kind === "explicit-equivalence") {
                throw new ProjectMigrationError(["documents", documentIndex, "connectivityEvidence", evidenceIndex], "Schema 32 explicit-equivalence has no authoring owner and cannot be migrated safely; replace it with physical topology, owner-addressed Net Labels, or hierarchy terminals");
            }
        }
    }
    project.schemaVersion = 33;
    return { project, report: { changed: false } };
}
export function upgradeSchema32To33(raw) {
    return upgradeSchema32To33WithReport(raw).project;
}
