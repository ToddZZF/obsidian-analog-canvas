import { deviceDescriptor, referencePolicyForInstance, } from "@icm/devices";
function effectiveParameterValue(instance, parameter) {
    const netlist = instance.netlist?.parameters[parameter.name];
    if (netlist !== undefined)
        return netlist.trim();
    return "";
}
function boldText(value) {
    return {
        kind: "span",
        style: "bold",
        children: [{ kind: "text", value }],
    };
}
function boldDocument(value) {
    return { runs: [boldText(value)] };
}
/**
 * A magnetic device's parameter under its textbook name: the letter, then
 * the rest as its subscript (L₁, L₂, C_B, L_p), followed by any value. A
 * one-letter name such as K stays as it is.
 */
function magneticParameterDocument(label, rest = "") {
    const match = /^([A-Za-z])([A-Za-z0-9]+)$/u.exec(label);
    if (!match)
        return boldDocument(`${label}${rest}`);
    return {
        runs: [
            {
                kind: "span",
                style: "bold",
                children: [
                    { kind: "text", value: match[1] },
                    {
                        kind: "span",
                        style: "subscript",
                        children: [{ kind: "text", value: match[2] }],
                    },
                    ...(rest ? [{ kind: "text", value: rest }] : []),
                ],
            },
        ],
    };
}
/**
 * One pure authority for the optional Value annotation beside an instance.
 * Electrical truth stays in the typed netlist parameters; this only projects
 * it to display text and never
 * writes back. Preserve authored spelling, including any explicit unit; never
 * append a guessed suffix. Keep upright bold text and a stacked MOS W/L fraction.
 */
/**
 * Whether this Symbol's device can ever annotate a value.
 *
 * Different from {@link displayableInstanceValue}, which answers whether one
 * instance has a value to show right now: a resistor with no resistance typed
 * yet is undisplayable but value-capable, and its Value control belongs on
 * screen so the person can see what is missing. A switch, and anything with
 * no device descriptor at all, can never carry one.
 */
export function symbolSupportsValueAnnotation(symbolId) {
    return (deviceDescriptor(symbolId)?.capabilities.supportsValueAnnotation === true);
}
/** Compound magnetic devices expose independent parameters instead of one Value. */
export function magneticDisplayParameters(symbolId) {
    if (!["xfmr", "tcoil", "center-tap-inductor"].includes(symbolId))
        return [];
    const parameters = deviceDescriptor(symbolId)?.parameters ?? [];
    return [
        ...parameters.filter((parameter) => parameter.name === "k"),
        ...parameters.filter((parameter) => parameter.name !== "k"),
    ];
}
/**
 * The parameters a person may show beside a part, each in a label of its own:
 * a compound magnetic part's (k, Lp, Ls, …), or a device's multiplier m, as
 * bandgap and mirror figures print "×8" by the transistor (#1423).
 */
export function instanceDisplayParameters(symbolId) {
    const magnetic = magneticDisplayParameters(symbolId);
    if (magnetic.length)
        return magnetic;
    return (deviceDescriptor(symbolId)?.parameters ?? []).filter((parameter) => parameter.displayRole === "multiplier");
}
/** Preserve authored values and units while identifying which parameter is shown. */
export function displayableInstanceParameter(instance, name, options = {}) {
    const parameter = deviceDescriptor(instance.symbolId)?.parameters.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase());
    const label = parameter?.label ?? name;
    const multiplier = parameter?.displayRole === "multiplier";
    const magnetic = magneticDisplayParameters(instance.symbolId).some((candidate) => candidate.name.toLowerCase() === name.toLowerCase());
    const named = (rest = "") => magnetic
        ? magneticParameterDocument(label, rest)
        : boldDocument(`${label}${rest}`);
    // A multiplier reads as a count of devices, "×8", not "M = 8".
    const counted = (value) => multiplier ? boldDocument(`×${value}`) : named(` = ${value}`);
    if (options.showValue === false) {
        return {
            kind: "displayable",
            content: named(),
        };
    }
    const value = Object.entries(instance.netlist?.parameters ?? {})
        .find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1]
        .trim();
    if (!value)
        return { kind: "undisplayable", reason: `Parameter ${name} is empty` };
    return {
        kind: "displayable",
        content: counted(value),
    };
}
/**
 * Whether this Instance gets a reference designator, by the policy that
 * names it. A placed Cell's block is derived per Project, so its Symbol has
 * no designator of its own, yet the Cell instance is X1 in the netlist; a
 * person probing `v(xdut.x1.net0)` needs to show it (#1317).
 */
