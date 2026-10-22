import { analyzeDesignNetlist, SIMULATION_DECK_GROUND } from "./extract.js";
import { inspectSimulationSourceGraph } from "./simulation-source-graph.js";
import { listAuthoredCircuitScopes, resolveAuthoredCircuitScope, } from "./simulation-source-scopes.js";
/** Run-local display metadata. Native vector spelling and electrical identity never change. */
export function ngspiceSignalNames(project, input) {
    return Object.fromEntries(Object.entries(ngspiceSignals(project, input)).map(([vector, signal]) => [
        vector,
        signal.label,
    ]));
}
/** Native vectors and Canvas addresses share the same resolved traversal. */
export function ngspiceSignals(project, input, selectedScope) {
    const graph = inspectSimulationSourceGraph(input);
    const authoredNetIds = new Map(project.documents.map((document) => [
        document.id,
        new Set(document.nets.map((net) => net.id)),
    ]));
    const labels = new Map();
    const targets = new Map();
    for (const binding of input.circuitBindings) {
        if (!graph.paths.includes(binding.path))
            continue;
        const ir = analyzeDesignNetlist(project, {
            format: "spice",
            rootDocumentId: binding.documentId,
            ...SIMULATION_DECK_GROUND,
            rootAsTopLevel: binding.emission === "top-level",
        }).ir;
        if (!ir)
            continue;
        const root = ir.cells.find((cell) => cell.id === ir.topCellId);
        if (!root)
            continue;
        for (const scope of listAuthoredCircuitScopes(graph, binding, ir)) {
            if (selectedScope &&
                (selectedScope.bindingId !== scope.bindingId ||
                    JSON.stringify(selectedScope.callPath) !==
                        JSON.stringify(scope.callPath)))
                continue;
            const resolved = resolveAuthoredCircuitScope(graph, binding, ir, scope);
            if (!resolved.ok)
                continue;
            const qualify = resolved.node;
            let visits = 0;
            function visit(cell, nodes, path, ancestors, occurrence) {
                if (++visits > 4096 || ancestors.has(cell.id))
                    return;
                const local = new Map(nodes);
                for (const net of cell.nets) {
                    const key = net.name.toLowerCase();
                    const node = local.get(key) ??
                        qualify(net.scope === "global" ? net.name : [...path, net.name].join("."));
                    local.set(key, node);
                    if (!authoredNetIds.get(cell.id)?.has(net.id))
                        continue;
                    const vector = `v(${node})`.toLowerCase();
                    const name = [...scope.callPath, ...path, net.name].join("/");
                    const names = labels.get(vector) ?? new Set();
                    names.add(name);
                    labels.set(vector, names);
                    targets.set(vector, [
                        ...(targets.get(vector) ?? []),
                        {
                            rootDocumentId: binding.documentId,
                            documentId: cell.id,
                            netId: net.id,
                            occurrence,
                        },
                    ]);
                }
                for (const instance of cell.instances) {
                    if (instance.deviceClass !== "hierarchical")
                        continue;
                    const child = ir.cells.find((candidate) => candidate.name === instance.target);
                    if (!child)
                        continue;
                    const ports = new Map();
                    for (const port of child.ports) {
                        const connection = instance.nodes.find((node) => node.pinName === port.name);
                        const node = connection && local.get(connection.netName.toLowerCase());
                        if (node)
                            ports.set(port.netName.toLowerCase(), node);
                    }
                    visit(child, ports, [...path, instance.reference], new Set([...ancestors, cell.id]), [...occurrence, instance.id]);
                }
            }
            visit(root, new Map(), [], new Set(), []);
        }
    }
    return Object.fromEntries([...labels].map(([vector, names]) => [
        vector,
        {
            label: [...names].join(" · "),
            targets: targets.get(vector) ?? [],
        },
    ]));
}
