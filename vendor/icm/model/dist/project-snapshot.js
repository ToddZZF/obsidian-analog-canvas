import { CircuitProjectSchema } from "./schema/project.js";
import { freezeSnapshot, isFrozenSnapshot } from "./immutable-snapshot.js";
import { shareEqualProjectStructure } from "./snapshot-structural-sharing.js";
const validatedSnapshots = new WeakSet();
const validatedResults = new WeakMap();
/** Validate the public, mutable transaction result and retain its provenance. */
export function validateProjectResult(input) {
    const result = CircuitProjectSchema.safeParse(input);
    if (result.success)
        validatedResults.set(result.data, { source: JSON.stringify(result.data) });
    return result;
}
/** Fully validate incoming models; reuse only immutable snapshots owned here. */
export function validateProjectSnapshot(input, previous) {
    if (typeof input === "object" &&
        input !== null &&
        validatedSnapshots.has(input))
        return { success: true, data: input };
    const known = typeof input === "object" && input !== null
        ? validatedResults.get(input)
        : undefined;
    if (known && known.source === JSON.stringify(input)) {
        if (!known.snapshot) {
            const detached = structuredClone(input);
            known.snapshot = freezeSnapshot(previous && validatedSnapshots.has(previous)
                ? shareEqualProjectStructure(previous, detached)
                : detached);
        }
        const project = known.snapshot;
        validatedSnapshots.add(project);
        return { success: true, data: project };
    }
    const result = CircuitProjectSchema.safeParse(input);
    if (!result.success)
        return result;
    const project = freezeSnapshot(previous &&
        (validatedSnapshots.has(previous) ||
            (previous === input && isFrozenSnapshot(previous)))
        ? shareEqualProjectStructure(previous, result.data)
        : result.data);
    validatedSnapshots.add(project);
    return { success: true, data: project };
}
/** Reuse equal immutable facts without revalidating the same owned result. */
export function shareProjectSnapshot(before, after) {
    const validated = parseProjectSnapshot(after, before);
    if (!validatedSnapshots.has(before))
        return validated;
    const project = freezeSnapshot(shareEqualProjectStructure(before, validated));
    validatedSnapshots.add(project);
    return project;
}
export function parseProjectSnapshot(input, previous) {
    const result = validateProjectSnapshot(input, previous);
    if (!result.success)
        throw result.error;
    return result.data;
}
