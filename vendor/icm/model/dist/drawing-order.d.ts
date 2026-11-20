import type { DrawingOrderEntry } from "./schema/drawing-presentation.js";
import type { DraftingObject, SchematicDocument } from "./schema/types.js";
type DrawingContents = Pick<SchematicDocument, "instances" | "drafting" | "annotations" | "drawingOrder">;
export declare function draftingIsBackground(object: DraftingObject): boolean;
export declare function drawingOrderKey(entry: DrawingOrderEntry): string;
/** All drawable identities, with placement-independent Instance membership. */
export declare function drawingOrderEntries(document: DrawingContents): DrawingOrderEntry[];
/** Back to front. Reconciles existing order against the contents of a draft. */
export declare function resolveDrawingOrder(document: DrawingContents): DrawingOrderEntry[];
export {};
