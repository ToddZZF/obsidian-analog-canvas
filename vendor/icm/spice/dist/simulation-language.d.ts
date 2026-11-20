import { type SourceSpan } from "@icm/model";
import { type SpiceDiagnostic } from "./diagnostics.js";
import type { SpiceSourceFile } from "./source-types.js";
export type SimulationLanguageContext = "deck" | "control" | "parameter" | "behavioral";
export interface SimulationLanguageHelp {
    name: string;
    context: SimulationLanguageContext;
    signature: string;
    summary: string;
    section: string;
    minimumArguments?: number;
    group?: string;
    keywords?: string;
    priority?: number;
    parameters?: readonly {
        label: string;
        choices?: readonly string[];
        optional?: boolean;
        repeat?: boolean;
    }[];
}
export declare const NGSPICE_LANGUAGE_REFERENCE = "https://ngspice.sourceforge.io/docs/ngspice-46-manual.pdf";
export declare const simulationLanguageHelp: readonly SimulationLanguageHelp[];
export declare function lookupSimulationHelp(name: string, context: SimulationLanguageContext): SimulationLanguageHelp | undefined;
/** Only proven local errors block; opaque input is retained for the simulator. */
export declare function inspectSimulationSource(file: SpiceSourceFile, entry?: boolean): {
    fileId: string;
    statements: import("./syntax.js").SpiceStatement[];
    logicalLines: import("./syntax.js").LogicalLine[];
    diagnostics: SpiceDiagnostic[];
    commands: {
        name: string;
        arguments: string[];
        sourceRef: SourceSpan;
    }[];
};
/**
 * Virtual-root normalization; source resolution performs no filesystem/network IO.
 * @internal Tests pin include path resolution through it.
 */
export declare function resolveSimulationInclude(sourcePath: string, requested: string): string | null;
export declare function unquoteSimulationToken(value: string): string;
