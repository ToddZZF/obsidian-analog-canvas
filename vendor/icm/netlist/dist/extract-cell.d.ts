import { type PlacedMosBodies, type ProjectedNetName } from "@icm/derived";
import type { CircuitProject, SchematicDocument } from "@icm/model";
import type { DesignNetlistCell, NetlistDiagnostic } from "./ir.js";
import { type ResolvedDesignNetlistAnalysisOptions } from "./extract-common.js";
export declare function extractCell(project: CircuitProject, document: SchematicDocument, documentsById: Map<string, SchematicDocument>, cellNameByDocumentId: ReadonlyMap<string, string>, projectedNames: ReadonlyMap<string, ProjectedNetName>, placedBodies: PlacedMosBodies | undefined, options: ResolvedDesignNetlistAnalysisOptions, diagnostics: NetlistDiagnostic[]): DesignNetlistCell | null;
