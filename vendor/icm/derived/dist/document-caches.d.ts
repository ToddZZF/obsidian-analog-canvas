import type { SchematicDocument } from "@icm/model";
export declare function registerDocumentCache<T>(cache: WeakMap<SchematicDocument, T>): WeakMap<SchematicDocument, T>;
/** Drop everything derived from `document`, which was just edited in place. */
export declare function forgetDerivedDocument(document: SchematicDocument): void;
