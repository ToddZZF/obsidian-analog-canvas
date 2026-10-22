import { razaviCatalogSymbols, razaviSemanticPrimitives, razaviSymbolCatalogEntries, razaviSymbolCatalogIdentity, } from "./razavi-catalog.generated.js";
const symbolsById = new Map(razaviCatalogSymbols.map((symbol) => [symbol.id, symbol]));
const entriesById = new Map(razaviSymbolCatalogEntries.map((entry) => [entry.symbolId, entry]));
/**
 * Resolvable: a reviewed, Reference-calibrated Symbol the runtime may draw.
 *
 * `palette` is browsability, not existence. A Symbol reached by an action
 * rather than by picking it — the crossed-output and swapped-input siblings —
 * has to resolve everywhere the Project can name it while staying out of a
 * Library where it would read as a near-duplicate of its source.
 */
function isRazaviLibraryCatalogEntry(entry) {
    if (entry.reviewStatus !== "reviewed")
        return false;
    // A house primitive resolves and draws like any other reviewed entry; what
    // it does not do is claim the reference's authority for its geometry.
    if (entry.provenance === "house")
        return entry.visualAuthority === undefined;
    return entry.visualAuthority?.kind === "razavi-reference-v1";
}
/** Browsable: the subset a person picks from. */
function isRazaviProductCatalogEntry(entry) {
    return entry.palette && isRazaviLibraryCatalogEntry(entry);
}
const symbolsFor = (predicate) => razaviSymbolCatalogEntries
    .filter(predicate)
    .map((entry) => symbolsById.get(entry.symbolId))
    .filter((symbol) => symbol !== undefined);
export const razaviLibrarySymbols = symbolsFor(isRazaviLibraryCatalogEntry);
export const razaviProductSymbols = symbolsFor(isRazaviProductCatalogEntry);
export { razaviCatalogSymbols, razaviSymbolCatalogEntries };
/** @internal Catalog tests pin the generated identity and primitives. */
export { razaviSemanticPrimitives, razaviSymbolCatalogIdentity };
export function getRazaviCatalogSymbol(symbolId) {
    return symbolsById.get(symbolId);
}
/** @internal Tests across packages fetch catalog Symbols by id with it. */
export function requireRazaviCatalogSymbol(symbolId) {
    const symbol = getRazaviCatalogSymbol(symbolId);
    if (!symbol)
        throw new Error(`Unknown Razavi catalog symbol: ${symbolId}`);
    return symbol;
}
export function getRazaviCatalogEntry(symbolId) {
    return entriesById.get(symbolId);
}
export function isRazaviProductSymbolId(symbolId) {
    const entry = entriesById.get(symbolId);
    return entry !== undefined && isRazaviProductCatalogEntry(entry);
}
