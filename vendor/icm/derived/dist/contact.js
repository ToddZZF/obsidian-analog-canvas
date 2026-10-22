import { deriveStableId, routeEnd } from "@icm/model";
import { buildEndpointObjectLookup, endpointKey, isVisibleEndpoint, netEndpoints, resolveEndpointOutwardDirection, resolveEndpointPoint, } from "./endpoint.js";
import { resolveDocumentRoutingGeometry, } from "./resolved-route-geometry.js";
function pointKey(point) {
    return `${point.x},${point.y}`;
}
function directContactPairs(document, resolver, evidence) {
    const pairs = [];
    for (const contact of (evidence ?? deriveDocumentContactEvidence(document, resolver)).contacts) {
        for (let leftIndex = 0; leftIndex < contact.endpoints.length; leftIndex++) {
            for (let rightIndex = leftIndex + 1; rightIndex < contact.endpoints.length; rightIndex++) {
                const left = contact.endpoints[leftIndex];
                const right = contact.endpoints[rightIndex];
                pairs.push({
                    id: [endpointKey(left), endpointKey(right)]
                        .sort((a, b) => a.localeCompare(b, "en"))
                        .join("|"),
                    netId: contact.netId,
                    point: { ...contact.point },
                    endpoints: [left, right],
                });
            }
        }
    }
    return pairs.sort((left, right) => left.id.localeCompare(right.id, "en"));
}
/**
 * Compare confirmed direct contacts across one projected edit. Pair identity
 * is endpoint-based, so two endpoints translated together are retained even
 * though their page coordinate changes.
 */
export function deriveDirectContactDelta(before, after, resolver, evidence) {
    const beforePairs = directContactPairs(before, resolver, evidence?.before);
    const afterPairs = directContactPairs(after, resolver, evidence?.after);
    const beforeById = new Map(beforePairs.map((pair) => [pair.id, pair]));
    const afterById = new Map(afterPairs.map((pair) => [pair.id, pair]));
    return {
        gained: afterPairs.filter((pair) => !beforeById.has(pair.id)),
        lost: beforePairs.filter((pair) => !afterById.has(pair.id)),
        retained: afterPairs.filter((pair) => beforeById.has(pair.id)),
    };
}
function directionKey(direction) {
    return `${Math.sign(direction.x)},${Math.sign(direction.y)}`;
}
function inverseAxisDirection(direction) {
    return {
        x: direction.x === 0 ? 0 : -Math.sign(direction.x),
        y: direction.y === 0 ? 0 : -Math.sign(direction.y),
    };
}
/**
 * Directions of a same-Net conductor whose interior runs through `point`.
 * A route the model never split still reads as one continuous wire under a
 * parked endpoint, so the visual branch needs its two through arms counted.
 * Pure crossings stay out: with no endpoint at the point there is no contact
 * to attach these directions to.
 */
