// A Library logic gate, D flip-flop or Delay Cell implemented by a Cell
// of its Project: the part keeps its symbol, and its call goes to the Cell's
// subcircuit.
import { foldNetName, projectCellInterface, } from "@icm/model";
import { subcircuitDescriptor } from "./registry.js";
import { isLibraryLogicGate } from "./reviewed-external.js";
/** The Library D flip-flops, which a Cell implements as it does a gate. */
const CELL_FLIP_FLOPS = new Set([
    "d-flip-flop",
    "d-flip-flop-q",
    "d-flip-flop-reset",
]);
/**
 * Whether a Library symbol keeps its look while a Cell of its Project
 * implements it: the logic gates, D flip-flops and Delay Cell.
 */
export function bindsProjectCell(symbolId) {
    return (isLibraryLogicGate(symbolId) ||
        CELL_FLIP_FLOPS.has(symbolId) ||
        symbolId === "delay-cell");
}
/** A Library gate's or flip-flop's pins, then its VDD and VSS terminals. */
export function libraryGateTerminals(symbolId) {
    if (!bindsProjectCell(symbolId))
        return [];
    return (subcircuitDescriptor(symbolId)?.ports ?? []).map((port) => port.supply
        ? { pinName: port.supply, supply: port.supply }
        : { pinName: port.pinName });
}
const spokenList = (names) => names.length < 2
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
/**
 * How a Library gate meets the Pins of a Cell that implements it: each of its
 * pins the Pin of that name, and its VDD and VSS terminals the Pins of theirs
 * where the Cell has them, since a Cell may take its supplies globally
 * instead. Names compare as SPICE compares them, without case. Undefined for
 * a symbol that is not a Library gate.
 */
export function matchGateCellPins(symbolId, cell) {
    const terminals = libraryGateTerminals(symbolId);
    if (!terminals.length)
        return undefined;
    const byName = new Map(terminals.map((terminal) => [foldNetName(terminal.pinName), terminal]));
    const pins = [];
    const extra = [];
    for (const portName of cell.portNames) {
        const terminal = byName.get(foldNetName(portName));
        if (!terminal)
            extra.push(portName);
        else
            pins.push({ portName, ...terminal });
    }
    const signals = terminals.filter((terminal) => !terminal.supply);
    const missing = signals
        .filter((terminal) => !pins.some((pin) => pin.pinName === terminal.pinName))
        .map((terminal) => terminal.pinName);
    if (!missing.length && !extra.length)
        return { ok: true, pins };
    const plural = (names, one, many) => names.length > 1 ? many : one;
    const problems = [
        ...(missing.length
            ? [`it has no ${plural(missing, "Pin", "Pins")} ${spokenList(missing)}`]
            : []),
        ...(extra.length
            ? [
                `its ${plural(extra, "Pin", "Pins")} ${spokenList(extra)} ${plural(extra, "is not one", "are not")} of the ${CELL_FLIP_FLOPS.has(symbolId) ? "flip-flop" : symbolId === "delay-cell" ? "Delay Cell" : "gate"}'s`,
            ]
            : []),
    ];
    return {
        ok: false,
        pins,
        missing,
        extra,
        message: `Cell ${cell.name} does not fit the ${symbolId}: ${problems.join(", and ")}. Its Pins must be ${spokenList(signals.map((terminal) => terminal.pinName))}, in any letter case, and VDD and VSS unless the Cell takes its supplies globally`,
    };
}
/**
 * The Cell a Library gate is bound to, and how the gate meets its Pins.
 * Undefined for any other Instance, or a Cell that is gone.
 */
export function gateCellBinding(project, instance) {
    const binding = instance.netlist?.binding;
    if (binding?.kind !== "subcircuit" || !bindsProjectCell(instance.symbolId))
        return undefined;
    const cell = project.documents.find((document) => document.id === binding.childDocumentId);
    if (!cell?.netlist)
        return undefined;
    const match = matchGateCellPins(instance.symbolId, {
        name: cell.netlist.name,
        portNames: projectCellInterface(cell.netlist).ports.map((port) => port.name),
    });
    return match && { cell, match };
}
