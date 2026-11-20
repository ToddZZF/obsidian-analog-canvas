export type NetlistFormat = "spice" | "spectre";
export type NetlistNamingProfile = "native" | "cadence-bang";
export type NetlistPortCase = "upper" | "lower";
export type EncodedNetName = {
    ok: true;
    token: string;
    collisionKey: string;
} | {
    ok: false;
    code: string;
    message: string;
};
/**
 * Pure dialect projection for one semantic Net name and scope. A Greek letter
 * is written as its standard name (`φ1` is `phi1`), a full-width character as
 * its ASCII form, and an ngspice bus bit with underscores, so collisions are
 * judged on what the netlist actually says.
 */
export declare function encodeNetName(name: string, scope: "local" | "global", format: NetlistFormat, profile?: NetlistNamingProfile): EncodedNetName;
export declare function encodedNetNameCollisionKey(token: string, format: NetlistFormat): string;
