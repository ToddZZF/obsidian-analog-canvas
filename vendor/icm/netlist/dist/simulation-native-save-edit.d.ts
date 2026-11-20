/** Pure shared API: caller applies returned sequential insertions through the
 * normal File/Project or editor transaction. No persistent settings or IO.
 * The helper authors common save selectors; arbitrary native programs remain
 * editable as text, including analysis-specific directives not covered here. */
export declare function nativeAcquisitionEdit(text: string, cursor: number, requested: readonly string[], entry: boolean, oldDirectives?: readonly string[]): {
    ok: false;
    error: {
        code: string;
        message: string;
    };
    text: string;
    anchor: number;
    changes: never[];
} | {
    ok: true;
    text: string;
    anchor: number;
    changes: {
        from: number;
        insert: string;
    }[];
};
