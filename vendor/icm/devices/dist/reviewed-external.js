import { parameterExpressionBody } from "./parameter-expression.js";
const geometry = (name, label, defaultValue, targetDefaultValue, spiceOrder) => ({
    name,
    label,
    required: true,
    editor: "text",
    unitHint: "m",
    placeholder: defaultValue,
    defaultValue,
    help: `${label === "W" ? "Width" : "Length"} stored canonically in metres`,
    displayRole: label === "W" ? "width" : "length",
    targetUnit: "micrometre",
    targetDefaultValue,
    spiceOrder,
});
const count = (name, label, help, spiceOrder) => ({
    name,
    label,
    required: false,
    editor: "decimal",
    placeholder: "1",
    defaultValue: "1",
    help,
    displayRole: name === "nf" ? "finger-count" : "multiplier",
    targetDefaultValue: "1",
    spiceOrder,
});
const SPICE_SUFFIX = {
    t: 1e12,
    g: 1e9,
    meg: 1e6,
    k: 1e3,
    m: 1e-3,
    u: 1e-6,
    n: 1e-9,
    p: 1e-12,
    f: 1e-15,
    a: 1e-18,
};
function parseSpiceNumber(value) {
    const text = value.trim().toLowerCase();
    const match = /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s*([a-z]*)$/u.exec(text);
    if (!match)
        throw new Error(`Geometry is not a SPICE number: ${value}`);
    const magnitude = Number(match[1]);
    const suffix = match[2] ?? "";
    if (!Number.isFinite(magnitude)) {
        throw new Error(`Geometry is not a SPICE number: ${value}`);
    }
    if (!suffix)
        return magnitude;
    const known = suffix.startsWith("meg") ? "meg" : suffix[0];
    const factor = SPICE_SUFFIX[known];
    if (factor === undefined) {
        throw new Error(`Geometry has an unknown SPICE suffix: ${value}`);
    }
    return magnitude * factor;
}
/** Canonical Project length (metres) to the reviewed SKY130 plain-um form. */
export function projectLengthToSky130Micrometres(value) {
    const expression = parameterExpressionBody(value);
    if (expression !== undefined) {
        const inverse = /^\((.*)\) \* 1u$/u.exec(expression);
        return inverse ? `{${inverse[1]}}` : `{(${expression}) / 1u}`;
    }
    return `${Number((parseSpiceNumber(value) / 1e-6).toPrecision(12))}`;
}
const sizeParameter = (binding, role) => binding.parameters.find((parameter) => parameter.displayRole === role);
/** A part's parameter of this name in any case, as the part spells it. */
const partEntry = (parameters, name) => Object.entries(parameters).find(([key]) => key.toLowerCase() === name.toLowerCase());
/**
 * The reviewed device an external definition calls, unless the Project gives
 * the definition its own artwork or body.
 */
export function reviewedBindingOfDefinition(definition) {
    if (definition.presentation || definition.implementation)
        return undefined;
    return resolveReviewedExternalBinding(definition.name, definition.terminals.map((terminal) => terminal.name));
}
/**
 * The W and L a part's parameters give a reviewed device. A missing one is
 * the device's default, as its wrapper takes it; undefined when the device
 * has no such size.
 */
export function reviewedSize(binding, parameters) {
    const read = (role) => {
        const parameter = sizeParameter(binding, role);
        const text = parameter &&
            (partEntry(parameters, parameter.name)?.[1] ?? parameter.defaultValue);
        if (text === undefined)
            return undefined;
        if (parameterExpressionBody(text) !== undefined)
            return { text };
        try {
            return { text, metres: parseSpiceNumber(text) };
        }
        catch {
            return { text };
        }
    };
    return { width: read("width"), length: read("length") };
}
/**
 * Whether a device's library has a model at the W and L a part's parameters
 * give it. Undefined when that cannot be said: the device declares no
 * modelled sizes, or an expression leaves it open.
 */
export function reviewedSizeModelled(binding, parameters) {
    const sizes = binding.modelledSizes;
    if (!sizes)
        return undefined;
    const size = reviewedSize(binding, parameters);
    const width = size.width?.metres;
    const length = size.length?.metres;
    // ngspice 46 (inpgmod.c) takes a value inside a bin or within 1e-9 m of
    // either edge. An unknown value fits any bin.
    const inside = (value, [low, high]) => value === undefined ||
        Math.abs(value - low) < 1e-9 ||
        Math.abs(value - high) < 1e-9 ||
        (low < value && value < high);
    if (!sizes.bins.some((bin) => inside(length, bin.length) && inside(width, bin.width)))
        return false;
    return width === undefined || length === undefined ? undefined : true;
}
/**
 * What gives a part a size its device has a model for, when its own is none.
 * One of its W and L, the first that is enough, becomes the device's own
 * value; both do when neither alone is enough. W goes before L, and a size in
 * `kept` (one an edit just set) after the other. An expression never changes.
 * Written under the part's own parameter names. Empty when the part's size is
 * modelled or open.
 */
