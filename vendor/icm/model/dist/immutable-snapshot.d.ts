export declare function isFrozenSnapshot(value: object): boolean;
/** Own a JSON model snapshot before sharing it between revision-scoped readers. */
export declare function freezeSnapshot<T>(value: T): T;
