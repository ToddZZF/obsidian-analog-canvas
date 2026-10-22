import { builtInModelContract, builtInModelContracts, builtInModelDefaults, } from "@icm/devices";
import { voltage, current, passive, printSpiceBehavioralModel, } from "./behavioral-model.js";
/**
 * Every subcircuit target this module gives a body.
 * @internal Tests hold every logic model contract to a body.
 */
export const IDEAL_LOGIC_TARGETS = builtInModelContracts
    .filter((model) => model.family === "logic")
    .map((model) => model.target);
/** An input's logic level, 0..1 volts on an internal node. */
const level = (pin) => voltage(`Bh${pin}`, `h${pin}`, "0", `0.5*(1+tanh((V(${pin},VSS)-0.5*V(VDD,VSS))/vt))`);
/** The rail-to-rail output of a 0..1 function, delayed by `td`. */
function drive(expression, outputs) {
    const [output, complement] = outputs;
    return [
        voltage("Bf", "nfn", "VSS", `V(VDD,VSS)*(${expression})`),
        passive("resistor", "Rd", "nfn", "ndl", "1k"),
        passive("capacitor", "Cd", "ndl", "VSS", "td/1000", true),
        voltage(`B${output}`, output, "VSS", "V(ndl,VSS)"),
        ...(complement
            ? [voltage(`B${complement}`, complement, "VSS", "V(VDD,VSS)-V(ndl,VSS)")]
            : []),
    ];
}
function combinationalBody(model) {
    const levels = model.inputs.map((pin) => `V(h${pin})`);
    const all = levels.join("*");
    const none = levels.map((value) => `(1-${value})`).join("*");
    // Parity, one input at a time, through internal nodes np1, np2, …
    const parity = [];
    let odd = levels[0];
    for (const [index, value] of levels.slice(1).entries()) {
        if (index === levels.length - 2) {
            odd = `${odd}+${value}-2*${odd}*${value}`;
            break;
        }
        parity.push(voltage(`Bp${index + 1}`, `np${index + 1}`, "0", `${odd}+${value}-2*${odd}*${value}`));
        odd = `V(np${index + 1})`;
    }
    const expression = {
        inverter: `1-${levels[0]}`,
        buffer: levels[0],
        and: all,
        nand: `1-${all}`,
        or: `1-${none}`,
        nor: none,
        xor: odd,
        xnor: `1-(${odd})`,
    }[model.fn];
    return [
        ...model.inputs.map(level),
        ...(model.fn === "xor" || model.fn === "xnor" ? parity : []),
        ...drive(expression, ["Y"]),
    ];
}
function flipFlopBody(model) {
    const hold = model.reset ? "*(1-V(hRST))" : "";
    const clear = (node) => (model.reset ? `-V(${node})*V(hRST)` : "");
    return [
        level("D"),
        level("CK"),
        ...(model.reset ? [level("RST")] : []),
        // The master follows D while CK is low; the slave follows the master
        // while CK is high. A 1 TΩ leak gives each held node a DC path.
        current("Bm", "0", "nm", `10m*((V(hD)-V(nm))*(1-V(hCK))${hold}${clear("nm")})`),
        passive("capacitor", "Cm", "nm", "0", "1p"),
        passive("resistor", "Rm", "nm", "0", "1T"),
        current("Bs", "0", "ns", `10m*((V(nm)-V(ns))*V(hCK)${hold}${clear("ns")})`),
        passive("capacitor", "Cs", "ns", "0", "1p"),
        passive("resistor", "Rs", "ns", "0", "1T"),
        ...drive("0.5*(1+tanh((V(ns)-0.5)/10m))", [
            "Q",
            ...(model.complement ? ["QBAR"] : []),
        ]),
    ];
}
/** Nominal 50% delay: tau = tpd/ln(2), followed by logic regeneration. */
function delayBody() {
    return [
        level("A"),
        voltage("Bf", "nfn", "VSS", "V(VDD,VSS)*V(hA)"),
        passive("resistor", "Rd", "nfn", "ndl", "1k"),
        passive("capacitor", "Cd", "ndl", "VSS", "tpd/(1000*ln(2))", true),
        voltage("BY", "Y", "VSS", "V(VDD,VSS)*0.5*(1+tanh((V(ndl,VSS)-0.5*V(VDD,VSS))/vt))"),
    ];
}
/** The `.subckt` text of one gate or flip-flop, ready for an ngspice file. */
export function idealLogicModel(target) {
    const model = builtInModelContract(target);
    if (model?.family !== "logic")
        throw new Error(`No ideal logic model: ${target}`);
    const ports = model.ports.map((port) => port.name);
    return {
        name: target,
        ports,
        comment: model.implementation === "delay"
            ? "Delay Cell: nominal 50% propagation tpd, tau=tpd/ln(2), logic regeneration; not pure transport delay"
            : `Ideal ${model.symbolId}: switches at V(VDD,VSS)/2; vt sets the step width, td the delay`,
        parameters: Object.entries(builtInModelDefaults(target)).map(([name, defaultValue]) => ({ name, defaultValue })),
        elements: model.implementation === "delay"
            ? delayBody()
            : model.implementation === "flip-flop"
                ? flipFlopBody({
                    reset: ports.includes("RST"),
                    complement: ports.includes("QBAR"),
                })
                : combinationalBody({
                    fn: model.implementation,
                    inputs: model.ports
                        .filter((port) => port.direction === "input")
                        .map((port) => port.name),
                }),
    };
}
/**
 * Existing SPICE consumer API, projected from the shared recipe.
 * @internal Tests run each printed body in ngspice.
 */
export function spiceIdealLogicSubcircuit(target) {
    return printSpiceBehavioralModel(idealLogicModel(target));
}
