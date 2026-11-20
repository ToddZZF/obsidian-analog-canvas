import type { Point, RouteEndpoint } from "@icm/model";
/** A device-neutral visible graph node supplied by the connectivity adapter. */
export interface RoutingGuidanceNode {
    key: string;
    endpoint: RouteEndpoint;
    point: Point;
    /** Deterministic upstream tie-breaker; lower values win. */
    priority: number;
}
export interface RoutingGuidanceComponent {
    id: string;
    /** Representative Base Net; semantic drawing edges may span several Nets. */
    netId: string | null;
    nodes: readonly RoutingGuidanceNode[];
}
export interface NetGuidanceGraph {
    /** Current representative Base Net used only for guide grouping/focus. */
    netId: string;
    /** Original imported Net identity; never an electrical Net authority. */
    sourceNetId?: string;
    components: readonly RoutingGuidanceComponent[];
}
/** A derived, non-persisted route suggestion between visible components. */
export interface RoutingGuide {
    id: string;
    /** Current representative Base Net used for grouping and focus. */
    netId: string;
    /** Actual current Base Nets at the endpoints; null means electrically unbound. */
    fromNetId: string | null;
    toNetId: string | null;
    /** Original imported Net identity when this is source routing guidance. */
    sourceNetId?: string;
    from: RouteEndpoint;
    to: RouteEndpoint;
    fromPoint: Point;
    toPoint: Point;
    distance: number;
}
/**
 * Pure MST guidance calculation. It has no dependency on symbols, instances,
 * SPICE, Documents, labels, or Net policy; callers provide already-realized
 * visible connectivity components.
 */
export declare function deriveRoutingGuidance(graph: NetGuidanceGraph): RoutingGuide[];