export function reviewedModelledSizeChanges(binding, parameters, kept = []) {
    if (reviewedSizeModelled(binding, parameters) !== false)
        return {};
    const size = reviewedSize(binding, parameters);
    const change = (role) => {
        const parameter = sizeParameter(binding, role);
        if (parameter?.defaultValue === undefined ||
            size[role]?.metres === undefined)
            return [];
        const name = partEntry(parameters, parameter.name)?.[0] ?? parameter.name;
        return [name, parameter.defaultValue];
    };
    const roles = ["width", "length"].toSorted((left, right) => Number(kept.includes(left)) - Number(kept.includes(right)));
    const candidates = [
        ...roles.map((role) => [change(role)]),
        roles.map(change),
    ].map((entries) => Object.fromEntries(entries.filter((entry) => entry.length === 2)));
    const fits = (changes) => Object.keys(changes).length > 0 &&
        reviewedSizeModelled(binding, { ...parameters, ...changes }) !== false;
    return candidates.find(fits) ?? candidates.at(-1);
}
/**
 * A micrometre-geometry size past this (1 mm) is almost always a unit slip,
 * such as SKY130's 0.15 kept without its unit and read as 0.15 m (#1474).
 */
const REVIEWED_SIZE_SLIP_LIMIT = 1e-3;
/**
 * The W and L of a part a reviewed device cannot have: an L, or a W per
 * finger, below the device's limits, an L above them, or either past 1 mm
 * where the library takes micrometres. W is compared per finger, as the PDK sizes a finger. A
 * size or finger count given by an expression is not checked, nor a device
 * modelled only at a few sizes, which REVIEWED_SIZE_UNMODELLED covers.
 */
export function reviewedSizeOutOfRange(binding, parameters) {
    if (binding.modelledSizes)
        return [];
    const size = reviewedSize(binding, parameters);
    const fingerParameter = binding.parameters.find((parameter) => parameter.displayRole === "finger-count");
    const fingers = (() => {
        if (!fingerParameter)
            return 1;
        const text = partEntry(parameters, fingerParameter.name)?.[1] ??
            fingerParameter.defaultValue;
        try {
            const count = text === undefined ? 1 : parseSpiceNumber(text);
            return count > 0 ? count : undefined;
        }
        catch {
            return undefined;
        }
    })();
    const found = [];
    for (const role of ["width", "length"]) {
        const parameter = sizeParameter(binding, role);
        const metres = size[role]?.metres;
        const shared = role === "width" ? fingers : 1;
        if (!parameter || metres === undefined || shared === undefined)
            continue;
        const each = metres / shared;
        const limits = binding.sizeLimits;
        const minimum = role === "width" ? limits?.widthPerFinger : limits?.length[0];
        const maximum = role === "length" ? limits?.length[1] : undefined;
        // A relative margin keeps 0.84u over 2 fingers at 0.42 µm. A unit slip
        // is named as one before it is a size too long.
        const bound = minimum !== undefined && each < minimum * (1 - 1e-9)
            ? { bound: "minimum", limit: minimum }
            : parameter.targetUnit === "micrometre" &&
                each > REVIEWED_SIZE_SLIP_LIMIT
                ? { bound: "slip", limit: REVIEWED_SIZE_SLIP_LIMIT }
                : maximum !== undefined && each > maximum * (1 + 1e-9)
                    ? { bound: "maximum", limit: maximum }
                    : undefined;
        if (bound)
            found.push({
                role,
                parameter: partEntry(parameters, parameter.name)?.[0] ?? parameter.name,
                text: size[role].text,
                metres,
                fingers: shared,
                ...bound,
            });
    }
    return found;
}
const mosTerminals = () => ["D", "G", "S", "B"].map((name) => ({
    targetName: name,
    pinName: name,
    interaction: "canvas",
}));
const sky130MosBinding = (id, masterName, symbolId, width, length, sizes) => ({
    id,
    libraryId: "sky130_fd_pr",
    masterName,
    invocationKind: "external-subcircuit",
    symbolId,
    deviceClass: "mos",
    terminals: mosTerminals(),
    parameters: [
        geometry("w", "W", width, projectLengthToSky130Micrometres(width), 1),
        geometry("l", "L", length, projectLengthToSky130Micrometres(length), 0),
        count("nf", "NF", "Finger count", 2),
        count("m", "M", "ngspice X-line parallel multiplier", 3),
    ],
    ...sizes,
});
/**
 * The bins of SKY130's 16 V models (sky130_fd_pr__nfet_g5v0d16v0.pm3.spice
 * and sky130_fd_pr__pfet_g5v0d16v0.pm3.spice, open_pdks c6d73a35).
 */
const SKY130_NFET_16V_SIZES = {
    bins: [
        { length: [6.95e-7, 7.05e-7], width: [1.9995e-5, 2.00005e-5] },
        { length: [6.95e-7, 7.05e-7], width: [4.995e-6, 5.0005e-6] },
        { length: [6.95e-7, 7.05e-7], width: [4.995e-5, 6.0005e-5] },
        { length: [2.195e-6, 2.25e-6], width: [1.9995e-5, 2.0005e-5] },
        { length: [2.195e-6, 2.25e-6], width: [4.995e-6, 5.005e-6] },
    ],
    description: "W 5, 20 or 50–60 µm at L 0.7 µm, or W 5 or 20 µm at L 2.2 µm",
};
const SKY130_PFET_16V_SIZES = {
    bins: [
        { length: [6.55e-7, 6.65e-7], width: [4.99e-6, 5.01e-5] },
        { length: [2.15e-6, 2.17e-6], width: [4.99e-6, 5.01e-5] },
    ],
    description: "W 5–50 µm at L 0.66 or 2.16 µm",
};
/**
 * The sizes a SKY130 MOS device modelled over a range runs at on Production,
 * whose simulator loads the continuous SKY130 library: measured there by
 * bisection, one device at a time (signed-in POST /api/simulate, 2026-10-08,
 * #1492). The shortest L is the nominal one (each stops 1–2 nm below it).
 * Every device stops below W 0.42 µm per finger. The longest L is the last one
 * that ran: 20.2 µm (20.21 stops) for all but the NVT pair, nfet_03v3_nvt
 * 0.909 µm (0.9095 stops) and nfet_05v0_nvt 24.99 µm (25 stops on a BSIM4
 * parameter fatal). W showed no ceiling up to 500 µm. volare's binned models
 * differ: they run L to 100 µm, nfet_01v8 and pfet_01v8_hvt down to W
 * 0.36 µm, and the NVT pair at a few points only.
 */
