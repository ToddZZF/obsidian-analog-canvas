import { schematicSerifTextMetrics } from "./schematic-serif-text-metrics.generated.js";
import { schematicTextMetrics } from "./schematic-text-metrics.generated.js";
function faceMetrics(table, style) {
    const face = table[style];
    return new Map([...table.glyphs].map((glyph, index) => [
        glyph,
        {
            advance: face.advances[index],
            left: face.bearings[index * 2],
            right: face.bearings[index * 2 + 1],
        },
    ]));
}
const tableFaces = (table) => ({
    plain: faceMetrics(table, "plain"),
    bold: faceMetrics(table, "bold"),
    italic: faceMetrics(table, "italic"),
    boldItalic: faceMetrics(table, "boldItalic"),
});
const faces = {
    metropolis: tableFaces(schematicTextMetrics),
    serif: tableFaces(schematicSerifTextMetrics),
};
function metricsFor(weight, italic, face) {
    return faces[face][italic ? (weight === "bold" ? "boldItalic" : "italic") : weight];
}
/** The round period's dot stands 0.105 em into its 0.36 em advance. */
const roundPeriod = { advance: 0.36, left: 0.105, right: 0.105 };
function glyphAdvanceEm(glyph, widths, face) {
    // The round period stands in for Metropolis's square one only.
    return glyph === "." && face === "metropolis"
        ? roundPeriod.advance
        : (widths.get(glyph)?.advance ??
            (/\p{Mark}/u.test(glyph)
                ? 0
                : /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(glyph)
                    ? 1
                    : 0.7));
}
export function schematicTextAdvanceEm(value, weight, italic = false, face = "metropolis") {
    const widths = metricsFor(weight, italic, face);
    return [...value].reduce((width, glyph) => width + glyphAdvanceEm(glyph, widths, face), 0);
}
/**
 * Where a run of schematic text puts ink, in em from where it starts: from
 * the first glyph's outline to the last one's, each glyph advancing as
 * schematicTextAdvanceEm adds them up. Italic faces supply their own advances
 * and ink bearings. A glyph the tables do not hold inks its whole advance.
 * Null for a run that draws nothing, such as a space.
 */
export function schematicTextInkEm(value, weight, italic = false, face = "metropolis") {
    const widths = metricsFor(weight, italic, face);
    let x = 0;
    let left = Infinity;
    let right = -Infinity;
    for (const glyph of value) {
        const advance = glyphAdvanceEm(glyph, widths, face);
        if (advance > 0 && !/\s/u.test(glyph)) {
            const side = glyph === "." && face === "metropolis"
                ? roundPeriod
                : (widths.get(glyph) ?? { left: 0, right: 0 });
            left = Math.min(left, x + side.left);
            right = Math.max(right, x + advance - side.right);
        }
        x += advance;
    }
    return left <= right ? { left, right } : null;
}
