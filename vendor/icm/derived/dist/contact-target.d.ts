import type { Point, RouteEndpoint, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import type { RoutedComponent } from "./connectivity.js";
import { type ResolvedDocumentRoutingGeometry } from "./resolved-route-geometry.js";
export type ElectricalContactCandidate = {
    kind: "endpoint";
    id: string;
    point: Point;
    netId: string | null;
    endpoint: RouteEndpoint;
} | {
    kind: "route";
    id: string;
    point: Point;
    netId: string;
    routeId: string;
    segmentIndex: number;
};
export interface ElectricalContactTarget {
    /** Stable identity of one actually connected visible conductor. */
    conductorId: string;
    point: Point;
    netId: string | null;
    candidates: readonly ElectricalContactCandidate[];
    endpoint?: Extract<ElectricalContactCandidate, {
        kind: "endpoint";
    }>;
    route?: Extract<ElectricalContactCandidate, {
        kind: "route";
    }>;
}
/**
 * Collapse raw SVG/snap hits into electrical conductors.
 *
 * Two segments at one Route corner, a pin plus its incident Route, or a
 * Junction plus all of its branches are one target. Two geometrically crossing
 * but visibly disconnected components stay separate even when storage happens
 * to assign them the same Net id.
 */
export declare function resolveElectricalContactTargets(document: SchematicDocument, resolver: SymbolResolver, candidates: readonly ElectricalContactCandidate[], precomputedComponents?: readonly RoutedComponent[]): ElectricalContactTarget[];
/** A read-only, stable snapshot's conductor lookup, populated only on a hit. */
export declare function createElectricalContactResolver(document: SchematicDocument, resolver: SymbolResolver, precomputedComponents?: readonly RoutedComponent[], geometry?: () => ResolvedDocumentRoutingGeometry): (candidates: readonly ElectricalContactCandidate[]) => ElectricalContactTarget[];
