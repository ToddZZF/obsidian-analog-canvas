/** Emit consecutive runs of like paint without moving any object across another. */
export function composeDrawing(order, ink, implicitOrder) {
    const parts = [];
    let layer;
    let draftingPlane = "background";
    let body = [];
    function flush() {
        if (!layer)
            return;
        const plane = layer === "drafting" ? ` data-drafting-layer="${draftingPlane}"` : "";
        parts.push(`<g data-layer="${layer}"${plane}>${body.join("")}</g>`);
        body = [];
        layer = undefined;
    }
    function paint(nextLayer, value) {
        if (!value)
            return;
        if (nextLayer !== layer)
            flush();
        layer = nextLayer;
        body.push(value);
    }
    for (const entry of order) {
        switch (entry.kind) {
            case "electrical":
                flush();
                parts.push(ink.electrical);
                draftingPlane = "foreground";
                break;
            case "circuit-marks":
                flush();
                if (implicitOrder && !ink.instances.size)
                    parts.push('<g data-layer="symbols"></g>');
                parts.push(ink.circuitMarks);
                if (implicitOrder && !ink.annotations.size)
                    parts.push('<g data-layer="annotations"></g>');
                break;
            case "instance":
                paint("symbols", ink.instances.get(entry.id));
                break;
            case "annotation":
                paint("annotations", ink.annotations.get(entry.id));
                break;
            case "drafting":
                paint("drafting", ink.drafting.get(entry.id));
                break;
        }
    }
    flush();
    return parts.join("");
}
