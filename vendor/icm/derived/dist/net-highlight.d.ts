import type { ProjectConnectivityIndex } from "./connectivity-index.js";
import type { EndpointRef, HierarchyEdge, VirtualConnectivityEdge } from "./connectivity-index.js";
import type { RoutingGuide } from "./routing-guidance.js";
import type { HierarchyFrame } from "./object-locator.js";
/**
 * Net highlight and occurrence-aware cross-Cell trace (Net connectivity rationale).
 * Pure computation over the Project connectivity index.
 */
export interface NetHighlight {
    documentId: string;
    hierarchyPath: readonly HierarchyFrame[];
    netId: string;
    visibleEndpoints: readonly EndpointRef[];
    routes: readonly string[];
    junctions: readonly string[];
    virtualEdges: readonly VirtualConnectivityEdge[];
    routingGuidance: readonly RoutingGuide[];
}
export type CrossCellTraceFrame = HierarchyEdge;
export interface HierarchyNetRef {
    documentId: string;
    netId: string;
    hierarchyPath: readonly HierarchyFrame[];
}
export interface HierarchyNetTraceHop {
    direction: "down" | "up";
    from: HierarchyNetRef;
    to: HierarchyNetRef;
    frame: CrossCellTraceFrame;
}
export interface GlobalNetTraceHop {
    direction: "global";
    from: HierarchyNetRef;
    to: HierarchyNetRef;
    foldedName: string;
}
export interface HierarchyNetTrace {
    primary: NetHighlight;
    /** One highlight for every reachable logical net, including the primary. */
    highlights: readonly NetHighlight[];
    /** Every concrete parent-instance/child-formal-terminal traversal edge. */
    hops: readonly (HierarchyNetTraceHop | GlobalNetTraceHop)[];
}
export declare function computeNetHighlight(index: ProjectConnectivityIndex, documentId: string, netId: string, origin?: EndpointRef, hierarchyPath?: readonly HierarchyFrame[]): NetHighlight | undefined;
/**
 * Traverse hierarchy connectivity in both directions. The visited key is the
 * concrete occurrence path and logical document/net pair;
 * hops are retained independently so two parent instances of one child Cell
 * remain distinguishable to a later hierarchy-aware UI.
 */
export declare function traceHierarchyNet(index: ProjectConnectivityIndex, documentId: string, netId: string, origin?: EndpointRef, hierarchyPath?: readonly HierarchyFrame[]): HierarchyNetTrace | undefined;
