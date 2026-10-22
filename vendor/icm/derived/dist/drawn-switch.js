import { flattenRichText, richTextIdentifier, } from "@icm/model";
/** A chopper's pins: two in, two out, passed straight or crossed (#1641). */
const CHOPPER_PINS = ["INP", "INN", "OUTP", "OUTN"];
/**
 * How a drawn switch is controlled: a two-terminal switch by the clock phase
 * its label names, a single-ended switch by its CTRL pin, and a chopper by
 * the clock its label names, straight while it is high and crossed while it
 * is low (#1641). All are read against ground. Switches bound to a model of
 * their own, and selectors SPICE has no primitive for, are not drawn
 * switches.
 */
export function drawnSwitchControl(definition) {
    if (definition.deviceClass !== "switch" || definition.targetPolicy !== "none")
        return null;
    if (definition.pinOrder.length === 2)
        return "phase";
    if (definition.pinOrder.join() === CHOPPER_PINS.join())
        return "chopper";
    return definition.pinOrder.length === 3 &&
        definition.pinOrder.includes("CTRL")
        ? "pin"
        : null;
}
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
