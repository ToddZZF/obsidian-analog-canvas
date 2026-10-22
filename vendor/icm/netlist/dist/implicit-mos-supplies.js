import { deriveStableId, } from "@icm/model";
import { drawnSupplyNet, drawsSupply, mosBulkKind, portableCellIdentifier, resolveMosBulkConnection, resolveCommittedDocumentLogicalNets, } from "@icm/derived";
import { gateCellBinding, IDEAL_COMPARATOR_TARGET, idealComparatorReadsSupply, isIdealComparatorBody, instanceBuiltInSubcircuit, isIdealOpampBody, resolveReviewedExternalBinding, } from "@icm/devices";
import { builtInBlockCallTarget, idealAnalogBlockCell, projectSubcircuitNames, } from "./ideal-analog-block-models.js";
/**
 * The supplies a built-in body reads. The ideal amplifiers and the adder in
 * either format, and the multiplier and the numeric ideal comparator in
 * SPICE, read neither: that comparator's call has no supply nodes at all,
 * yet a flash ADC drawn with ground and no VDD gained a VDD Cell Pin that
 * nothing inside used. The ideal comparator whose high level is its own VDD
 * reads that supply alone. The ideal op-amp reads its supplies only once a
 * drawn or selected VDD powers it (ideal-opamp.ts), so an undrawn supply
 * takes no default. Every other body reads both. An authored Cell or
 * a declared external definition of the same name replaces the body, and may
 * well use both supplies.
 */
export function bodySupplies(target, 
/** The Project's own subcircuit names; see projectSubcircuitNames. */
projectNames, format) {
    if (projectNames.has(target.toLowerCase()))
        return ["VDD", "VSS"];
    if (isIdealComparatorBody(target) &&
        (target !== IDEAL_COMPARATOR_TARGET || format === "spice"))
        return idealComparatorReadsSupply(target) ? ["VDD"] : [];
    if (isIdealOpampBody(target))
        return [];
    return idealAnalogBlockCell(target, format) !== null ||
        (format === "spice" &&
            (target === "multiplier" || target === IDEAL_COMPARATOR_TARGET))
        ? []
        : ["VDD", "VSS"];
}
/**
 * The hidden VDD/VSS terminals of Analog Blocks whose body reads them, in a
 * Cell that neither binds them nor draws any supply of that domain, each
 * with the supplies its body reads. They take the default an unconnected MOS
 * body takes. A Cell that drew several supplies of a domain is asked to
 * choose instead.
 */
function blockSuppliesToDefault(source, options) {
    const projectNames = projectSubcircuitNames(source, source.documents.flatMap((document) => document.netlist?.name
        ? [portableCellIdentifier(document.netlist.name, document.id)]
        : []));
    return source.documents.flatMap((document) => {
        let logical;
        const drawn = new Map();
        const domainDrawn = (domain) => {
            logical ??= resolveCommittedDocumentLogicalNets(document);
            if (!drawn.has(domain))
                drawn.set(domain, drawsSupply(document, domain, logical));
            return drawn.get(domain);
        };
        return document.instances.flatMap((instance) => {
            const descriptor = instanceBuiltInSubcircuit(source, instance);
            if (!descriptor)
                return [];
            const reads = bodySupplies(builtInBlockCallTarget(instance, descriptor, projectNames), projectNames, options.format ?? "spice");
            return descriptor.ports.flatMap((port) => {
                const supply = port.supply;
                if (!supply || !reads.includes(supply))
                    return [];
                const bound = document.nets.some((net) => net.terminals.some((pin) => pin.instanceId === instance.id && pin.pinName === supply));
                if (bound || domainDrawn(supply === "VDD" ? "vdd" : "ground"))
                    return [];
                return [
                    { documentId: document.id, instanceId: instance.id, supply, reads },
                ];
            });
        });
    });
}
/**
 * The Net {@link withImplicitMosSupplies} adds to a Cell for a conventional
 * supply it had to supply itself, VDD or ground (`0`). Extraction reads it
 * back to say which bodies took that supply and which pin it became.
 */
