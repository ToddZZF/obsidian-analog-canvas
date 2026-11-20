import type { SymbolDefinition } from "./schema.js";
import type { RazaviSemanticPrimitiveEntry, RazaviSymbolCatalogEntry } from "./razavi-catalog.js";
export declare const razaviSymbolCatalogIdentity: {
    readonly schemaVersion: 2;
    readonly id: "razavi-symbols";
    readonly version: 1;
};
export declare const razaviSymbolCatalogEntries: readonly RazaviSymbolCatalogEntry[];
export declare const razaviSemanticPrimitives: readonly RazaviSemanticPrimitiveEntry[];
export declare const razaviCatalogSymbols: readonly SymbolDefinition[];
