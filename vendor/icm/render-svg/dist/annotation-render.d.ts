import type { AnnotationPresentation, ResolvedDocumentRoutingGeometry, SchematicStyleProfile } from "@icm/derived";
import type { Annotation, Point, RichTextDocument, Rotation, SchematicDocument } from "@icm/model";
/** One render-call projection shared by formal bounds and SVG painting. */
export interface ResolvedSvgAnnotation {
    annotation: Annotation;
    content: RichTextDocument;
    presentation: AnnotationPresentation;
}
export declare function renderAnnotationText(content: RichTextDocument, annotation: Annotation, profile: SchematicStyleProfile): string;
/**
 * Paint one top-level fraction and its ordinary styled companions as siblings.
 * SVG forbids the fraction's line inside a <text>, so the generic inline path
 * cannot preserve its bar. Explicit x positions keep the bar and continuation
 * on the same measured line without changing the canonical RichText AST.
 */
export declare function renderPositionedFractionAnnotation(content: RichTextDocument, options: {
    attributes: string;
    position: Point;
    alignment: "start" | "middle" | "end";
    fontSize: number;
    color?: string;
    profile: SchematicStyleProfile;
}): string | null;
export declare function rotateOffset(offset: {
    x: number;
    y: number;
}, rotation: SchematicDocument["annotations"][number]["rotation"]): {
    x: number;
    y: number;
};
/** Where a route marker is drawn: its arrow or sign, and its text. */
export declare function drawnRouteMarkerPlacement(annotation: Annotation, presentation: AnnotationPresentation, routingGeometry: ResolvedDocumentRoutingGeometry): {
    position: Point;
    labelPosition: Point;
    rotation: Rotation;
} | null;
