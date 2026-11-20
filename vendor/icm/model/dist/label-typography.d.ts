import type { Annotation, RichTextDocument, SchematicDocument } from "./schema.js";
/** Current drawing's naming typography, shared by labels, pins and block text. */
export declare function labelTypography(presentation: SchematicDocument["presentation"]): {
    underscoreSubscript: boolean;
    subscriptAfterFirst: boolean;
    subscriptCase: "lowercase" | "preserve" | "uppercase";
    subscriptItalic: boolean;
    firstLetterItalic: boolean;
};
export type LabelTypography = ReturnType<typeof labelTypography>;
/** Explicit whole-drawing naming action, not a side effect of rendering. */
export declare function formatLabelIdentifier(name: string, options: Pick<LabelTypography, "subscriptAfterFirst" | "subscriptCase">): string;
/** Only change the initial character's slant; retain every other authored style. */
export declare function formatLabelFirstLetter(content: RichTextDocument, italic: boolean | undefined): RichTextDocument;
export declare function labelTextDocument(name: string, presentation: SchematicDocument["presentation"]): RichTextDocument;
/**
 * Labels whose standard look comes from what they label: supply markers,
 * device References, and the voltage nodes Cell Pins and Net labels name.
 */
export type LabelRole = "supply" | "device-reference" | "voltage-node";
/** The role that gives a bound label a standard look, if any. */
export declare function labelRole(annotation: Pick<Annotation, "kind" | "binding">): LabelRole | undefined;
export interface RoleLabelFormatOptions {
    /**
     * The single letter the labelled device's References start with — R, C,
     * L, M, Q, D, V, I… — when it has one. The model knows no devices, so the
     * caller that does passes it.
     */
    readonly deviceLetter?: string;
}
/**
 * The standard look a role-labelled name is created with, stored on the
 * label so later rule or drawing-setting changes never redraw it. The name
 * keeps its exact spelling; a spelling without a standard form gets none.
 * - supply, voltage node (Cell Pin, Net label): italic V over an upright
 *   subscript (V_DD, V_in, V_BP, V_casP)
 * - a Cell Pin or Net label named for a current: italic I over an upright
 *   subscript (I_out, I_REF, I₁), except an input's IN… or an IO pin
 * - device reference that starts with its device letter: that letter in
 *   italic over an upright subscript of the rest (M₁, R₁₂, R_L1, C_L, R_FB)
 * - any other device reference: italic letters over an upright index, so a
 *   block named for what it is keeps its letters together (OA₁, XU₀)
 * - any name led by a Greek letter, such as a clock phase: that letter in
 *   italic over an upright subscript of the rest (Φ₁, Φ_1pp, ω₀)
 */
export declare function roleLabelFormat(role: LabelRole, name: string, options?: RoleLabelFormatOptions): RichTextDocument | undefined;
/**
 * Whether a Cell Pin label shows only the look its name gets automatically:
 * no look of its own, or the formal-port look the editor drew it with. Such
 * a label takes its role's look when it is renamed or restyled (#1419); an
 * author's own look is kept.
 */
export declare function isAutomaticPinLabelLook(formatOverride: RichTextDocument | undefined, name: string): boolean;
/**
 * The standard look of a name its author wrote as letters over a subscript —
 * a switch's Φ₁, a free V_icm, a flip-flop's Q_A, V_in+ — split where they
 * split it: the letters in bold italic over a bold upright subscript.
 * Undefined for anything else: no subscript, text after the subscript, a
 * space, a formula, or styling beyond italic, bold and subscript.
 */
export declare function writtenNameLook(document: RichTextDocument): RichTextDocument | undefined;
/** Whether a stored format is still exactly the standard look for `name`. */
export declare function isRoleLabelFormat(format: RichTextDocument, role: LabelRole, name: string, options?: RoleLabelFormatOptions): boolean;
/** The standard look of a supply marker's label (VDD Power, drawn rails). */
export declare function supplyLabelFormat(name: string): RichTextDocument | undefined;
/**
 * The format a bound label keeps when its name changes. An untouched
 * standard look follows the new spelling, or is dropped when that spelling
 * has no standard form; an authored format keeps its styling around the new
 * text.
 */
export declare function renamedLabelFormat(annotation: Pick<Annotation, "kind" | "binding" | "formatOverride">, previousName: string, nextName: string, presentation: SchematicDocument["presentation"], options?: RoleLabelFormatOptions): RichTextDocument | undefined;
/**
 * A format that still spells `name`. Restyling never renames, so when a
 * styling change leaves a character the old look hid (an underscore that
 * began a removed subscript), that character is shown again rather than
 * dropped from the electrical name.
 */
export declare function formatPresentingName(format: RichTextDocument, name: string): RichTextDocument;
/** One existing label a look pass would restyle. */
export interface LabelLookChange {
    readonly annotationId: string;
    readonly name: string;
    readonly format: RichTextDocument;
    /**
     * `standard`: the role's standard look (V_DD, M₁, V_in), for a label with
     * no look of its own or one whose stored look only repeats its historical
     * look. `upright`: the label's own look with its scripts upright.
     */
    readonly kind: "standard" | "upright";
    readonly role?: LabelRole;
}
export interface LabelLookChanges {
    readonly labels: LabelLookChange[];
    /**
     * The drawing never chose a subscript slant, so the historical default
     * slants the subscripts of labels without a look of their own; setting
     * `labelSubscriptItalic` to false draws them upright.
     */
    readonly uprightSubscripts: boolean;
}
export interface LabelLookChangeOptions {
    /**
     * Also restyle looks the editor stored before these standards: a stored
     * copy of a label's historical look takes its standard look, and a script
     * slanted by the surrounding italic is drawn upright. Only for drawings
     * made before scripts defaulted to upright, since an author may now slant
     * a script on purpose.
     */
    readonly legacyLooks?: boolean;
    /** The device letter of the Instance a Reference label names, if any. */
    readonly deviceLetterOf?: (annotation: Annotation) => string | undefined;
}
/**
 * How an existing drawing's labels would reach the standard: drawn supply,
 * device Reference, Cell Pin and Net labels without a look of their own take
 * their standard look, and subscripts default to upright. Names never change,
 * an author's own look is kept, and a label that is not drawn is left as it
 * is. `legacyLooks` also restyles looks stored before these standards.
 */
export declare function labelLookChanges(document: SchematicDocument, options?: LabelLookChangeOptions): LabelLookChanges;
