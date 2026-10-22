import { deviceDescriptor, subcircuitDescriptor } from "./registry.js";
export const hierarchyReferencePolicy = {
    kind: "required",
    prefix: "X",
};
export function referencePolicyForInstance(instance, project) {
    const binding = instance.netlist?.binding;
    if (binding?.kind === "subcircuit" ||
        binding?.kind === "unresolved-subcircuit" ||
        (binding?.kind === "external-subcircuit" &&
            !deviceDescriptor(instance.symbolId, project)?.referencePrefix) ||
        subcircuitDescriptor(instance.symbolId, project)) {
        return hierarchyReferencePolicy;
    }
    const prefix = deviceDescriptor(instance.symbolId, project)?.referencePrefix;
    return prefix ? { kind: "required", prefix } : { kind: "none" };
}
export function referencePolicyForSymbol(symbolId) {
    if (subcircuitDescriptor(symbolId))
        return hierarchyReferencePolicy;
    const prefix = deviceDescriptor(symbolId)?.referencePrefix;
    return prefix ? { kind: "required", prefix } : { kind: "none" };
}
/**
 * The letter a device's References are written from — R, C, L, M, Q, D, V,
 * I… — which a Reference label shows in italic over a subscript of the rest
 * (R_L1, C_L). Subcircuit calls, whose X says how SPICE invokes them rather
 * than what they are, and devices without a one-letter prefix have none.
 */
export function referenceDeviceLetter(symbolId, project) {
    if (subcircuitDescriptor(symbolId, project))
        return undefined;
    const prefix = deviceDescriptor(symbolId, project)?.referencePrefix;
    return prefix && /^[A-WYZ]$/u.test(prefix) ? prefix : undefined;
}
export function referenceSuffixForPolicy(reference, policy) {
    if (policy.kind === "none")
        return null;
    return suffixForPrefix(reference, policy.prefix);
}
function suffixForPrefix(reference, prefix) {
    const match = new RegExp(`^${prefix}(\\d+)$`, "iu").exec(reference);
    if (!match)
        return null;
    const suffix = Number(match[1]);
    return Number.isSafeInteger(suffix) && suffix > 0 ? suffix : null;
}
/** One per-Cell, case-folded reference authority for allocation and diagnosis. */
export function createReferenceIndex(document, project) {
    const policyByInstanceId = new Map();
    const byReference = new Map();
    const occupiedSuffixesByPrefix = new Map();
    const issues = [];
    for (const instance of document.instances) {
        const policy = referencePolicyForInstance(instance, project);
        policyByInstanceId.set(instance.id, policy);
        const reference = instance.reference;
        if (reference) {
            const foldedReference = reference.toLowerCase();
            const instances = byReference.get(foldedReference) ?? [];
            instances.push(instance.id);
            byReference.set(foldedReference, instances);
        }
        if (policy.kind === "none") {
            continue;
        }
        if (!reference) {
            issues.push({ code: "MISSING_REFERENCE", instanceId: instance.id });
            continue;
        }
        // Keep imported/previously authored X references across model transitions.
        // New native devices, including PDK wrappers, still allocate M/R/C/etc.
        const retainedExternalReference = Boolean(deviceDescriptor(instance.symbolId, project)?.referencePrefix) &&
            /^x/iu.test(reference);
        if (!reference.toUpperCase().startsWith(policy.prefix.toUpperCase()) &&
            !retainedExternalReference) {
            issues.push({
                code: "WRONG_REFERENCE_PREFIX",
                instanceId: instance.id,
                reference,
                expectedPrefix: policy.prefix,
            });
        }
        const suffix = suffixForPrefix(reference, policy.prefix);
        if (suffix !== null) {
            const occupied = occupiedSuffixesByPrefix.get(policy.prefix) ?? new Set();
            occupied.add(suffix);
            occupiedSuffixesByPrefix.set(policy.prefix, occupied);
        }
    }
    for (const [foldedReference, instances] of byReference) {
        if (instances.length < 2)
            continue;
        for (const instanceId of instances) {
            const otherInstanceId = instances.find((candidate) => candidate !== instanceId);
            issues.push({
                code: "DUPLICATE_REFERENCE",
                instanceId,
                reference: foldedReference,
                ...(otherInstanceId ? { otherInstanceId } : {}),
            });
        }
    }
    return { byReference, occupiedSuffixesByPrefix, policyByInstanceId, issues };
}
export function nextReference(index, policy, options = {}) {
    if (policy.kind === "none")
        return undefined;
    const occupied = index.occupiedSuffixesByPrefix.get(policy.prefix);
    const reserved = options.reservedReferences;
    let suffix = Math.max(1, options.startAt ?? 1);
    while (occupied?.has(suffix) ||
        index.byReference.has(`${policy.prefix}${suffix}`.toLowerCase()) ||
        reserved?.has(`${policy.prefix}${suffix}`.toLowerCase())) {
        suffix += 1;
    }
    return `${policy.prefix}${suffix}`;
}
export function referenceIssuesForInstance(index, instanceId) {
    return index.issues.filter((issue) => issue.instanceId === instanceId);
}
