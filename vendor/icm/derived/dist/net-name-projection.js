import { foldNetName } from "@icm/model";
import { resolveDocumentLogicalNets, } from "./logical-net.js";
function compareExactText(left, right) {
    return left < right ? -1 : left > right ? 1 : 0;
}
function compareCandidates(left, right) {
    return (left.authorityRank - right.authorityRank ||
        left.documentDepth - right.documentDepth ||
        compareExactText(left.spelling, right.spelling));
}
function uniqueSpellings(candidates) {
    return [...new Set(candidates.map((candidate) => candidate.spelling))].sort(compareExactText);
}
function hierarchyDepths(project) {
    const documentsById = new Map(project.documents.map((document) => [document.id, document]));
    const depths = new Map();
    const pending = [{ documentId: project.topDocumentId, depth: 0 }];
    for (let index = 0; index < pending.length; index += 1) {
        const current = pending[index];
        const prior = depths.get(current.documentId);
        if (prior !== undefined && prior <= current.depth)
            continue;
        depths.set(current.documentId, current.depth);
        const document = documentsById.get(current.documentId);
        if (!document)
            continue;
        for (const instance of document.instances) {
            const binding = instance.netlist?.binding;
            if (binding?.kind !== "subcircuit")
                continue;
            pending.push({
                documentId: binding.childDocumentId,
                depth: current.depth + 1,
            });
        }
    }
    return depths;
}
function candidatesForLogicalNet(document, logicalNet, documentDepth) {
    const memberNetIds = new Set(logicalNet.baseNetIds);
    const foldedIdentity = logicalNet.name
        ? foldNetName(logicalNet.name)
        : undefined;
    const authoritative = [];
    const hints = [];
    for (const evidence of document.connectivityEvidence) {
        if (!memberNetIds.has(evidence.netId))
            continue;
        if (evidence.kind === "name-claim") {
            if (foldedIdentity && foldNetName(evidence.name) !== foldedIdentity) {
                continue;
            }
            authoritative.push({
                spelling: evidence.name.trim(),
                authorityRank: evidence.owner.kind === "global-declaration" ? 2 : 0,
                documentDepth,
            });
        }
        else if (evidence.kind === "net-name-hint") {
            if (foldedIdentity &&
                foldNetName(evidence.sourceName) !== foldedIdentity) {
                continue;
            }
            hints.push({
                spelling: evidence.sourceName.trim(),
                authorityRank: 3,
                documentDepth,
            });
        }
    }
    for (const terminal of document.netlist?.terminals ?? []) {
        if (!memberNetIds.has(terminal.netId))
            continue;
        if (foldedIdentity && foldNetName(terminal.name) !== foldedIdentity) {
            continue;
        }
        authoritative.push({
            spelling: terminal.name.trim(),
            authorityRank: 1,
            documentDepth,
        });
    }
    if (authoritative.length > 0)
        return authoritative;
    if (foldedIdentity) {
        return [
            {
                spelling: logicalNet.name.trim(),
                authorityRank: 2,
                documentDepth,
            },
        ];
    }
    const hintIdentities = new Set(hints.map((candidate) => foldNetName(candidate.spelling)));
    return hintIdentities.size === 1 ? hints : [];
}
function projectedName(document, logicalNet, documentDepth, reachable) {
    const candidates = [
        ...candidatesForLogicalNet(document, logicalNet, documentDepth),
    ].sort(compareCandidates);
    return {
        value: {
            documentId: document.id,
            logicalNetId: logicalNet.id,
            baseNetIds: logicalNet.baseNetIds,
            scope: logicalNet.scope ?? "local",
            spellings: uniqueSpellings(candidates),
            ...(candidates[0] ? { preferredSpelling: candidates[0].spelling } : {}),
        },
        candidates,
        reachable,
    };
}
/**
 * Pure revision-scoped spelling projection. It never changes Base Nets,
 * owner-addressed evidence, or source provenance.
 */
export function deriveProjectNetNameProjection(project) {
    const depths = hierarchyDepths(project);
    const mutableByDocument = new Map();
    const globalGroups = new Map();
    for (const document of project.documents) {
        const reachableDepth = depths.get(document.id);
        const documentDepth = reachableDepth ?? Number.MAX_SAFE_INTEGER;
        const byLogicalNetId = new Map();
        for (const logicalNet of resolveDocumentLogicalNets(document).groups) {
            const projected = projectedName(document, logicalNet, documentDepth, reachableDepth !== undefined);
            byLogicalNetId.set(logicalNet.id, projected);
            if (projected.value.scope === "global" && logicalNet.name) {
                const foldedName = foldNetName(logicalNet.name);
                const members = globalGroups.get(foldedName) ?? [];
                members.push(projected);
                globalGroups.set(foldedName, members);
            }
        }
        mutableByDocument.set(document.id, byLogicalNetId);
    }
    for (const members of globalGroups.values()) {
        const candidateMembers = members.some((member) => member.reachable)
            ? members.filter((member) => member.reachable)
            : members;
        const candidates = candidateMembers
            .flatMap((member) => member.candidates)
            .sort(compareCandidates);
        const spellings = uniqueSpellings(candidates);
        const preferredSpelling = candidates[0]?.spelling;
        for (const member of members) {
            member.value = {
                ...member.value,
                spellings,
                ...(preferredSpelling ? { preferredSpelling } : {}),
            };
        }
    }
    return {
        byDocumentId: new Map([...mutableByDocument.entries()].map(([documentId, projections]) => [
            documentId,
            new Map([...projections.entries()].map(([logicalNetId, projection]) => [
                logicalNetId,
                projection.value,
            ])),
        ])),
    };
}
