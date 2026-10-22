import { findHierarchyPaths } from "./hierarchy-navigation.js";
import { directObjectLocator } from "./object-locator.js";
import { resolveDocumentLogicalNets } from "./logical-net.js";
const MATCH_RANK = {
    exact: 0,
    prefix: 1,
    substring: 2,
};
const KIND_RANK = {
    instance: 0,
    net: 1,
};
function classifyMatch(value, query) {
    if (value === query)
        return "exact";
    if (value.startsWith(query))
        return "prefix";
    if (value.includes(query))
        return "substring";
    return null;
}
function instanceLabel(id, symbolId, reference) {
    if (reference)
        return reference;
    return symbolId ?? id;
}
function searchLocator(documentId, kind, objectId, objectIndex) {
    const resolved = objectIndex?.resolve(documentId, objectId);
    if (resolved?.kind === kind)
        return resolved;
    return directObjectLocator(documentId, kind, objectId);
}
function collectCandidates(project, objectIndex) {
    const candidates = [];
    for (const document of project.documents) {
        for (const instance of document.instances) {
            const locator = searchLocator(document.id, "instance", instance.id, objectIndex);
            const label = instanceLabel(instance.id, instance.symbolId, instance.reference);
            candidates.push({
                locator,
                label,
                field: "instance-id",
                value: instance.id.toLowerCase(),
            });
            candidates.push({
                locator,
                label,
                field: "symbol",
                value: instance.symbolId.toLowerCase(),
            });
            const reference = instance.reference;
            if (reference) {
                candidates.push({
                    locator,
                    label,
                    field: "netlist-reference",
                    value: reference.toLowerCase(),
                });
            }
            for (const [key, rawValue] of Object.entries(instance.netlist?.parameters ?? {})) {
                candidates.push({
                    locator,
                    label: `${key}=${String(rawValue)}`,
                    field: "property",
                    value: String(rawValue).toLowerCase(),
                });
                candidates.push({
                    locator,
                    label: `${key}=${String(rawValue)}`,
                    field: "property",
                    value: key.toLowerCase(),
                });
            }
        }
        for (const net of resolveDocumentLogicalNets(document).groups) {
            const locator = searchLocator(document.id, "net", net.id, objectIndex);
            const label = net.name ?? net.id;
            candidates.push({
                locator,
                label,
                field: "net-id",
                value: net.id.toLowerCase(),
            });
            if (net.name) {
                candidates.push({
                    locator,
                    label,
                    field: "net-name",
                    value: net.name.toLowerCase(),
                });
            }
        }
    }
    return candidates;
}
export function buildProjectSearchIndex(project, options = {}) {
    const candidates = collectCandidates(project, options.connectivityIndex?.objectIndex);
    return {
        search(query) {
            const normalized = query.trim().toLowerCase();
            if (normalized.length === 0)
                return [];
            // Keep the best-scoring candidate per object.
            const bestByObject = new Map();
            for (const candidate of candidates) {
                const match = classifyMatch(candidate.value, normalized);
                if (!match)
                    continue;
                const key = `${candidate.locator.documentId}\u0000${candidate.locator.kind}\u0000${candidate.locator.objectId}`;
                const current = bestByObject.get(key);
                if (!current ||
                    MATCH_RANK[match] < MATCH_RANK[current.match] ||
                    (MATCH_RANK[match] === MATCH_RANK[current.match] &&
                        candidate.field.localeCompare(current.candidate.field, "en") < 0)) {
                    bestByObject.set(key, { candidate, match });
                }
            }
            return [...bestByObject.values()]
                .flatMap(({ candidate, match }) => {
                const paths = options.connectivityIndex
                    ? (findHierarchyPaths(options.connectivityIndex, project.topDocumentId, candidate.locator.documentId) ?? [candidate.locator.hierarchyPath])
                    : [candidate.locator.hierarchyPath];
                return paths.map((hierarchyPath) => ({
                    locator: { ...candidate.locator, hierarchyPath },
                    label: candidate.label,
                    field: candidate.field,
                    matchType: match,
                }));
            })
                .sort((left, right) => MATCH_RANK[left.matchType] - MATCH_RANK[right.matchType] ||
                left.locator.documentId.localeCompare(right.locator.documentId, "en") ||
                KIND_RANK[left.locator.kind] - KIND_RANK[right.locator.kind] ||
                left.locator.objectId.localeCompare(right.locator.objectId, "en") ||
                left.locator.hierarchyPath
                    .map((frame) => frame.instanceId)
                    .join("\u0000")
                    .localeCompare(right.locator.hierarchyPath
                    .map((frame) => frame.instanceId)
                    .join("\u0000"), "en"));
        },
    };
}
