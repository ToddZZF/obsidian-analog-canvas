/**
 * The text a bound Annotation is obliged to read as: its Instance's Reference,
 * its Cell terminal's name, or the Net name it claims, compiled to the house
 * style.
 *
 * This is the single authority for that question. The schema uses it to refuse
 * a format override that no longer says the name it presents, and the
 * compatibility layer uses it to repair one — and those two must never drift,
 * because a repair computed differently from the check either fails to fix the
 * file or reports success on a file that still cannot load.
 *
 * Returns null when the Annotation binds to nothing, which has no obligation.
 */
export function boundAnnotationName(document, annotation) {
    const binding = annotation.binding;
    if (!binding)
        return null;
    if (binding.kind === "instance-reference") {
        return ((document.instances ?? []).find((instance) => instance.id === binding.instanceId)?.reference ?? "");
    }
    if (binding.kind === "cell-terminal-name") {
        return (document.netlist?.terminals.find((terminal) => terminal.id === binding.terminalId)?.name ?? "");
    }
    if (binding.kind !== "net-name")
        return null;
    // Pre-parse callers reach this before schema defaults are applied, so the
    // arrays this reads may legitimately be absent rather than empty.
    const nameClaim = (document.connectivityEvidence ?? []).find((evidence) => evidence.kind === "name-claim" &&
        evidence.netId === binding.netId &&
        ((evidence.owner?.kind === "net-label" &&
            evidence.owner.annotationId === annotation.id) ||
            // A power-marker claim is owned by the marker instance for supply
            // ports, but a drawn power rail's claim is owned by the label
            // annotation itself — both spellings name this annotation's net.
            (evidence.owner?.kind === "power-marker" &&
                ((annotation.anchor.kind === "object" &&
                    evidence.owner.objectId === annotation.anchor.objectId) ||
                    evidence.owner.objectId === annotation.id))));
    return nameClaim?.name ?? "";
}
