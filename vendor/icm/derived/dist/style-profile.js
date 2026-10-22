import { razaviPeripheralGeometry } from "./razavi-peripheral-geometry.generated.js";
import { withSchematicRoundPeriodFont } from "./schematic-font.js";
/**
 * The serif choice's stack (#1725): ICM Serif, the served subset of
 * Liberation Serif; Liberation Serif or Times New Roman where a viewer has
 * them and not ICM Serif; DejaVu Sans for symbols none of them draw.
 */
export const SERIF_FONT_FAMILY = "'ICM Serif','Liberation Serif','Times New Roman',Times,'DejaVu Sans',serif";
/** The one typography system shared by all presentation profiles. */
export const globalSchematicTypography = {
    fontFamily: withSchematicRoundPeriodFont("'Metropolis','DejaVu Sans',Arial,'Helvetica Neue',Helvetica,sans-serif"),
    mathWeight: 700,
    mathStyle: "italic",
    plainWeight: 400,
    instanceFontSize: 15.116,
    netFontSize: 15.116,
    powerFontSize: 15.116,
    annotationFontSize: 15.116,
    polarityFontSize: 14,
    captionFontSize: 14,
    subscriptScale: 0.76,
    subscriptBaselineShiftEm: 0.44,
    subscriptHorizontalGapEm: 0.046,
    labelGap: 6,
    lineHeight: 1,
};
export const razaviTextbookProfile = {
    id: "razavi-textbook-v1",
    foreground: "#000",
    background: "#fff",
    strokes: {
        wire: 1.6,
        symbol: 1.6,
        normal: 1.6,
        emphasis: 2.4,
        ground: razaviPeripheralGeometry.groundBarStroke,
        supply: 1.8,
        // Matches the 3.24-unit filled horizontal bar in the reviewed VDD Symbol.
        powerRail: 3.24,
        annotation: 1.6,
    },
    nodes: {
        junctionRadius: razaviPeripheralGeometry.solidNodeRadius,
    },
    annotations: {
        supplyBarWidth: 20,
        currentArrowLength: razaviPeripheralGeometry.currentArrowLength,
        arrowHeadLength: razaviPeripheralGeometry.arrowHeadLength,
        arrowHeadWidth: razaviPeripheralGeometry.arrowHeadWidth,
        currentLabelGap: razaviPeripheralGeometry.currentLabelGap,
        polarityOffsetX: 12,
        polarityHalfGap: 8,
    },
    lineCap: "butt",
    lineJoin: "miter",
    miterLimit: 4,
    typography: globalSchematicTypography,
};
const profiles = new Map([
    [razaviTextbookProfile.id, razaviTextbookProfile],
]);
export function resolveSchematicStyleProfile(profileId) {
    const profile = profiles.get(profileId);
    if (!profile)
        throw new Error(`Unknown schematic style profile: ${profileId}`);
    return profile;
}
const overriddenProfiles = new WeakMap();
const serifProfiles = new WeakMap();
/** `profile` set in the serif face, one object per profile. */
function withSerifFace(profile) {
    const cached = serifProfiles.get(profile);
    if (cached)
        return cached;
    const serif = {
        ...profile,
        typography: {
            ...profile.typography,
            face: "serif",
            fontFamily: SERIF_FONT_FAMILY,
        },
    };
    serifProfiles.set(profile, serif);
    return serif;
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
export function resolveDocumentStyleProfile(presentation) {
    const scaled = scaledDocumentStyleProfile(presentation);
    // One face for the whole canvas: the serif when the Document chose it.
    return presentation.textFace === "serif" ? withSerifFace(scaled) : scaled;
}
function scaledDocumentStyleProfile(presentation) {
    const base = resolveSchematicStyleProfile(presentation.styleProfileId);
    const overrides = presentation.styleOverrides;
    if (!overrides)
        return base;
    const cached = overriddenProfiles.get(overrides);
    if (cached && cached.id === base.id)
        return cached;
    const font = overrides.fontScale ?? 1;
    const wire = overrides.wireStrokeScale ?? 1;
    const symbol = overrides.symbolStrokeScale ?? 1;
    const annotation = overrides.annotationStrokeScale ?? 1;
    const junction = overrides.junctionRadiusScale ?? 1;
    const profile = {
        ...base,
        strokes: {
            ...base.strokes,
            wire: base.strokes.wire * wire,
            symbol: base.strokes.symbol * symbol,
            normal: base.strokes.normal * symbol,
            emphasis: base.strokes.emphasis * symbol,
            ground: base.strokes.ground * symbol,
            supply: base.strokes.supply * symbol,
            powerRail: base.strokes.powerRail * symbol,
            annotation: base.strokes.annotation * annotation,
        },
        nodes: {
            ...base.nodes,
            junctionRadius: base.nodes.junctionRadius * junction,
        },
        typography: {
            ...base.typography,
            instanceFontSize: base.typography.instanceFontSize * font,
            netFontSize: base.typography.netFontSize * font,
            powerFontSize: base.typography.powerFontSize * font,
            annotationFontSize: base.typography.annotationFontSize * font,
            polarityFontSize: base.typography.polarityFontSize * font,
            captionFontSize: base.typography.captionFontSize * font,
        },
    };
    overriddenProfiles.set(overrides, profile);
    return profile;
}
/**
 * The profile one object draws with: its Document's resolved profile, unless
 * the object keeps the Document style of the drawing it was copied from. The
 * kept factors replace the Document's; only the base profile is shared.
 */
export function objectStyleProfile(documentProfile, object) {
    const kept = object?.documentStyle;
    return kept
        ? resolveDocumentStyleProfile({
            styleProfileId: documentProfile.id,
            styleOverrides: kept,
            // A kept style scales; the face stays the canvas's.
            ...(documentProfile.typography.face === "serif"
                ? { textFace: "serif" }
                : {}),
        })
        : documentProfile;
}
const DOCUMENT_STYLE_FACTORS = [
    "fontScale",
    "wireStrokeScale",
    "symbolStrokeScale",
    "annotationStrokeScale",
    "junctionRadiusScale",
];
/**
 * Whether two objects draw alike. An absent kept style follows the Document,
 * so it equals only another absent one; present factors compare with 1 for
 * any factor left out.
 */
export function sameDocumentStyle(left, right) {
    if (!left || !right)
        return !left && !right;
    return DOCUMENT_STYLE_FACTORS.every((factor) => (left[factor] ?? 1) === (right[factor] ?? 1));
}
export function strokeWidthForRole(profile, role) {
    return profile.strokes[role];
}
export function resolvePrimitiveStrokeWidth(profile, role, explicitWidth) {
    if (role !== undefined)
        return strokeWidthForRole(profile, role);
    return explicitWidth;
}
