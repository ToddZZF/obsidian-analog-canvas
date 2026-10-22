function record(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value)
        ? value
        : undefined;
}
function migrateExpression(value, changed) {
    const expression = record(value);
    if (!expression)
        return;
    if (expression.kind === "current" && typeof expression.pinName !== "string") {
        // Schema 43 could author current outputs only for independent sources.
        // Both built-in source descriptors use `+` as their first terminal, and
        // ngspice's source-current sign is current entering that terminal.
        expression.pinName = "+";
        changed.value = true;
        return;
    }
    if ("operand" in expression)
        migrateExpression(expression.operand, changed);
    if ("left" in expression)
        migrateExpression(expression.left, changed);
    if ("right" in expression)
        migrateExpression(expression.right, changed);
}
/** Add the terminal identity omitted by schema-43 source-current outputs. */
export function upgradeSchema43To44WithReport(raw) {
    const project = structuredClone(raw);
    const changed = { value: false };
    const migratedOutputIds = [];
    const setups = Array.isArray(project.simulationSetups)
        ? project.simulationSetups
        : [];
    for (const setupValue of setups) {
        const input = record(record(setupValue)?.input);
        if (input?.kind !== "structured" || !Array.isArray(input.outputs))
            continue;
        for (const outputValue of input.outputs) {
            const output = record(outputValue);
            if (!output)
                continue;
            const outputChanged = { value: false };
            migrateExpression(output.expression, outputChanged);
            if (outputChanged.value && typeof output.id === "string")
                migratedOutputIds.push(output.id);
            changed.value ||= outputChanged.value;
        }
    }
    project.schemaVersion = 44;
    return {
        project,
        report: { changed: changed.value, migratedOutputIds },
    };
}
export function upgradeSchema43To44(raw) {
    return upgradeSchema43To44WithReport(raw).project;
}
