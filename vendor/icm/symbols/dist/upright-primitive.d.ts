import type { Orientation, Point } from "@icm/model";
import type { SymbolPrimitive } from "./schema.js";
export declare function screenUprightPrimitive(primitive: SymbolPrimitive, orientation?: Pick<Orientation, "rotation" | "mirror">, pivot?: Point): SymbolPrimitive;
/** The centre each upright mark turns about: the middle of all its strokes. */
export declare function uprightMarkPivots(primitives: readonly SymbolPrimitive[]): ReadonlyMap<string, Point>;
