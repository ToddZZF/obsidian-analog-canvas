/** Schema 57 makes a locally authored Power Rail an explicit formal Cell Pin.
 * The visible power-label owns the terminal, so migration does not invent a
 * hidden interface Instance or change physical Net membership. */
export declare function upgradeSchema56To57(raw: Record<string, unknown>): Record<string, unknown>;
