import type { SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import { type CoincidentContact, type DocumentContactEvidence } from "./contact.js";
import type { ResolvedDocumentLogicalNets } from "./logical-net.js";
import { type ResolvedNetLabelBinding } from "./net-label.js";
import { type ResolvedDocumentRoutingGeometry } from "./resolved-route-geometry.js";
import { type DocumentSpatialIndex } from "./spatial-index.js";
import { type EndpointConnection } from "./endpoint.js";
type Instance = SchematicDocument["instances"][number];
type Net = SchematicDocument["nets"][number];
type Route = SchematicDocument["routes"][number];
type Junction = SchematicDocument["junctions"][number];
type Annotation = SchematicDocument["annotations"][number];
/**
 * One immutable-revision read context for every derived consumer. This is an
 * implementation object only: it is never persisted and never becomes a
 * second electrical protocol.
 */
export interface DocumentDerivedContext {
    readonly documentId: string;
    readonly documentRevision: number;
    readonly instancesById: ReadonlyMap<string, Instance>;
    readonly netsById: ReadonlyMap<string, Net>;
    readonly routesById: ReadonlyMap<string, Route>;
    readonly junctionsById: ReadonlyMap<string, Junction>;
    readonly annotationsById: ReadonlyMap<string, Annotation>;
    readonly routesByNetId: ReadonlyMap<string, readonly Route[]>;
    readonly junctionsByNetId: ReadonlyMap<string, readonly Junction[]>;
    readonly annotationsByNetId: ReadonlyMap<string, readonly Annotation[]>;
    readonly routeDegreeByEndpointKey: ReadonlyMap<string, number>;
    readonly endpointConnections: ReadonlyMap<string, EndpointConnection>;
    readonly routingGeometry: ResolvedDocumentRoutingGeometry;
    readonly contactEvidence: DocumentContactEvidence;
    readonly contactsByNetId: ReadonlyMap<string, readonly CoincidentContact[]>;
    readonly netLabelBindingsByNetId: ReadonlyMap<string, readonly ResolvedNetLabelBinding[]>;
    readonly logicalNetResolution: ResolvedDocumentLogicalNets;
    readonly spatialIndex: DocumentSpatialIndex;
}
export declare function buildDocumentDerivedContext(document: SchematicDocument, resolver: SymbolResolver): DocumentDerivedContext;
export {};
