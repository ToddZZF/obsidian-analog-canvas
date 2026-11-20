import type { Point, RouteEndpoint, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import type { DocumentSpatialIndex } from "./spatial-index.js";
import { type EndpointConnection, type EndpointObjectLookup } from "./endpoint.js";
import { type ResolvedDocumentRoutingGeometry } from "./resolved-route-geometry.js";
export interface ContactIncident {
    kind: "route" | "terminal";
    objectId: string;
    direction: Point;
}
/**
 * One derived electrical contact between explicit graph nodes on the same Net.
 *
 * Contact locations come only from explicit same-Net endpoints. Route arms
 * contribute only when the Route explicitly references one of those
 * endpoints; a same-Net segment that merely passes through the coordinate is
 * still a geometric crossing. This is the shared evidence used by visible
 * connectivity, junction rendering, and diagnostics.
 */
export interface CoincidentContact {
    id: string;
    netId: string;
    point: Point;
    endpoints: readonly RouteEndpoint[];
    incidents: readonly ContactIncident[];
    /** Distinct visible directions across both Route arms and terminal stems. */
    branchDirections: readonly Point[];
}
export interface DocumentContactEvidence {
    contacts: readonly CoincidentContact[];
    byEndpointKey: ReadonlyMap<string, CoincidentContact>;
}
/**
 * One pairwise projection of a confirmed same-Net {@link CoincidentContact}.
 * It is the transform-time input used to detect when a previously confirmed
 * direct contact has been separated. Gained contacts are committed by the Edit
 * Engine's transaction connectivity normalizer; this read model continues to
 * describe only already-confirmed same-Net contacts.
 */
export interface DirectContactPair {
    id: string;
    netId: string;
    point: Point;
    endpoints: readonly [RouteEndpoint, RouteEndpoint];
}
export interface DirectContactDelta {
    gained: readonly DirectContactPair[];
    lost: readonly DirectContactPair[];
    retained: readonly DirectContactPair[];
}
/**
 * Compare confirmed direct contacts across one projected edit. Pair identity
 * is endpoint-based, so two endpoints translated together are retained even
 * though their page coordinate changes.
 */
export declare function deriveDirectContactDelta(before: SchematicDocument, after: SchematicDocument, resolver: SymbolResolver, evidence?: {
    before?: DocumentContactEvidence;
    after?: DocumentContactEvidence;
}): DirectContactDelta;
/**
 * Whether a confirmed same-Net contact needs a visible junction dot.
 *
 * A dot communicates a visible branch, not the number of model objects at a
 * contact. Route arms and terminal stems that leave in the same direction
 * paint as one conductor. A straight join, a corner, and a terminal stem that
 * is collinear with a through-wire therefore remain dotless. Three distinct
 * visible directions require a dot. Three coincident terminals also require a
 * dot even when some symbol stems overlap geometrically.
 */
export declare function contactRequiresJunctionDot(contact: CoincidentContact): boolean;
export declare function deriveDocumentContactEvidence(document: SchematicDocument, resolver: SymbolResolver, routingGeometry?: ResolvedDocumentRoutingGeometry, options?: {
    routesByNetId?: ReadonlyMap<string, readonly SchematicDocument["routes"][number][]>;
    endpointConnections?: ReadonlyMap<string, EndpointConnection>;
    endpointLookup?: EndpointObjectLookup;
    spatialIndex?: DocumentSpatialIndex;
    routesById?: ReadonlyMap<string, SchematicDocument["routes"][number]>;
}): DocumentContactEvidence;