const sky130Limits = (shortest, longest, widthPerFinger = 4.2e-7) => ({ sizeLimits: { length: [shortest, longest], widthPerFinger } });
/**
 * The 20 V drain-extended wrappers have one channel each, so only the
 * parallel count is offered. volare's wrappers fix it inside and ignore the W
 * and L they are called with; the hosted continuous library's take them, and
 * stop at their own defaults (#1486). So the X line always gives the channel
 * the volare wrapper fixes, in plain micrometres.
 */
const sky130FixedMosBinding = (id, masterName, symbolId, channel) => ({
    id,
    libraryId: "sky130_fd_pr",
    masterName,
    invocationKind: "external-subcircuit",
    symbolId,
    deviceClass: "mos",
    terminals: mosTerminals(),
    parameters: [count("m", "M", "ngspice X-line parallel multiplier", 0)],
    fixedParameters: [
        { name: "l", value: channel.length },
        { name: "w", value: channel.width },
    ],
    nativeElement: "m1",
});
const sky130ResistorBinding = (id, masterName) => ({
    id,
    libraryId: "sky130_fd_pr",
    masterName,
    invocationKind: "external-subcircuit",
    symbolId: "resistor",
    deviceClass: "resistor",
    terminals: [
        { targetName: "R0", pinName: "1", interaction: "canvas" },
        { targetName: "R1", pinName: "2", interaction: "canvas" },
        {
            targetName: "B",
            pinName: "B",
            interaction: "property",
            role: "substrate",
        },
    ],
    parameters: [
        geometry("w", "W", "1u", "1", 0),
        geometry("l", "L", "5.5u", "5.5", 1),
        count("mult", "MULT", "SKY130 resistor wrapper multiplier", 2),
    ],
});
const sky130MimCapBinding = (id, masterName) => ({
    id,
    libraryId: "sky130_fd_pr",
    masterName,
    invocationKind: "external-subcircuit",
    symbolId: "capacitor",
    deviceClass: "capacitor",
    terminals: [
        { targetName: "C0", pinName: "1", interaction: "canvas" },
        { targetName: "C1", pinName: "2", interaction: "canvas" },
    ],
    parameters: [
        geometry("w", "W", "5u", "5", 0),
        geometry("l", "L", "5u", "5", 1),
        count("mf", "MF", "SKY130 MIM wrapper multiplicity", 2),
    ],
});
/**
 * The SKY130 varactor is drawn with the plain capacitor, whose pins 1 and 2
 * its C0 and C1 take. The Variable Capacitor is not a varactor: it stands for
 * any tunable capacitance (a switched MOM or MIM bank, MOS capacitors, or a
 * varactor), so it stays an ideal capacitor and is offered no reviewed model
 * (#1298).
 */
const sky130VaractorBinding = () => ({
    id: "sky130-cap-var-lvt",
    libraryId: "sky130_fd_pr",
    masterName: "sky130_fd_pr__cap_var_lvt",
    invocationKind: "external-subcircuit",
    symbolId: "capacitor",
    deviceClass: "capacitor",
    terminals: [
        { targetName: "C0", pinName: "1", interaction: "canvas" },
        { targetName: "C1", pinName: "2", interaction: "canvas" },
        {
            targetName: "B",
            pinName: "B",
            interaction: "property",
            role: "substrate",
        },
    ],
    parameters: [
        geometry("w", "W", "5u", "5", 0),
        geometry("l", "L", "500n", "0.5", 1),
        count("vm", "VM", "SKY130 varactor multiplicity", 2),
    ],
});
const sky130InductorBinding = (id, masterName) => ({
    id,
    libraryId: "sky130_fd_pr",
    masterName,
    invocationKind: "external-subcircuit",
    symbolId: "inductor",
    deviceClass: "inductor",
    terminals: [
        { targetName: "A", pinName: "1", interaction: "canvas" },
        { targetName: "B", pinName: "2", interaction: "canvas" },
        {
            targetName: "CT",
            pinName: "CT",
            interaction: "property",
            role: "floating",
        },
        {
            targetName: "SUB",
            pinName: "SUB",
            interaction: "property",
            role: "substrate",
        },
    ],
    parameters: [],
});
const bjtCanvasTerminals = () => ["C", "B", "E"].map((name) => ({
    targetName: name,
    pinName: name,
    interaction: "canvas",
}));
/**
 * A SKY130 vertical PNP. Each size's wrapper exposes C/B/E only; its internal
 * Q card ties substrate to C. The collector is the p-substrate, so C carries
 * the substrate role and belongs on ground (#1314).
 */
