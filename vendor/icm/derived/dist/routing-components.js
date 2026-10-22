import { routeEnd } from "@icm/model";
import { endpointKey } from "./endpoint.js";
export function derivePowerRailComponent(document, routeId) {
    const seed = document.routes.find((route) => route.id === routeId);
    if (!seed || seed.presentation !== "power-rail")
        return null;
    const candidates = document.routes.filter((route) => route.netId === seed.netId && route.presentation === "power-rail");
    const byJunction = new Map();
    for (const route of candidates) {
        for (const endpoint of [route.start, routeEnd(route)]) {
            if (endpoint.kind !== "junction")
                continue;
            const incident = byJunction.get(endpoint.junctionId) ?? [];
            incident.push(route);
            byJunction.set(endpoint.junctionId, incident);
        }
    }
    const visited = new Set([seed.id]);
    const queue = [seed];
    while (queue.length > 0) {
        const route = queue.shift();
        for (const endpoint of [route.start, routeEnd(route)]) {
            if (endpoint.kind !== "junction")
                continue;
            for (const incident of byJunction.get(endpoint.junctionId) ?? []) {
                if (visited.has(incident.id))
                    continue;
                visited.add(incident.id);
                queue.push(incident);
            }
        }
    }
    const railRoutes = candidates.filter((route) => visited.has(route.id));
    const degreeByJunction = new Map();
    for (const route of railRoutes) {
        for (const endpoint of [route.start, routeEnd(route)]) {
            if (endpoint.kind !== "junction")
                continue;
            degreeByJunction.set(endpoint.junctionId, (degreeByJunction.get(endpoint.junctionId) ?? 0) + 1);
        }
    }
    const order = (left, right) => left.localeCompare(right, "en");
    const junctionIds = [...degreeByJunction.keys()].sort(order);
    return {
        routeIds: railRoutes.map((route) => route.id).sort(order),
        junctionIds,
        endpointJunctionIds: junctionIds
            .filter((junctionId) => degreeByJunction.get(junctionId) === 1)
            .sort(order),
    };
}
export function deriveInternalGroupSelection(document, instanceIds) {
    const selectedIds = new Set(instanceIds);
    const netIds = document.nets
        .filter((net) => net.terminals.length > 0 &&
        net.terminals.every((terminal) => selectedIds.has(terminal.instanceId)))
        .map((net) => net.id)
        .sort((left, right) => left.localeCompare(right, "en"));
    const internalRouteIds = new Set();
    const internalJunctionIds = new Set();
    const routesByNetId = new Map();
    for (const route of document.routes) {
        const netRoutes = routesByNetId.get(route.netId) ?? [];
        netRoutes.push(route);
        routesByNetId.set(route.netId, netRoutes);
    }
    for (const net of document.nets) {
        const netRoutes = [...(routesByNetId.get(net.id) ?? [])].sort((left, right) => left.id.localeCompare(right.id, "en"));
        const routesByEndpoint = new Map();
        for (const route of netRoutes) {
            for (const endpoint of [route.start, routeEnd(route)]) {
                const key = endpointKey(endpoint);
                const incident = routesByEndpoint.get(key) ?? [];
                incident.push(route);
                routesByEndpoint.set(key, incident);
            }
        }
        const unvisited = new Set(netRoutes.map((route) => route.id));
        for (const seed of netRoutes) {
            if (!unvisited.has(seed.id))
                continue;
            const component = [];
            const queue = [seed];
            unvisited.delete(seed.id);
            while (queue.length > 0) {
                const route = queue.shift();
                component.push(route);
                for (const endpoint of [route.start, routeEnd(route)]) {
                    for (const incident of routesByEndpoint.get(endpointKey(endpoint)) ??
                        []) {
                        if (!unvisited.delete(incident.id))
                            continue;
                        queue.push(incident);
                    }
                }
            }
            const componentEndpoints = new Map(component
                .flatMap((route) => [route.start, routeEnd(route)])
                .map((endpoint) => [endpointKey(endpoint), endpoint]));
            let hasSelectedTerminal = false;
            let crossesSelectionBoundary = false;
            for (const endpoint of componentEndpoints.values()) {
                if (endpoint.kind !== "terminal")
                    continue;
                if (selectedIds.has(endpoint.instanceId))
                    hasSelectedTerminal = true;
                else
                    crossesSelectionBoundary = true;
            }
            if (!hasSelectedTerminal || crossesSelectionBoundary)
                continue;
            for (const route of component)
                internalRouteIds.add(route.id);
            for (const endpoint of componentEndpoints.values()) {
                if (endpoint.kind === "junction")
                    internalJunctionIds.add(endpoint.junctionId);
            }
        }
    }
    return {
        netIds,
        routeIds: [...internalRouteIds].sort((left, right) => left.localeCompare(right, "en")),
        junctionIds: [...internalJunctionIds].sort((left, right) => left.localeCompare(right, "en")),
    };
}
