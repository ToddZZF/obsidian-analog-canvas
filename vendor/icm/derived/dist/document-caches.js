/**
 * Every derived cache keyed by a Document object. Each one treats a Document
 * as fixed at its revision, as a committed one is. A private planning draft
 * edited in place keeps its revision, so it must forget them after each edit:
 * otherwise a batch of an Agent's wires was planned against a view without
 * the wires before it, and drew two Nets along one line.
 */
const caches = [];
export function registerDocumentCache(cache) {
    caches.push(cache);
    return cache;
}
/** Drop everything derived from `document`, which was just edited in place. */
export function forgetDerivedDocument(document) {
    for (const cache of caches)
        cache.delete(document);
}
