import type { SourceBundle } from "./source-types.js";
export declare const SPICE_DIALECT_IDS: readonly ["ngspice-46-core", "spice3f5-core", "ltspice-24-structural", "xyce-7-structural"];
export type SupportedSpiceDialectId = (typeof SPICE_DIALECT_IDS)[number];
export interface SpiceDialectEvidence {
    dialect: SupportedSpiceDialectId;
    confidence: "explicit" | "high" | "compatible";
    evidence: string[];
}
export interface SpiceCompileOptions {
    dialect?: SupportedSpiceDialectId | "auto";
    /** Includes can use any path within a preselected virtual workspace. */
    includeRoot?: "workspace";
}
export declare function detectSpiceDialect(bundle: SourceBundle, override?: SpiceCompileOptions["dialect"]): SpiceDialectEvidence;
