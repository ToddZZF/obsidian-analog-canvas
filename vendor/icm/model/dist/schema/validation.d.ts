import type { z } from "zod";
/** Shared strict-schema validation primitive for ID-addressable collections. */
export declare function reportDuplicateIds(entries: ReadonlyArray<{
    id: string;
}>, path: string, context: z.RefinementCtx): void;
