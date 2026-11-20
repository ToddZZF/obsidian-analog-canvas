import type { StableId } from "@icm/model";
import type { DesignNetlistIR, DesignNetlistCell } from "./ir.js";
export interface TerminalCurrentInstrumentation {
    readonly cellId: StableId;
    readonly instanceId: StableId;
    readonly pinName: string;
    readonly senseReference: string;
    readonly senseNode: string;
}
export declare function instrumentationKey(instrumentation: Pick<TerminalCurrentInstrumentation, "cellId" | "instanceId" | "pinName">): string;
/** Series zero-volt source: positive branch flow enters the selected terminal.
 * Applies to derived IR only; source selection and name allocation are callers. */
export declare function instrumentTerminalCurrents(ir: DesignNetlistIR, instrumentations: ReadonlyMap<string, TerminalCurrentInstrumentation>): DesignNetlistIR;
export declare function instrumentCellTerminalCurrents(cell: DesignNetlistCell, instrumentations: ReadonlyMap<string, TerminalCurrentInstrumentation>): DesignNetlistCell;
