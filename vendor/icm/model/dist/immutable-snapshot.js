const frozenSnapshots = new WeakSet();
export function isFrozenSnapshot(value) {
    return frozenSnapshots.has(value);
}
/** Own a JSON model snapshot before sharing it between revision-scoped readers. */
export function freezeSnapshot(value) {
    if (value !== null &&
        typeof value === "object" &&
        !frozenSnapshots.has(value)) {
        frozenSnapshots.add(value);
        for (const child of Object.values(value))
            freezeSnapshot(child);
        Object.freeze(value);
    }
    return value;
}
