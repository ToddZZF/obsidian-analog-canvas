/**
 * Find deterministic concrete instance paths through structural Cell calls.
 * Multiple instances may reference the same child Cell, so this returns frames
 * rather than a lossy list of document ids. Stable call order makes traversal
 * repeatable, independently of symbol resolution and electrical connectivity.
 */
function hierarchyFramesByParent(index) {
    const edges = [...index.hierarchy.calls]
        .sort((left, right) => left.parentDocumentId.localeCompare(right.parentDocumentId, "en") ||
        left.instanceId.localeCompare(right.instanceId, "en") ||
        left.childDocumentId.localeCompare(right.childDocumentId, "en"))
        .map((edge) => ({
        parentDocumentId: edge.parentDocumentId,
        instanceId: edge.instanceId,
        childDocumentId: edge.childDocumentId,
    }));
    const byParent = new Map();
    for (const frame of edges) {
        const frames = byParent.get(frame.parentDocumentId) ?? [];
        if (!frames.some((candidate) => candidate.instanceId === frame.instanceId &&
            candidate.childDocumentId === frame.childDocumentId)) {
            frames.push(frame);
        }
        byParent.set(frame.parentDocumentId, frames);
    }
    return byParent;
}
/**
 * Enumerate every concrete caller path from root to a target Cell. Cycles are
 * cut at the current document chain rather than globally, so distinct valid
 * callers of the same reusable Cell remain visible.
 */
export function findHierarchyPaths(index, rootDocumentId, targetDocumentId) {
    if (rootDocumentId === targetDocumentId)
        return [[]];
    const byParent = hierarchyFramesByParent(index);
    const paths = [];
    const visit = (documentId, path, ancestry) => {
        for (const frame of byParent.get(documentId) ?? []) {
            if (ancestry.has(frame.childDocumentId))
                continue;
            const next = [...path, frame];
            if (frame.childDocumentId === targetDocumentId) {
                paths.push(next);
                continue;
            }
            visit(frame.childDocumentId, next, new Set([...ancestry, frame.childDocumentId]));
        }
    };
    visit(rootDocumentId, [], new Set([rootDocumentId]));
    return paths.length > 0 ? paths : undefined;
}
export function findHierarchyPath(index, rootDocumentId, targetDocumentId) {
    const paths = findHierarchyPaths(index, rootDocumentId, targetDocumentId);
    return paths?.[0];
}
