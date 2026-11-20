import type { CircuitProject } from "@icm/model";
import type { DesignNetlistIR, DesignNetlistInstance } from "./ir.js";
/** An occurrence, not just a Cell-local ID: repeated child Cells remain distinct. */
export interface ElectricalDeviceOrigin {
    vertex: number;
    documentId: string;
    instanceId: string;
    path: string[];
    referencePath: string[];
}
export interface ElectricalGraph {
    labels: string[];
    edges: number[][];
    /** Candidate index only. Equality is NEVER evidence of equivalence. */
    bucket: string;
    /** Semantic identities for topology search only; exact duplicate labels stay intact. */
    topologyLabels?: string[];
    deviceOrigins?: ElectricalDeviceOrigin[];
    /**
     * Each Cell's printed cards, in no order: two graphs with the same cards
     * print the same netlist whatever order its cards come in.
     */
    cards?: string;
}
export type ElectricalGraphResult = {
    status: "ready";
    graph: ElectricalGraph;
} | {
    status: "uncheckable";
    reason: string;
    /** A circuit past the size limit, or with no devices, still prints
     * its cards (#1932). */
    cards?: string;
};
/**
 * The fields, folded to lower case, of the waveforms an independent source
 * is not set to, which the editor keeps and the netlist does not print;
 * null for any other part, or a waveform the editor does not know.
 */
export declare function unprintedSourceFields(instance: DesignNetlistInstance): ReadonlySet<string> | null;
/** Layout-free graph of the emitted devices, with hierarchy expanded. */
export declare function electricalGraphFromIR(ir: DesignNetlistIR, sourceSymbols?: ReadonlyMap<DesignNetlistInstance, string>): ElectricalGraphResult;
/**
 * Whether two results are the same circuit: "equal" to the comparison, or,
 * past its size limit or with no devices, the same printed cards, which
 * only ever prove it.
 */
export declare function sameElectricalCircuit(a: ElectricalGraphResult, b: ElectricalGraphResult): boolean;
export declare function projectElectricalGraph(project: CircuitProject): ElectricalGraphResult;
/** Exact colored-graph bijection. A budget exhaustion is explicitly unknown. */
export type ElectricalGraphMatch = {
    status: "equal";
    mapping: number[];
} | {
    status: "different" | "unknown";
};
export declare function matchElectricalGraphs(a: ElectricalGraph, b: ElectricalGraph, maxSteps?: number, preference?: (source: number, target: number) => number): ElectricalGraphMatch;
export declare function compareElectricalGraphs(a: ElectricalGraph, b: ElectricalGraph, maxSteps?: number): "equal" | "different" | "unknown";
export declare function matchElectricalTopologies(a: ElectricalGraph, b: ElectricalGraph, maxSteps?: number, preference?: (source: number, target: number) => number): ElectricalGraphMatch;
export declare function topologyGraph(graph: ElectricalGraph): ElectricalGraph;
/**
 * Exact graph isomorphism after removing author-facing names and interface
 * representation. Device classes, transistor polarity, pin roles and actual
 * connectivity remain structural evidence.
 * @internal Tests pin topologyGraph's equivalence rules through it.
 */
export declare function compareElectricalTopologies(a: ElectricalGraph, b: ElectricalGraph, maxSteps?: number): "equal" | "different" | "unknown";
/**
 * Layout/name/interface-independent topology closeness in [0, 1].
 *
 * This is ranking evidence, never equivalence evidence. Exact duplicate
 * decisions belong to compareElectricalTopologies. The score compares
 * device/pin/external-terminal populations and two rounds of their electrical
 * neighborhoods, while deliberately ignoring model and parameter values,
 * names, top-level port order, and port-versus-global representation.
 */
export declare function electricalGraphTopologySimilarity(a: ElectricalGraph, b: ElectricalGraph): number;
