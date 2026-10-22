import { endpointKey } from "./endpoint.js";
import { resolveDocumentLogicalNets } from "./logical-net.js";
import { resolveMosBulkConnection } from "./mos-bulk.js";
function sameEndpoint(left, right) {
    return endpointKey(left) === endpointKey(right);
}
export function createEndpointConnectivityClassifier(document, index, resolver) {
    const logicalResolution = resolveDocumentLogicalNets(document);
    const noConnectKeys = new Set(document.noConnects.map((record) => endpointKey(record.endpoint)));
    const assess = (endpoint) => {
        const key = endpointKey(endpoint);
        const baseNetId = index?.endpointToBaseNetId.get(key) ?? null;
        const record = baseNetId
            ? index?.logicalNetByBaseNetId.get(baseNetId)
            : undefined;
        const peers = (record?.logicalEndpoints ?? []).filter((candidate) => !sameEndpoint(candidate, endpoint));
        const membership = !baseNetId
            ? "unbound"
            : peers.length > 0
                ? "peer-connected"
                : "singleton";
        const logicalGroup = baseNetId
            ? logicalResolution.byBaseNetId.get(baseNetId)
            : undefined;
        const formalBoundary = Boolean(logicalGroup &&
            document.netlist?.terminals.some((terminal) => logicalGroup.baseNetIds.includes(terminal.netId)));
        const globalSupply = Boolean(logicalGroup?.scope === "global" &&
            (logicalGroup.powerDomain === "vdd" ||
                logicalGroup.powerDomain === "ground"));
        const sourceDeclared = Boolean(logicalGroup?.sourceNetIds.length);
        let implicit = false;
        if (endpoint.kind === "terminal") {
            const instance = document.instances.find((candidate) => candidate.id === endpoint.instanceId);
            const resolved = instance
                ? resolver.resolve(instance.symbolId, instance.symbolVariantId)
                : undefined;
            implicit = Boolean(resolved?.definition.pins.find((pin) => pin.name === endpoint.pinName)
                ?.presentation.visibility === "implicit");
        }
        const intent = {
            explicitNoConnect: noConnectKeys.has(key),
            implicit,
            formalBoundary,
            globalSupply,
            sourceDeclared,
        };
        return {
            endpoint,
            baseNetId,
            logicalNetId: record?.netId ?? null,
            membership,
            peerEndpoints: peers,
            intent,
            electricallySatisfied: membership === "peer-connected" ||
                intent.explicitNoConnect ||
                intent.implicit ||
                intent.formalBoundary ||
                intent.globalSupply,
        };
    };
    return {
        assess,
        assessMosBulk(instanceId) {
            const endpoint = {
                kind: "terminal",
                instanceId,
                pinName: "B",
            };
            const assessment = assess(endpoint);
            const instance = document.instances.find((candidate) => candidate.id === instanceId);
            const resolution = instance
                ? resolveMosBulkConnection(document, instance)
                : undefined;
            const configuredDefault = resolution?.status === "cell-default" ||
                resolution?.status === "instance-override" ||
                resolution?.status === "supply-default";
            const externalPeers = assessment.peerEndpoints.filter((candidate) => {
                if (candidate.kind !== "terminal")
                    return true;
                const peerInstance = document.instances.find((item) => item.id === candidate.instanceId);
                const peerResolved = peerInstance
                    ? resolver.resolve(peerInstance.symbolId, peerInstance.symbolVariantId)
                    : undefined;
                return (peerResolved?.definition.pins
                    .find((pin) => pin.name === candidate.pinName)
                    ?.role.toLowerCase() !== "bulk");
            });
            return {
                ...assessment,
                peerEndpoints: externalPeers,
                membership: !assessment.baseNetId
                    ? "unbound"
                    : externalPeers.length > 0
                        ? "peer-connected"
                        : "singleton",
                electricallySatisfied: configuredDefault ||
                    externalPeers.length > 0 ||
                    assessment.intent.explicitNoConnect ||
                    assessment.intent.formalBoundary ||
                    assessment.intent.globalSupply,
            };
        },
    };
}
