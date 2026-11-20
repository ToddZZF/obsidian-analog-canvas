import type { Instance, SchematicDocument } from "@icm/model";
import { type BuiltInSubcircuitDescriptor } from "@icm/devices";
import type { DesignNetlistInstance, NetlistDiagnostic } from "./ir.js";
import { type ResolvedDesignNetlistAnalysisOptions } from "./extract-common.js";
import { type CellNetContext } from "./extract-nets.js";
export declare function extractBuiltInSubcircuitInstance(document: SchematicDocument, instance: Instance, definition: BuiltInSubcircuitDescriptor, reference: string, context: CellNetContext, _options: ResolvedDesignNetlistAnalysisOptions, diagnostics: NetlistDiagnostic[], 
/**
 * A Library part, whose call reaches its generated body, not a User
 * Component calling the author's own subcircuit (#1928).
 */
libraryPart: boolean, 
/** The body never reads VDD/VSS, so an undrawn supply is tied to ground. */
supplyFree?: boolean): DesignNetlistInstance | null;
