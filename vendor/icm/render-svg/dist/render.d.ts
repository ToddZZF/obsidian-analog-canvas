import type { DocumentContactEvidence, ResolvedDocumentRoutingGeometry, ResolvedDrawingScene } from "@icm/derived";
import type { DerivedRect, GridRect, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
export interface SvgRenderOptions {
    /** Read-only paint filter. Geometry and electrical facts still use the full Document. */
    objectIds?: ReadonlySet<string>;
    /** Page background only; explicit object fills are preserved. */
    background?: "document" | "transparent";
    /** Explicit render crop is a caller-owned grid rectangle. */
    bounds?: GridRect;
    margin?: number;
    title?: string;
    /** Revision-scoped routing read model supplied by a shared caller. */
    routingGeometry?: ResolvedDocumentRoutingGeometry;
    /** Contact evidence paired with `routingGeometry`; never persisted. */
    contactEvidence?: DocumentContactEvidence;
}
export interface SvgScene {
    /** Formal visual bounds may include fractional text/curve geometry. */
    viewBox: DerivedRect;
    formalBody: string;
    drawingScene: ResolvedDrawingScene;
}
export declare function buildSvgScene(input: SchematicDocument, resolver: SymbolResolver, options?: SvgRenderOptions): SvgScene;
export declare function renderDocumentSvg(document: SchematicDocument, resolver: SymbolResolver, options?: SvgRenderOptions): string;
