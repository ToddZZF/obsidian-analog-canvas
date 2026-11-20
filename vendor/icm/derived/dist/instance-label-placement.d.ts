import { type InstanceParameterResolver } from "@icm/devices";
import type { Annotation, Point, Rect, SchematicDocument } from "@icm/model";
import type { ResolvedSymbol } from "@icm/symbols";
import { type SchematicStyleProfile } from "./style-profile.js";
import { visibleSymbolInkBounds } from "./visual.js";
import { LABEL_CAP_HEIGHT_EM } from "./text-ink.js";
export interface InstanceLabelPlacement {
    readonly position: Point;
    readonly alignment: "start" | "middle" | "end";
}
export type InstanceLabelSide = "left" | "right" | "top" | "bottom";
/** A part's sides in the order labels try them. */
export declare const INSTANCE_LABEL_SIDES: readonly InstanceLabelSide[];
/**
 * The upright rows of a part's name and value on one side of it, the name
 * read first and its value under it (#1384): the Reference's slot, which a
 * name or a value shown alone takes; the value's, under the Reference; and
 * the Reference's over a shown value, a value row further out above the
 * part and the Reference's slot elsewhere.
 */
export type InstanceLabelSlot = "reference" | "value" | "reference-over-value";
/**
 * Vertical distance between the reference row and the value row: the
 * smallest whole grid multiple of at least 1.2 em, so a value stays next to
 * its part (#1105) and snapping cannot pull the two rows into each other.
 */
export declare function instanceLabelRowOffset(profile: SchematicStyleProfile, grid: number): number;
/**
 * The row distance until 2026-10-04, 1.35 em rounded up to the grid (a whole
 * extra grid step at the default size). Labels still there count as
 * untouched, so they keep following their part.
 */
export declare function previousInstanceLabelRowOffset(profile: SchematicStyleProfile, grid: number): number;
/**
 * Row distance between a part's reference and its value. A stacked W/L
 * fraction reaches a numerator above its baseline and a denominator below
 * it, so at one text row its numerator ran into the reference's subscript
 * (M₂ over 10u, #1299). Its row keeps the label gap on both sides: under a
 * reference, between the numerator's capitals and the subscript; over one,
 * between the denominator and the reference's capitals. Every other value
 * keeps one text row (instanceLabelRowOffset).
 */
export declare function instanceValueRowOffset(symbolId: string, profile: SchematicStyleProfile, grid: number): number;
export declare function isMosSymbol(resolved: ResolvedSymbol): boolean;
export declare function isBjtSymbol(resolved: ResolvedSymbol): boolean;
/**
 * True when the Symbol draws a polarity-marked differential input pair, so a
 * caller can offer "swap + / −" as a named action. The swap itself is the
 * ordinary top/bottom reflection: the marks are artwork, and the terminals
 * move with them, so the electrical fact and the drawing stay in agreement.
 */
export declare function hasDifferentialInputs(resolved: ResolvedSymbol): boolean;
/**
 * Canonical upright Net-name label of a supply port. On the reviewed VDD
 * Port artwork the label stays on the world-right side after rotation or
 * mirror, so the glyph never follows the symbol into its bar or stem. A
 * Named Ground shows its name centred beyond its bars, away from its pin
 * (below them as drawn upright), where RNL's `$NAMED_GROUND_SYMBOL` puts it.
 */
export declare function defaultVddPowerLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, grid: number): InstanceLabelPlacement | null;
export declare function inferInstanceLabelSide(localAnchor: Point, localBounds: Rect): InstanceLabelSide | null;
/**
 * The drawn extent a label keeps its distance from. A path without declared
 * bounds contributes the hull of its absolute M/L/C points (Z closes it
 * without adding any) instead of the Symbol's padded viewBox, which left a
 * delay cell's label 15 units from its box.
 */
export declare function instanceLabelInkBounds(resolved: ResolvedSymbol, signalFlowParameters?: Parameters<typeof visibleSymbolInkBounds>[1]): Rect;
/** Clearance between a label's ink and its Symbol's drawn ink, in drawing units. */
export declare const INSTANCE_LABEL_GAP = 4;
export { LABEL_CAP_HEIGHT_EM };
/**
 * The distances the placement rule works with, in drawing units: the gap,
 * the height of the label's capitals, and how far a subscript's figures reach
 * below its baseline.
 */