const sky130VerticalPnpBinding = (id, masterName) => ({
    id,
    libraryId: "sky130_fd_pr",
    masterName,
    invocationKind: "external-subcircuit",
    symbolId: "pnp",
    deviceClass: "bjt",
    terminals: bjtCanvasTerminals().map((terminal) => terminal.pinName === "C"
        ? { ...terminal, role: "substrate" }
        : terminal),
    // The emitter area is fixed inside; parallel devices are the X-line
    // multiplier, which ngspice 46 scales exactly (m=8 carries 8x the current
    // of m=1). A bandgap's 1:8 ratio is this count.
    parameters: [count("m", "M", "ngspice X-line parallel multiplier", 0)],
});
const bjtTerminalsWithSubstrate = () => [
    ...bjtCanvasTerminals(),
    {
        targetName: "S",
        pinName: "S",
        interaction: "property",
        role: "substrate",
    },
];
/*
 * IHP SG13G2 (IHP-Open-PDK, ihp-sg13g2/libs.tech, checked at 5e6d592e of
 * 2026-09-01): every device is a subcircuit called on an X line, as the
 * PDK's own xschem symbols write it. Its geometry is in metres, the Project's
 * own unit, so values pass through unconverted (no `targetUnit`). Terminal
 * spelling and order follow each `.subckt` line of the ngspice models;
 * defaults and parameter order follow the xschem symbol templates.
 */
const sg13Length = (name, label, defaultValue, help, displayRole, spiceOrder, unitHint = "m") => ({
    name,
    label,
    required: true,
    editor: "text",
    unitHint,
    placeholder: defaultValue,
    defaultValue,
    help,
    displayRole,
    targetDefaultValue: defaultValue,
    spiceOrder,
});
const sg13Count = (name, label, help, spiceOrder, displayRole = "multiplier", defaultValue = "1") => ({
    name,
    label,
    required: false,
    editor: "decimal",
    placeholder: defaultValue,
    defaultValue,
    help,
    displayRole,
    targetDefaultValue: defaultValue,
    spiceOrder,
});
const sg13Canvas = (names) => names.map((name) => ({
    targetName: name,
    pinName: name.toUpperCase(),
    interaction: "canvas",
}));
const sg13Substrate = (pinName) => ({
    targetName: "bn",
    pinName,
    interaction: "property",
    role: "substrate",
});
/** `.subckt sg13_{lv,hv}_{n,p}mos d g s b`: w l ng m (the PSP103 core). */
const sg13MosBinding = (id, masterName, symbolId, width, length) => ({
    id,
    libraryId: "sg13g2_pr",
    masterName,
    invocationKind: "external-subcircuit",
    symbolId,
    deviceClass: "mos",
    terminals: sg13Canvas(["d", "g", "s", "b"]),
    parameters: [
        sg13Length("w", "W", width, "Width in metres", "width", 0),
        sg13Length("l", "L", length, "Length in metres", "length", 1),
        sg13Count("ng", "NG", "Gate finger count", 2, "finger-count"),
        sg13Count("m", "M", "Parallel device count", 3),
    ],
});
/** `.subckt npn13G2* c b e bn`: the SiGe HBTs (VBIC), substrate as a
 * property terminal, with the emitter geometry xschem writes. */
