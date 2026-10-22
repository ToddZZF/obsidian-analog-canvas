import { registerDocumentCache } from "./document-caches.js";
import { deriveStableId, foldNetName } from "@icm/model";
import { deriveImportedRoutingGuidance, deriveNetConnectivity, deriveNetConnectivityContext, } from "./connectivity.js";
import { endpointKey, isVisibleEndpoint, netEndpoints } from "./endpoint.js";
import { directObjectLocator, } from "./object-locator.js";
import { resolveAnnotationName } from "./annotation-text.js";
import { resolveDocumentLogicalNets, } from "./logical-net.js";
const terminalEndpoint = (instanceId, pinName) => ({ kind: "terminal", instanceId, pinName });
/** Derived-only cache: never persisted and invalidated by revision/resolver. */
const documentIndexCache = registerDocumentCache(new WeakMap());
/**
 * Returns routing guidance whose `from`/`to` are ordered by `endpointKey` and
 * whose `id` is recomputed from the ordered keys, so the same logical guide
 * yields the same id regardless of how the visible wire is partitioned into
 * Routes (Net connectivity rationale).
 */
function normalizeRoutingGuidance(line) {
    const swap = endpointKey(line.from).localeCompare(endpointKey(line.to), "en") > 0;
    const from = swap ? line.to : line.from;
    const to = swap ? line.from : line.to;
    const fromPoint = swap ? line.toPoint : line.fromPoint;
    const toPoint = swap ? line.fromPoint : line.toPoint;
    const fromNetId = swap ? line.toNetId : line.fromNetId;
    const toNetId = swap ? line.fromNetId : line.toNetId;
    return {
        id: deriveStableId("routing-guidance", line.sourceNetId ?? line.netId, endpointKey(from), endpointKey(to)),
        netId: line.netId,
        fromNetId,
        toNetId,
        ...(line.sourceNetId ? { sourceNetId: line.sourceNetId } : {}),
        from,
        to,
        fromPoint,
        toPoint,
        distance: line.distance,
    };
}
function buildDocumentIndex(document, resolver) {
    const cached = documentIndexCache.get(document);
    if (cached?.revision === document.revision && cached.resolver === resolver) {
        return cached.index;
    }
    const endpointToBaseNetId = new Map();
    for (const net of document.nets) {
        for (const endpoint of netEndpoints(document, net)) {
            endpointToBaseNetId.set(endpointKey(endpoint), net.id);
        }
    }
    const connectivityContext = deriveNetConnectivityContext(document, resolver);
    const routingGuidanceByNet = new Map();
    const routingGuidance = deriveImportedRoutingGuidance(document, resolver, connectivityContext).map(normalizeRoutingGuidance);
    for (const line of routingGuidance) {
        for (const netId of new Set([line.fromNetId, line.toNetId])) {
            if (netId === null)
                continue;
            const lines = routingGuidanceByNet.get(netId) ?? [];
            lines.push(line);
            routingGuidanceByNet.set(netId, lines);
        }
    }
    const baseRecords = new Map();
    for (const net of document.nets) {
        baseRecords.set(net.id, buildNetRecord(document, resolver, net, routingGuidanceByNet.get(net.id) ?? [], connectivityContext, connectivityContext.routesByNetId.get(net.id) ?? [], connectivityContext.junctionsByNetId.get(net.id) ?? []));
    }
    const logicalNets = new Map();
    const logicalNetByBaseNetId = new Map();
    for (const group of connectivityContext.logicalNetResolution.groups) {
        const records = group.baseNetIds.map((netId) => baseRecords.get(netId));
        const aggregate = {
            netId: group.id,
            baseNetIds: group.baseNetIds,
            logicalEndpoints: uniqueEndpoints(records.flatMap((record) => record.logicalEndpoints)),
            visibleEndpoints: uniqueEndpoints(records.flatMap((record) => record.visibleEndpoints)),
            routedComponents: records.flatMap((record) => record.routedComponents),
            routes: uniqueStrings(records.flatMap((record) => record.routes)),
            junctions: uniqueStrings(records.flatMap((record) => record.junctions)),
            virtualEdges: records.flatMap((record) => record.virtualEdges),
            routingGuidance: uniqueRoutingGuidance(records.flatMap((record) => record.routingGuidance)),
        };
        logicalNets.set(group.id, aggregate);
        for (const baseNetId of group.baseNetIds) {
            logicalNetByBaseNetId.set(baseNetId, aggregate);
        }
    }
    const index = {
        ...connectivityContext,
        routingGuidance,
        endpointToBaseNetId,
        logicalNets,
        logicalNetByBaseNetId,
    };
    documentIndexCache.set(document, {
        revision: document.revision,
        resolver,
        index,
    });
    return index;
}
function uniqueStrings(values) {
    return [...new Set(values)].sort((left, right) => left.localeCompare(right, "en"));
}
function uniqueEndpoints(values) {
    return [
        ...new Map(values.map((endpoint) => [endpointKey(endpoint), endpoint])).values(),
    ].sort((left, right) => endpointKey(left).localeCompare(endpointKey(right), "en"));
}
function uniqueRoutingGuidance(values) {
    return [...new Map(values.map((line) => [line.id, line])).values()].sort((left, right) => left.id.localeCompare(right.id, "en"));
}
function buildNetRecord(document, resolver, net, routingGuidance, connectivityContext, routesForNet, junctionsForNet) {
    const logicalEndpoints = [
        ...net.terminals.map((terminal) => terminalEndpoint(terminal.instanceId, terminal.pinName)),
    ].sort((a, b) => endpointKey(a).localeCompare(endpointKey(b), "en"));
    const visibleEndpoints = netEndpoints(document, net).filter((endpoint) => isVisibleEndpoint(document, resolver, endpoint, connectivityContext));
    const routedComponents = deriveNetConnectivity(document, resolver, net, connectivityContext).components;
    const routes = routesForNet
        .map((route) => route.id)
        .sort((a, b) => a.localeCompare(b, "en"));
    const junctions = junctionsForNet
        .map((junction) => junction.id)
        .sort((a, b) => a.localeCompare(b, "en"));
    const virtualEdges = deriveLabelVirtualEdges(document, net, connectivityContext.netLabelBindingsByNetId.get(net.id) ?? [], connectivityContext.logicalNetResolution);
    return {
        netId: net.id,
        baseNetIds: [net.id],
        logicalEndpoints,
        visibleEndpoints,
        routedComponents,
        routes,
        junctions,
        virtualEdges,
        routingGuidance,
    };
}
/**
 * Typed net-label/power-label virtual edges. Net Labels are bound to a Net id
 * and resolved to the nearest routed component; the old Junction-id overload
 * is deliberately not accepted. Power labels retain their legacy Junction
 * compatibility until their separate symbol binding contract is migrated.
 */
