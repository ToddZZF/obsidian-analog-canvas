import type { Annotation, RouteEndpoint, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import { type ResolvedDocumentRoutingGeometry } from "./resolved-route-geometry.js";
export interface ResolvedNetLabelBinding {
    annotationId: string;
    netId: string;
    routeId?: string;
    segmentIndex?: number;
    legId?: string;
    endpoint: RouteEndpoint;
}
/**
 * Resolves the single accepted electrical meaning of a Net Label.
 *
 * `netId` is the electrical identity. `anchor` separately controls placement:
 * an explicit route anchor is exact, while a free/object anchor resolves to
 * the nearest routed component only for virtual-connectivity presentation.
 */
export declare function resolveNetLabelBinding(document: SchematicDocument, resolver: SymbolResolver, annotation: Annotation, routingGeometry?: ResolvedDocumentRoutingGeometry): ResolvedNetLabelBinding | null;
export declare function resolveNetLabelBindings(document: SchematicDocument, resolver: SymbolResolver, netId: string, routingGeometry?: ResolvedDocumentRoutingGeometry): ResolvedNetLabelBinding[];