const sg13NpnBinding = (id, masterName, emitterLength, emitterWidth) => ({
    id,
    libraryId: "sg13g2_pr",
    masterName,
    invocationKind: "external-subcircuit",
    symbolId: "npn",
    deviceClass: "bjt",
    terminals: [...sg13Canvas(["c", "b", "e"]), sg13Substrate("S")],
    parameters: [
        sg13Length("le", "LE", emitterLength, "Emitter length in metres", "none", 0),
        sg13Length("we", "WE", emitterWidth, "Emitter width in metres", "none", 1),
        sg13Count("Nx", "NX", "Emitter count, 1 to 10", 2),
    ],
});
/** `.subckt rsil|rppd|rhigh 1 2 bn`: w l (b bends) m. */
const sg13ResistorBinding = (id, masterName, length, bends) => ({
    id,
    libraryId: "sg13g2_pr",
    masterName,
    invocationKind: "external-subcircuit",
    symbolId: "resistor",
    deviceClass: "resistor",
    terminals: [
        { targetName: "1", pinName: "1", interaction: "canvas" },
        { targetName: "2", pinName: "2", interaction: "canvas" },
        sg13Substrate("B"),
    ],
    parameters: [
        sg13Length("w", "W", "500n", "Width in metres", "width", 0),
        sg13Length("l", "L", length, "Length in metres", "length", 1),
        ...(bends ? [sg13Count("b", "B", "Number of bends", 2, "none", "0")] : []),
        sg13Count("m", "M", "Parallel resistor count", 3),
    ],
});
/** `.subckt cap_cmim PLUS MINUS` and `cap_rfcmim PLUS MINUS bn`. */
const sg13MimBinding = (id, masterName, side, feed) => ({
    id,
    libraryId: "sg13g2_pr",
    masterName,
    invocationKind: "external-subcircuit",
    symbolId: "capacitor",
    deviceClass: "capacitor",
    terminals: [
        { targetName: "PLUS", pinName: "1", interaction: "canvas" },
        { targetName: "MINUS", pinName: "2", interaction: "canvas" },
        ...(feed ? [sg13Substrate("B")] : []),
    ],
    parameters: [
        sg13Length("w", "W", side, "Width in metres", "width", 0),
        sg13Length("l", "L", side, "Length in metres", "length", 1),
        ...(feed
            ? [sg13Length("wfeed", "WFEED", feed, "Feed width in metres", "none", 2)]
            : []),
        sg13Count("m", "M", "Parallel capacitor count", 3),
    ],
});
export const reviewedExternalDeviceBindings = [
    sky130MosBinding("sky130-nfet-01v8", "sky130_fd_pr__nfet_01v8", "nmos", "1u", "150n", sky130Limits(1.5e-7, 2.02e-5)),
    sky130MosBinding("sky130-pfet-01v8", "sky130_fd_pr__pfet_01v8", "pmos", "1u", "150n", sky130Limits(1.5e-7, 2.02e-5)),
    sky130MosBinding("sky130-nfet-01v8-lvt", "sky130_fd_pr__nfet_01v8_lvt", "nmos", "1.65u", "150n", sky130Limits(1.5e-7, 2.02e-5)),
    sky130MosBinding("sky130-pfet-01v8-lvt", "sky130_fd_pr__pfet_01v8_lvt", "pmos", "3u", "350n", sky130Limits(3.5e-7, 2.02e-5)),
    sky130MosBinding("sky130-nfet-03v3-nvt", "sky130_fd_pr__nfet_03v3_nvt", "nmos", "1u", "500n", sky130Limits(5e-7, 9.09e-7)),
    sky130MosBinding("sky130-nfet-05v0-nvt", "sky130_fd_pr__nfet_05v0_nvt", "nmos", "1u", "900n", sky130Limits(9e-7, 2.499e-5)),
    sky130MosBinding("sky130-nfet-g5v0d10v5", "sky130_fd_pr__nfet_g5v0d10v5", "nmos", "10u", "500n", sky130Limits(5e-7, 2.02e-5)),
    // Drain-extended devices are drawn with the DMOS symbols. The 16 V pair
    // is modelled only at a few sizes, its defaults among them.
    sky130MosBinding("sky130-nfet-g5v0d16v0", "sky130_fd_pr__nfet_g5v0d16v0", "ndmos", "5u", "700n", {
        nativeElement: "xmain1.msky130_fd_pr__nfet_g5v0d16v0__base",
        modelledSizes: SKY130_NFET_16V_SIZES,
    }),
    sky130MosBinding("sky130-pfet-g5v0d16v0", "sky130_fd_pr__pfet_g5v0d16v0", "pdmos", "5u", "660n", {
        nativeElement: "xmain1.msky130_fd_pr__pfet_g5v0d16v0__base",
        modelledSizes: SKY130_PFET_16V_SIZES,
    }),
    // Each 20 V wrapper's own channel (w_*/hvnel_*/l_* in its volare
    // subcircuit file), in micrometres.
    sky130FixedMosBinding("sky130-nfet-20v0", "sky130_fd_pr__nfet_20v0", "ndmos", { length: "2.95", width: "29.41" }),
    sky130FixedMosBinding("sky130-nfet-20v0-nvt", "sky130_fd_pr__nfet_20v0_nvt", "ndmos", { length: "1.5", width: "30" }),
    sky130FixedMosBinding("sky130-nfet-20v0-zvt", "sky130_fd_pr__nfet_20v0_zvt", "ndmos", { length: "5", width: "30" }),
    sky130FixedMosBinding("sky130-pfet-20v0", "sky130_fd_pr__pfet_20v0", "pdmos", { length: "0.5", width: "30" }),
    sky130MosBinding("sky130-pfet-01v8-hvt", "sky130_fd_pr__pfet_01v8_hvt", "pmos", "1u", "150n", sky130Limits(1.5e-7, 2.02e-5)),
    sky130MosBinding("sky130-pfet-g5v0d10v5", "sky130_fd_pr__pfet_g5v0d10v5", "pmos", "20u", "500n", sky130Limits(5e-7, 2.02e-5)),
    sky130ResistorBinding("sky130-res-high-po", "sky130_fd_pr__res_high_po"),
    sky130ResistorBinding("sky130-res-xhigh-po", "sky130_fd_pr__res_xhigh_po"),
    sky130MimCapBinding("sky130-cap-mim-m3-1", "sky130_fd_pr__cap_mim_m3_1"),
    sky130MimCapBinding("sky130-cap-mim-m3-2", "sky130_fd_pr__cap_mim_m3_2"),
    sky130VaractorBinding(),
    sky130InductorBinding("sky130-ind-03-90", "sky130_fd_pr__ind_03_90"),
    sky130InductorBinding("sky130-ind-05-125", "sky130_fd_pr__ind_05_125"),
    sky130InductorBinding("sky130-ind-05-220", "sky130_fd_pr__ind_05_220"),
    sky130VerticalPnpBinding("sky130-pnp-05v5-w0p68l0p68", "sky130_fd_pr__pnp_05v5_W0p68L0p68"),
    // The 3.4 um emitter stays below its high-injection knee at currents
    // where the 0.68 um one does not (#1614).
    sky130VerticalPnpBinding("sky130-pnp-05v5-w3p40l3p40", "sky130_fd_pr__pnp_05v5_W3p40L3p40"),
    {
        id: "sky130-npn-05v5-w1p00l1p00",
        libraryId: "sky130_fd_pr",
        masterName: "sky130_fd_pr__npn_05v5_W1p00L1p00",
        invocationKind: "external-subcircuit",
        symbolId: "npn",
        deviceClass: "bjt",
        terminals: bjtTerminalsWithSubstrate(),
        parameters: [count("m", "M", "ngspice X-line parallel multiplier", 0)],
    },
    sg13MosBinding("sg13g2-lv-nmos", "sg13_lv_nmos", "nmos", "150n", "130n"),
    sg13MosBinding("sg13g2-lv-pmos", "sg13_lv_pmos", "pmos", "150n", "130n"),
    sg13MosBinding("sg13g2-hv-nmos", "sg13_hv_nmos", "nmos", "300n", "450n"),
    sg13MosBinding("sg13g2-hv-pmos", "sg13_hv_pmos", "pmos", "300n", "400n"),
    sg13NpnBinding("sg13g2-npn13g2", "npn13G2", "900n", "70n"),
    sg13NpnBinding("sg13g2-npn13g2l", "npn13G2l", "1u", "70n"),
    sg13NpnBinding("sg13g2-npn13g2v", "npn13G2v", "1u", "120n"),
    {
        // `.subckt pnpMPA c b e`; xschem writes its area and perimeter from a
        // 0.7 um by 2 um emitter.
        id: "sg13g2-pnpmpa",
        libraryId: "sg13g2_pr",
        masterName: "pnpMPA",
        invocationKind: "external-subcircuit",
        symbolId: "pnp",
        deviceClass: "bjt",
        terminals: sg13Canvas(["c", "b", "e"]),
        parameters: [
            sg13Length("a", "A", "1.4p", "Emitter area in square metres", "none", 0, "m²"),
            sg13Length("p", "P", "5.4u", "Emitter perimeter in metres", "none", 1),
            sg13Count("m", "M", "Parallel device count", 2),
        ],
    },
    sg13ResistorBinding("sg13g2-rsil", "rsil", "500n", false),
    sg13ResistorBinding("sg13g2-rppd", "rppd", "500n", true),
    sg13ResistorBinding("sg13g2-rhigh", "rhigh", "960n", true),
    sg13MimBinding("sg13g2-cap-cmim", "cap_cmim", "7u"),
    sg13MimBinding("sg13g2-cap-rfcmim", "cap_rfcmim", "10u", "5u"),
];
/** The Library gate drawn for a cell function, by input count (#1450). */
const GATE_SYMBOLS = {
    inv: [undefined, "inverter"],
    buf: [undefined, "buffer"],
    nand: [undefined, undefined, "nand-gate", "nand-gate-3", "nand-gate-4"],
    nor: [undefined, undefined, "nor-gate", "nor-gate-3", "nor-gate-4"],
    and: [undefined, undefined, "and-gate", "and-gate-3", "and-gate-4"],
    or: [undefined, undefined, "or-gate", "or-gate-3", "or-gate-4"],
    xor: [undefined, undefined, "xor-gate", "xor-gate-3", "xor-gate-4"],
    xnor: [undefined, undefined, "xnor-gate", "xnor-gate-3", "xnor-gate-4"],
};
const GATE_OF_SYMBOL = new Map(Object.entries(GATE_SYMBOLS).flatMap(([fn, symbols]) => symbols.flatMap((symbolId, inputs) => symbolId ? [[symbolId, { fn: fn, inputs }]] : [])));
/** Whether a symbol is one of the Library logic gates (#1450). */
export function isLibraryLogicGate(symbolId) {
    return GATE_OF_SYMBOL.has(symbolId);
}
const GATE_INPUTS = ["A", "B", "C", "D"];
const INVERTING = new Set([
    "inv",
    "nand",
    "nor",
    "xnor",
]);
const builds = (rule, fn, inputs) => inputs <= (rule.maxInputs[fn] ?? 4);
/**
 * Reads a cell name by a library's pattern: a one-input cell matches group
 * `inv` or `buf`, any other gate `fn` (spelled as `functions` names it) and
 * `inputs`.
 */
