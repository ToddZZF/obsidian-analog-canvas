/** Reversible native assignments on a Canvas source. Unknown native programs
 * belong in authored files; they are not constrained by this editing subset. */
export declare function parseEditableSourceParameters(text: string): {
    ok: true;
    parameters: Record<string, string>;
} | {
    ok: false;
    message: string;
};
