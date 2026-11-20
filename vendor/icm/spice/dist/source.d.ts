import type { SourceBundle, SpiceSourceFile, SpiceSourceInput } from "./source-types.js";
/** Whether a source is native Spectre, by its extension or its first lines. */
export declare function isSpectreSource(input: SpiceSourceInput): boolean;
export declare function normalizeSourcePath(path: string): string | null;
/**
 * An include named by an absolute, drive-qualified or URL path is a library
 * outside the sources (a PDK's models): it is kept as written and never read.
 */
export declare function isExternalLibraryPath(requestedPath: string): boolean;
export declare function decodeSourceContent(bytes: Uint8Array): {
    encoding: SpiceSourceFile["encoding"];
    text: string;
};
export declare function createSourceBundle(inputs: readonly SpiceSourceInput[], entryPath: string, includeRoot?: "workspace"): Promise<SourceBundle>;
