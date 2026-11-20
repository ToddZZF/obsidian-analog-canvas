import { z } from "zod";
import { HexColorSchema, StableIdSchema } from "./common.js";
export const BodyFillSchema = z.discriminatedUnion("kind", [
    z.strictObject({ kind: z.literal("background") }),
    z.strictObject({ kind: z.literal("color"), color: HexColorSchema }),
]);
export const DrawingOrderEntrySchema = z.discriminatedUnion("kind", [
    z.strictObject({ kind: z.literal("instance"), id: StableIdSchema }),
    z.strictObject({ kind: z.literal("annotation"), id: StableIdSchema }),
    z.strictObject({ kind: z.literal("drafting"), id: StableIdSchema }),
    z.strictObject({ kind: z.literal("electrical") }),
    z.strictObject({ kind: z.literal("circuit-marks") }),
]);
