import type { SpiceSourceInput } from "./source-types.js";
/** The dependencies of the original bytes, before any frontend conversion. */
export declare function localSourceReferences(input: SpiceSourceInput, packageFile: boolean): {
    path: string;
    packageFile: boolean;
    reference: string;
}[];
