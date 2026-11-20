export function draftingIsBackground(object) {
    return ((object.kind === "rectangle" || object.kind === "circle") &&
        object.layer === "background");
}
export function drawingOrderKey(entry) {
    return "id" in entry ? `${entry.kind}:${entry.id}` : entry.kind;
}
/** The old fixed layers are the implicit order of drawings without a list. */
function defaultDrawingOrder(document) {
    const objects = [...(document.drafting?.objects ?? [])].sort((left, right) => left.zIndex - right.zIndex);
    const byId = (left, right) => left.id.localeCompare(right.id, "en");
    return [
        ...objects.filter(draftingIsBackground).map(draftingEntry),
        { kind: "electrical" },
        ...[...document.instances].sort(byId).map(instanceEntry),
        // No Connects and mutual coupling marks drew above symbols in legacy files.
        { kind: "circuit-marks" },
        ...[...document.annotations].sort(byId).map(annotationEntry),
        ...objects
            .filter((object) => !draftingIsBackground(object))
            .map(draftingEntry),
    ];
}
function draftingEntry({ id }) {
    return { kind: "drafting", id };
}
function instanceEntry({ id }) {
    return { kind: "instance", id };
}
function annotationEntry({ id }) {
    return { kind: "annotation", id };
}
/** All drawable identities, with placement-independent Instance membership. */
export function drawingOrderEntries(document) {
    return [
        { kind: "electrical" },
        { kind: "circuit-marks" },
        ...document.instances.map(instanceEntry),
        ...document.annotations.map(annotationEntry),
        ...(document.drafting?.objects ?? []).map(draftingEntry),
    ];
}
/** Back to front. Reconciles existing order against the contents of a draft. */
export function resolveDrawingOrder(document) {
    if (!document.drawingOrder)
        return defaultDrawingOrder(document);
    const available = new Map(drawingOrderEntries(document).map((entry) => [
        drawingOrderKey(entry),
        entry,
    ]));
    const surviving = document.drawingOrder.filter((entry) => available.delete(drawingOrderKey(entry)));
    return [...surviving, ...available.values()];
}
