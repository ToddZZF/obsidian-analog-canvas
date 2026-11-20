import { type ProjectedNetName, type ResolvedDocumentLogicalNets, type ResolvedLogicalNet } from "@icm/derived";
import type { CircuitProject, ExternalSubcircuitDefinition, Instance, SchematicDocument } from "@icm/model";
import type { DesignNetlistCell, NetlistDiagnostic } from "./ir.js";
import { type EncodedNetName } from "./net-name-codec.js";
import { type ResolvedDesignNetlistAnalysisOptions } from "./extract-common.js";
export interface CellNetContext {
    nameByNetId: Map<string, string>;
    /** A Net the drawing names, under a name this format cannot write. */
    unwritableNameByNetId: Map<string, string>;
    nameByAuthoredName: Map<string, string>;
    netByTerminal: Map<string, ResolvedLogicalNet>;
    noConnectNameByTerminal: Map<string, string>;
    nets: DesignNetlistCell["nets"];
    /**
     * This Cell's resolved Logical Nets. A body with no explicit wiring asks the
     * bulk policy per pin, and that policy resolves the whole Document when it
     * is not handed this — once per terminal of every MOS.
     */
    logicalNets: ResolvedDocumentLogicalNets;
}
export declare function encodeCandidate(name: string, scope: "local" | "global", options: ResolvedDesignNetlistAnalysisOptions): EncodedNetName;
/**
 * A visible Ground or supply marker (VDD Power, Named Ground) is already an
 * explicit electrical statement.
 * Older drawings and copied markers can predate the persisted name-claim
 * ownership record, so recover that statement in the read-only export view.
 * Ordinary unnamed Nets still receive deterministic net0-style names below.
 */
export declare function withNetlistPowerMarkerClaims(document: SchematicDocument, project?: CircuitProject): SchematicDocument;
export declare function buildNetContext(project: CircuitProject, sourceDocument: SchematicDocument, documentsById: Map<string, SchematicDocument>, externalDefinitionsById: ReadonlyMap<string, ExternalSubcircuitDefinition>, projectedNames: ReadonlyMap<string, ProjectedNetName>, options: ResolvedDesignNetlistAnalysisOptions, diagnostics: NetlistDiagnostic[]): CellNetContext;
export declare function terminalNetName(document: SchematicDocument, instance: Instance, pinName: string, context: CellNetContext, diagnostics: NetlistDiagnostic[], memberId?: string): string | null;
