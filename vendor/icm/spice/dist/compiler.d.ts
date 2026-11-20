import type { SpiceDiagnostic } from "./diagnostics.js";
import { type SpiceCompileOptions, type SpiceDialectEvidence } from "./dialect.js";
import type { CircuitIR } from "./ir.js";
import type { SourceBundle, SpiceSourceInput } from "./source-types.js";
export interface SpiceCompileResult {
    bundle: SourceBundle;
    ir: CircuitIR | null;
    diagnostics: SpiceDiagnostic[];
    dialectEvidence: SpiceDialectEvidence;
    successful: boolean;
}
export declare function compileSourceBundle(bundle: SourceBundle, options?: SpiceCompileOptions): SpiceCompileResult;
export declare function compileSpiceSources(inputs: readonly SpiceSourceInput[], entryPath: string, options?: SpiceCompileOptions): Promise<SpiceCompileResult>;
