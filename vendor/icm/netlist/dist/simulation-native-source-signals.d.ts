import type { SimulationSourceInput } from "@icm/model";
/** Exact literal top-level acquisitions, without pretending to know runtime
 * elaboration, unknown OSDI model outputs or subcircuit internals. */
export declare function nativeSourceAcquisitions(input: SimulationSourceInput): {
    quantity: "voltage" | "current";
    vector: string;
    save: string;
}[];
