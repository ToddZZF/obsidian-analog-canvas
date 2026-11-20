/**
 * A symbol an imported or PDK device may be drawn with: the Razavi product
 * catalog, or the Extended Devices library beside it (high-voltage DMOS and
 * depletion MOS), which SKY130's drain-extended devices are reviewed for.
 */
export declare function isPdkMappableSymbolId(symbolId: string): boolean;
export interface PdkSymbolMapping {
    symbolId: string;
    pinNames: readonly string[];
    source: "exact" | "pdk-rule";
    registryId: string;
}
export interface PdkSymbolMappingOverride {
    modelName: string;
    terminalCount: number;
    symbolId: string;
    pinNames: readonly string[];
    registryId: string;
}
export declare function resolvePdkSymbolMapping(modelName: string, terminalCount: number, exactOverrides?: readonly PdkSymbolMappingOverride[]): PdkSymbolMapping | undefined;
export declare function resolvePdkSymbolMappingForTerminalOrder(modelName: string, terminalNames: readonly string[], exactOverrides?: readonly PdkSymbolMappingOverride[]): PdkSymbolMapping | undefined;
