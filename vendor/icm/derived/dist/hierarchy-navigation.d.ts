import type { HierarchyFrame } from "./object-locator.js";
import type { ProjectConnectivityIndex } from "./connectivity-index.js";
/**
 * Enumerate every concrete caller path from root to a target Cell. Cycles are
 * cut at the current document chain rather than globally, so distinct valid
 * callers of the same reusable Cell remain visible.
 */
export declare function findHierarchyPaths(index: ProjectConnectivityIndex, rootDocumentId: string, targetDocumentId: string): readonly (readonly HierarchyFrame[])[] | undefined;
export declare function findHierarchyPath(index: ProjectConnectivityIndex, rootDocumentId: string, targetDocumentId: string): readonly HierarchyFrame[] | undefined;
