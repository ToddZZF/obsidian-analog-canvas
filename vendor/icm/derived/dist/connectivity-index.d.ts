import type { CircuitProject, RouteEndpoint } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import { type RoutedComponent } from "./connectivity.js";
import type { RoutingGuide } from "./routing-guidance.js";
import { type ObjectLocator, type HierarchyFrame } from "./object-locator.js";
import type { DocumentDerivedContext } from "./document-derived-context.js";
/**
 * Shared derived connectivity read model; see docs/specs/connectivity-and-routing.md.
 * Physical membership, logical equivalence, guidance and occurrence-aware lookup
 * remain projections of Project facts, never another persisted authority.
 */
export type EndpointRef = RouteEndpoint;
export interface VirtualConnectivityEdge {
    kind: "net-label" | "power-label";
    from: EndpointRef;
    to: EndpointRef;
    /** Label text binding the two endpoints. */
    evidence: string;
}
export interface NetConnectivityRecord {
    netId: string;
    baseNetIds: readonly string[];
    /** Instance terminals — electrical truth, independent of geometry. */
    logicalEndpoints: readonly EndpointRef[];
    /** Visible graph participants (visible terminals + the Net's Junctions). */
    visibleEndpoints: readonly EndpointRef[];
    routedComponents: readonly RoutedComponent[];
    routes: readonly string[];
    junctions: readonly string[];
    virtualEdges: readonly VirtualConnectivityEdge[];
    /** Imported routing guidance with partition-invariant id/direction. */
    routingGuidance: readonly RoutingGuide[];
}
export interface DocumentConnectivityIndex extends DocumentDerivedContext {
    /** Also includes guides to extant but electrically unbound terminals. */
    routingGuidance: readonly RoutingGuide[];
    /** Physical membership: endpoint key -> Base Net id. */
    endpointToBaseNetId: ReadonlyMap<string, string>;
    /** One canonical record per resolved Logical Net. */
    logicalNets: ReadonlyMap<string, NetConnectivityRecord>;
    /** Total lookup from every Base Net id to its Logical Net record. */
    logicalNetByBaseNetId: ReadonlyMap<string, NetConnectivityRecord>;
}
export interface HierarchyEdge {
    parentDocumentId: string;
    instanceId: string;
    parentPinName: string;
    childDocumentId: string;
    childTerminalName: string;
    childNetId: string;
    parentMemberId?: string;
    parentMemberName?: string;
    childMemberId?: string;
    childMemberName?: string;
}
export interface HierarchyConnectivityIndex {
    /** Structural calls exist even without pins, wiring or resolved symbols. */
    calls: readonly HierarchyFrame[];
    edges: readonly HierarchyEdge[];
}
export interface NetObjectRef {
    documentId: string;
    netId: string;
}
/** Derived project-wide equivalence for explicitly named global Nets only. */
export interface GlobalNetGroup {
    foldedName: string;
    nets: readonly NetObjectRef[];
}
/**
 * Project-level object identity (Net connectivity rationale). Direct-document locators carry an
 * empty hierarchy path; C6 later supplies non-empty paths for navigation.
 */
export interface ProjectObjectIndex {
    resolve(documentId: string, objectId: string): ObjectLocator | undefined;
}
export interface ProjectConnectivityIndex {
    projectId: string;
    topDocumentId: string;
    documents: ReadonlyMap<string, DocumentConnectivityIndex>;
    hierarchy: HierarchyConnectivityIndex;
    globalNets: ReadonlyMap<string, GlobalNetGroup>;
    objectIndex: ProjectObjectIndex;
}
export declare function buildProjectConnectivityIndex(project: CircuitProject, resolver: SymbolResolver): ProjectConnectivityIndex;
