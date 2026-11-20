import type { ComponentDefinition, ExternalSubcircuitDefinition, Instance, SchematicDocument } from "@icm/model";
import type { DesignNetlistInstance, NetlistDiagnostic } from "./ir.js";
import { type ResolvedDesignNetlistAnalysisOptions } from "./extract-common.js";
import { type CellNetContext } from "./extract-nets.js";
export declare function extractHierarchyInstance(document: SchematicDocument, instance: Instance, documentsById: Map<string, SchematicDocument>, cellNameByDocumentId: ReadonlyMap<string, string>, context: CellNetContext, options: ResolvedDesignNetlistAnalysisOptions, diagnostics: NetlistDiagnostic[]): DesignNetlistInstance | null;
export declare function extractExternalSubcircuitInstance(document: SchematicDocument, instance: Instance, definition: ExternalSubcircuitDefinition | undefined, component: ComponentDefinition | undefined, context: CellNetContext, options: ResolvedDesignNetlistAnalysisOptions, diagnostics: NetlistDiagnostic[]): DesignNetlistInstance | null;
