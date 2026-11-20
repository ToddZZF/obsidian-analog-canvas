import type { DraftingObject, Point, RichTextDocument } from "./schema.js";
type DraftText = Extract<DraftingObject, {
    kind: "text";
}>;
/** Shared insertion defaults; explicit RichText is never restyled. */
export declare function createDraftText(options: {
    id: string;
    position: Point;
    content: string | RichTextDocument;
    alignment?: DraftText["alignment"] | undefined;
    rotation?: DraftText["rotation"] | undefined;
}): DraftText;
export {};