function deriveLabelVirtualEdges(document, net, bindings, logicalNets) {
    const groups = new Map();
    for (const binding of bindings) {
        const annotation = document.annotations.find((candidate) => candidate.id === binding.annotationId);
        const label = resolveAnnotationName(document, annotation, logicalNets).trim();
        if (label.length === 0)
            continue;
        const group = groups.get(label) ?? {
            kind: "net-label",
            endpoints: [],
        };
        group.endpoints.push(binding.endpoint);
        groups.set(label, group);
    }
    for (const annotation of document.annotations) {
        if (annotation.kind !== "power-label" || annotation.netId !== net.id) {
            continue;
        }
        const binding = bindings.find((candidate) => candidate.annotationId === annotation.id);
        if (!binding)
            continue;
        const label = resolveAnnotationName(document, annotation, logicalNets).trim();
        if (label.length === 0)
            continue;
        const group = groups.get(label) ?? {
            kind: annotation.kind,
            endpoints: [],
        };
        group.endpoints.push(binding.endpoint);
        groups.set(label, group);
    }
    const edges = [];
    for (const [label, group] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0], "en"))) {
        const ordered = [
            ...new Map(group.endpoints.map((endpoint) => [endpointKey(endpoint), endpoint])).values(),
        ].sort((a, b) => endpointKey(a).localeCompare(endpointKey(b), "en"));
        for (let index = 0; index < ordered.length - 1; index += 1) {
            edges.push({
                kind: group.kind,
                from: ordered[index],
                to: ordered[index + 1],
                evidence: label,
            });
        }
    }
    return edges;
}
function buildHierarchyIndex(project, resolver, documents) {
    const calls = [];
    const edges = [];
    for (const parent of project.documents) {
        for (const instance of parent.instances) {
            const childId = referencedDocumentId(project, instance);
            if (!childId)
                continue;
            calls.push({
                parentDocumentId: parent.id,
                instanceId: instance.id,
                childDocumentId: childId,
            });
            const child = project.documents.find((candidate) => candidate.id === childId);
            if (!child)
                continue;
            const childIndex = documents.get(childId);
            if (!childIndex)
                continue;
            const resolved = resolver.resolve(instance.symbolId, instance.symbolVariantId);
            if (!resolved)
                continue;
            for (const pin of resolved.definition.pins) {
                const childTerminals = (child.netlist?.terminals ?? []).filter((terminal) => foldNetName(terminal.name) === foldNetName(pin.name));
                const childLogicalNets = childTerminals.map((terminal) => childIndex.logicalNetByBaseNetId.get(terminal.netId));
                // A name identifies the projected interface pin, not electrical
                // equivalence. Only preserve an edge when every authored member is
                // already connected by the child's independent connectivity facts.
                if (childLogicalNets.length === 0 ||
                    childLogicalNets.some((record) => !record) ||
                    new Set(childLogicalNets.map((record) => record.netId)).size !== 1) {
                    continue;
                }
                const childTerminal = childTerminals[0];
                edges.push({
                    parentDocumentId: parent.id,
                    instanceId: instance.id,
                    parentPinName: pin.name,
                    childDocumentId: childId,
                    childTerminalName: childTerminal.name,
                    childNetId: childTerminal.netId,
                });
            }
        }
    }
    edges.sort((a, b) => a.parentDocumentId.localeCompare(b.parentDocumentId, "en") ||
        a.instanceId.localeCompare(b.instanceId, "en") ||
        a.parentPinName.localeCompare(b.parentPinName, "en"));
    calls.sort((a, b) => a.parentDocumentId.localeCompare(b.parentDocumentId, "en") ||
        a.instanceId.localeCompare(b.instanceId, "en") ||
        a.childDocumentId.localeCompare(b.childDocumentId, "en"));
    return { calls, edges };
}
function buildGlobalNetIndex(project, documents) {
    const groups = new Map();
    for (const document of project.documents) {
        const logicalNets = documents.get(document.id)?.logicalNetResolution ??
            resolveDocumentLogicalNets(document);
        for (const logicalNet of logicalNets.groups) {
            if (logicalNet.scope !== "global" || !logicalNet.name)
                continue;
            const foldedName = foldNetName(logicalNet.name);
            const refs = groups.get(foldedName) ?? [];
            refs.push({ documentId: document.id, netId: logicalNet.id });
            groups.set(foldedName, refs);
        }
    }
    return new Map([...groups.entries()]
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([foldedName, nets]) => [
        foldedName,
        {
            foldedName,
            nets: nets.sort((left, right) => left.documentId.localeCompare(right.documentId, "en") ||
                left.netId.localeCompare(right.netId, "en")),
        },
    ]));
}
/** Resolve only the stable imported hierarchy link written by the importer. */
function referencedDocumentId(project, instance) {
    const binding = instance.netlist?.binding;
    const childId = binding?.kind === "subcircuit" ? binding.childDocumentId : undefined;
    if (typeof childId === "string" &&
        project.documents.some((candidate) => candidate.id === childId)) {
        return childId;
    }
    return null;
}
function buildObjectIndex(project, documents) {
    return {
        resolve(documentId, objectId) {
            const document = project.documents.find((candidate) => candidate.id === documentId);
            const documentIndex = documents.get(documentId);
            if (!document)
                return undefined;
            if (document.id === objectId) {
                return directObjectLocator(documentId, "document", objectId);
            }
            if (documentIndex?.instancesById.has(objectId)) {
                return directObjectLocator(documentId, "instance", objectId);
            }
            if (documentIndex?.netsById.has(objectId)) {
                return directObjectLocator(documentId, "net", objectId);
            }
            if (documentIndex?.routesById.has(objectId)) {
                return directObjectLocator(documentId, "route", objectId);
            }
            if (documentIndex?.junctionsById.has(objectId)) {
                return directObjectLocator(documentId, "junction", objectId);
            }
            if (documentIndex?.annotationsById.has(objectId)) {
                return directObjectLocator(documentId, "annotation", objectId);
            }
            return undefined;
        },
    };
}
export function buildProjectConnectivityIndex(project, resolver) {
    const documents = new Map();
    for (const document of project.documents) {
        documents.set(document.id, buildDocumentIndex(document, resolver));
    }
    return {
        projectId: project.id,
        topDocumentId: project.topDocumentId,
        documents,
        hierarchy: buildHierarchyIndex(project, resolver, documents),
        globalNets: buildGlobalNetIndex(project, documents),
        objectIndex: buildObjectIndex(project, documents),
    };
}
