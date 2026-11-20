import { type ElectricalGraph, type ElectricalDeviceOrigin } from "./equivalence.js";
export interface DeviceCorrespondence {
    source: ElectricalDeviceOrigin;
    target: ElectricalDeviceOrigin;
    parameterSimilarity: number;
}
export interface TopologyCorrespondence {
    exact: boolean;
    netlistMatch: "equal" | "different" | "unknown";
    similarity: number;
    structureSimilarity: number;
    parameterSimilarity: number;
    matchedDevices: number;
    sourceDevices: number;
    targetDevices: number;
    pairs: DeviceCorrespondence[];
    /** Search stopped at its work budget; pairs remain valid, not necessarily maximal. */
    limited: boolean;
}
export declare function compareTopologyCorrespondence(a: ElectricalGraph, b: ElectricalGraph, maxWork?: number): TopologyCorrespondence;
