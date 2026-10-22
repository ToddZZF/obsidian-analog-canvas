import { expandedComponentSymbols, expandedComponentCatalogEntries, } from "./expanded-components.generated.js";
/**
 * Optional devices that extend the Reference-calibrated Razavi core without
 * claiming Razavi visual authority.  These symbols follow the conventional
 * high-voltage and MOS-variant drawings supplied for the Extended Devices
 * library. Derived MOS entries deliberately reuse the complete NMOS/PMOS
 * artwork and add only their named distinguishing geometry.
 */
export const EXTENDED_DEVICE_CATEGORY = "Extended Devices";
export const HIGH_VOLTAGE_DEVICE_SUBCATEGORY = "High-voltage devices";
export const MOS_VARIANT_SUBCATEGORY = "MOS variants";
export const expandedDeviceSymbols = expandedComponentSymbols;
export const expandedDeviceCatalogEntries = expandedComponentCatalogEntries;
export function expandedDeviceCatalogEntry(symbolId) {
    return expandedDeviceCatalogEntries.find((entry) => entry.symbolId === symbolId);
}
