import type { StableId } from "@icm/model";
import type { NetlistDiagnostic } from "./ir.js";
import type { DesignNetlistAnalysisOptions } from "./extract.js";
export declare function isIdentifier(value: string, allowGround?: boolean): boolean;
export declare function compareText(left: string, right: string): number;
export declare function diagnostic(diagnostics: NetlistDiagnostic[], documentId: StableId, code: string, message: string, objectIds?: StableId[], severity?: NetlistDiagnostic["severity"], parameter?: string): void;
export type ResolvedDesignNetlistAnalysisOptions = Required<DesignNetlistAnalysisOptions> & {
    /**
     * A simulation run's deck, which names its folder's files (`deckSources`),
     * rather than a netlist the editor hands out.
     */
    run: boolean;
};
