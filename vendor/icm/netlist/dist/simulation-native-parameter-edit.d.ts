/** An unfinished, source-owned declaration, not a persisted variable override.
 * Entry files start with a literal title; included files have no title. Insert
 * before any circuit/include/control scope, even when the existing draft is
 * syntactically incomplete. Callers apply this edit through their normal file
 * transaction and fill in the declaration at anchor. */
export declare function nativeParameterDeclarationEdit(text: string, entry: boolean): {
    text: string;
    changes: {
        from: number;
        to: number;
        insert: string;
    }[];
    anchor: number;
};
