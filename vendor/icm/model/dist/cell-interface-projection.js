import { foldNetName } from "./net-name.js";
/**
 * Project independently authored Cell Pins into the formal interface consumed
 * by hierarchy symbols and netlist export. Equal folded names share one
 * transient formal port. The source declarations and their Base Nets are never
 * rewritten or physically merged; the Logical-Net resolver interprets their
 * shared Port name as electrical identity.
 */
export function projectCellInterface(netlist) {
    if (!netlist)
        return { ports: [], issues: [] };
    const groups = [];
    const groupByKey = new Map();
    for (const terminal of netlist.terminals) {
        const key = foldNetName(terminal.name);
        const existing = groupByKey.get(key);
        if (!existing) {
            const group = {
                id: terminal.id,
                key,
                name: terminal.name,
                direction: terminal.direction,
                terminalIds: [terminal.id],
                netIds: [terminal.netId],
                interfaceInstanceIds: [...terminal.interfaceInstanceIds],
                directions: [terminal.direction],
            };
            groups.push(group);
            groupByKey.set(key, group);
            continue;
        }
        existing.terminalIds.push(terminal.id);
        existing.netIds.push(terminal.netId);
        existing.interfaceInstanceIds.push(...terminal.interfaceInstanceIds);
        if (!existing.directions.includes(terminal.direction)) {
            existing.directions.push(terminal.direction);
            existing.direction = "passive";
        }
    }
    return {
        ports: groups.map(({ directions: _directions, ...port }) => port),
        issues: groups.flatMap((group) => group.directions.length > 1
            ? [
                {
                    code: "CELL_PORT_DIRECTION_CONFLICT",
                    portKey: group.key,
                    portName: group.name,
                    terminalIds: [...group.terminalIds],
                    directions: [...group.directions],
                },
            ]
            : []),
    };
}