export function instanceCarriesReference(instance, project) {
    return referencePolicyForInstance(instance, project).kind !== "none";
}
/**
 * Whether a part's value prints this parameter as its ×m: a MOS's W/L does
 * (#752), so its own ×m label is wanted only while the W/L is hidden.
 */
export function valuePrintsMultiplier(symbolId, parameterName) {
    const parameters = symbolId
        ? (deviceDescriptor(symbolId)?.parameters ?? [])
        : [];
    return (parameters.some((parameter) => parameter.displayRole === "multiplier" &&
        parameter.name.toLowerCase() === parameterName.toLowerCase()) && parameters.some((parameter) => parameter.displayRole === "width"));
}
/**
 * The multiplier a part's W/L prints after its fraction once it has W and
 * L, or undefined. A parallel multiplier changes the device the drawing
 * stands for, so it is part of the value rather than a hidden parameter.
 * One is the implicit default and stays unwritten.
 */
export function printedValueMultiplier(instance) {
    const multiplier = deviceDescriptor(instance.symbolId)?.parameters.find((parameter) => parameter.displayRole === "multiplier");
    if (!multiplier || !valuePrintsMultiplier(instance.symbolId, multiplier.name))
        return undefined;
    const value = effectiveParameterValue(instance, multiplier);
    return value !== "" && Number(value) !== 1 ? value : undefined;
}
export function displayableInstanceValue(instance) {
    const definition = deviceDescriptor(instance.symbolId);
    if (!definition) {
        return {
            kind: "undisplayable",
            reason: `Symbol ${instance.symbolId} has no netlist device class`,
        };
    }
    const width = definition.parameters.find((parameter) => parameter.displayRole === "width");
    const length = definition.parameters.find((parameter) => parameter.displayRole === "length");
    if (width || length) {
        const widthValue = width ? effectiveParameterValue(instance, width) : "";
        const lengthValue = length ? effectiveParameterValue(instance, length) : "";
        if (!widthValue || !lengthValue || !width || !length) {
            return {
                kind: "undisplayable",
                reason: definition.deviceClass === "mos"
                    ? "MOS value needs both W and L"
                    : `${definition.deviceClass} value needs both width and length`,
            };
        }
        const multiplierValue = printedValueMultiplier(instance);
        return {
            kind: "displayable",
            content: {
                runs: [
                    {
                        kind: "fraction",
                        numerator: boldDocument(widthValue),
                        denominator: boldDocument(lengthValue),
                    },
                    ...(multiplierValue !== undefined
                        ? [
                            {
                                kind: "span",
                                style: "bold",
                                children: [
                                    { kind: "text", value: ` ×${multiplierValue}` },
                                ],
                            },
                        ]
                        : []),
                ],
            },
        };
    }
    const value = definition.parameters.find((parameter) => parameter.displayRole === "value");
    const valueText = value ? effectiveParameterValue(instance, value) : "";
    if (!value) {
        return {
            kind: "undisplayable",
            reason: `${definition.deviceClass} has no defined value display`,
        };
    }
    if (!valueText) {
        return {
            kind: "undisplayable",
            reason: `${definition.deviceClass} value parameter is empty`,
        };
    }
    return {
        kind: "displayable",
        content: boldDocument(valueText),
    };
}
