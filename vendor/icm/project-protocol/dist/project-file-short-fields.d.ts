export declare const SHORT_FIELDS_FILE_VERSION = 83;
type FileObject = Record<string, unknown>;
/** Visit only the SourceSpan owners and captured Symbol fields of a Project. */
export declare function transformShortProjectFields(project: FileObject, decode: boolean): void;
export {};
