import { endpointKey, netEndpoints, resolveEndpointPoint } from "./endpoint.js";
import { resolveVisualAnchor } from "./anchor.js";
import { nearestRouteSegment } from "./route-query.js";
import { resolveDocumentRoutingGeometry, } from "./resolved-route-geometry.js";
/**
 * Resolves the single accepted electrical meaning of a Net Label.
 *
 * `netId` is the electrical identity. `anchor` separately controls placement:
 * an explicit route anchor is exact, while a free/object anchor resolves to
 * the nearest routed component only for virtual-connectivity presentation.
 */
export function resolveNetLabelBinding(document, resolver, annotation, routingGeometry = resolveDocumentRoutingGeometry(document, resolver)) {
    if ((annotation.kind !== "net-label" && annotation.kind !== "power-label") ||
        !annotation.netId ||
        !document.nets.some((net) => net.id === annotation.netId)) {
        return null;
    }
    const netId = annotation.netId;
    const anchor = annotation.anchor;
    if (anchor.kind === "route") {
        const route = document.routes.find((candidate) => candidate.id === anchor.routeId && candidate.netId === netId);
        if (route) {
            return {
                annotationId: annotation.id,
                netId,
                routeId: route.id,
                legId: anchor.legId,
                segmentIndex: route.legs.findIndex((leg) => leg.id === anchor.legId),
                endpoint: route.start,
            };
        }
    }
    if (anchor.kind === "object") {
        const junction = document.junctions.find((candidate) => candidate.id === anchor.objectId && candidate.netId === netId);
        if (junction) {
            return {
                annotationId: annotation.id,
                netId,
                endpoint: { kind: "junction", junctionId: junction.id },
            };
        }
    }
    const position = resolveVisualAnchor(document, resolver, annotation.anchor, routingGeometry).position;
    const routeCandidates = document.routes
        .filter((route) => route.netId === netId)
        .flatMap((route) => {
        const geometry = routingGeometry.routes.get(route.id);
        const hit = geometry ? nearestRouteSegment(geometry, position) : null;
        return hit
            ? [
                {
                    distance: hit.distanceSquared,
                    endpoint: route.start,
                    routeId: route.id,
                    legId: hit.address.legId,
                    segmentIndex: hit.address.segmentIndex,
                },
            ]
            : [];
    })
        .sort((left, right) => left.distance - right.distance ||
        left.routeId.localeCompare(right.routeId, "en") ||
        left.segmentIndex - right.segmentIndex);
    const route = routeCandidates[0];
    if (route) {
        return {
            annotationId: annotation.id,
            netId,
            routeId: route.routeId,
            legId: route.legId,
            segmentIndex: route.segmentIndex,
            endpoint: route.endpoint,
        };
    }
    const net = document.nets.find((candidate) => candidate.id === netId);
    const endpoint = netEndpoints(document, net)
        .flatMap((candidate) => {
        const endpointPosition = resolveEndpointPoint(document, resolver, candidate);
        return endpointPosition
            ? [
                {
                    endpoint: candidate,
                    distance: (position.x - endpointPosition.x) ** 2 +
                        (position.y - endpointPosition.y) ** 2,
                },
            ]
            : [];
    })
        .sort((left, right) => left.distance - right.distance ||
        endpointKey(left.endpoint).localeCompare(endpointKey(right.endpoint), "en"))[0]?.endpoint;
    return endpoint ? { annotationId: annotation.id, netId, endpoint } : null;
}
export function resolveNetLabelBindings(document, resolver, netId, routingGeometry = resolveDocumentRoutingGeometry(document, resolver)) {
    return document.annotations
        .flatMap((annotation) => {
        const binding = resolveNetLabelBinding(document, resolver, annotation, routingGeometry);
        return binding?.netId === netId ? [binding] : [];
    })
        .sort((left, right) => left.annotationId.localeCompare(right.annotationId, "en"));
}
