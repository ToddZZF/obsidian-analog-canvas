import type { Annotation, DerivedPoint, DerivedRect, RichTextDocument, Rotation, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import { type ResolvedAnchor } from "./anchor.js";
import { labelInkDescentEm } from "./text-ink.js";
import { type ResolvedDocumentRoutingGeometry } from "./resolved-route-geometry.js";
import { type SchematicStyleProfile } from "./style-profile.js";
import type { ResolvedDocumentLogicalNets } from "./logical-net.js";
/** Shared SVG, editor-hit, marquee, and export presentation of an annotation. */
export interface AnnotationPresentation {
    readonly anchor: ResolvedAnchor;
    /** Visible SVG text baseline; never substitute fallback while resolved. */
    readonly position: DerivedPoint;
    readonly rotation: Rotation;
    readonly alignment: "start" | "middle" | "end";
    readonly bounds: DerivedRect;
    /**
     * The extent label placement keeps clear of a part: capitals above the
     * baseline and a subscript's figures below it, with a stacked fraction's
     * rise and any further lines, and across from the first glyph's outline
     * to the last one's as the label advance tables set them. `bounds`
     * reserves the font's whole ascent and a descender, most of it empty over
     * capitals.
     */
    readonly inkBounds: DerivedRect;
}
/**
 * Shared canvas/export visibility policy for persisted annotations. A retained
 * Instance keeps its object-anchored labels for a later re-placement, but its
 * labels are not floating drawing objects while the Instance is in the Tray.
 * Formal Cell Pins use their terminal name as their sole visible identity.
 *
 * An annotation with no resolved text is not visible either. It paints no
 * glyph, so anything the canvas hangs on it — a hit box, a marquee target — is
 * a control nobody can see. Empty text is always a projection that came back
 * with nothing (a designator for an Instance the device registry gives no
 * reference prefix, a value the Instance does not carry), never something a
 * person authored: `proposeTextEditingCommit` deletes an annotation the moment
 * its content is emptied, and an open editing session holds its text in the
 * session rather than in the annotation. So there is no empty-but-wanted
 * annotation to exempt, including one mid-edit.
 */
export declare function isSchematicAnnotationVisible(document: SchematicDocument, annotation: Annotation, logicalNets?: ResolvedDocumentLogicalNets, resolvedText?: RichTextDocument, resolver?: SymbolResolver): boolean;
export { labelInkDescentEm };
export declare function resolveAnnotationPresentation(document: SchematicDocument, resolver: SymbolResolver, annotation: Annotation, documentProfile: SchematicStyleProfile, routingGeometry?: ResolvedDocumentRoutingGeometry, logicalNets?: ResolvedDocumentLogicalNets, resolvedText?: RichTextDocument): AnnotationPresentation;
