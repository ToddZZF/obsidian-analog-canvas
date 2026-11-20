import type { SimulationSourceInput } from "@icm/model";
import type { SimulationSourceDiagnostic } from "./source-file-graph.js";
import { type MappedSimulationFile } from "./simulation-source-map.js";
/** An ambient-temperature run point, not tnom or a device parameter override.
 * Set options immediately before each analysis/sweep group so native clears
 * and earlier options cannot silently restore a nominal ambient temperature. */
export declare function projectVacaskRunTemperature(input: SimulationSourceInput, mapped: MappedSimulationFile[], temperatureC: number | undefined): {
    files: MappedSimulationFile[];
    diagnostics: SimulationSourceDiagnostic[];
};