export function implicitSupplyNetId(documentId, supply) {
    return deriveStableId("netlist-default-supply", documentId, supply);
}
/** The rails of a gate bound to a standard cell, or to a Cell's VDD/VSS Pins. */
function boundGateRails(source, instance) {
    const binding = instance.netlist?.binding;
    if (binding?.kind === "subcircuit")
        return (gateCellBinding(source, instance)?.match.pins.flatMap((pin) => pin.supply ? [pin.supply] : []) ?? []);
    if (binding?.kind !== "external-subcircuit")
        return [];
    const definition = source.externalSubcircuitDefinitions.find((candidate) => candidate.id === binding.definitionId);
    if (!definition || definition.implementation)
        return [];
    const reviewed = resolveReviewedExternalBinding(definition.name, definition.terminals.map((terminal) => terminal.name), instance.symbolId);
    return (reviewed?.terminals.flatMap((terminal) => terminal.supply ? [terminal.supply] : []) ?? []);
}
/**
 * The rails of a gate bound to a standard cell or to a Cell of the Project
 * (#1450) that no Net was chosen for, in a Cell that drew no supply of that
 * domain: each joins the conventional supply, as an unbound gate's does. A
 * drawn supply is read at export, or asked for when several were drawn
 * (MISSING_BLOCK_SUPPLY).
 */
function boundGateSuppliesToDefault(source) {
    return source.documents.flatMap((document) => {
        let logical;
        const domainDrawn = (supply) => drawsSupply(document, supply === "VDD" ? "vdd" : "ground", (logical ??= resolveCommittedDocumentLogicalNets(document)));
        return document.instances.flatMap((instance) => {
            const rails = new Set(boundGateRails(source, instance));
            return [...rails].flatMap((supply) => document.nets.some((net) => net.terminals.some((pin) => pin.instanceId === instance.id && pin.pinName === supply)) || domainDrawn(supply)
                ? []
                : [{ documentId: document.id, instanceId: instance.id, supply }]);
        });
    });
}
/** A read-only electrical projection for schematic MOS bodies with no authored
 * connection. Supply symbols are not required to express the default substrate.
 * Existing body wiring, Cell defaults and explicit NoConnect remain authoritative.
 */
