import type { DrawingOrderEntry } from "@icm/model";
/** Owned annotations immediately above their instance in the paint order. */
export declare function gatheredDrawingLabelOwners(order: readonly DrawingOrderEntry[], owners: ReadonlyMap<string, string>): ReadonlyMap<string, string>;
