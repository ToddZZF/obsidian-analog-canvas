/**
 * A saved Symbol's content signature, independent of key order: a repair
 * recognizes exactly the built-in snapshot it replaces by it.
 */
export declare function symbolSignature(prefix: string, symbol: unknown): string;
