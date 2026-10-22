import { endpointKey } from "./endpoint.js";
import { deriveVisibleConnectivity } from "./connectivity.js";
import { resolveDocumentRoutingGeometry, } from "./resolved-route-geometry.js";
import { unitDirection } from "./segment-geometry.js";
/**
 * Collapse raw SVG/snap hits into electrical conductors.
 *
 * Two segments at one Route corner, a pin plus its incident Route, or a
 * Junction plus all of its branches are one target. Two geometrically crossing
 * but visibly disconnected components stay separate even when storage happens
 * to assign them the same Net id.
 */
export function resolveElectricalContactTargets(document, resolver, candidates, precomputedComponents) {
    return createElectricalContactResolver(document, resolver, precomputedComponents)(candidates);
}
/** A read-only, stable snapshot's conductor lookup, populated only on a hit. */
export function createElectricalContactResolver(document, resolver, precomputedComponents, geometry) {
    let lookup;
    return (candidates) => {
        // No contact means no conductor classification, not an empty full sweep.
        if (candidates.length === 0)
            return [];
        if (!lookup) {
            const endpointComponents = new Map();
            const routeComponents = new Map();
            const components = precomputedComponents ??
                deriveVisibleConnectivity(document, resolver).flatMap((net) => net.components);
            for (const component of components) {
                for (const node of component.nodes) {
                    endpointComponents.set(node.key, component.id);
                }
                for (const routeId of component.routes) {
                    routeComponents.set(routeId, component.id);
                }
            }
            lookup = {
                endpointComponents,
                routeComponents,
                routingGeometry: geometry?.() ?? resolveDocumentRoutingGeometry(document, resolver),
            };
        }
        const { endpointComponents, routeComponents, routingGeometry } = lookup;
        const collinearSignature = (candidate) => {
            const segment = routingGeometry.routes
                .get(candidate.routeId)
                ?.segments.find((entry) => entry.address.segmentIndex === candidate.segmentIndex);
            const direction = segment
                ? unitDirection(segment.from, segment.to)
                : null;
            if (!direction)
                return null;
            const canonical = direction.x < 0 || (direction.x === 0 && direction.y < 0)
                ? { x: -direction.x, y: -direction.y }
                : direction;
            return [
                candidate.netId,
                candidate.point.x,
                candidate.point.y,
                canonical.x.toFixed(9),
                canonical.y.toFixed(9),
            ].join(":");
        };
        const collinearCounts = new Map();
        for (const candidate of candidates) {
            if (candidate.kind !== "route")
                continue;
            const signature = collinearSignature(candidate);
            if (!signature)
                continue;
            collinearCounts.set(signature, (collinearCounts.get(signature) ?? 0) + 1);
        }
        // A candidate joins its visible component, and a collinear same-Net overlap
        // joins its overlapping partners. Overlap only merges: the two collinear
        // arms of a T-Junction must stay one target with the Junction and its
        // perpendicular arm, not become a second target beside them.
        const parent = candidates.map((_, index) => index);
        const root = (index) => {
            while (parent[index] !== index)
                index = parent[index];
            return index;
        };
        const keys = candidates.map(() => []);
        const firstByKey = new Map();
        candidates.forEach((candidate, index) => {
            const signature = candidate.kind === "route" ? collinearSignature(candidate) : null;
            const componentId = candidate.kind === "endpoint"
                ? endpointComponents.get(endpointKey(candidate.endpoint))
                : routeComponents.get(candidate.routeId);
            const candidateKeys = [
                componentId ??
                    (candidate.kind === "endpoint"
                        ? `endpoint:${endpointKey(candidate.endpoint)}`
                        : `route:${candidate.routeId}`),
                ...(signature && (collinearCounts.get(signature) ?? 0) > 1
                    ? [`collinear:${signature}`]
                    : []),
            ];
            for (const key of candidateKeys) {
                keys[index].push(key);
                const first = firstByKey.get(key);
                if (first === undefined) {
                    firstByKey.set(key, index);
                    continue;
                }
                const [left, right] = [root(first), root(index)];
                if (left !== right)
                    parent[Math.max(left, right)] = Math.min(left, right);
            }
        });
        const grouped = new Map();
        candidates.forEach((_, index) => {
            const group = root(index);
            grouped.set(group, [...(grouped.get(group) ?? []), index]);
        });
        return [...grouped.values()]
            .map((members) => {
            // The smallest key names the conductor, independent of candidate order.
            const conductorId = members.flatMap((index) => keys[index]).sort()[0];
            const sorted = members
                .map((index) => candidates[index])
                .sort((left, right) => left.id.localeCompare(right.id, "en"));
            const endpoint = sorted.find((candidate) => candidate.kind === "endpoint");
            const route = sorted.find((candidate) => candidate.kind === "route");
            return {
                conductorId,
                point: { ...sorted[0].point },
                netId: sorted[0].netId,
                candidates: sorted,
                ...(endpoint ? { endpoint } : {}),
                ...(route ? { route } : {}),
            };
        })
            .sort((left, right) => left.conductorId.localeCompare(right.conductorId));
    };
}