const readGateCell = (pattern, canonical, functions) => (name) => {
    const masterName = canonical(name);
    const groups = pattern.exec(masterName)?.groups;
    if (!groups)
        return undefined;
    if (groups.inv)
        return { masterName, fn: "inv", inputs: 1 };
    if (groups.buf)
        return { masterName, fn: "buf", inputs: 1 };
    const fn = functions[groups.fn];
    return fn ? { masterName, fn, inputs: Number(groups.inputs) } : undefined;
};
const LOWER_CASE_FUNCTIONS = {
    nand: "nand",
    nor: "nor",
    and: "and",
    or: "or",
    xor: "xor",
    xnor: "xnor",
};
const lowerCaseExample = (prefix) => (fn, inputs) => `${prefix}${fn}${inputs > 1 ? inputs : ""}_1`;
const TSMC28_FUNCTIONS = {
    ND: "nand",
    NR: "nor",
    AN: "and",
    OR: "or",
    XOR: "xor",
    XNR: "xnor",
};
const TSMC28_STEMS = {
    inv: "INV",
    buf: "BUFF",
    nand: "ND",
    nor: "NR",
    and: "AN",
    or: "OR",
    xor: "XOR",
    xnor: "XNR",
};
const STANDARD_CELL_RULES = [
    {
        // sky130_fd_sc_hd__nand2_1: inputs A–D, VGND VNB VPB VPWR, then the
        // output. Clock, delay and probe buffers and inverters have the same pins.
        libraryId: "sky130_fd_sc_hd",
        read: readGateCell(/^sky130_fd_sc_hd__(?:(?<inv>inv|clkinv|clkinvlp|bufinv)|(?<buf>buf|bufbuf|clkbuf|clkdlybuf4s\d\d|dlygate4sd\d|dlymetal6s\ds|probec?_p)|(?<fn>nand|nor|and|or|xor|xnor)(?<inputs>[234]))_\d+$/u, (name) => name.toLowerCase(), LOWER_CASE_FUNCTIONS),
        pins: (fn, inputs) => [
            ...GATE_INPUTS.slice(0, inputs).map((pin) => [pin, pin]),
            ["VGND", "VSS", "VSS"],
            ["VNB", "VSS", "VSS"],
            ["VPB", "VDD", "VDD"],
            ["VPWR", "VDD", "VDD"],
            // Y when the function inverts, X otherwise, except that the library
            // names xnor3's output X.
            [INVERTING.has(fn) && !(fn === "xnor" && inputs === 3) ? "Y" : "X", "Y"],
        ],
        example: lowerCaseExample("sky130_fd_sc_hd__"),
        maxInputs: { xor: 3, xnor: 3 },
        namespace: /^sky130_fd_sc_hd__/iu,
    },
    {
        // sg13g2_nand2_1: the output first (Y inverting, X not), inputs A–D,
        // VDD VSS; the delay gates are buffers.
        libraryId: "sg13g2_stdcell",
        read: readGateCell(/^sg13g2_(?:(?<inv>inv)|(?<buf>buf|dlygate4sd\d)|(?<fn>nand|nor|and|or|xor|xnor)(?<inputs>[234]))_\d+$/u, (name) => name.toLowerCase(), LOWER_CASE_FUNCTIONS),
        pins: (fn, inputs) => [
            [INVERTING.has(fn) ? "Y" : "X", "Y"],
            ...GATE_INPUTS.slice(0, inputs).map((pin) => [pin, pin]),
            ["VDD", "VDD", "VDD"],
            ["VSS", "VSS", "VSS"],
        ],
        example: lowerCaseExample("sg13g2_"),
        maxInputs: { xor: 2, xnor: 2 },
        namespace: /^sg13g2_/iu,
    },
    {
        // ND2D1BWP12T30P140[LVT]: [CK]<function><inputs>[X|OPT…]D<drive>; the
        // clock (CK, DCCK), delay (DEL), ECO (G…MCO) and level-shifting (LVLHL)
        // buffers and inverters too. Input I or A1–A4, output ZN inverting and Z
        // not, then VDD VSS.
        libraryId: "tcbn28hpcplusbwp12t30p140",
        read: readGateCell(/^(?:(?<inv>INV|CKN|DCCKN|GINVMCO)|(?<buf>BUFFX?|CKB|DCCKB|DEL\d{3}|GBUFFMCO|LVLHL)|(?:CK)?(?<fn>ND|NR|AN|OR|XOR|XNR)(?<inputs>[234])(?:X|OPT[A-Z]*)?)D\d+(?:P\d+)?BWP12T30P140(?:LVT)?$/u, (name) => name.toUpperCase(), TSMC28_FUNCTIONS),
        pins: (fn, inputs) => [
            ...(inputs === 1
                ? [["I", "A"]]
                : GATE_INPUTS.slice(0, inputs).map((pin, index) => [
                    `A${index + 1}`,
                    pin,
                ])),
            [INVERTING.has(fn) ? "ZN" : "Z", "Y"],
            ["VDD", "VDD", "VDD"],
            ["VSS", "VSS", "VSS"],
        ],
        example: (fn, inputs) => `${TSMC28_STEMS[fn]}${inputs > 1 ? inputs : ""}D1BWP12T30P140`,
        maxInputs: {},
        namespace: /BWP12T30P140(?:LVT)?$/iu,
    },
];
/**
 * The standard-cell library a cell name belongs to, any cell of it, gate or
 * not (#1596): for telling a cell no Library gate takes from an unknown name.
 */
