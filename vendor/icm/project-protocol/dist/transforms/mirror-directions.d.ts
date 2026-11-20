/** Normalize legacy mirror tokens before any current-schema validation. */
export declare function normalizeLegacyMirrorDirections(raw: Record<string, unknown>): Record<string, unknown>;
/** Upgrade every Instance and floating drafting Symbol from schema 51 to 52. */
export declare function upgradeSchema51To52(raw: Record<string, unknown>): Record<string, unknown>;
