function record(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value)
        ? value
        : undefined;
}
function identifierLabel(value, fallback) {
    const normalized = value
        .trim()
        .replace(/[^A-Za-z0-9_]+/gu, "_")
        .replace(/^_+|_+$/gu, "");
    const candidate = normalized || fallback;
    return /^[A-Za-z_]/u.test(candidate) ? candidate : `Output_${candidate}`;
}
function uniqueLabel(requested, fallback, used) {
    const base = identifierLabel(requested, fallback).slice(0, 128);
    let candidate = base;
    for (let suffix = 2; used.has(candidate.toLowerCase()); suffix += 1) {
        const ending = `_${suffix}`;
        candidate = `${base.slice(0, 128 - ending.length)}${ending}`;
    }
    used.add(candidate.toLowerCase());
    return candidate;
}
function array(value) {
    return Array.isArray(value) ? value : [];
}
function voltageBaseNetId(document, anchor) {
    if (anchor.kind === "base-net" && typeof anchor.netId === "string")
        return anchor.netId;
    if (anchor.kind === "junction" && typeof anchor.junctionId === "string")
        return record(array(document.junctions).find((value) => record(value)?.id === anchor.junctionId))?.netId;
    if (anchor.kind === "route" && typeof anchor.routeId === "string")
        return record(array(document.routes).find((value) => record(value)?.id === anchor.routeId))?.netId;
    if (anchor.kind === "terminal" &&
        typeof anchor.instanceId === "string" &&
        typeof anchor.pinName === "string") {
        for (const netValue of array(document.nets)) {
            const net = record(netValue);
            if (typeof net?.id === "string" &&
                array(net.terminals).some((terminalValue) => {
                    const terminal = record(terminalValue);
                    return (terminal?.instanceId === anchor.instanceId &&
                        terminal?.pinName === anchor.pinName);
                }))
                return net.id;
        }
    }
    return undefined;
}
/**
 * Derive an initial authored label from the same electrical identities the
 * editor presents. The result is copied into `output.label`; it is not a
 * second display-name protocol and may be renamed independently afterwards.
 */
function migratedProbeLabel(project, probe) {
    const document = array(project.documents)
        .map(record)
        .find((candidate) => candidate?.id === probe.documentId);
    if (!document)
        return String(probe.id);
    if (probe.kind === "source-current" && typeof probe.instanceId === "string") {
        const instance = array(document.instances)
            .map(record)
            .find((candidate) => candidate?.id === probe.instanceId);
        const reference = typeof instance?.reference === "string"
            ? instance.reference
            : probe.instanceId;
        return `${reference}_current`;
    }
    const anchor = record(probe.anchor);
    if (probe.kind !== "net-voltage" || !anchor)
        return String(probe.id);
    const netId = voltageBaseNetId(document, anchor);
    if (!netId)
        return String(probe.id);
    const nameClaim = array(document.connectivityEvidence)
        .map(record)
        .find((evidence) => evidence?.kind === "name-claim" &&
        evidence.netId === netId &&
        typeof evidence.name === "string");
    if (typeof nameClaim?.name === "string")
        return nameClaim.name;
    const netlist = record(document.netlist);
    const formalTerminal = array(netlist?.terminals)
        .map(record)
        .find((terminal) => terminal?.netId === netId && typeof terminal.name === "string");
    if (typeof formalTerminal?.name === "string")
        return formalTerminal.name;
    const endpoint = array(document.nets)
        .map(record)
        .find((net) => net?.id === netId);
    const terminals = array(endpoint?.terminals).map(record);
    const terminal = terminals.find((candidate) => {
        if (typeof candidate?.instanceId !== "string")
            return false;
        const instance = array(document.instances)
            .map(record)
            .find((value) => value?.id === candidate.instanceId);
        return record(record(instance?.netlist)?.binding)?.kind === "subcircuit";
    }) ?? terminals[0];
    if (typeof terminal?.instanceId === "string" &&
        typeof terminal.pinName === "string") {
        const instance = array(document.instances)
            .map(record)
            .find((candidate) => candidate?.id === terminal.instanceId);
        const netlist = record(instance?.netlist);
        const binding = record(netlist?.binding);
        if (binding?.kind === "subcircuit")
            return terminal.pinName;
        const reference = typeof instance?.reference === "string"
            ? instance.reference
            : terminal.instanceId;
        return `${reference}_${terminal.pinName}`;
    }
    return String(probe.id);
}
/** Replace persisted primitive probes with the canonical output-expression form. */
export function upgradeSchema42To43WithReport(raw) {
    const project = structuredClone(raw);
    const migratedOutputIds = [];
    let changed = false;
    const setups = Array.isArray(project.simulationSetups)
        ? project.simulationSetups
        : [];
    for (const value of setups) {
        const setup = record(value);
        const input = record(setup?.input);
        if (!setup)
            continue;
        setup.version = 2;
        changed = true;
        if (input?.kind === "structured" && Array.isArray(input.probes)) {
            const usedLabels = new Set();
            input.outputs = input.probes.map((probeValue) => {
                const probe = record(probeValue);
                if (!probe || typeof probe.id !== "string")
                    return probeValue;
                migratedOutputIds.push(probe.id);
                const expression = { ...probe };
                delete expression.id;
                expression.kind =
                    expression.kind === "net-voltage" ? "voltage" : "current";
                return {
                    id: probe.id,
                    label: uniqueLabel(migratedProbeLabel(project, probe), probe.id, usedLabels),
                    expression,
                };
            });
            delete input.probes;
        }
    }
    project.schemaVersion = 43;
    return {
        project,
        report: {
            changed,
            migratedOutputIds,
        },
    };
}
export function upgradeSchema42To43(raw) {
    return upgradeSchema42To43WithReport(raw).project;
}
