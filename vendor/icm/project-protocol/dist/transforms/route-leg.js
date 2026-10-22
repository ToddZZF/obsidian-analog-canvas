import { deriveStableId } from "@icm/model";
import { ProjectMigrationError } from "./project.js";
/** Upgrade schema 25's parallel Route arrays to stable schema-26 legs. */
export function upgradeSchema25To26WithReport(raw) {
    const project = structuredClone(raw);
    const migratedRoutes = [];
    if (Array.isArray(project.documents)) {
        for (const [documentIndex, value] of project.documents.entries()) {
            if (!isRecord(value))
                continue;
            migratedRoutes.push(...migrateDocumentRoutes(value, documentIndex));
        }
    }
    project.schemaVersion = 26;
    return { project, report: { routes: migratedRoutes } };
}
export function upgradeSchema25To26(raw) {
    return upgradeSchema25To26WithReport(raw).project;
}
function migrateDocumentRoutes(document, documentIndex) {
    const documentId = stringValue(document.id) ?? `document-${documentIndex}`;
    if (!Array.isArray(document.routes))
        return [];
    const legIdsByRoute = new Map();
    const reports = [];
    const migrated = document.routes.map((value, routeIndex) => {
        const path = ["documents", documentIndex, "routes", routeIndex];
        if (!isRecord(value)) {
            throw new ProjectMigrationError(path, "Route must be an object");
        }
        const routeId = stringValue(value.id);
        const netId = stringValue(value.netId);
        const start = value.from;
        const endpoint = value.to;
        const waypoints = Array.isArray(value.waypoints) ? value.waypoints : null;
        const segmentModes = Array.isArray(value.segmentModes)
            ? value.segmentModes
            : null;
        if (!routeId || !netId || !isRecord(start) || !isRecord(endpoint)) {
            throw new ProjectMigrationError(path, "Route is missing id, Net, or endpoint");
        }
        if (!waypoints || !segmentModes) {
            throw new ProjectMigrationError(path, "Route waypoints and segment modes must be arrays");
        }
        if (segmentModes.length !== waypoints.length + 1) {
            throw new ProjectMigrationError([...path, "segmentModes"], "A route requires one segment mode per geometric segment");
        }
        const legIds = segmentModes.map((_, index) => deriveStableId("route-leg", routeId, String(index)));
        const bendIds = waypoints.map((_, index) => deriveStableId("route-bend", routeId, String(index)));
        const legs = segmentModes.map((mode, index) => {
            const waypoint = waypoints[index];
            return {
                id: legIds[index],
                to: index < waypoints.length
                    ? {
                        kind: "bend",
                        bendId: bendIds[index],
                        position: waypoint,
                    }
                    : { kind: "endpoint", endpoint },
                mode,
            };
        });
        legIdsByRoute.set(routeId, legIds);
        reports.push({
            documentId,
            routeId,
            legIds,
            bendIds,
            reboundAnnotationIds: [],
        });
        const { from: _from, to: _to, waypoints: _waypoints, segmentModes: _modes, ...rest } = value;
        return { ...rest, start, legs };
    });
    document.routes = migrated;
    for (const annotation of records(document.annotations)) {
        const annotationId = stringValue(annotation.id);
        const anchor = isRecord(annotation.anchor) ? annotation.anchor : null;
        if (!anchor || anchor.kind !== "route")
            continue;
        const routeId = stringValue(anchor.routeId);
        const segmentIndex = integerValue(anchor.segmentIndex);
        const legId = routeId !== null && segmentIndex !== null
            ? legIdsByRoute.get(routeId)?.[segmentIndex]
            : undefined;
        if (!legId) {
            throw new ProjectMigrationError(["documents", documentIndex, "annotations"], `Route annotation ${annotationId ?? "<unknown>"} references an invalid segment`);
        }
        const { segmentIndex: _segmentIndex, ...rest } = anchor;
        annotation.anchor = { ...rest, legId };
        const report = reports.find((item) => item.routeId === routeId);
        if (annotationId && report) {
            report.reboundAnnotationIds.push(annotationId);
        }
    }
    return reports;
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function records(value) {
    return Array.isArray(value) ? value.filter(isRecord) : [];
}
function stringValue(value) {
    return typeof value === "string" && value.length > 0 ? value : null;
}
function integerValue(value) {
    return typeof value === "number" && Number.isInteger(value) && value >= 0
        ? value
        : null;
}
