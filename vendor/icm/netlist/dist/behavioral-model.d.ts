/** Small compiler-owned model recipe, not a parser or a user modeling language. */
export type BehavioralElement = {
    kind: "voltage";
    name: string;
    nodes: readonly [string, string];
    expression: string;
} | {
    kind: "current";
    name: string;
    nodes: readonly [string, string];
    expression: string;
} | {
    kind: "resistor" | "capacitor" | "inductor";
    name: string;
    nodes: readonly [string, string];
    value: string;
    expression?: boolean;
};
export interface BehavioralModel {
    name: string;
    ports: readonly string[];
    parameters: readonly {
        name: string;
        defaultValue: string;
    }[];
    comment?: string;
    elements: readonly BehavioralElement[];
}
export declare function voltage(name: string, positive: string, negative: string, expression: string): BehavioralElement;
export declare function current(name: string, positive: string, negative: string, expression: string): BehavioralElement;
export declare function passive(kind: "resistor" | "capacitor" | "inductor", name: string, positive: string, negative: string, value: string, expression?: boolean): BehavioralElement;
/** The instance parameter a passive element's value sets, in Spectre and VACASK. */
export declare const PASSIVE_VALUE: {
    readonly resistor: "r";
    readonly capacitor: "c";
    readonly inductor: "l";
};
export declare function printSpiceBehavioralModel(model: BehavioralModel): string[];
/** Native Spectre syntax, projected from the same nodes/equations/defaults. */
export declare function printSpectreBehavioralModel(model: BehavioralModel): string[];
/** Translate only the reviewed expression notation; never parse device cards. */
export declare function projectBehavioralExpression(raw: string, scalar: (raw: string) => string): string;
