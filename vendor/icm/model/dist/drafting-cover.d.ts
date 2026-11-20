import type { CircuitProject, DraftingObject } from "./schema.js";
/** The sheet-colored stroke or fill by which an object would cover, if any. */
export declare function draftingCoverColor(object: Pick<DraftingObject, "styleOverride"> | undefined): string | null;
/** The first drafting object in a Project that would cover its drawing. */
export declare function projectDraftingCover(project: Pick<CircuitProject, "documents">): {
    documentId: string;
    objectId: string;
    color: string;
} | null;
/** What a writer is told when a drafting object would cover the drawing. */
export declare function draftingCoverMessage(objectId: string, color: string): string;
