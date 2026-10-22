/**
 * Small deterministic LRU for rebuildable session artifacts. Entry order is
 * recency order; persistence and canonical output must never depend on it.
 */
export class BoundedLruCache {
    #entries = new Map();
    #protectedKeys = new Set();
    #maxEntries;
    #maxBytes;
    #sizeOf;
    #totalBytes = 0;
    constructor(options) {
        if (!Number.isSafeInteger(options.maxEntries) || options.maxEntries < 1) {
            throw new Error("LRU maxEntries must be a positive integer");
        }
        if (!Number.isSafeInteger(options.maxBytes) || options.maxBytes < 1) {
            throw new Error("LRU maxBytes must be a positive integer");
        }
        this.#maxEntries = options.maxEntries;
        this.#maxBytes = options.maxBytes;
        this.#sizeOf = options.sizeOf;
    }
    get size() {
        return this.#entries.size;
    }
    get totalBytes() {
        return this.#totalBytes;
    }
    get(key) {
        const entry = this.#entries.get(key);
        if (!entry)
            return undefined;
        this.#entries.delete(key);
        this.#entries.set(key, entry);
        return entry.value;
    }
    set(key, value) {
        const measured = this.#sizeOf(key, value);
        if (!Number.isFinite(measured) || measured < 0) {
            throw new Error("LRU entry size must be a non-negative finite number");
        }
        const bytes = Math.ceil(measured);
        const previous = this.#entries.get(key);
        if (previous) {
            this.#entries.delete(key);
            this.#totalBytes -= previous.bytes;
        }
        if (bytes > this.#maxBytes && !this.#protectedKeys.has(key))
            return false;
        this.#entries.set(key, { value, bytes });
        this.#totalBytes += bytes;
        this.#evictToBounds();
        return this.#entries.has(key);
    }
    replaceProtectedKeys(keys) {
        this.#protectedKeys.clear();
        for (const key of keys)
            this.#protectedKeys.add(key);
        this.#evictToBounds();
    }
    #evictToBounds() {
        while (this.#entries.size > this.#maxEntries ||
            this.#totalBytes > this.#maxBytes) {
            let evicted = false;
            for (const [oldestKey, oldest] of this.#entries) {
                if (this.#protectedKeys.has(oldestKey))
                    continue;
                this.#entries.delete(oldestKey);
                this.#totalBytes -= oldest.bytes;
                evicted = true;
                break;
            }
            // The active working set is allowed to exceed the background cache
            // budget: evicting it would change the currently rendered document.
            if (!evicted)
                break;
        }
    }
    clear() {
        this.#entries.clear();
        this.#protectedKeys.clear();
        this.#totalBytes = 0;
    }
}
