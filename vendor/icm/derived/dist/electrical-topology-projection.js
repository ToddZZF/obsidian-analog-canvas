import { deriveStableId, routeEnd } from "@icm/model";
import { buildDocumentDerivedContext } from "./document-derived-context.js";
import { endpointKey } from "./endpoint.js";
import { resolveDocumentLogicalNets } from "./logical-net.js";
class DisjointSet {
    #parent = new Map();
    add(key) {
        if (!this.#parent.has(key))
            this.#parent.set(key, key);
    }
    find(key) {
        const parent = this.#parent.get(key);
        if (!parent)
            throw new Error(`Unknown electrical endpoint ${key}`);
        if (parent === key)
            return key;
        const root = this.find(parent);
        this.#parent.set(key, root);
        return root;
    }
    union(left, right) {
        this.add(left);
        this.add(right);
        const leftRoot = this.find(left);
        const rightRoot = this.find(right);
        if (leftRoot === rightRoot)
            return;
        const [survivor, removed] = [leftRoot, rightRoot].sort((a, b) => a.localeCompare(b, "en"));
        this.#parent.set(removed, survivor);
    }
}
function ownerKey(owner, netId) {
    switch (owner.kind) {
        case "net-label":
            return `net-label:${owner.annotationId}`;
        case "power-marker":
            return `power-marker:${owner.objectId}`;
        case "global-declaration":
            return `global-declaration:${owner.sourceNetId}:${netId}`;
    }
}
/**
 * Derive the electrical facts used to validate a planned routing operation.
 * The projection is independent of a planner's changed-object report.
 */
export function deriveElectricalTopologyProjection(document, resolver) {
    const endpointToBaseNet = new Map();
    const context = resolver
        ? buildDocumentDerivedContext(document, resolver)
        : undefined;
    const sets = new DisjointSet();
    for (const net of document.nets) {
        for (const terminal of net.terminals) {
            const key = endpointKey({ kind: "terminal", ...terminal });
            endpointToBaseNet.set(key, net.id);
            sets.add(key);
        }
    }
    for (const junction of document.junctions) {
        const key = endpointKey({ kind: "junction", junctionId: junction.id });
        endpointToBaseNet.set(key, junction.netId);
        sets.add(key);
    }
    const routeIncidence = new Map();
    const junctionIncidenceMutable = new Map();
    for (const route of document.routes) {
        const keys = [endpointKey(route.start), endpointKey(routeEnd(route))];
        routeIncidence.set(route.id, keys);
        sets.union(keys[0], keys[1]);
        for (const endpoint of [route.start, routeEnd(route)]) {
            if (endpoint.kind !== "junction")
                continue;
            const incident = junctionIncidenceMutable.get(endpoint.junctionId) ?? [];
            incident.push(route.id);
            junctionIncidenceMutable.set(endpoint.junctionId, incident);
        }
    }
    if (context) {
        for (const contact of context.contactEvidence.contacts) {
            const keys = contact.endpoints.map(endpointKey);
            const first = keys[0];
            if (!first)
                continue;
            for (const key of keys.slice(1))
                sets.union(first, key);
        }
    }
    const endpointToPhysicalComponent = new Map();
    for (const [key, netId] of endpointToBaseNet) {
        endpointToPhysicalComponent.set(key, deriveStableId("physical-component", netId, sets.find(key)));
    }
    const logicalNetByBaseNet = new Map();
    for (const group of (context?.logicalNetResolution ?? resolveDocumentLogicalNets(document)).groups) {
        for (const netId of group.baseNetIds) {
            logicalNetByBaseNet.set(netId, group.id);
        }
    }
    const nameClaimsByOwner = new Map();
    for (const evidence of document.connectivityEvidence) {
        if (evidence.kind !== "name-claim")
            continue;
        nameClaimsByOwner.set(ownerKey(evidence.owner, evidence.netId), {
            evidenceId: evidence.id,
            netId: evidence.netId,
            name: evidence.name,
            scope: evidence.scope,
            ...(evidence.powerDomain ? { powerDomain: evidence.powerDomain } : {}),
        });
    }
    const junctionIncidence = new Map();
    for (const junction of document.junctions) {
        junctionIncidence.set(junction.id, [...(junctionIncidenceMutable.get(junction.id) ?? [])].sort((a, b) => a.localeCompare(b, "en")));
    }
    return {
        endpointToBaseNet,
        endpointToPhysicalComponent,
        logicalNetByBaseNet,
        nameClaimsByOwner,
        routeIncidence,
        junctionIncidence,
    };
}
