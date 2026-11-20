import { type SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import type { DocumentDerivedContext } from "./document-derived-context.js";
import { type RoutingGuide } from "./routing-guidance.js";
export interface ImportReferenceIssue {
    code: "IMPORT_REFERENCE_UNAVAILABLE" | "IMPORT_REFERENCE_OPEN" | "IMPORT_REFERENCE_SHORT" | "IMPORT_REFERENCE_SCOPE_CHANGED" | "IMPORT_REFERENCE_MISSING_ENDPOINT" | "IMPORT_REFERENCE_UNPLACED";
    sourceNetIds: string[];
    instanceIds: string[];
    message: string;
}
export interface ImportReferenceAssessment {
    available: boolean;
    guides: RoutingGuide[];
    issues: ImportReferenceIssue[];
}
/** Compare a Cell definition with its frozen import, never with provenance lineage.
 * Parent-instance wiring is compared in the parent definition: repeated child
 * Ports on the same parent node are expected, not a child-definition short.
 */
export declare function assessImportReference(document: SchematicDocument, resolver: SymbolResolver, context?: DocumentDerivedContext): ImportReferenceAssessment;
