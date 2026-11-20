export declare function deriveStableId(prefix: string, ...identityParts: string[]): string;
/** The block symbol a Cell's callers draw by default, keyed by its name without case. */
export declare function hierarchicalSymbolId(cellName: string): string;
export declare function createId(prefix: string, randomUuid?: () => string): string;
