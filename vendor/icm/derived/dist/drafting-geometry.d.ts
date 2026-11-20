import type { DerivedPoint, DerivedRect, DraftingObject, Rotation, RichTextDocument, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import { type ResolvedDocumentRoutingGeometry } from "./resolved-route-geometry.js";
import { measureRichTextDocument, richTextMetrics } from "./rich-text-layout.js";
import { type SchematicStyleProfile } from "./style-profile.js";
export type DraftingAnchorRole = "anchor" | "from" | "to" | "target";
export interface DraftingDiagnostic {
    code: "DRAFTING_ANCHOR_TARGET_MISSING" | "DRAFTING_ROUTE_SEGMENT_INVALID" | "DRAFTING_SYMBOL_UNRESOLVED";
    severity: "warning";
    draftingObjectId: string;
    anchorRole: DraftingAnchorRole;
    targetObjectIds: string[];
    message: string;
    bounds?: DerivedRect;
}
export type ResolvedDraftingGeometry = {
    kind: "text";
    /** Rotation pivot and stable placement anchor for the whole object. */
    position: DerivedPoint;
    /** Center of the editable text, which may shift between polarity marks. */
    textPosition: DerivedPoint;
    /** Layout bearing for multipart notation. Text and marks stay upright. */
    rotation: Rotation;
    polarityLines: Array<{
        role: "positive-horizontal" | "positive-vertical" | "negative";
        from: DerivedPoint;
        to: DerivedPoint;
    }>;
    bounds: DerivedRect;
    diagnostics: DraftingDiagnostic[];
} | {
    kind: "arrow";
    from: DerivedPoint;
    to: DerivedPoint;
    points: DerivedPoint[];
    vertices: DerivedPoint[];
    curveControls: Array<DerivedPoint | null>;
    center: DerivedPoint;
    bounds: DerivedRect;
    diagnostics: DraftingDiagnostic[];
} | {
    kind: "leader";
    anchor: DerivedPoint;
    target: DerivedPoint;
    bounds: DerivedRect;
    diagnostics: DraftingDiagnostic[];
} | {
    kind: "callout";
    textPosition: DerivedPoint;
    target: DerivedPoint;
    rotation: Rotation;
    textBounds: DerivedRect;
    bounds: DerivedRect;
    diagnostics: DraftingDiagnostic[];
} | {
    kind: "construction-line";
    points: DerivedPoint[];
    vertices: DerivedPoint[];
    curveControls: Array<DerivedPoint | null>;
    bounds: DerivedRect;
    diagnostics: [];
} | {
    kind: "rectangle";
    center: DerivedPoint;
    width: number;
    height: number;
    rotation: number;
    corners: DerivedPoint[];
    bounds: DerivedRect;
    diagnostics: [];
} | {
    kind: "circle";
    center: DerivedPoint;
    radius: number;
    bounds: DerivedRect;
    diagnostics: [];
} | {
    kind: "floating-symbol";
    position: DerivedPoint;
    rotation: Rotation;
    bounds: DerivedRect;
    diagnostics: DraftingDiagnostic[];
};
/**
 * The content a drafting text actually lays out.
 *
 * A label anchored to a rectangle is a label *inside a box*, so it wraps to
 * that box instead of running out past its edges. Every other text keeps the
 * author's own lines exactly. The SVG renderer calls this too: one wrapped
 * document for both is what keeps the selection box on the text it frames,
 * rather than two implementations agreeing by luck.
 */
export declare function draftTextLayoutContent(document: SchematicDocument, object: Extract<DraftingObject, {
    kind: "text";
}>, metrics: Parameters<typeof measureRichTextDocument>[1]): RichTextDocument;
export declare function resolveDraftingObjectGeometry(document: SchematicDocument, resolver: SymbolResolver, object: DraftingObject, resolvedRoutingGeometry?: ResolvedDocumentRoutingGeometry): ResolvedDraftingGeometry;
/**
 * The turn a drawing text's glyphs take about its anchor: a free text at a
 * quarter turn reads down (90) or up (270) the page. At any other turn, and
 * with polarity marks, the glyphs stay upright, as all other text does.
 */
export declare function draftTextTurn(object: Extract<DraftingObject, {
    kind: "text";
}>): 0 | 90 | 270;
/**
 * Free drawing text that draws words: polarity marks, which stand at
 * terminals on purpose, and blank text are left out. Findings about text
 * over a label or a wire look at these (#1323).
 */
export declare function drawnFreeTexts(document: SchematicDocument): Extract<DraftingObject, {
    kind: "text";
}>[];
/**
 * What a free text's words draw, capitals to subscripts, as a label's
 * inkBounds: its line box's empty ascent and descent left out. Text with
 * polarity marks, a formula or a turn keeps its bounds.
 */
export declare function resolveDraftingTextInkBounds(document: SchematicDocument, resolver: SymbolResolver, object: Extract<DraftingObject, {
    kind: "text";
}>, routingGeometry: ResolvedDocumentRoutingGeometry): DerivedRect;
export declare function resolvePolarityTextGeometry(position: DerivedPoint, polarity: "both" | "positive" | "negative", content: RichTextDocument, metrics: ReturnType<typeof richTextMetrics>, rotation: Rotation, alignment?: "start" | "middle" | "end"): {
    textPosition: DerivedPoint;
    lines: Extract<ResolvedDraftingGeometry, {
        kind: "text";
    }>["polarityLines"];
};
/**
 * First-line baseline that centers the painted line grid on `centerY`. Line
 * breaks step a constant `lineHeight` em (see the renderer's renderRuns), so
 * the painted grid spans (lineCount - 1) steps regardless of inline fraction
 * extents.
 */
export declare function centeredFirstBaselineY(content: RichTextDocument, centerY: number, fontSize: number, profile: SchematicStyleProfile): number;
