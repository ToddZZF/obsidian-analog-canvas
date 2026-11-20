import type { DerivedPoint, GridPoint, Rotation, SchematicDocument, VisualAnchor } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import { type ResolvedDocumentRoutingGeometry } from "./resolved-route-geometry.js";
export interface ResolvedAnchor {
    position: DerivedPoint;
    rotation: Rotation;
    resolved: boolean;
    /**
     * Present only when the anchor could not be resolved (deleted Route/object,
     * removed segment, non-orthogonal segment). Warning state is derived here,
     * never persisted as a boolean.
     */
    diagnostic?: AnchorDiagnostic;
}
export type AnchorDiagnosticCode = "anchor-target-missing" | "DRAFTING_ROUTE_SEGMENT_INVALID";
export interface AnchorDiagnostic {
    code: AnchorDiagnosticCode;
    message: string;
    objectId?: string;
}
/**
 * Resolve a VisualAnchor against a Document. A `route` anchor resolves against
 * canonical route geometry; an `object` anchor resolves to the target's
 * placement plus localOffset; a `free` anchor is its own position.
 */
export declare function resolveVisualAnchor(document: SchematicDocument, resolver: SymbolResolver, anchor: VisualAnchor, routingGeometry?: ResolvedDocumentRoutingGeometry): ResolvedAnchor;
/**
 * Find the placement Point of an attachable object: an Instance or Junction.
 * Junction. A DraftingObject is intentionally not a valid V1 anchor target
 * (ADR 0010: no drafting-to-drafting attachment).
 */
/**
 * The position an `object` anchor hangs off. Exported because anchor
 * resolution is not the only caller: a drag that rewrites localOffset must
 * measure against the same target this resolves, or the two disagree and the
 * dragged label renders back where it started.
 */
export declare function resolveAnchorTargetPosition(document: SchematicDocument, objectId: string): GridPoint | null;
