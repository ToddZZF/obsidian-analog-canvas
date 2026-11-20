import { hierarchicalSymbolId } from "@icm/model";
import type { CellSymbolPresentation, CircuitProject, SchematicDocument } from "@icm/model";
import { type HierarchicalBlockLayoutOptions, type HierarchicalBlockPinSlot, type HierarchicalBlockTerminal } from "./hierarchical-block-geometry.js";
import type { SymbolDefinition } from "./schema.js";
import type { SymbolResolver } from "./resolver.js";
export { freeHierarchicalBlockOffsets, hierarchicalBlockBodySize, hierarchicalBlockPinSlots, hierarchicalBlockLabelWarnings, type HierarchicalBlockPinSlot, } from "./hierarchical-block-geometry.js";
export { hierarchicalSymbolId };
/** External symbols are keyed by immutable definition identity, never master spelling. */
export declare function externalSubcircuitSymbolId(definitionId: string): string;
/** Shared generic block artwork contract, independent of its definition owner. */
export interface BlockSymbolLayout {
    id: string;
    name: string;
    terminals: readonly HierarchicalBlockTerminal[];
    presentation?: CellSymbolPresentation | undefined;
}
export declare function createBlockSymbol(layout: BlockSymbolLayout, options?: HierarchicalBlockLayoutOptions): SymbolDefinition;
type CellSymbolSource = Pick<SchematicDocument, "netlist"> & Partial<Pick<SchematicDocument, "annotations">>;
/** Same representative declaration as the effective interface, including its authored format. */
export declare function projectCellSymbolTerminals(document: CellSymbolSource): HierarchicalBlockTerminal[];
export declare function createHierarchicalBlockSymbol(document: Pick<SchematicDocument, "name" | "sourceBinding" | "netlist"> & {
    readonly presentation?: SchematicDocument["presentation"];
    readonly annotations?: SchematicDocument["annotations"];
}, options?: HierarchicalBlockLayoutOptions): SymbolDefinition | null;
/** The Cells some Cell of the Project has placed. */
export declare function placedCellDocumentIds(project: Pick<CircuitProject, "documents">): Set<string>;
/**
 * The symbol a Cell no parent has placed yet shows, and the one its first
 * placement keeps (planPlaceCellInstance): Pins on the side their Ports are
 * drawn on (#1319), and a body with room for top and bottom Pin names
 * (#1327). A placed block's Pins never move, so this applies only before.
 */
export declare function unplacedCellSymbol(document: SchematicDocument): CellSymbolPresentation | undefined;
/**
 * Where every Pin of a Cell's block stands as its callers see it, in
 * interface order (#1320): a placed Cell's stored placements and automatic
 * slots; for a Cell no parent has placed yet, the layout its first placement
 * would store (unplacedCellSymbol).
 */
export declare function cellSymbolPinSlots(project: Pick<CircuitProject, "documents">, document: SchematicDocument): HierarchicalBlockPinSlot[];
export declare function createProjectHierarchicalSymbols(project: Pick<CircuitProject, "documents" | "topDocumentId"> & Partial<Pick<CircuitProject, "externalSubcircuitDefinitions">>, baseDefinitions?: readonly SymbolDefinition[] | SymbolResolver): SymbolDefinition[];
/** Authored inputs of generated blocks; used to invalidate only changed
 * interfaces/presentations while retaining captured artwork across releases. */
export declare function projectSymbolSources(project: Pick<CircuitProject, "documents" | "topDocumentId"> & Partial<Pick<CircuitProject, "externalSubcircuitDefinitions">>): Map<string, {
    name: string;
    terminals: {
        id: string;
        name: string;
        direction: "inout" | "input" | "output" | "passive";
        nameContent?: import("@icm/model").RichTextDocument | undefined;
    }[];
    presentation?: {
        minimumBodySize?: {
            width: number;
            height: number;
        } | undefined;
        bodyBounds?: {
            left: number;
            right: number;
            top: number;
            bottom: number;
        } | undefined;
        pinPlacements?: {
            terminalId: string;
            side: "east" | "north" | "south" | "west";
            offset: number;
        }[] | undefined;
        artwork?: import("@icm/model").CellSymbolArtwork | undefined;
    } | undefined;
}>;
