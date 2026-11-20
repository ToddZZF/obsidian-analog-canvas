import type { VacaskSourceStatement } from "./vacask-source.js";
/** Top-level assignment spans; expressions remain simulator-owned. */
export declare function vacaskAssignments(statement: VacaskSourceStatement): {
    name: string;
    start: number;
    end: number;
}[];
export declare function isVacaskStatement(statement: VacaskSourceStatement, name: string): boolean;
