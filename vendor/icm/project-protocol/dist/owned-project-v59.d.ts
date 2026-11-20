/**
 * The portable authoring format. The editor's normalized runtime indexes are
 * deliberately an implementation detail, not a second editable file format.
 * All transforms are structural: no coordinates, identities or electrical
 * facts are inferred, and no instance is removed.
 */
import type { CircuitProject } from "@icm/model";
type ObjectValue = Record<string, unknown>;
/** Capture full source; only repeated owner references and wrapper structures disappear. */
export declare function encodeProjectFile(project: CircuitProject): ObjectValue;
/** Decode once into the existing validated runtime model. Unknown fields stay errors. */
export declare function decodeProjectFile(raw: ObjectValue, options?: {
    allowParameterShowValue?: boolean;
    allowSourceControl?: boolean;
    allowFormulaFormat?: boolean;
}): ObjectValue;
export {};
