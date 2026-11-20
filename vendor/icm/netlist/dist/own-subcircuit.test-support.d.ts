import type { CircuitProject } from "@icm/model";
/**
 * The author's own SPICE subcircuit `name`, external definition `own-<name>`
 * with its ports in `ports` order, implemented by a model source of the
 * Project.
 */
export declare function addOwnSubcircuit(project: CircuitProject, name: string, ports: readonly string[]): void;
