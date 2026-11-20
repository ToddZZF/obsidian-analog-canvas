import { type CircuitProject, type Instance, type SchematicDocument } from "@icm/model";
import type { DesignNetlistInstance, NetlistDiagnostic } from "./ir.js";
import { type ResolvedDesignNetlistAnalysisOptions } from "./extract-common.js";
import { type CellNetContext } from "./extract-nets.js";
export declare function builtInZenerModelName(reference: string): string;
export declare function zenerParameter(instance: Instance, name: "bv" | "ibv"): string | undefined;
export declare function extractDeviceInstance(project: CircuitProject, document: SchematicDocument, instance: Instance, context: CellNetContext, options: ResolvedDesignNetlistAnalysisOptions, diagnostics: NetlistDiagnostic[]): DesignNetlistInstance | null;
