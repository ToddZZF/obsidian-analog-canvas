import type { CircuitProject, SchematicDocument } from "./schema.js";
export declare function createEmptyDocument(id: string, name: string): SchematicDocument;
/** Inherit drawing preferences, never another Cell's terminal-bound symbol. */
export declare function createCellDocument(id: string, name: string, presentation: SchematicDocument["presentation"]): SchematicDocument;
/** The Symbol Library every current Project locks (packages/components/catalog.json). */
export declare const CURRENT_SYMBOL_LIBRARY_LOCK: Readonly<{
    id: "razavi-symbols";
    version: "1";
    hash: "razavi-reference-v1";
}>;
export declare function createEmptyProject(id: string, name: string, documentId?: string): CircuitProject;