export function standardCellLibraryOfName(name) {
    return STANDARD_CELL_RULES.find((rule) => rule.namespace.test(name))
        ?.libraryId;
}
/** A standard cell's binding id: this prefix and the cell's name. */
const STANDARD_CELL_ID_PREFIX = "std-cell-";
/** Cells read so far, reused while they last; cleared at 256 entries, since any drive number reads. */
const standardCellBindings = new Map();
/**
 * A standard cell of a Library gate's function (#1450), read from its name,
 * whichever gate that is: the gate keeps its pins, and its VDD/VSS property
 * terminals feed each domain's rails. Only a gate's own model choice asks for
 * any cell; elsewhere a cell is reviewed only behind its gate (see
 * {@link reviewedExternalBindingForMaster}).
 */
export function standardCellBindingForMaster(name) {
    const key = name.toLowerCase();
    const known = standardCellBindings.get(key);
    if (known)
        return known;
    for (const rule of STANDARD_CELL_RULES) {
        const cell = rule.read(name);
        const symbolId = cell && builds(rule, cell.fn, cell.inputs)
            ? GATE_SYMBOLS[cell.fn][cell.inputs]
            : undefined;
        if (!cell || !symbolId)
            continue;
        const binding = {
            id: `${STANDARD_CELL_ID_PREFIX}${cell.masterName}`,
            libraryId: rule.libraryId,
            masterName: cell.masterName,
            invocationKind: "external-subcircuit",
            symbolId,
            deviceClass: "logic",
            terminals: rule
                .pins(cell.fn, cell.inputs)
                .map(([targetName, pinName, supply]) => supply
                ? { targetName, pinName, interaction: "property", supply }
                : { targetName, pinName, interaction: "canvas" }),
            parameters: [],
        };
        if (standardCellBindings.size >= 256)
            standardCellBindings.clear();
        standardCellBindings.set(key, binding);
        return binding;
    }
    return undefined;
}
const reviewedById = new Map(reviewedExternalDeviceBindings.map((binding) => [
    binding.id,
    binding,
]));
/**
 * The reviewed device of a master name. `symbolId` is the symbol the part is
 * drawn with: a standard cell is reviewed only behind the Library gate of its
 * function (#1450). Without it, as when importing a netlist or drawing a
 * definition's block, a cell is an ordinary external subcircuit.
 */
