export interface ComponentInterfaceIssue {
    readonly path: (string | number)[];
    readonly message: string;
}
/** Shared electrical invariants, independent of artwork and host schemas. */
interface ComponentInterface {
    readonly symbol: {
        readonly id: string;
        readonly pins: readonly {
            readonly name: string;
        }[];
    };
    readonly electrical?: {
        readonly symbolId: string;
        readonly pinOrder: readonly string[];
    } | null | undefined;
    readonly subcircuit?: {
        readonly symbolId: string;
        readonly ports: readonly {
            readonly name: string;
            readonly pinName?: string | undefined;
            readonly supply?: "VDD" | "VSS" | undefined;
        }[];
    } | undefined;
}
/** The variant that draws a symbol's optional supply pins (#1833). */
export declare const SUPPLY_PINS_VARIANT_ID = "supply-pins";
/**
 * A supply pin a symbol draws only on request: a supply role its default
 * variant hides. It draws the supply port of its name; left unwired, shown or
 * hidden, that supply takes its Net in Properties or Auto.
 */
export declare function isOptionalSupplyPin(symbol: {
    readonly variants: readonly {
        readonly id: string;
        readonly hiddenPinNames: readonly string[];
    }[];
    readonly defaultVariantId?: string | undefined;
}, pin: {
    readonly name: string;
    readonly role: string;
}): boolean;
export declare function componentInterfaceIssues(definition: ComponentInterface): ComponentInterfaceIssue[];
export {};