function routeThroughDirections(centerline, point) {
    for (let index = 1; index < centerline.length - 1; index += 1) {
        const vertex = centerline[index];
        if (vertex.x === point.x && vertex.y === point.y) {
            return [
                {
                    x: Math.sign(centerline[index - 1].x - point.x),
                    y: Math.sign(centerline[index - 1].y - point.y),
                },
                {
                    x: Math.sign(centerline[index + 1].x - point.x),
                    y: Math.sign(centerline[index + 1].y - point.y),
                },
            ];
        }
    }
    for (let index = 0; index < centerline.length - 1; index += 1) {
        const from = centerline[index];
        const to = centerline[index + 1];
        const cross = (to.x - from.x) * (point.y - from.y) -
            (to.y - from.y) * (point.x - from.x);
        if (cross !== 0)
            continue;
        const dot = (point.x - from.x) * (to.x - from.x) +
            (point.y - from.y) * (to.y - from.y);
        const length = (to.x - from.x) * (to.x - from.x) + (to.y - from.y) * (to.y - from.y);
        if (dot <= 0 || dot >= length)
            continue;
        return [
            { x: Math.sign(from.x - point.x), y: Math.sign(from.y - point.y) },
            { x: Math.sign(to.x - point.x), y: Math.sign(to.y - point.y) },
        ];
    }
    return [];
}
function routeEndpointDirections(route, centerline, endpointKeys) {
    const directions = [];
    if (centerline.length < 2)
        return directions;
    if (endpointKeys.has(endpointKey(route.start))) {
        directions.push({
            x: Math.sign(centerline[1].x - centerline[0].x),
            y: Math.sign(centerline[1].y - centerline[0].y),
        });
    }
    if (endpointKeys.has(endpointKey(routeEnd(route)))) {
        directions.push({
            x: Math.sign(centerline.at(-2).x - centerline.at(-1).x),
            y: Math.sign(centerline.at(-2).y - centerline.at(-1).y),
        });
    }
    return directions;
}
function contactIncidents(document, resolver, endpoints, point, geometry, routesForNet, endpointConnections, endpointLookup) {
    const incidents = [];
    const explicitEndpointKeys = new Set(endpoints.map(endpointKey));
    for (const route of routesForNet) {
        const centerline = geometry.routes.get(route.id)?.centerline;
        if (!centerline)
            continue;
        const endpointDirections = routeEndpointDirections(route, centerline, explicitEndpointKeys);
        for (const direction of endpointDirections) {
            incidents.push({ kind: "route", objectId: route.id, direction });
        }
        if (endpointDirections.length === 0) {
            for (const direction of routeThroughDirections(centerline, point)) {
                incidents.push({ kind: "route", objectId: route.id, direction });
            }
        }
    }
    for (const endpoint of endpoints) {
        if (endpoint.kind !== "terminal")
            continue;
        const outward = endpointConnections?.get(endpointKey(endpoint))?.outward ??
            resolveEndpointOutwardDirection(document, resolver, endpoint, endpointLookup);
        if (outward) {
            incidents.push({
                kind: "terminal",
                objectId: endpoint.instanceId,
                direction: inverseAxisDirection(outward),
            });
        }
    }
    return incidents.sort((left, right) => directionKey(left.direction).localeCompare(directionKey(right.direction), "en") ||
        left.kind.localeCompare(right.kind, "en") ||
        left.objectId.localeCompare(right.objectId, "en"));
}
function netContacts(document, resolver, net, geometry, routesForNet, endpointConnections, endpointLookup, routeLookup) {
    const grouped = new Map();
    for (const endpoint of netEndpoints(document, net)) {
        if (!isVisibleEndpoint(document, resolver, endpoint, endpointLookup)) {
            continue;
        }
        const point = endpointConnections?.get(endpointKey(endpoint))?.contactPoint ??
            resolveEndpointPoint(document, resolver, endpoint, endpointLookup);
        if (!point)
            continue;
        const key = pointKey(point);
        grouped.set(key, [...(grouped.get(key) ?? []), { endpoint, point }]);
    }
    return [...grouped.values()]
        .map((entries) => {
        const endpoints = entries
            .map((entry) => entry.endpoint)
            .sort((left, right) => endpointKey(left).localeCompare(endpointKey(right), "en"));
        const point = entries[0].point;
        // Scanning a small Net is cheaper than querying all spatial buckets.
        // Larger Nets reuse the context's already-built broad-phase index.
        const nearbyRoutes = routeLookup && routesForNet.length > 32
            ? [
                ...new Set(routeLookup.spatialIndex.routeSegments
                    .queryPoint(point)
                    .map((segment) => segment.routeId)),
            ].flatMap((id) => {
                const route = routeLookup.routesById.get(id);
                return route?.netId === net.id ? [route] : [];
            })
            : routesForNet;
        const incidents = contactIncidents(document, resolver, endpoints, point, geometry, nearbyRoutes, endpointConnections, endpointLookup);
        const directions = new Map();
        for (const incident of incidents) {
            directions.set(directionKey(incident.direction), incident.direction);
        }
        return {
            id: deriveStableId("contact", net.id, pointKey(point), endpoints.map(endpointKey).join("|")),
            netId: net.id,
            point: { ...point },
            endpoints,
            incidents,
            branchDirections: [...directions.values()],
        };
    })
        .sort((left, right) => left.netId.localeCompare(right.netId, "en") ||
        left.point.x - right.point.x ||
        left.point.y - right.point.y ||
        left.id.localeCompare(right.id, "en"));
}
/**
 * Whether a confirmed same-Net contact needs a visible junction dot.
 *
 * A dot communicates a visible branch, not the number of model objects at a
 * contact. Route arms and terminal stems that leave in the same direction
 * paint as one conductor. A straight join, a corner, and a terminal stem that
 * is collinear with a through-wire therefore remain dotless. Three distinct
 * visible directions require a dot. Three coincident terminals also require a
 * dot even when some symbol stems overlap geometrically.
 */
export function contactRequiresJunctionDot(contact) {
    const terminalCount = contact.endpoints.filter((endpoint) => endpoint.kind === "terminal").length;
    return terminalCount >= 3 || contact.branchDirections.length >= 3;
}
export function deriveDocumentContactEvidence(document, resolver, routingGeometry = resolveDocumentRoutingGeometry(document, resolver), options = {}) {
    const endpointLookup = options.endpointLookup ?? buildEndpointObjectLookup(document);
    const routeLookup = options.spatialIndex
        ? {
            spatialIndex: options.spatialIndex,
            routesById: options.routesById ??
                new Map(document.routes.map((route) => [route.id, route])),
        }
        : undefined;
    const routesByNetId = options.routesByNetId ??
        (() => {
            const grouped = new Map();
            for (const route of document.routes) {
                const routes = grouped.get(route.netId) ?? [];
                routes.push(route);
                grouped.set(route.netId, routes);
            }
            return grouped;
        })();
    const contacts = [...document.nets]
        .sort((left, right) => left.id.localeCompare(right.id, "en"))
        .flatMap((net) => netContacts(document, resolver, net, routingGeometry, routesByNetId.get(net.id) ?? [], options.endpointConnections, endpointLookup, routeLookup));
    const byEndpointKey = new Map();
    for (const contact of contacts) {
        for (const endpoint of contact.endpoints) {
            byEndpointKey.set(endpointKey(endpoint), contact);
        }
    }
    return { contacts, byEndpointKey };
}