export function reviewedExternalBindingForMaster(masterName, symbolId) {
    const normalized = masterName.toLowerCase();
    const device = reviewedExternalDeviceBindings.find((binding) => binding.masterName.toLowerCase() === normalized);
    if (device || !symbolId || !GATE_OF_SYMBOL.has(symbolId))
        return device;
    const cell = standardCellBindingForMaster(masterName);
    return cell?.symbolId === symbolId ? cell : undefined;
}
/** The binding a netlisted Instance recorded, standard cells included. */
export function reviewedExternalBindingById(id) {
    if (!id)
        return undefined;
    return (reviewedById.get(id) ??
        (id.startsWith(STANDARD_CELL_ID_PREFIX)
            ? standardCellBindingForMaster(id.slice(STANDARD_CELL_ID_PREFIX.length))
            : undefined));
}
export function reviewedExternalBindingForTerminalCount(masterName, terminalCount) {
    const binding = reviewedExternalBindingForMaster(masterName);
    return binding?.terminals.length === terminalCount ? binding : undefined;
}
/**
 * Exact master and exact public terminal order are both required; `symbolId`
 * as in {@link reviewedExternalBindingForMaster}.
 */
export function resolveReviewedExternalBinding(masterName, terminalNames, symbolId) {
    const binding = reviewedExternalBindingForMaster(masterName, symbolId);
    return binding &&
        binding.terminals.length === terminalNames.length &&
        binding.terminals.every((terminal, index) => terminal.targetName.toLowerCase() ===
            terminalNames[index]?.toLowerCase())
        ? binding
        : undefined;
}
/**
 * Whether a definition declares a reviewed library interface, a PDK device or
 * a standard cell (#1450) in its exact pin order, whichever symbol draws it:
 * the library supplies its body, so the Project need not.
 */
export function resolveReviewedLibraryInterface(masterName, terminalNames) {
    return resolveReviewedExternalBinding(masterName, terminalNames, standardCellBindingForMaster(masterName)?.symbolId);
}
/** The process each reviewed library belongs to: a PDK's standard cells ride with its primitives. */
export const LIBRARY_PROCESS = {
    sky130_fd_pr: "sky130",
    sky130_fd_sc_hd: "sky130",
    sg13g2_pr: "sg13g2",
    sg13g2_stdcell: "sg13g2",
    tcbn28hpcplusbwp12t30p140: "tsmc28",
};
/** Reviewed masters a part may take, from one PDK's libraries or all of them. */
export function reviewedExternalModelSuggestions(symbolId, libraryId) {
    const sameProcess = (id) => !libraryId || LIBRARY_PROCESS[id] === LIBRARY_PROCESS[libraryId];
    // A gate is offered each library's weakest cell of its function; any other
    // drive strength or variant of the library is accepted as well.
    const gate = GATE_OF_SYMBOL.get(symbolId);
    if (gate)
        return STANDARD_CELL_RULES.filter((rule) => sameProcess(rule.libraryId) && builds(rule, gate.fn, gate.inputs)).map((rule) => rule.example(gate.fn, gate.inputs));
    return reviewedExternalDeviceBindings
        .filter((binding) => reviewedExternalBindingSupportsSymbol(binding, symbolId) &&
        sameProcess(binding.libraryId))
        .map((binding) => binding.masterName);
}
/**
 * Whether a part drawn with this symbol may take the reviewed device. Only its
 * own symbol may: the binding's terminals name that symbol's pins, so on any
 * other drawing they are pins the part does not have, and it can be neither
 * wired nor exported.
 */
export function reviewedExternalBindingSupportsSymbol(binding, symbolId) {
    return binding.symbolId === symbolId;
}
/** Reviewed SKY130 plain-um input to the canonical Project length spelling. */
export function sky130MicrometresToProjectLength(value) {
    const text = value.trim();
    const expression = parameterExpressionBody(text);
    if (expression !== undefined) {
        const inverse = /^\((.*)\) \/ 1u$/u.exec(expression);
        return inverse ? `{${inverse[1]}}` : `{(${expression}) * 1u}`;
    }
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/iu.test(text)) {
        throw new Error(`Reviewed SKY130 geometry must be a plain micrometre number: ${value}`);
    }
    const micrometres = Number(text);
    if (!Number.isFinite(micrometres)) {
        throw new Error(`Geometry is not a finite number: ${value}`);
    }
    if (Math.abs(micrometres) >= 1 || micrometres === 0) {
        return `${Number(micrometres.toPrecision(12))}u`;
    }
    return `${Number((micrometres * 1000).toPrecision(12))}n`;
}
