export interface BoundedLruCacheOptions<Key, Value> {
    maxEntries: number;
    maxBytes: number;
    sizeOf: (key: Key, value: Value) => number;
}
/**
 * Small deterministic LRU for rebuildable session artifacts. Entry order is
 * recency order; persistence and canonical output must never depend on it.
 */
export declare class BoundedLruCache<Key, Value> {
    #private;
    constructor(options: BoundedLruCacheOptions<Key, Value>);
    get size(): number;
    get totalBytes(): number;
    get(key: Key): Value | undefined;
    set(key: Key, value: Value): boolean;
    replaceProtectedKeys(keys: Iterable<Key>): void;
    clear(): void;
}
