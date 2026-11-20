import type { SymbolStrokeRole } from "@icm/symbols";
import type { DocumentTextFace } from "@icm/model";
import type { SchematicTextFace } from "./fraction-text-metrics.js";
export interface SchematicStyleProfile {
    readonly id: "razavi-textbook-v1";
    readonly foreground: string;
    readonly background: string;
    readonly strokes: {
        readonly wire: number;
        readonly symbol: number;
        readonly normal: number;
        readonly emphasis: number;
        readonly ground: number;
        readonly supply: number;
        readonly powerRail: number;
        readonly annotation: number;
    };
    readonly nodes: {
        readonly junctionRadius: number;
    };
    readonly annotations: {
        readonly supplyBarWidth: number;
        readonly currentArrowLength: number;
        readonly arrowHeadLength: number;
        readonly arrowHeadWidth: number;
        readonly currentLabelGap: number;
        readonly polarityOffsetX: number;
        readonly polarityHalfGap: number;
    };
    readonly lineCap: "butt" | "round" | "square";
    readonly lineJoin: "miter" | "round" | "bevel";
    readonly miterLimit: number;
    readonly typography: SchematicTypography;
}
export interface SchematicTypography {
    readonly fontFamily: string;
    readonly mathWeight: number;
    readonly mathStyle: "italic";
    readonly plainWeight: number;
    readonly instanceFontSize: number;
    readonly netFontSize: number;
    readonly powerFontSize: number;
    readonly annotationFontSize: number;
    readonly polarityFontSize: number;
    readonly captionFontSize: number;
    readonly subscriptScale: number;
    readonly subscriptBaselineShiftEm: number;
    readonly subscriptHorizontalGapEm: number;
    readonly labelGap: number;
    readonly lineHeight: number;
    /** The face text is set and measured in; Metropolis when absent. */
    readonly face?: SchematicTextFace;
}
/**
 * The serif choice's stack (#1725): ICM Serif, the served subset of
 * Liberation Serif; Liberation Serif or Times New Roman where a viewer has
 * them and not ICM Serif; DejaVu Sans for symbols none of them draw.
 */
export declare const SERIF_FONT_FAMILY = "'ICM Serif','Liberation Serif','Times New Roman',Times,'DejaVu Sans',serif";
/**
 * The stack of each face a Document may choose instead of Metropolis
 * (#1725): its served subset first (ICM Serif, ICM Sans, ICM Modern), then
 * the face under its own name and the face it shares metrics with where a
 * viewer has them and not the subset, then DejaVu Sans for symbols none of
 * them draw.
 */
export declare const DOCUMENT_TEXT_FACE_FONT_FAMILIES: Readonly<Record<DocumentTextFace, string>>;
/** The one typography system shared by all presentation profiles. */
export declare const globalSchematicTypography: SchematicTypography;
export declare const razaviTextbookProfile: SchematicStyleProfile;
export declare function resolveSchematicStyleProfile(profileId: string): SchematicStyleProfile;
/**
 * Presentation intent slice the document-level resolver consumes. Matches
 * `PresentationIntent` structurally so callers pass `document.presentation`.
 */
export interface StyleOverridablePresentation {
    readonly styleProfileId: string;
    readonly styleOverrides?: {
        readonly fontScale?: number | undefined;
        readonly wireStrokeScale?: number | undefined;
        readonly symbolStrokeScale?: number | undefined;
        readonly annotationStrokeScale?: number | undefined;
        readonly junctionRadiusScale?: number | undefined;
    } | undefined;
    /** The whole canvas's face; Metropolis when absent (#1725). */
    readonly textFace?: DocumentTextFace | undefined;
}
/**
 * The document-facing profile resolution: the approved base profile with the
 * persisted `styleOverrides` scales composed on top. Absent overrides return
 * the base profile object itself, so untouched documents render
 * byte-identically. Font scale applies to the whole typography system; wire,
 * symbol-artwork, and drafting/annotation strokes and the junction-dot
 * radius scale independently. Results are cached per persisted overrides
 * object so repeated resolutions stay referentially stable.
 */
export declare function resolveDocumentStyleProfile(presentation: StyleOverridablePresentation): SchematicStyleProfile;
/** A drawn object that may keep the Document style of a copy's source. */
export interface DocumentStyleKeeper {
    readonly documentStyle?: StyleOverridablePresentation["styleOverrides"];
}
/**
 * The profile one object draws with: its Document's resolved profile, unless
 * the object keeps the Document style of the drawing it was copied from. The
 * kept factors replace the Document's; only the base profile is shared.
 */
export declare function objectStyleProfile(documentProfile: SchematicStyleProfile, object: DocumentStyleKeeper | undefined): SchematicStyleProfile;
/**
 * Whether two objects draw alike. An absent kept style follows the Document,
 * so it equals only another absent one; present factors compare with 1 for
 * any factor left out.
 */
export declare function sameDocumentStyle(left: DocumentStyleKeeper["documentStyle"], right: DocumentStyleKeeper["documentStyle"]): boolean;
export declare function strokeWidthForRole(profile: SchematicStyleProfile, role: SymbolStrokeRole): number;
export declare function resolvePrimitiveStrokeWidth(profile: SchematicStyleProfile, role: SymbolStrokeRole | undefined, explicitWidth: number | undefined): number | undefined;
