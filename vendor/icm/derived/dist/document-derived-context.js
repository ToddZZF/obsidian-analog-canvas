import { registerDocumentCache } from "./document-caches.js";
import { routeEnd, isFrozenSnapshot } from "@icm/model";
import { deriveDocumentContactEvidence, } from "./contact.js";
import { resolveNetLabelBinding, } from "./net-label.js";
import { resolveDocumentRoutingGeometry, } from "./resolved-route-geometry.js";
import { buildDocumentSpatialIndex, } from "./spatial-index.js";
import { endpointKey, buildEndpointObjectLookup, resolveEndpointConnection, } from "./endpoint.js";
const contextCache = registerDocumentCache(new WeakMap());
function groupedBy(values, keyOf) {
    const groups = new Map();
    for (const value of values) {
        const key = keyOf(value);
        if (!key)
            continue;
        const group = groups.get(key) ?? [];
        group.push(value);
        groups.set(key, group);
    }
    return groups;
}
export function buildDocumentDerivedContext(document, resolver) {
    const symbols = isFrozenSnapshot(document)
        ? resolvedSymbolContext(document, resolver)
        : undefined;
    const cached = symbols === undefined ? undefined : contextCache.get(document);
    if (cached?.revision === document.revision && cached.symbols === symbols) {
        return cached.context;
    }
    const endpointLookup = buildEndpointObjectLookup(document);
    const { instancesById, junctionsById, logicalNets: logicalNetResolution, } = endpointLookup;
    const routesByNetId = groupedBy(document.routes, (item) => item.netId);
    const routesById = new Map(document.routes.map((route) => [route.id, route]));
    const junctionsByNetId = groupedBy(document.junctions, (item) => item.netId);
    const annotationsByNetId = groupedBy(document.annotations, (item) => item.netId);
    const endpoints = new Map([
        ...document.nets.flatMap((net) => net.terminals.map((terminal) => ({
            kind: "terminal",
            ...terminal,
        }))),
        ...document.junctions.map((junction) => ({
            kind: "junction",
            junctionId: junction.id,
        })),
        ...document.routes.flatMap((route) => [route.start, routeEnd(route)]),
    ].map((endpoint) => [endpointKey(endpoint), endpoint]));
    const endpointConnections = new Map();
    for (const [key, endpoint] of endpoints) {
        const connection = resolveEndpointConnection(document, resolver, endpoint, endpointLookup);
        if (connection)
            endpointConnections.set(key, connection);
    }
    const routingGeometry = resolveDocumentRoutingGeometry(document, resolver, endpointConnections);
    const spatialIndex = buildDocumentSpatialIndex(document, routingGeometry);
    const contactEvidence = deriveDocumentContactEvidence(document, resolver, routingGeometry, {
        routesByNetId,
        routesById,
        spatialIndex,
        endpointConnections,
        endpointLookup,
    });
    const netLabelBindingsByNetId = new Map();
    for (const annotation of document.annotations) {
        const binding = resolveNetLabelBinding(document, resolver, annotation, routingGeometry);
        if (!binding)
            continue;
        const bindings = netLabelBindingsByNetId.get(binding.netId) ?? [];
        bindings.push(binding);
        netLabelBindingsByNetId.set(binding.netId, bindings);
    }
    for (const bindings of netLabelBindingsByNetId.values()) {
        bindings.sort((left, right) => left.annotationId.localeCompare(right.annotationId, "en"));
    }
    const routeDegreeByEndpointKey = new Map();
    for (const route of document.routes) {
        for (const endpoint of [route.start, routeEnd(route)]) {
            const key = endpointKey(endpoint);
            routeDegreeByEndpointKey.set(key, (routeDegreeByEndpointKey.get(key) ?? 0) + 1);
        }
    }
    const context = {
        documentId: document.id,
        documentRevision: document.revision,
        instancesById,
        netsById: new Map(document.nets.map((item) => [item.id, item])),
        routesById,
        junctionsById,
        annotationsById: new Map(document.annotations.map((item) => [item.id, item])),
        routesByNetId,
        junctionsByNetId,
        annotationsByNetId,
        routeDegreeByEndpointKey,
        endpointConnections,
        routingGeometry,
        contactEvidence,
        contactsByNetId: groupedBy(contactEvidence.contacts, (item) => item.netId),
        netLabelBindingsByNetId,
        logicalNetResolution,
        spatialIndex,
    };
    if (symbols !== undefined)
        contextCache.set(document, {
            revision: document.revision,
            symbols,
            context,
        });
    return context;
}
function resolvedSymbolContext(document, resolver) {
    const references = new Map();
    for (const instance of document.instances) {
        const reference = [instance.symbolId, instance.symbolVariantId];
        references.set(JSON.stringify(reference), reference);
    }
    for (const object of document.drafting?.objects ?? []) {
        if (object.kind !== "floating-symbol")
            continue;
        const reference = [object.symbolId, undefined];
        references.set(JSON.stringify(reference), reference);
    }
    return JSON.stringify([...references.values()].map(([id, variant]) => resolver.resolve(id, variant) ?? null));
}
