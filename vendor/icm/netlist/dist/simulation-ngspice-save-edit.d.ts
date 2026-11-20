/** One undoable native edit, including deck-level .probe cards when required. */
export declare function ngspiceAcquisitionEdit(text: string, cursor: number, vectors: readonly string[], entry: boolean, directives?: readonly string[]): {
    ok: true;
    text: string;
    anchor: number;
    changes: {
        from: number;
        insert: string;
    }[];
};
