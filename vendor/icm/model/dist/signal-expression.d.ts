import type { ConnectivityEvidence, SchematicDocument } from "./schema.js";
/** Read-only scalar names from each owner; no copied editable name claims. */
export declare function scalarConnectivityEvidence(document: SchematicDocument): ConnectivityEvidence[];
/** The explicitly authored signal grammar. Loading names never calls this parser. */
export declare function parseSignalExpression(expression: string): readonly string[];
/** Display only: the ordered identities remain the binding, not this short text. */
export declare function formatSignalMembers(names: readonly string[]): string;
