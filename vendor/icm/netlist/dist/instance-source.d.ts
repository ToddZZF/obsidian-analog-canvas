import { type CircuitProject } from "@icm/model";
export interface ComponentSourceCode {
    code: string;
    exact: boolean;
    note: string | null;
}
/** Exact current SPICE card when exportable; otherwise an honest placeholder template. */
export declare function instanceSpiceSource(project: CircuitProject, documentId: string, instanceId: string, fallbackPins: readonly string[]): ComponentSourceCode;
