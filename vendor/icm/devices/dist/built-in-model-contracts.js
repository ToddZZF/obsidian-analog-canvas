import { ADDER_SIGN_PARAMETERS, ADDER_TARGET } from "./adder.js";
import { IDEAL_COMPARATOR_TARGET } from "./contract.js";
import { HIGH_LEVEL_PARAMETER, DIFFERENTIAL_COMPARATOR_TARGET, idealComparatorBodyPorts, idealComparatorModelTarget, idealComparatorReadsSupply, SUPPLY_HIGH_LEVEL, } from "./ideal-comparator.js";
import { OPAMP_HIGH_LIMIT, OPAMP_LIMIT_SUPPLIES, OPAMP_LOW_LIMIT, OPAMP_TARGET, UNPOWERED_OPAMP_LIMITS, idealOpampBodyReads, } from "./ideal-opamp.js";
import { builtInSubcircuitDescriptors } from "./registry.js";
function parameter(name, label, defaultValue, unitHint, help) {
    return {
        name,
        label,
        defaultValue,
        unitHint,
        help,
        placeholder: defaultValue,
        required: false,
        editor: "text",
        displayRole: "none",
    };
}
const analog = {
    opamp_differential: parameter("gain", "Differential gain", "1e6", "V/V", "Ideal, frequency-independent differential voltage gain; outputs are not rail-limited."),
    voltage_amplifier: parameter("gain", "Voltage gain", "1", "V/V", "Ideal, frequency-independent voltage gain; output is not rail-limited."),
    transconductance: parameter("gm", "Transconductance", "1m", "S", "Ideal transconductance; positive input voltage drives output current into the load."),
    differential_transconductance: parameter("gm", "Differential transconductance", "1m", "S", "Ideal transconductance driven by the differential input voltage."),
    multiplier: parameter("gain", "Gain", "1", "1/V", "Ideal product V(Y) = gain·V(A)·V(B), from ground; output is not rail-limited."),
    adc: parameter("bits", "Resolution", "8", "bits", "Ideal quantizer: the input maps onto 2^bits levels between VSS and VDD, without a clock."),
    dac: parameter("bits", "Resolution", "8", "bits", "Ideal quantizer: the input code, as a voltage between VSS and VDD, maps onto 2^bits output levels."),
};
const logic = [
    parameter("vt", "Transition width", "10m", "V", "Smooth logic threshold width about half the supply voltage."),
    parameter("td", "Output time constant", "10p", "s", "One-pole output delay; not a digital event propagation delay."),
];
const delay = [
    logic[0],
    {
        ...parameter("tpd", "Propagation delay", "10p", "s", "Nominal 50% propagation delay for a settled full-swing step. RC state with logic regeneration; narrow pulses may be suppressed, not pure transport delay."),
        expressions: false,
    },
].map((definition) => ({ ...definition, expressions: false }));
// The ideal comparator's export checks that each level is a number, so none
// takes an expression in braces.
const comparator = [
    {
        ...parameter(HIGH_LEVEL_PARAMETER, "High output", SUPPLY_HIGH_LEVEL, "V", "VDD, the comparator's own supply, or a level in volts from ground. The logic it drives reads a high above half its supply."),
        keywords: [SUPPLY_HIGH_LEVEL],
    },
    parameter("vlow", "Low output", "0", "V", "Low output level from ground."),
    parameter("vtransition", "Transition width", "1m", "V", "Positive smooth comparator transition width."),
].map((definition) => ({ ...definition, expressions: false }));
// The op-amp's limits are each a number or its supply (ideal-opamp.ts), which
// export checks, so neither takes an expression in braces.
const opamp = [
    parameter("gain", "Open-loop gain", "1e6", "V/V", "Ideal, frequency-independent open-loop voltage gain, exact between the output limits."),
    {
        ...parameter(OPAMP_HIGH_LIMIT, "Output high limit", OPAMP_LIMIT_SUPPLIES[OPAMP_HIGH_LIMIT], "V", `VDD, the op-amp's own supply, or a level in volts from ground. An op-amp with no supply drawn reads ${UNPOWERED_OPAMP_LIMITS[OPAMP_HIGH_LIMIT]} V.`),
        keywords: [OPAMP_LIMIT_SUPPLIES[OPAMP_HIGH_LIMIT]],
        expressions: false,
    },
    {
        ...parameter(OPAMP_LOW_LIMIT, "Output low limit", OPAMP_LIMIT_SUPPLIES[OPAMP_LOW_LIMIT], "V", `VSS, the op-amp's own negative supply or ground, or a level in volts from ground. An op-amp with no supply drawn reads ${UNPOWERED_OPAMP_LIMITS[OPAMP_LOW_LIMIT]} V.`),
        keywords: [OPAMP_LIMIT_SUPPLIES[OPAMP_LOW_LIMIT]],
        expressions: false,
    },
];
const recipes = {
    [OPAMP_TARGET]: { family: "opamp", implementation: "opamp" },
    opamp_differential: {
        family: "linear",
        implementation: "opamp_differential",
    },
    voltage_amplifier: { family: "linear", implementation: "voltage_amplifier" },
    transconductance: { family: "linear", implementation: "transconductance" },
    differential_transconductance: {
        family: "linear",
        implementation: "differential_transconductance",
    },
    [ADDER_TARGET]: { family: "linear", implementation: "adder" },
    multiplier: { family: "signal", implementation: "multiplier" },
    adc: { family: "signal", implementation: "quantizer" },
    dac: { family: "signal", implementation: "quantizer" },
    inverter: { family: "logic", implementation: "inverter" },
    buffer: { family: "logic", implementation: "buffer" },
    delay_cell: { family: "logic", implementation: "delay" },
    ...Object.fromEntries(["and", "nand", "or", "nor", "xor", "xnor"].flatMap((implementation) => ["", "_3", "_4"].map((suffix) => [
        `${implementation}_gate${suffix}`,
        { family: "logic", implementation },
    ]))),
    d_flip_flop: { family: "logic", implementation: "flip-flop" },
    d_flip_flop_q: { family: "logic", implementation: "flip-flop" },
    d_flip_flop_reset: { family: "logic", implementation: "flip-flop" },
    [IDEAL_COMPARATOR_TARGET]: {
        family: "comparator",
        implementation: "comparator",
    },
    [DIFFERENTIAL_COMPARATOR_TARGET]: {
        family: "comparator",
        implementation: "comparator",
    },
};
function contract(target) {
    const recipe = Object.hasOwn(recipes, target) ? recipes[target] : undefined;
    if (!recipe)
        return undefined;
    const { family, implementation } = recipe;
    const descriptor = builtInSubcircuitDescriptors.find((descriptor) => target === IDEAL_COMPARATOR_TARGET
        ? descriptor.symbolId === "comparator"
        : descriptor.target === target);
    return {
        ...recipe,
        target,
        symbolId: descriptor.symbolId,
        // The ideal comparator's numeric body lowers only signal ports; the body
        // its VDD high level chooses adds VDD (ideal-comparator.ts). Its
        // historical five-port external master is not a generated model.
        ports: family === "comparator"
            ? idealComparatorBodyPorts(target, descriptor.ports)
            : descriptor.ports,
        parameters: family === "logic"
            ? implementation === "delay"
                ? delay
                : logic
            : family === "comparator"
                ? comparator
                : family === "opamp"
                    ? opamp
                    : target === ADDER_TARGET
                        ? ADDER_SIGN_PARAMETERS
                        : Object.hasOwn(analog, target)
                            ? [analog[target]]
                            : [],
        backends: {
            spice: "included",
            spectre: family === "linear" ||
                family === "opamp" ||
                family === "comparator" ||
                (family === "logic" && implementation !== "flip-flop")
                ? "included"
                : "external",
            vacask: "included",
        },
    };
}
/** Model facts, not artwork or Project state. Family factories consume these defaults. */
export const builtInModelContracts = [
    ...new Set([
        ...builtInSubcircuitDescriptors.map((descriptor) => descriptor.target),
        IDEAL_COMPARATOR_TARGET,
    ]),
].flatMap((target) => {
    const model = contract(target);
    return model ? [model] : [];
});
const byTarget = new Map(builtInModelContracts.map((model) => [model.target, model]));
export function builtInModelContract(target) {
    return byTarget.get(target);
}
export function builtInModelDefaults(target) {
    return Object.fromEntries((builtInModelContract(target)?.parameters ?? []).flatMap((p) => p.defaultValue === undefined ? [] : [[p.name, p.defaultValue]]));
}
/**
 * The numeric body's own `vhigh` default: the level every comparator placed
 * before VDD became the catalog default stores, so that body prints as it
 * always has.
 */
