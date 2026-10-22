import { deriveStableId } from "./ids.js";
/**
 * The Leg and Bend IDs `createRoutePath` allocates for a Route of `legCount`
 * legs. They derive from the Route ID, but split Routes keep their original
 * children, so a freed Route ID's children may still exist elsewhere. Callers
 * choosing a new Route ID check these against the Document as well.
 */
export function createdRouteChildIds(routeId, legCount) {
    return Array.from({ length: legCount }, (_, index) => [
        deriveStableId("route-leg", routeId, String(index)),
        ...(index < legCount - 1
            ? [deriveStableId("route-bend", routeId, String(index))]
            : []),
    ]).flat();
}
/**
 * Construct a new canonical Route path and allocate deterministic child IDs.
 * Existing Routes must be edited with identity-preserving Route operations,
 * never reconstructed through this creation-only factory.
 */
export function createRoutePath(input) {
    if (input.modes.length !== input.bends.length + 1) {
        throw new Error("A new Route requires one mode per geometric leg");
    }
    const childIds = createdRouteChildIds(input.id, input.modes.length);
    return {
        id: input.id,
        netId: input.netId,
        start: input.start,
        legs: input.modes.map((mode, index) => ({
            id: childIds[index * 2],
            to: index < input.bends.length
                ? {
                    kind: "bend",
                    bendId: childIds[index * 2 + 1],
                    position: { ...input.bends[index] },
                }
                : { kind: "endpoint", endpoint: input.end },
            mode,
        })),
        ...(input.presentation ? { presentation: input.presentation } : {}),
        ...(input.styleOverride
            ? { styleOverride: structuredClone(input.styleOverride) }
            : {}),
        ...(input.documentStyle
            ? { documentStyle: structuredClone(input.documentStyle) }
            : {}),
    };
}
export function routeEnd(route) {
    const target = route.legs.at(-1)?.to;
    if (target?.kind !== "endpoint") {
        throw new Error(`Route ${route.id} has no final endpoint`);
    }
    return target.endpoint;
}
export function routeEndpoints(route) {
    return [route.start, routeEnd(route)];
}
export function routeBends(route) {
    return route.legs.flatMap((leg) => leg.to.kind === "bend" ? [{ ...leg.to.position }] : []);
}
export function routeModes(route) {
    return route.legs.map((leg) => leg.mode);
}
