import type { ProjectModelSource } from "@icm/model";
import { type SubcircuitStartStatement } from "@icm/spice";
import type { PrintedProjectModelSource } from "./project-model-source.js";
import type { SimulationSourceDiagnostic } from "./source-file-graph.js";
/** A bounded, execution-only projection. Native ownership is never replaced by
 * imported schematic geometry or a relabelled opaque library. */
export declare function projectVacaskModel(source: ProjectModelSource, expanded: PrintedProjectModelSource, reservedNames?: Iterable<string>, nativeEntries?: readonly SubcircuitStartStatement[]): {
    ok: true;
    rendered: PrintedProjectModelSource;
} | {
    ok: false;
    diagnostics: SimulationSourceDiagnostic[];
};
