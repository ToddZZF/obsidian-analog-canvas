import type { CircuitProject, SchematicDocument } from "./schema/types.js";
export declare function shareEqualDocumentStructure(before: SchematicDocument, after: SchematicDocument): SchematicDocument;
/** Share all unchanged Project facts after model validation, including definitions. */
export declare function shareEqualProjectStructure(before: CircuitProject, after: CircuitProject): CircuitProject;
