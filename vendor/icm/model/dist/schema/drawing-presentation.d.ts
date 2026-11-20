import { z } from "zod";
export declare const BodyFillSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"background">;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"color">;
    color: z.ZodString;
}, z.core.$strict>], "kind">;
export type BodyFill = z.infer<typeof BodyFillSchema>;
export declare const DrawingOrderEntrySchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"instance">;
    id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"annotation">;
    id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"drafting">;
    id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"electrical">;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"circuit-marks">;
}, z.core.$strict>], "kind">;
export type DrawingOrderEntry = z.infer<typeof DrawingOrderEntrySchema>;
export type DrawingObjectEntry = Extract<DrawingOrderEntry, {
    id: string;
}>;
