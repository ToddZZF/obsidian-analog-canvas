import type { CellSymbolPinPlacement, CellSymbolPresentation } from "./schema/presentation.js";
import type { CellPortDirection } from "./cell-interface-projection.js";
type LayoutTerminal = {
    readonly id: string;
    readonly direction: CellPortDirection;
};
/** Pins leave one connection-grid step clear at each corner. */
export declare function cellSymbolPinFitsBody(pin: Pick<CellSymbolPinPlacement, "side" | "offset">, bounds: NonNullable<CellSymbolPresentation["bodyBounds"]>): boolean;
/** Resolve omitted placements once for geometry and authored-bounds validation. */
export declare function resolveCellSymbolPinPlacements(terminals: readonly LayoutTerminal[], presentation?: CellSymbolPresentation): CellSymbolPinPlacement[];
/** Explicit edges contain automatic and authored pins alike. */
export declare function cellSymbolPinContainmentProblems(terminals: readonly LayoutTerminal[], presentation?: CellSymbolPresentation): string[];
export {};
