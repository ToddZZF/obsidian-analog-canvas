import type { CellSymbolPresentation, CellSymbolSide, RichTextDocument } from "@icm/model";
import type { SymbolDefinition } from "./schema.js";
export interface HierarchicalBlockLayoutOptions {
    /**
     * Size the body so that each top or bottom Pin's name clears the side
     * Pins' names and the body's sides. Only for a Cell no parent has placed
     * yet: a placed block's Pins must never move under its wires.
     */
    readonly fitNames?: boolean | undefined;
}
export interface HierarchicalBlockTerminal {
    readonly id: string;
    readonly name: string;
    readonly direction: "input" | "output" | "inout" | "passive";
    readonly nameContent?: RichTextDocument;
    readonly signalMembers?: Array<{
        id: string;
        name: string;
    }>;
}
/** Where a Pin stands on a block: its side and its offset along that side. */
export interface HierarchicalBlockPinSlot {
    readonly terminalId: string;
    readonly side: CellSymbolSide;
    readonly offset: number;
}
/**
 * Where each Pin stands on the block, in terminal order: at its stored
 * placement, or at the automatic slot the block gives a Pin without one.
 */
export declare function hierarchicalBlockPinSlots(terminals: readonly HierarchicalBlockTerminal[], presentation?: CellSymbolPresentation): HierarchicalBlockPinSlot[];
/**
 * The offsets along one side a Pin may still take, in the order an automatic
 * Pin takes them (0, -20, 20, -40, 40, …): those a full row from every
 * offset in `taken`, so no two Pin names share a row. On the 20-unit rows
 * the automatic layout uses, that is every slot `taken` leaves free; beside
 * a Pin drawn between two rows (offset 10), it keeps a row's distance.
 */
export declare function freeHierarchicalBlockOffsets(taken: Iterable<number>): number[];
/** The body size a Cell's block takes for these Pins. */
export declare function hierarchicalBlockBodySize(terminals: readonly HierarchicalBlockTerminal[], presentation?: CellSymbolPresentation, options?: HierarchicalBlockLayoutOptions): {
    width: number;
    height: number;
};
/** Conservative name clearance advice; explicit edges are never changed. */
export declare function hierarchicalBlockLabelWarnings(terminals: readonly HierarchicalBlockTerminal[], presentation?: CellSymbolPresentation): string[];
/** Geometry used only for a Project's derived subcircuit navigation blocks. */
export declare function createHierarchicalBlockGeometry(terminals: readonly HierarchicalBlockTerminal[], presentation?: CellSymbolPresentation, options?: HierarchicalBlockLayoutOptions): SymbolDefinition;
