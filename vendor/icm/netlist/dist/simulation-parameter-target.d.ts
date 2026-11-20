import type { CircuitProject } from "@icm/model";
/** Mutates only the caller's run projection. Both legacy and native compilers share target resolution. */
export declare function applySimulationParameter(project: CircuitProject, target: {
    readonly documentId: string;
    readonly instanceId: string;
    readonly parameter: string;
}, value: string, source: string, codePrefix: string, requireExisting?: boolean): {
    ok: true;
} | {
    ok: false;
    code: string;
    message: string;
};