const NUMERIC_BODY_HIGH_LEVEL = "1";
/** The ideal comparator's model facts as one of its bodies takes them. */
export function idealComparatorBodyContract(body) {
    const model = builtInModelContract(idealComparatorModelTarget(body));
    const readsSupply = idealComparatorReadsSupply(body);
    const descriptor = builtInSubcircuitDescriptors.find((candidate) => candidate.symbolId === model.symbolId);
    return {
        name: body,
        readsSupply,
        ports: idealComparatorBodyPorts(body, descriptor.ports),
        parameters: model.parameters.flatMap((p) => p.name !== HIGH_LEVEL_PARAMETER
            ? [{ name: p.name, defaultValue: p.defaultValue }]
            : readsSupply
                ? []
                : [{ name: p.name, defaultValue: NUMERIC_BODY_HIGH_LEVEL }]),
    };
}
/**
 * The ideal op-amp's model facts as one of its bodies takes them. A numeric
 * limit's default is the level an op-amp with no supply of its own reads.
 */
export function idealOpampBodyContract(body) {
    const model = builtInModelContract(OPAMP_TARGET);
    const reads = idealOpampBodyReads(body);
    return {
        name: body,
        readsVdd: reads.vdd,
        readsVss: reads.vss,
        ports: model.ports,
        parameters: model.parameters.flatMap((p) => p.name === OPAMP_HIGH_LIMIT || p.name === OPAMP_LOW_LIMIT
            ? reads[p.name === OPAMP_HIGH_LIMIT ? "vdd" : "vss"]
                ? []
                : [{ name: p.name, defaultValue: UNPOWERED_OPAMP_LIMITS[p.name] }]
            : [{ name: p.name, defaultValue: p.defaultValue }]),
    };
}
