import type { Net, Point, RouteEndpoint, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import { type RoutingGuide } from "./routing-guidance.js";
import { type DocumentDerivedContext } from "./document-derived-context.js";
export interface VisibleConnectivityNode {
    key: string;
    endpoint: RouteEndpoint;
    point: Point | null;
}
export interface RoutedComponent {
    id: string;
    netId: string;
    nodes: VisibleConnectivityNode[];
    /** Stored Routes whose endpoints belong to this visible component. */
    routes: string[];
}
export interface VisibleNetConnectivity {
    netId: string;
    components: RoutedComponent[];
}
/** @deprecated Use RoutingGuide for new consumers. */
export type Flightline = RoutingGuide;
/**
 * Shared per-document context for connectivity derivation. Deriving it once
 * and passing it through turns an all-nets sweep from quadratic (full
 * contact evidence and label bindings re-derived per net) into one pass.
 */
/** @deprecated Use DocumentDerivedContext for new shared consumers. */
export type NetConnectivityContext = DocumentDerivedContext;
export declare function deriveNetConnectivityContext(document: SchematicDocument, resolver: SymbolResolver): NetConnectivityContext;
export declare function deriveNetConnectivity(document: SchematicDocument, resolver: SymbolResolver, net: Net, context?: NetConnectivityContext): VisibleNetConnectivity;
export declare function deriveVisibleConnectivity(document: SchematicDocument, resolver: SymbolResolver): VisibleNetConnectivity[];
/**
 * Compatibility adapter for callers that need visible-guidance candidates for
 * every Net. Product UI should use deriveImportedRoutingGuidance instead.
 * @internal Routing tests check that no Net is left with guidance.
 */
export declare function deriveFlightlines(document: SchematicDocument, resolver: SymbolResolver): Flightline[];
/**
 * Routing assistance for topology imported from SPICE. Hand-authored Nets are
 * deliberately excluded even when they share a source-bound Document.
 */
export declare function deriveImportedRoutingGuidance(document: SchematicDocument, resolver: SymbolResolver, context?: DocumentDerivedContext): RoutingGuide[];
