import type { CircuitProject } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
/**
 * Gallery submission quality gates (roadmap phase G3). One deterministic
 * evaluator runs in the publish dialog (live feedback) and in the worker
 * (authoritative enforcement), so the API can never accept what the UI
 * would refuse. Policy set by the owner:
 *
 * - no ERC errors;
 * - no floating endpoints — every visible pin is wired into a net with
 *   other members or carries a sanctioned intent (formal boundary, global
 *   supply, implicit pin, or explicit NoConnect) already classified by ERC;
 * - no near-empty submissions — at least 2 instances, or a drawing with
 *   at least 3 drafting objects including a text (pure block diagrams
 *   stay submittable).
 */
export type SubmissionGateCode = "erc-errors" | "floating-endpoints" | "empty-project";
export interface SubmissionGateFailure {
    code: SubmissionGateCode;
    message: string;
    count: number;
    /** Up to five human-readable example labels ("M1.g", "ERC_…"). */
    examples: readonly string[];
}
export interface SubmissionGateReport {
    ok: boolean;
    failures: readonly SubmissionGateFailure[];
}
export declare function evaluateSubmissionGates(project: CircuitProject, resolver: SymbolResolver): SubmissionGateReport;
