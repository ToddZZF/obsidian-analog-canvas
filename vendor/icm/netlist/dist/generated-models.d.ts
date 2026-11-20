import { type BehavioralModel } from "./behavioral-model.js";
/**
 * The generated body an IR definition prints, under whatever name it is
 * written: its own, or the reserved one it takes where an author's
 * definition has its own (#1928).
 */
export declare function definitionBody(definition: {
    readonly name: string;
    readonly body?: string;
}): string;
/**
 * One family dispatch; printers never own model equations or defaults.
 * `ports` prints the same body with its ports in another order (see
 * `withBodyPortOrder`); its elements name ports, never positions. `name`
 * writes it under another name, where an author's definition has its own
 * (#1928).
 */
export declare function generatedBehavioralDefinition(target: string, ports?: readonly string[], name?: string): BehavioralModel;
export declare function generatedBehavioralModel(target: string, ports?: readonly string[], name?: string): string[];
