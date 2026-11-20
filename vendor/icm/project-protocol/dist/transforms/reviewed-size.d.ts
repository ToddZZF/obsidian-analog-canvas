import type { CircuitProject } from "@icm/model";
/**
 * Give every part bound to a device its library models only at a few sizes
 * (SKY130's 16 V pair) a size it models, when its own is none.
 *
 * From #1194 until #1484 a DMOS placed in a SKY130 circuit took the 16 V
 * device at the catalog's W 1 µm / L 0.15 µm, which no simulator can run, and
 * a typed W or L could leave one at any size. Each such part now takes the
 * changes `reviewedModelledSizeChanges` gives: the device's own W, else its
 * own L, else both; an expression stays as written. Edits keep that true from
 * here on (#1485).
 *
 * This runs on every load rather than as a numbered migration step, like the
 * misdrawn-binding repair: a size its library has no model for is never
 * runnable, whichever version or client wrote the file.
 */
export declare function repairUnmodelledReviewedSizes(project: CircuitProject): CircuitProject;
