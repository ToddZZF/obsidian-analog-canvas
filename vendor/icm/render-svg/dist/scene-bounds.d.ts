import type { ResolvedDrawingScene, ResolvedDocumentRoutingGeometry, SchematicStyleProfile } from "@icm/derived";
import type { DerivedRect, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import type { ResolvedSvgAnnotation } from "./annotation-render.js";
export declare function deriveBounds(document: SchematicDocument, resolver: SymbolResolver, drawingScene: ResolvedDrawingScene, routingGeometry: ResolvedDocumentRoutingGeometry, dottedJunctionIds: ReadonlySet<string>, margin: number, annotations: readonly ResolvedSvgAnnotation[], profile: SchematicStyleProfile, objectIds?: ReadonlySet<string>): DerivedRect;
