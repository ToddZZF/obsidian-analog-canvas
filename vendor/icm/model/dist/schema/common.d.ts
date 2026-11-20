import { z } from "zod";
/**
 * Version of the normalized runtime/editor model.
 *
 * This is deliberately distinct from the portable Project File schema owned
 * by `@icm/project-protocol`. It is the version used by the validated model
 * that rendering, connectivity and transactions operate on; it is not the
 * value written to an `.icproj.json` file's `schemaVersion` field.
 */
export declare const CURRENT_MODEL_SCHEMA_VERSION = 58;
export declare const StableIdSchema: z.ZodString;
/** Strict persisted/presentation hex color token. Format: `#RRGGBB`. */
export declare const HexColorSchema: z.ZodString;
/** A persisted Document page point before its Document-grid relation is known. */
export declare const GridPointSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, z.core.$strict>;
/** A grid-domain rectangle. Alignment is validated with a Document grid. */
export declare const GridRectSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodNumber;
    height: z.ZodNumber;
}, z.core.$strict>;
/** Read-only renderer/diagnostic geometry. It may be fractional. */
export declare const DerivedPointSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, z.core.$strict>;
/** Read-only renderer/diagnostic bounds. Empty geometry may have zero extent. */
export declare const DerivedRectSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodNumber;
    height: z.ZodNumber;
}, z.core.$strict>;
/** Symbol-library artwork coordinates, unrelated to a Document page grid. */
export declare const SymbolLocalPointSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, z.core.$strict>;
export declare const SymbolLocalRectSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodNumber;
    height: z.ZodNumber;
}, z.core.$strict>;
export declare const PointSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, z.core.$strict>;
export declare const RectSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodNumber;
    height: z.ZodNumber;
}, z.core.$strict>;
export declare const RotationSchema: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<45>, z.ZodLiteral<90>, z.ZodLiteral<135>, z.ZodLiteral<180>, z.ZodLiteral<225>, z.ZodLiteral<270>, z.ZodLiteral<315>]>;
/** Independent screen-space reflection axes; `both` composes the two. */
export declare const MirrorSchema: z.ZodEnum<{
    both: "both";
    horizontal: "horizontal";
    none: "none";
    vertical: "vertical";
}>;
export declare const OrientationSchema: z.ZodObject<{
    rotation: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<45>, z.ZodLiteral<90>, z.ZodLiteral<135>, z.ZodLiteral<180>, z.ZodLiteral<225>, z.ZodLiteral<270>, z.ZodLiteral<315>]>;
    mirror: z.ZodEnum<{
        both: "both";
        horizontal: "horizontal";
        none: "none";
        vertical: "vertical";
    }>;
}, z.core.$strict>;
