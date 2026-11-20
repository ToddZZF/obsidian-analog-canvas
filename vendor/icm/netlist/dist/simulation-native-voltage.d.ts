import type { CircuitProject, SimulationSourceInput, SimulationSourceExpression } from "@icm/model";
/** Resolve the existing durable anchor; no new persisted acquisition identity. */
export declare function resolveSimulationVoltageProbeNetId(project: CircuitProject, target: Pick<Extract<SimulationSourceExpression, {
    kind: "voltage";
}>, "kind" | "documentId" | "anchor" | "occurrence">): string | undefined;
/** GUI and API resolve the same scoped electrical target, never a display label
 * or a temporary JSON output compiled by the retired execution pipeline. */
export declare function nativeVoltageAcquisition(project: CircuitProject, input: SimulationSourceInput, target: Extract<SimulationSourceExpression, {
    kind: "voltage";
}>, engine?: "ngspice" | "vacask"): {
    ok: false;
    message: string;
    vector?: never;
    save?: never;
} | {
    message?: never;
    ok: true;
    vector: string;
    save: string;
};
