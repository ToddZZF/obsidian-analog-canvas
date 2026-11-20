import type { CircuitProject } from "@icm/model";
export declare const CURRENT_PROJECT_FILE_VERSION = 83;
type Value = Record<string, any>;
/** Member-specific No Connect declarations are explicit from schema 77. */
export declare function rejectMemberNoConnect(raw: Value): void;
/** Schema 75 understood ranges, but not ordered expressions or slice selectors. */
export declare function rejectOrderedSignals(raw: Value): void;
/** Old envelopes never infer or accept new member-qualified connectivity. */
export declare function rejectSignalMembers(raw: Value): void;
/** An object's kept Document style first appears in schema 64. */
export declare function rejectKeptDocumentStyle(raw: Value): void;
export declare function encodeProjectFile(project: CircuitProject): Value;
export declare function decodeProjectFile(raw: Value): Value;
export {};
