/**
 * Native syntax projection, with no SPICE card parsing or model equations.
 * `name` writes the body under another name, where an author's definition
 * has its own (#1928).
 */
export declare function nativeBehavioralModel(target: string, scalar: (raw: string) => string, models: ReadonlyMap<string, string>, name?: string): string[];
