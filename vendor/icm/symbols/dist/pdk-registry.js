import { resolveReviewedExternalBinding, reviewedExternalBindingForMaster, } from "@icm/devices";
import { expandedDeviceCatalogEntry } from "./expanded-device-catalog.js";
import { isRazaviProductSymbolId } from "./razavi-catalog.js";
/**
 * A symbol an imported or PDK device may be drawn with: the Razavi product
 * catalog, or the Extended Devices library beside it (high-voltage DMOS and
 * depletion MOS), which SKY130's drain-extended devices are reviewed for.
 */
export function isPdkMappableSymbolId(symbolId) {
    return (isRazaviProductSymbolId(symbolId) ||
        expandedDeviceCatalogEntry(symbolId) !== undefined);
}
export function resolvePdkSymbolMapping(modelName, terminalCount, exactOverrides = []) {
    const normalized = modelName.toLowerCase();
    const exact = exactOverrides.find((candidate) => candidate.modelName.toLowerCase() === normalized &&
        candidate.terminalCount === terminalCount &&
        candidate.pinNames.length === terminalCount);
    if (exact && isPdkMappableSymbolId(exact.symbolId)) {
        return {
            symbolId: exact.symbolId,
            pinNames: [...exact.pinNames],
            registryId: exact.registryId,
            source: "exact",
        };
    }
    const reviewed = reviewedExternalBindingForMaster(modelName);
    return reviewed &&
        reviewed.terminals.length === terminalCount &&
        isPdkMappableSymbolId(reviewed.symbolId)
        ? {
            symbolId: reviewed.symbolId,
            pinNames: reviewed.terminals.map((terminal) => terminal.pinName),
            source: "exact",
            registryId: reviewed.id,
        }
        : undefined;
}
export function resolvePdkSymbolMappingForTerminalOrder(modelName, terminalNames, exactOverrides = []) {
    const exact = resolvePdkSymbolMapping(modelName, terminalNames.length, exactOverrides);
    if (exactOverrides.length > 0 && exact?.source === "exact") {
        const override = exactOverrides.find((candidate) => candidate.registryId === exact.registryId &&
            candidate.modelName.toLowerCase() === modelName.toLowerCase());
        if (override) {
            return terminalNames.every((name, index) => name.toLowerCase() === override.pinNames[index]?.toLowerCase())
                ? exact
                : undefined;
        }
    }
    const reviewed = resolveReviewedExternalBinding(modelName, terminalNames);
    return reviewed && exact
        ? {
            ...exact,
            pinNames: reviewed.terminals.map((terminal) => terminal.pinName),
        }
        : undefined;
}
