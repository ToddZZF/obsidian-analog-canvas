import type { SymbolDefinition } from "./schema.js";
/**
 * Optional devices that extend the Reference-calibrated Razavi core without
 * claiming Razavi visual authority.  These symbols follow the conventional
 * high-voltage and MOS-variant drawings supplied for the Extended Devices
 * library. Derived MOS entries deliberately reuse the complete NMOS/PMOS
 * artwork and add only their named distinguishing geometry.
 */
export declare const EXTENDED_DEVICE_CATEGORY = "Extended Devices";
export declare const HIGH_VOLTAGE_DEVICE_SUBCATEGORY = "High-voltage devices";
export declare const MOS_VARIANT_SUBCATEGORY = "MOS variants";
export interface ExpandedDeviceCatalogEntry {
    readonly symbolId: string;
    readonly category: typeof EXTENDED_DEVICE_CATEGORY;
    readonly subcategory: typeof HIGH_VOLTAGE_DEVICE_SUBCATEGORY | typeof MOS_VARIANT_SUBCATEGORY;
}
export declare const expandedDeviceSymbols: readonly SymbolDefinition[];
export declare const expandedDeviceCatalogEntries: readonly ExpandedDeviceCatalogEntry[];
export declare function expandedDeviceCatalogEntry(symbolId: string): ExpandedDeviceCatalogEntry | undefined;
