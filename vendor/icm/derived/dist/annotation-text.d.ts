import type { Annotation, RichTextDocument, SchematicDocument } from "@icm/model";
import { type ResolvedDocumentLogicalNets } from "./logical-net.js";
import type { SymbolResolver } from "@icm/symbols";
/**
 * Resolve one Annotation's text from its bound fact. A captured selector look
 * can survive an open copied boundary until a live member name is available.
 */
export declare function resolveAnnotationText(document: SchematicDocument, annotation: Annotation, logicalNets?: ResolvedDocumentLogicalNets, resolver?: SymbolResolver): RichTextDocument;
/** Electrical names must never be inferred from a lossy rendered string. */
export declare function resolveAnnotationName(document: SchematicDocument, annotation: Annotation, logicalNets?: ResolvedDocumentLogicalNets): string;
type NameClaim = Extract<SchematicDocument["connectivityEvidence"][number], {
    kind: "name-claim";
}>;
/** The name claim a Net label owns: the name it gives its Net. */
export declare function netLabelNameClaim(document: SchematicDocument, annotationId: string): NameClaim | undefined;
/**
 * The claim of a Net label that can show a display alias: one naming its own
 * Net, not a bus member selector, which claims nothing.
 */
export declare function aliasableNetLabelClaim(document: SchematicDocument, annotation: Annotation): NameClaim | undefined;
/**
 * The claim of a Net label showing a display alias: its own text, while the
 * claim keeps naming its Net. Undefined for any other text.
 */
export declare function netLabelAliasClaim(document: SchematicDocument, annotation: Annotation): NameClaim | undefined;
export {};
