import type { Rect, SchematicDocument } from "@icm/model";
import { type SymbolResolver } from "@icm/symbols";
import { type ResolvedDrawingScene } from "./drawing-scene.js";
import type { ResolvedDocumentRoutingGeometry } from "./resolved-route-geometry.js";
import { type SchematicStyleProfile } from "./style-profile.js";
import type { VisualDiagnostic } from "./visual.js";
export declare function drawingOcclusionFindings(document: SchematicDocument, resolver: SymbolResolver, scene: ResolvedDrawingScene, styleProfile: SchematicStyleProfile, routingGeometry: ResolvedDocumentRoutingGeometry, annotationBounds: readonly {
    id: string;
    name: string;
    bounds: Rect;
}[], instanceName: (id: string) => string): VisualDiagnostic[];
