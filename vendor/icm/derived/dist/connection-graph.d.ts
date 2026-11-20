/** Transient graph of the completed edit. Stored Net IDs never add an edge. */
export declare class ConnectionGraph {
    private parent;
    add(key: string): void;
    root(key: string): string;
    join(keys: readonly string[]): void;
    groups(keys: readonly string[]): string[][];
}
