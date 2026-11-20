import type { DesignNetlistIR, NetlistDiagnostic } from "./ir.js";
import type { PrintedNetlistInstance, PrintedNetlistParameter } from "./printed-netlist.js";
/** Native identifiers are case-sensitive; quoting does not rename an electrical node. */
export declare function vacaskIdentifier(name: string): string;
/** Translate project scalar syntax, not arbitrary authored simulation programs. */
export declare function vacaskProjectValue(raw: string, parameterNames?: ReadonlyMap<string, string>): string;
export type PrintedVacask = {
    ok: true;
    text: string;
    instances: PrintedNetlistInstance[];
    parameters: PrintedNetlistParameter[];
} | {
    ok: false;
    diagnostics: NetlistDiagnostic[];
};
/**
 * Native circuit projection directly from the shared electrical IR. Analyses,
 * model-library selection and environment policy belong to preparation, not
 * this printer. Used by native execution and the generated Circuit preview.
 */
export declare function printVacaskWithLocations(ir: DesignNetlistIR, rootAsTopLevel?: boolean, emission?: {
    cellIds?: ReadonlySet<string>;
    definitionNames?: ReadonlySet<string>;
    preamble?: boolean;
    reservedNames?: Iterable<string>;
    /** Editing projection only: unresolved parameter slots never reach execution. */
    authoring?: boolean;
}): PrintedVacask;
