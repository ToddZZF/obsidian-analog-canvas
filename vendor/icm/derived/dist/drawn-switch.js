import { flattenRichText, richTextIdentifier, } from "@icm/model";
/**
 * The clock phase a switch's label names — Φ1 for a label drawn Φ₁, EN_bar
 * for E̅N̅ — or null while the label shows the switch's own name.
 */
export function drawnSwitchPhase(document, instance) {
    const label = document.annotations.find((annotation) => annotation.kind === "instance-label" &&
        annotation.anchor.kind === "object" &&
        annotation.anchor.objectId === instance.id &&
        !annotation.binding &&
        annotation.content);
    if (!label?.content)
        return null;
    const name = phaseName(label.content);
    if (!name)
        return null;
    const node = barsText(label.content.runs) ? `${name}_bar` : name;
    const drawnName = richTextIdentifier(label.content);
    // A bar over blank text spells no name of its own.
    return drawnName === node || /\s/u.test(drawnName)
        ? { name: node }
        : { name: node, drawnName };
}
function phaseName(content) {
    return flattenRichText(content).normalize("NFKC").replace(/\s+/gu, "");
}
/** Whether an overbar covers any of the phase's characters. */
function barsText(runs) {
    return runs.some((run) => run.kind === "span" &&
        (run.style === "overbar"
            ? phaseName({ runs: run.children }) !== ""
            : barsText(run.children)));
}
