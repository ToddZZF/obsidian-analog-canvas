export function instrumentationKey(instrumentation) {
    return `${instrumentation.cellId}\u0000${instrumentation.instanceId}\u0000${instrumentation.pinName}`;
}
/** Series zero-volt source: positive branch flow enters the selected terminal.
 * Applies to derived IR only; source selection and name allocation are callers. */
export function instrumentTerminalCurrents(ir, instrumentations) {
    if (instrumentations.size === 0)
        return ir;
    return {
        ...ir,
        cells: ir.cells.map((cell) => instrumentCellTerminalCurrents(cell, instrumentations)),
    };
}
export function instrumentCellTerminalCurrents(cell, instrumentations) {
    if (instrumentations.size === 0)
        return cell;
    return {
        ...cell,
        instances: cell.instances.flatMap((instance) => {
            const selected = instance.nodes.flatMap((node) => {
                const instrumentation = instrumentations.get(instrumentationKey({
                    cellId: cell.id,
                    instanceId: instance.id,
                    pinName: node.pinName,
                }));
                const existing = instrumentation &&
                    cell.instances.some((probe) => probe.terminalCurrentSense?.instanceId === instance.id &&
                        probe.terminalCurrentSense.pinName === node.pinName);
                return instrumentation && !existing ? [{ node, instrumentation }] : [];
            });
            if (selected.length === 0)
                return [instance];
            return [
                {
                    ...instance,
                    nodes: instance.nodes.map((node) => {
                        const selectedNode = selected.find((item) => item.node.pinName === node.pinName);
                        return selectedNode
                            ? { ...node, netName: selectedNode.instrumentation.senseNode }
                            : node;
                    }),
                },
                ...selected.map(({ node, instrumentation }) => ({
                    id: `${instance.id}:simulation-current-sense:${instrumentation.senseReference}`,
                    reference: instrumentation.senseReference,
                    invocationKind: "primitive",
                    deviceClass: "voltage-source",
                    target: null,
                    terminalCurrentSense: {
                        instanceId: instance.id,
                        pinName: node.pinName,
                    },
                    nodes: [
                        { pinName: "+", netName: node.netName },
                        { pinName: "-", netName: instrumentation.senseNode },
                    ],
                    parameters: [{ name: "dc", rawValue: "0" }],
                })),
            ];
        }),
    };
}
