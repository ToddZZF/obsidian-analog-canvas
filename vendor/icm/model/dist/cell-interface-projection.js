import { foldNetName } from "./net-name.js";
/** Scalar interface view for electrical consumers; symbols keep the aggregate declarations. */
export function scalarCellTerminals(netlist) {
    return (netlist?.terminals ?? []).flatMap((terminal) => terminal.signal && terminal.signal.members.length > 1
        ? terminal.signal.members.map((member) => ({
            ...terminal,
            id: member.id,
            name: member.name,
            netId: member.netId,
            signal: undefined,
            aggregateName: terminal.name,
            memberId: member.id,
        }))
        : [{ ...terminal, aggregateName: terminal.name, memberId: undefined }]);
}
export function projectScalarCellInterface(netlist) {
    return projectCellInterface(netlist
        ? { ...netlist, terminals: scalarCellTerminals(netlist) }
        : undefined);
}
/**
 * Project independently authored Cell Pins into the formal interface consumed
 * by hierarchy symbols and netlist export. Equal folded names share one
 * transient formal port. The source declarations and their Base Nets are never
 * rewritten or physically merged; the Logical-Net resolver interprets their
 * shared Port name as electrical identity.
 *
 * A Port's direction is a drawing hint (which side of the block symbol its pin
 * takes); an analog Pin has no electrical direction and no netlist writes one.
 * Declarations of one name may state different directions, as a VDD Power
 * marker (inout) and a plain Port (passive) do by default: the shared Port then
 * reads passive, and nothing reports it.
 */
export function projectCellInterface(netlist) {
    if (!netlist)
        return { ports: [] };
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
            };
            groups.push(group);
            groupByKey.set(key, group);
            continue;
        }
        existing.terminalIds.push(terminal.id);
        existing.netIds.push(terminal.netId);
        existing.interfaceInstanceIds.push(...terminal.interfaceInstanceIds);
        if (existing.direction !== terminal.direction)
            existing.direction = "passive";
    }
    return { ports: groups };
}
