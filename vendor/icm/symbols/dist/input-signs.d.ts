import { type Orientation } from "@icm/model";
import type { ResolvedSymbol, SymbolResolver } from "./resolver.js";
/** The part of an Instance its signs read; a full Instance qualifies. */
export interface InputSignSource {
    readonly netlist?: {
        readonly parameters: Readonly<Record<string, string>>;
    } | undefined;
    readonly placement?: Orientation | null | undefined;
}
/**
 * The Symbol as this Instance draws it: its definition and variant, with the
 * sign marks its parameters choose added to the artwork and to the box the
 * artwork occupies. Unchanged, and the same object, when there are none.
 */
export declare function withInputSigns(resolved: ResolvedSymbol, instance: InputSignSource): ResolvedSymbol;
/**
 * The Symbol an Instance draws, with its sign marks; see withInputSigns.
 * Whatever measures an Instance's ink resolves it here: the scene and its
 * bounds, the hit box and snapping, labels, visual diagnostics, the bodies
 * wire planning keeps clear of and the wire-under-symbol warning, and the
 * Agent Snapshot's bounds. A reader of pins alone may resolve the bare
 * Symbol, since the marks add no pin.
 */
export declare function resolveInstanceSymbol(resolver: SymbolResolver, instance: InputSignSource & {
    readonly symbolId: string;
    readonly symbolVariantId?: string | undefined;
}): ResolvedSymbol | undefined;
