import { BoundedLruCache } from "./bounded-lru.js";
import { ANALOG_CANVAS_MATH_PROFILE_ID, validateFormulaSource, } from "./profile.js";
export { ANALOG_CANVAS_MATH_PROFILE_ID } from "./profile.js";
export const CANONICAL_FORMULA_FONT_SIZE = 100;
function fnv1a32(input, seed) {
    let hash = seed >>> 0;
    for (let index = 0; index < input.length; index += 1) {
        hash ^= input.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
}
export function formulaSourceHash(request) {
    const source = [
        request.profileId,
        "sans-v2",
        request.display,
        request.bold ?? true,
        request.italic ?? false,
        request.latex,
    ].join("\u0000");
    return `${fnv1a32(source, 0x811c9dc5)}${fnv1a32(source, 0x9e3779b9)}`;
}
export function validateFormulaRequest(request) {
    if (request.profileId !== ANALOG_CANVAS_MATH_PROFILE_ID) {
        return {
            code: "FORMULA_INVALID_REQUEST",
            message: `Unsupported formula profile: ${request.profileId}`,
        };
    }
    return validateFormulaSource(request.latex);
}
const FORMULA_ARTIFACT_CACHE_MAX_ENTRIES = 128;
const FORMULA_ARTIFACT_CACHE_MAX_BYTES = 16 * 1024 * 1024;
function formulaResultBytes(key, result) {
    const fixedObjectEstimate = 128;
    if (result.ok) {
        return (fixedObjectEstimate +
            2 *
                (key.length +
                    result.artifact.sourceHash.length +
                    result.artifact.svg.length));
    }
    return (fixedObjectEstimate +
        2 *
            (key.length +
                result.diagnostic.message.length +
                (result.diagnostic.command?.length ?? 0)));
}
const artifacts = new BoundedLruCache({
    maxEntries: FORMULA_ARTIFACT_CACHE_MAX_ENTRIES,
    maxBytes: FORMULA_ARTIFACT_CACHE_MAX_BYTES,
    sizeOf: formulaResultBytes,
});
const pending = new Map();
const retentionOwners = new Map();
let retentionOwnerCounter = 0;
function synchronizeRetainedFormulaKeys() {
    artifacts.replaceProtectedKeys([...retentionOwners.values()].flatMap((keys) => [...keys]));
}
/** Protects one active render/export working set from background LRU eviction. */
export function retainFormulaArtifacts(requests) {
    const owner = ++retentionOwnerCounter;
    retentionOwners.set(owner, new Set(requests.map((request) => formulaSourceHash(request))));
    synchronizeRetainedFormulaKeys();
    let released = false;
    return () => {
        if (released)
            return;
        released = true;
        retentionOwners.delete(owner);
        synchronizeRetainedFormulaKeys();
    };
}
export function cachedFormulaResult(request) {
    return artifacts.get(formulaSourceHash(request));
}
export async function prepareFormula(request) {
    const key = formulaSourceHash(request);
    const cached = artifacts.get(key);
    if (cached)
        return cached;
    const existing = pending.get(key);
    if (existing)
        return existing;
    const task = import("./index.js")
        .then(({ typesetFormula }) => typesetFormula(request))
        .then((result) => {
        // A glyph file that failed to load (offline, or replaced by a deploy)
        // may load on the next request, so that failure is not remembered.
        if (result.ok || result.diagnostic.code !== "FORMULA_FONT_UNAVAILABLE")
            artifacts.set(key, result);
        return result;
    })
        .finally(() => pending.delete(key));
    pending.set(key, task);
    return task;
}
/** @internal Tests start each case from an empty formula cache. */
export function clearFormulaArtifactCacheForTests() {
    retentionOwners.clear();
    artifacts.clear();
    pending.clear();
}
