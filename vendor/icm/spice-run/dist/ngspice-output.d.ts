import type { ModelLibrarySelection } from "./contract.js";
export interface NgspiceOutputContext {
    netlist: string;
    testbench: string;
    deck: string;
    inputRevision?: string | undefined;
    timeoutMs: number;
    modelLibrary: ModelLibrarySelection | null;
    collection?: {
        rawfile?: unknown;
    } | undefined;
    runToken?: unknown;
    execution?: {
        target: "cloudflare-container" | "operator-host";
    };
    /**
     * Every file submitted with the deck. Given only by a caller that holds
     * the run's complete source; with it, notices about model cards none of
     * these texts define (the Profile's library) are not dropped input.
     */
    files?: readonly {
        path: string;
        text: string;
    }[] | undefined;
}
export interface NgspiceRawOutput {
    log?: unknown;
    stdout?: unknown;
    stderr?: unknown;
    exitCode?: unknown;
    signal?: unknown;
    timedOut?: unknown;
    cancelled?: unknown;
    durationMs?: unknown;
    environment?: unknown;
    rawfile?: unknown;
    rawfileFormat?: unknown;
    rawfileRequested?: unknown;
    rawfileName?: unknown;
    collection?: {
        rawfile?: unknown;
    };
    rawfileError?: unknown;
    truncatedOutputs?: unknown;
}
/** Same numerical/collection verdict on the executor and legacy Worker path. */
export declare function assembleNgspiceOutput(raw: NgspiceRawOutput, context: NgspiceOutputContext): Promise<{
    execution?: NgspiceOutputContext["execution"];
    cancelled?: boolean;
    executedDeck?: string;
    rawfile?: string;
    outcome: import("./contract.js").SimulationOutcome;
    diagnostics: readonly import("./contract.js").SimulationDiagnostic[];
    log: string;
    durationMs: number;
    metadata: import("./contract.js").SimulationRunMetadata;
    data?: import("./result-data.js").SimulationResultData;
}>;
