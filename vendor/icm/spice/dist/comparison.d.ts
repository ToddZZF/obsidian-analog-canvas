import type { SourceSpan } from "@icm/model";
import type { CircuitIR } from "./ir.js";
/** Kinds that change which devices exist or what they are wired to. */
export declare const TOPOLOGY_DIFFERENCE_KINDS: readonly ["interface", "device", "target", "declaration", "connection", "scope"];
/** Kinds that leave the wiring alone. */
export declare const DETAIL_DIFFERENCE_KINDS: readonly ["port-order", "binding", "parameter"];
export interface StructuralDifference {
    kind: (typeof TOPOLOGY_DIFFERENCE_KINDS)[number] | (typeof DETAIL_DIFFERENCE_KINDS)[number];
    cell: string;
    object: string;
    expected: unknown;
    actual: unknown;
    expectedSource?: SourceSpan;
}
/** Checks besides topology; each is on unless set to false. */
export interface StructuralComparisonOptions {
    /** Port order, not only the port set. A figure does not fix it. */
    portOrder?: boolean | undefined;
    /** Literal device parameters. */
    parameters?: boolean | undefined;
    /** One device bound to the same name another way: model card or call. */
    bindings?: boolean | undefined;
    /** Off, .model bodies, .param, Cell parameters and preserved statements
     * are left out and listed in `notes` instead of making the result
     * inconclusive, and a parameter expression compares by its text. */
    declarations?: boolean | undefined;
    /** Preserve the exact original spans for a source writeback report. */
    referenceSpans?: boolean | undefined;
    /** Known types of model targets in the drawing, even if its printer omits their declarations. */
    actualModelTypes?: ReadonlyMap<string, string | undefined>;
}
export interface StructuralComparison {
    status: "equal" | "different" | "inconclusive";
    /** Devices and what they are wired to, alone. */
    topology: "equal" | "different" | "inconclusive";
    /** One line: the topology verdict, then the other differences by kind. */
    summary: string;
    differences: StructuralDifference[];
    reasons: string[];
    /** What the reference holds that a comparison without declarations left out. */
    notes: string[];
    comparedCells: number;
}
/** Reference/pin-identity comparison, not a simulator or graph isomorphism.
 * Reuses compiler IR, including global scope and ordered subcircuit terminals.
 * Local auto names do not matter; a Net is its sorted endpoint membership.
 */
export declare function compareCircuitIR(actual: CircuitIR, expected: CircuitIR, actualRoot: string, expectedRoot?: string, options?: StructuralComparisonOptions): StructuralComparison;
