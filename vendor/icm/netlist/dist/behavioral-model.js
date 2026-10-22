export function voltage(name, positive, negative, expression) {
    return { kind: "voltage", name, nodes: [positive, negative], expression };
}
export function current(name, positive, negative, expression) {
    return { kind: "current", name, nodes: [positive, negative], expression };
}
export function passive(kind, name, positive, negative, value, expression = false) {
    return { kind, name, nodes: [positive, negative], value, expression };
}
export function printSpiceBehavioralModel(model) {
    return [
        ...(model.comment ? [`* ${model.comment}`] : []),
        `.subckt ${model.name} ${model.ports.join(" ")} params: ${model.parameters.map((p) => `${p.name}=${p.defaultValue}`).join(" ")}`,
        ...model.elements.map((element) => {
            const prefix = `${element.name} ${element.nodes.join(" ")}`;
            return element.kind === "voltage" || element.kind === "current"
                ? `${prefix} ${element.kind === "voltage" ? "V" : "I"}={${element.expression}}`
                : `${prefix} ${element.expression ? `{${element.value}}` : element.value}`;
        }),
        `.ends ${model.name}`,
    ];
}
/** Native Spectre syntax, projected from the same nodes/equations/defaults. */
export function printSpectreBehavioralModel(model) {
    return [
        ...(model.comment ? [`// ${model.comment}`] : []),
        `subckt ${model.name} (${model.ports.join(" ")})`,
        ...(model.parameters.length
            ? [
                `parameters ${model.parameters.map((p) => `${p.name}=${p.defaultValue}`).join(" ")}`,
            ]
            : []),
        ...model.elements.map((element) => {
            const prefix = `${element.name} (${element.nodes.join(" ")})`;
            return element.kind === "voltage" || element.kind === "current"
                ? `${prefix} bsource ${element.kind === "voltage" ? "v" : "i"}=${projectBehavioralExpression(element.expression, (value) => value)}`
                : `${prefix} ${element.kind} ${element.kind === "capacitor" ? "c" : "r"}=${element.value}`;
        }),
        `ends ${model.name}`,
    ];
}
/** Translate only the reviewed expression notation; never parse device cards. */
export function projectBehavioralExpression(raw, scalar) {
    const accesses = [];
    const protectedExpression = raw.replace(/V\(([^()]+)\)/gu, (_, nodes) => {
        const index = accesses.push(`v(${nodes})`) - 1;
        return `__access${index}`;
    });
    return scalar(protectedExpression).replace(/__access(\d+)/gu, (_, index) => accesses[Number(index)]);
}
