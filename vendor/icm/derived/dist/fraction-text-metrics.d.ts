import type { DocumentTextFace } from "@icm/model";
/**
 * The face a Document's text is set in: Metropolis, or one a Document may
 * choose instead (#1725), each measured from its own tables: Liberation Serif
 * (served as ICM Serif), Liberation Sans (ICM Sans) or Latin Modern Roman
 * (ICM Modern).
 */
export type SchematicTextFace = "metropolis" | DocumentTextFace;
export declare function schematicTextAdvanceEm(value: string, weight: "plain" | "bold", italic?: boolean, face?: SchematicTextFace): number;
/**
 * Where a run of schematic text puts ink, in em from where it starts: from
 * the first glyph's outline to the last one's, each glyph advancing as
 * schematicTextAdvanceEm adds them up. Italic faces supply their own advances
 * and ink bearings. A glyph the tables do not hold inks its whole advance.
 * Null for a run that draws nothing, such as a space.
 */
export declare function schematicTextInkEm(value: string, weight: "plain" | "bold", italic?: boolean, face?: SchematicTextFace): {
    left: number;
    right: number;
} | null;
