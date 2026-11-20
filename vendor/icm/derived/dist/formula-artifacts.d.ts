import { type FormulaRequest } from "@icm/math-typesetting/cache";
import type { SchematicDocument } from "@icm/model";
export declare function formulaRequestsForDocument(document: SchematicDocument): FormulaRequest[];
export declare function prepareDocumentFormulaArtifacts(document: SchematicDocument): Promise<{
    preparedNewArtifact: boolean;
    release: () => void;
}>;
