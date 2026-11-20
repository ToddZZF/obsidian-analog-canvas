import type { RouteEndpoint, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import type { DocumentConnectivityIndex } from "./connectivity-index.js";
export type EndpointMembership = "unbound" | "singleton" | "peer-connected";
export interface EndpointConnectivityIntent {
    explicitNoConnect: boolean;
    implicit: boolean;
    formalBoundary: boolean;
    globalSupply: boolean;
    /** Historical provenance only; never evidence that a current pin is connected. */
    sourceDeclared: boolean;
}
/**
 * One pure, revision-local answer to two deliberately separate questions:
 * what electrical peers does this endpoint have, and which explicit design
 * intents make an otherwise peerless endpoint acceptable? This is derived
 * from the canonical Base/Logical-Net model and is never persisted.
 */
export interface EndpointConnectivityAssessment {
    endpoint: RouteEndpoint;
    baseNetId: string | null;
    logicalNetId: string | null;
    membership: EndpointMembership;
    peerEndpoints: readonly RouteEndpoint[];
    intent: EndpointConnectivityIntent;
    electricallySatisfied: boolean;
}
export interface EndpointConnectivityClassifier {
    assess(endpoint: RouteEndpoint): EndpointConnectivityAssessment;
    assessMosBulk(instanceId: string): EndpointConnectivityAssessment;
}
export declare function createEndpointConnectivityClassifier(document: SchematicDocument, index: DocumentConnectivityIndex | undefined, resolver: SymbolResolver): EndpointConnectivityClassifier;
