import { deriveStableId } from "@icm/model";
export class ProjectMigrationError extends Error {
    path;
    constructor(path, message) {
        super(message);
        this.path = path;
    }
}
/**
 * Schema 25 makes every canvas Cell Pin an independent authoring record.
 * Schema-24 terminals that owned several visual markers are split into
 * singleton terminal records. Existing physical topology is authoritative and
 * therefore remains byte-for-byte unchanged; the migration never guesses how
 * to partition a Base Net, Route, or Junction.
 */
export function upgradeSchema24To25WithReport(raw) {
    const project = structuredClone(raw);
    const independentCellPins = [];
    const createdTerminalIds = [];
    const reboundAnnotationIds = [];
    const preservedLegacySharedNets = [];
    let splitRepeatedTerminalCount = 0;
    if (Array.isArray(project.documents)) {
        for (const [documentIndex, value] of project.documents.entries()) {
            if (!isRecord(value))
                continue;
            const result = migrateDocumentCellPins(value, documentIndex);
            independentCellPins.push(...result.independentCellPins);
            splitRepeatedTerminalCount += result.splitRepeatedTerminalCount;
            createdTerminalIds.push(...result.createdTerminalIds);
            reboundAnnotationIds.push(...result.reboundAnnotationIds);
            preservedLegacySharedNets.push(...result.preservedLegacySharedNets);
        }
    }
    project.schemaVersion = 25;
    return {
        project,
        report: {
            independentCellPins,
            splitRepeatedTerminalCount,
            createdTerminalIds,
            reboundAnnotationIds,
            preservedLegacySharedNets,
        },
    };
}
export function upgradeSchema24To25(raw) {
    return upgradeSchema24To25WithReport(raw).project;
}
function migrateDocumentCellPins(document, documentIndex) {
    const documentId = stringValue(document.id) ?? `document-${documentIndex}`;
    const netlist = isRecord(document.netlist) ? document.netlist : null;
    if (!netlist || !Array.isArray(netlist.terminals)) {
        return {
            independentCellPins: [],
            splitRepeatedTerminalCount: 0,
            createdTerminalIds: [],
            reboundAnnotationIds: [],
            preservedLegacySharedNets: [],
        };
    }
    const terminals = records(netlist.terminals);
    const annotations = records(document.annotations);
    const occupiedIds = collectIds(document);
    const migrated = [];
    const independentCellPins = [];
    const createdTerminalIds = [];
    const reboundAnnotationIds = [];
    const preservedLegacySharedNets = [];
    let splitRepeatedTerminalCount = 0;
    if (terminals.length !== netlist.terminals.length) {
        throw new ProjectMigrationError(["documents", documentIndex, "netlist", "terminals"], "Cell terminals must be objects");
    }
    for (const [terminalIndex, terminal] of terminals.entries()) {
        const terminalPath = [
            "documents",
            documentIndex,
            "netlist",
            "terminals",
            terminalIndex,
        ];
        const sourceTerminalId = stringValue(terminal.id);
        const name = stringValue(terminal.name);
        const netId = stringValue(terminal.netId);
        const markerIds = stringArray(terminal.interfaceInstanceIds);
        if (!sourceTerminalId || !name || !netId) {
            throw new ProjectMigrationError(terminalPath, "Cell terminal is missing id, name, or Net");
        }
        if (markerIds.length === 0) {
            throw new ProjectMigrationError([...terminalPath, "interfaceInstanceIds"], "Cell terminal has no drawing marker");
        }
        if (!Array.isArray(terminal.interfaceInstanceIds) ||
            markerIds.length !== terminal.interfaceInstanceIds.length) {
            throw new ProjectMigrationError([...terminalPath, "interfaceInstanceIds"], "Cell terminal drawing markers must be stable IDs");
        }
        const direction = terminalDirection(terminal.direction);
        if (!direction) {
            throw new ProjectMigrationError([...terminalPath, "direction"], "Cell terminal has an invalid direction");
        }
        if (markerIds.length > 1) {
            splitRepeatedTerminalCount += 1;
            preservedLegacySharedNets.push({
                documentId,
                sourceTerminalId,
                netId,
            });
        }
        for (const [markerIndex, interfaceInstanceId] of markerIds.entries()) {
            const retainedSourceTerminalId = markerIndex === 0;
            const terminalId = retainedSourceTerminalId
                ? sourceTerminalId
                : migratedTerminalId(sourceTerminalId, interfaceInstanceId, occupiedIds);
            occupiedIds.add(terminalId);
            if (!retainedSourceTerminalId)
                createdTerminalIds.push(terminalId);
            migrated.push({
                ...terminal,
                id: terminalId,
                interfaceInstanceIds: [interfaceInstanceId],
            });
            independentCellPins.push({
                documentId,
                sourceTerminalId,
                terminalId,
                interfaceInstanceId,
                name,
                direction,
                netId,
                retainedSourceTerminalId,
            });
            if (retainedSourceTerminalId)
                continue;
            for (const annotation of annotations) {
                if (!annotationBindsTerminalAtMarker(annotation, sourceTerminalId, interfaceInstanceId)) {
                    continue;
                }
                annotation.binding = {
                    kind: "cell-terminal-name",
                    terminalId,
                };
                const annotationId = stringValue(annotation.id);
                if (annotationId)
                    reboundAnnotationIds.push(annotationId);
            }
        }
    }
    netlist.terminals = migrated;
    return {
        independentCellPins,
        splitRepeatedTerminalCount,
        createdTerminalIds,
        reboundAnnotationIds,
        preservedLegacySharedNets,
    };
}
function migratedTerminalId(sourceTerminalId, interfaceInstanceId, occupiedIds) {
    let ordinal = 1;
    while (true) {
        const candidate = deriveStableId("cell-terminal", sourceTerminalId, interfaceInstanceId, ...(ordinal === 1 ? [] : [String(ordinal)]));
        if (!occupiedIds.has(candidate))
            return candidate;
        ordinal += 1;
    }
}
function annotationBindsTerminalAtMarker(annotation, terminalId, markerId) {
    const anchor = isRecord(annotation.anchor) ? annotation.anchor : null;
    const binding = isRecord(annotation.binding) ? annotation.binding : null;
    return (anchor?.kind === "object" &&
        anchor.objectId === markerId &&
        binding?.kind === "cell-terminal-name" &&
        binding.terminalId === terminalId);
}
function collectIds(value, result = new Set()) {
    if (Array.isArray(value)) {
        value.forEach((item) => collectIds(item, result));
        return result;
    }
    if (!isRecord(value))
        return result;
    if (typeof value.id === "string")
        result.add(value.id);
    Object.values(value).forEach((item) => collectIds(item, result));
    return result;
}
function terminalDirection(value) {
    return value === "input" ||
        value === "output" ||
        value === "inout" ||
        value === "passive"
        ? value
        : undefined;
}
function records(value) {
    return Array.isArray(value) ? value.filter(isRecord) : [];
}
function stringArray(value) {
    return Array.isArray(value)
        ? value.filter((item) => typeof item === "string")
        : [];
}
function stringValue(value) {
    return typeof value === "string" && value.length > 0 ? value : undefined;
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
