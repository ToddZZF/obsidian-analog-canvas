/**
 * The symbols that mean "this point is a supply", and the Net each one
 * authors when placed. A marker is an explicit placement, so reading one is
 * evidence, never inference: nothing here derives a supply from a Net's
 * spelling, from device polarity, or from where a wire happens to sit.
 *
 * This lives below the Edit Engine because two different readers need it —
 * the planner that authors the Net when a marker is placed, and the body
 * policy that asks which supply a MOS body follows.
 */
declare const SUPPLY_MARKER_BY_SYMBOL: {
    readonly ground: {
        readonly name: "0";
        readonly pinName: "0";
        readonly domain: "ground";
        readonly scope: "global";
    };
    readonly "vdd-port": {
        readonly name: "VDD";
        readonly pinName: "P";
        readonly domain: "vdd";
        readonly scope: "global";
    };
    readonly "named-ground": {
        readonly name: "VSS";
        readonly pinName: "P";
        readonly domain: "vdd";
        readonly scope: "global";
    };
};
export type SupplyMarker = (typeof SUPPLY_MARKER_BY_SYMBOL)[keyof typeof SUPPLY_MARKER_BY_SYMBOL];
export type SupplyDomain = SupplyMarker["domain"];
export declare function supplyMarkerForSymbol(symbolId: string): SupplyMarker | undefined;
export {};
