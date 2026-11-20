import type { SymbolDefinition, SymbolPin, SymbolVariant } from "./schema.js";
import { type CircuitProject } from "@icm/model";
import { type InstanceParameterResolver } from "@icm/devices";
export interface ResolvedSymbol {
    definition: SymbolDefinition;
    variant?: SymbolVariant;
}
export interface SymbolResolver extends InstanceParameterResolver {
    resolve(symbolId: string, variantId?: string): ResolvedSymbol | undefined;
}
/**
 * The pins a part's symbol draws in its variant, where wires end: each pin
 * but an implicit one and those the variant hides, with any it offers
 * elsewhere on its art, as a 3-terminal MOS body. The rest take their Net in
 * Properties, as an op-amp's hidden supplies do (#1833).
 */
export declare function drawnPinNames(resolved: ResolvedSymbol): string[];
/**
 * `box` grown to hold the supply pins a part draws on request and their
 * leads (#1941), which may stand past its viewBox: a box a body path without
 * declared bounds falls back to. The default variant draws none, so a part
 * as placed keeps the box it had.
 */
export declare function withShownSupplies<Box extends {
    x: number;
    y: number;
    width: number;
    height: number;
}>(box: Box, resolved: ResolvedSymbol): Box;
type AuxiliaryPin = NonNullable<SymbolVariant["auxiliaryPins"]>[number];
/**
 * A pin its variant moves rather than hides: hidden where the base symbol
 * has it and offered back at another spot, as the wide chopper's corners
 * (#2170). It is drawn there whatever it connects to. A 3-terminal MOS body
 * offered back is shown only while its bulk asks to be (mosBulkShouldBeVisible),
 * so a "B" is never a move.
 */
export declare function relocatedPin(variant: SymbolVariant | undefined, pinName: string): AuxiliaryPin | undefined;
/** Whether a variant leaves a pin undrawn: hidden, and not moved elsewhere. */
export declare function variantHidesPin(variant: SymbolVariant | undefined, pinName: string): boolean;
/** The pins a variant leaves undrawn: those it hides and does not move. */
export declare function variantHiddenPinNames(variant: SymbolVariant | undefined): Set<string>;
/** Where a variant draws a pin, in the symbol's own frame. */
export declare function variantPinAt(variant: SymbolVariant | undefined, pin: SymbolPin): SymbolPin["at"];
export declare class InMemorySymbolResolver implements SymbolResolver {
    #private;
    readonly resolveParameters?: InstanceParameterResolver["resolveParameters"];
    constructor(definitions: readonly SymbolDefinition[], base?: InMemorySymbolResolver, resolveParameters?: InstanceParameterResolver["resolveParameters"]);
    resolve(symbolId: string, variantId?: string): ResolvedSymbol | undefined;
    /** Whether every delegated catalog still reads its owned frozen definitions. */
    static hasStableDefinitions(resolver: SymbolResolver): boolean;
}
/** Validate a library at ingestion; the resulting catalog owns its records. */
export declare function createSymbolCatalog(definitions: readonly SymbolDefinition[] | InMemorySymbolResolver): InMemorySymbolResolver;
export declare function createProjectSymbolResolver(project: Pick<CircuitProject, "documents" | "topDocumentId"> & Partial<Pick<CircuitProject, "externalSubcircuitDefinitions" | "componentDefinitions">>, baseDefinitions: readonly SymbolDefinition[] | InMemorySymbolResolver): InMemorySymbolResolver;
export declare function findUnsupportedProjectSymbolIds(project: Pick<CircuitProject, "documents" | "topDocumentId"> & Partial<Pick<CircuitProject, "externalSubcircuitDefinitions" | "componentDefinitions">>, baseDefinitions: readonly SymbolDefinition[]): string[];
export {};