export function withImplicitMosSupplies(source, options) {
    const blockSupplies = blockSuppliesToDefault(source, options);
    const cellRails = boundGateSuppliesToDefault(source);
    const missing = source.documents.flatMap((document) => {
        const logical = resolveCommittedDocumentLogicalNets(document);
        return document.instances.flatMap((instance) => mosBulkKind(instance) &&
            resolveMosBulkConnection(document, instance, logical)?.status ===
                "unresolved"
            ? [{ documentId: document.id, instanceId: instance.id }]
            : []);
    });
    const placedBodies = new Map();
    if (!missing.length && !blockSupplies.length && !cellRails.length)
        return { project: source, placedBodies };
    const project = structuredClone(source);
    const addedVddPorts = new Set();
    const supplies = new Map();
    function supply(document, positive) {
        const logical = resolveCommittedDocumentLogicalNets(document);
        const drawn = drawnSupplyNet(document, positive ? "vdd" : "ground", logical);
        if (drawn)
            return drawn;
        const name = positive ? "VDD" : "0";
        // Reuse an unambiguous authored conventional name. Never collapse two
        // differently scoped Nets merely because they spell the same supply.
        const named = logical.groups.filter((group) => group.name?.toUpperCase() === (positive ? "VDD" : "VSS"));
        if (named.length === 1 && !named[0].conflicts.length)
            return document.nets.find((net) => named[0].baseNetIds.includes(net.id));
        const netId = implicitSupplyNetId(document.id, name);
        const ownerId = deriveStableId("netlist-default-supply-owner", document.id, name);
        const net = {
            id: netId,
            terminals: [{ instanceId: ownerId, pinName: positive ? "P" : "0" }],
        };
        document.nets.push(net);
        document.instances.push({
            id: ownerId,
            symbolId: positive ? "vdd-port" : "ground",
            placement: null,
        });
        const formal = positive &&
            options.groundPin === "pin" &&
            !(options.rootAsTopLevel && document.id === options.rootDocumentId) &&
            document.netlist;
        if (formal) {
            formal.terminals.unshift({
                id: `${ownerId}-port`,
                name,
                netId,
                direction: "inout",
                interfaceInstanceIds: [ownerId],
            });
            addedVddPorts.add(document.id);
        }
        else {
            document.connectivityEvidence.push({
                id: `${ownerId}-claim`,
                kind: "name-claim",
                netId,
                name,
                scope: "global",
                powerDomain: positive ? "vdd" : "ground",
                owner: { kind: "power-marker", objectId: ownerId },
            });
        }
        return net;
    }
    /** The Cell's default supply of one domain, made once. */
    function defaultSupply(document, positive) {
        let result = supplies.get(document.id);
        if (!result)
            supplies.set(document.id, (result = {}));
        return positive
            ? (result.pmos ??= supply(document, true))
            : (result.nmos ??= supply(document, false));
    }
    function defaults(document) {
        return {
            pmos: defaultSupply(document, true),
            nmos: defaultSupply(document, false),
        };
    }
    for (const item of missing) {
        const document = project.documents.find((d) => d.id === item.documentId);
        const instance = document.instances.find((i) => i.id === item.instanceId);
        const kind = mosBulkKind(instance);
        const configuredId = kind === "nmos"
            ? document.mosBulkDefaults?.nmosNetId
            : document.mosBulkDefaults?.pmosNetId;
        // An imported part with no fourth node is unresolved even under a Cell
        // default, which it takes here; every other body that reaches this point
        // has no default and takes the conventional supply.
        const configured = document.nets.find((candidate) => candidate.id === configuredId);
        const net = configured ?? defaults(document)[kind];
        // An unresolved policy-owned orphan can still carry stale B membership.
        for (const candidate of document.nets)
            candidate.terminals = candidate.terminals.filter((pin) => pin.instanceId !== instance.id || pin.pinName !== "B");
        net.terminals.push({ instanceId: instance.id, pinName: "B" });
        let placed = placedBodies.get(document.id);
        if (!placed)
            placedBodies.set(document.id, (placed = new Map()));
        placed.set(instance.id, configured ? "cell-default" : "conventional");
    }
    for (const item of blockSupplies) {
        const document = project.documents.find((d) => d.id === item.documentId);
        // The defaults of every supply the body reads are made together, as a
        // MOS body's are. A body that reads VDD alone, the comparator whose high
        // level is its own VDD, gives a Cell drawn without ground no VSS pin.
        for (const read of item.reads)
            defaultSupply(document, read === "VDD");
        defaultSupply(document, item.supply === "VDD").terminals.push({
            instanceId: item.instanceId,
            pinName: item.supply,
        });
    }
    for (const item of cellRails) {
        const document = project.documents.find((d) => d.id === item.documentId);
        defaultSupply(document, item.supply === "VDD").terminals.push({
            instanceId: item.instanceId,
            pinName: item.supply,
        });
    }
    // A newly exposed supply belongs on both sides of an internal Cell call.
    // Ground propagation is handled by the existing VSS interface projection.
    // A caller takes the defaults its child took: one calling a child whose
    // only default is VDD, an ideal comparator's, gains no ground either.
    let changed = true;
    while (changed) {
        changed = false;
        for (const document of project.documents) {
            for (const instance of [...document.instances]) {
                const binding = instance.netlist?.binding;
                if (binding?.kind !== "subcircuit")
                    continue;
                const child = supplies.get(binding.childDocumentId);
                if (!child)
                    continue;
                const caller = supplies.get(document.id);
                if ((child.pmos && !caller?.pmos) || (child.nmos && !caller?.nmos)) {
                    if (child.pmos)
                        defaultSupply(document, true);
                    if (child.nmos)
                        defaultSupply(document, false);
                    changed = true;
                }
                if (!addedVddPorts.has(binding.childDocumentId))
                    continue;
                if (document.nets.some((net) => net.terminals.some((pin) => pin.instanceId === instance.id && pin.pinName === "VDD")))
                    continue;
                defaultSupply(document, true).terminals.push({
                    instanceId: instance.id,
                    pinName: "VDD",
                });
                changed = true;
            }
        }
    }
    return { project, placedBodies };
}