export declare function instanceLabelMetrics(profile: SchematicStyleProfile, sizeScale?: number): {
    gap: number;
    capHeight: number;
    subscriptDrop: number;
};
/**
 * Places horizontal SVG text around the active symbol variant, the same way
 * for every family: the label's ink keeps INSTANCE_LABEL_GAP from the drawn
 * artwork on whichever side it sits. Beside the Symbol its capitals are
 * centred on the body; below, the capitals start one gap under it; above,
 * the subscript's descent is cleared first, so M₂ or R₂ over a part never
 * touches it. The position is not snapped to the connection grid: rounding
 * the gap to a grid step is what left gates, registers and blocks 10 to 26
 * units away while devices sat at 5.
 *
 * A name reads before its value on every side (#1384). Beside or below the
 * part the value's row is under the name's. Above it the group stands on
 * its last row, the one nearest the part: the value, or a label shown
 * alone, stands there, a W/L fraction far enough out to clear the part, and
 * a name over its value stands a value row further out. A value row is the
 * part's own value's, a W/L fraction's taller one; a group whose value is
 * plain text, as a MOS's ×m shown for its hidden W/L is, passes one text
 * row as `valueRow` (#1434).
 */
export declare function placeUprightInstanceLabel(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, localAnchor: Point, localSide: InstanceLabelSide, grid: number, sizeScale?: number, slot?: InstanceLabelSlot, valueRow?: number): InstanceLabelPlacement | null;
/**
 * The upright placer until 2026-10-06: above the part a value row stood a
 * row further out than its name (#1384). Labels still where it put them,
 * by default or by an arrangement, count as untouched.
 * @internal Tests place labels where the old placer did.
 */
export declare function outwardPlaceUprightInstanceLabel(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, localAnchor: Point, localSide: InstanceLabelSide, grid: number, sizeScale?: number, slot?: InstanceLabelSlot): InstanceLabelPlacement | null;
/**
 * Where a Cell Pin's name may go, best first: the side away from its wire,
 * then the two sides across the Pin. A name that would collide on the first
 * side takes the next one (#1105); the side toward the wire is never offered.
 */
export declare function portLabelCandidates(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number): InstanceLabelPlacement[];
/**
 * Where a vertical Cell Pin's name was placed from 2026-09-24 to 2026-09-29:
 * a whole grid step above or below its artwork. Labels still sitting there
 * count as untouched, so they keep following their Pin.
 */
export declare function previousPortLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number): InstanceLabelPlacement | null;
/**
 * Where a Cell Pin's name under its artwork was placed from 2026-09-29 to
 * 2026-10-08: half a grid step and 0.7 em below it, which let its capitals
 * touch the circle (#1529). Labels still sitting there count as untouched.
 */
export declare function shallowPortLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number): InstanceLabelPlacement | null;
/**
 * Where a Cell Pin's name was placed before 2026-09-24: always beside the
 * Pin, snapped to the grid, at the height of its rotated anchor. Labels still
 * sitting there count as untouched, so they keep following their Pin.
 */
export declare function legacyPortLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number): InstanceLabelPlacement | null;
/**
 * Supplies canonical placement for renderer-owned instance labels, for a
 * label of the given size (a label a person made smaller sits closer), in
 * one of its group's slots on the part's default side, its value
 * `valueRow` under its name as placeUprightInstanceLabel reads it.
 */
export declare function defaultInstanceLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number, slot?: InstanceLabelSlot, sizeScale?: number, valueRow?: number): InstanceLabelPlacement | null;
/**
 * Where the rule until 2026-10-06 put an untouched value above its part: a
 * row further out than its name, so it read before the name (#1384). Beside
 * and below a part it is the current rule. Such a value still counts as
 * untouched, so an orientation edit or an arrangement puts it under its name.
 */
export declare function outwardDefaultInstanceLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number, slot?: InstanceLabelSlot, sizeScale?: number): InstanceLabelPlacement | null;
/**
 * Where the rule until 2026-10-05 put an untouched value: the current sides
 * and one text row under the reference for every part, a stacked W/L
 * fraction included (#1299); above a part, a row further out than its name.
 * Such a value still counts as untouched, so an orientation edit moves it to
 * the current row.
 */
export declare function uniformRowDefaultInstanceLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number, slot?: InstanceLabelSlot, sizeScale?: number): InstanceLabelPlacement | null;
/**
 * Where the rule from 2026-09-25 to 2026-10-04 put an untouched label: the
 * current sides, with the wider row distance under the reference.
 */
export declare function previousDefaultInstanceLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number, slot?: InstanceLabelSlot, sizeScale?: number): InstanceLabelPlacement | null;
/**
 * Where the placement rule before 2026-09-25 put an untouched label, so an
 * orientation edit still recognizes it as machine-placed and moves it with
 * the current rule.
 */
export declare function legacyDefaultInstanceLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number, slot?: InstanceLabelSlot, sizeScale?: number): InstanceLabelPlacement | null;
/**
 * How far a label stands from `placement`, or null when it stands
 * elsewhere: it keeps the placement's alignment and stands on it, or, with
 * `slides`, anywhere along the side of the part the placement is on.
 */
export declare function offsetFromPlacement(label: InstanceLabelPlacement, placement: InstanceLabelPlacement | null, slides?: boolean): Point | null;
/**
 * The side of its part and the slot of its group a label of this size
 * stands in, as the upright placer puts it, or null.
 */
export declare function instanceLabelSlotAt(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number, label: InstanceLabelPlacement, sizeScale?: number): {
    side: InstanceLabelSide;
    slot: InstanceLabelSlot;
} | null;
/** A part's name or value as drawn, read as one of its group. */
export interface InstanceGroupLabel extends InstanceLabelPlacement {
    readonly profile: SchematicStyleProfile;
    readonly sizeScale: number;
    readonly shows: boolean;
}
/**
 * A part's name or value annotation read as one of its group, its part
 * placed at `partPosition`, or null for one not attached to its part.
 */
export declare function instanceGroupLabel(document: SchematicDocument, annotation: Annotation, partPosition: Point): InstanceGroupLabel | null;
/**
 * Where a part's name and value stand together: the side of the part, as
 * drawn, and how far they are slid along it.
 */
export interface InstanceLabelGroupSeat {
    readonly side: InstanceLabelSide;
    readonly shift: Point;
}
/**
 * The seat of a part's name and value when they stand as one group in the
 * slots the upright placer gives them on a side of the part, slid alike
 * along it with `slides`, or null when either stands anywhere else.
 * `stacks` reads a name first and its value under it, or a value standing
 * over its name above the part as the outward placer stacked them, or
 * either.
 */
export declare function instanceLabelGroupSeat(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, grid: number, name: InstanceGroupLabel, value: InstanceGroupLabel, { stacks, slides, }?: {
    stacks?: "any" | "value-over-name";
    slides?: boolean;
}): InstanceLabelGroupSeat | null;
/**
 * Where a part's name and value stand on `seat`, name first and its value
 * under it: a label shown without the other takes the name's slot, and a
 * hidden one waits where it stands when shown. Null when no side of the
 * part faces the seat's side.
 */
export declare function seatedInstanceLabelGroup(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, grid: number, seat: InstanceLabelGroupSeat, name: InstanceGroupLabel, value: InstanceGroupLabel): {
    name: InstanceLabelPlacement;
    value: InstanceLabelPlacement;
} | null;
export declare function defaultInstanceParameterLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number, parameter: string, resolver?: InstanceParameterResolver): InstanceLabelPlacement | null;
/** Where the rule until 2026-10-04 put a parameter's value: the current
 * parts and sides, rows apart by the wider row distance. */
export declare function previousDefaultInstanceParameterLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number, parameter: string, resolver?: InstanceParameterResolver): InstanceLabelPlacement | null;
/**
 * The placement rule used until 2026-09-26, and still on a diagonal: every
 * value in one column beside the whole Symbol. Labels still exactly there
 * count as untouched, so they keep following their Symbol.
 */
export declare function legacyDefaultInstanceParameterLabelPlacement(instance: SchematicDocument["instances"][number], resolved: ResolvedSymbol, profile: SchematicStyleProfile, grid: number, parameter: string): InstanceLabelPlacement | null;
