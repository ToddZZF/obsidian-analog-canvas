import type { SourceBundle } from "./source-types.js";
/** @public The `./node` entry point reads a source tree from disk. */
export declare function loadSourceBundleFromFile(entryPath: string): Promise<SourceBundle>;
