import type { CellSymbolArtwork, ComponentDefinition, ExternalSubcircuitDefinition, SymbolDefinition, ProjectModelSource } from "./schema.js";
import { type ComponentInterfaceIssue } from "./component-interface.js";
/** Raw authoring text may still name the owner from which this draft was copied. */
export declare function resolveCircuitArtworkDraft(component: ComponentDefinition, owner: ExternalSubcircuitDefinition, origin: NonNullable<NonNullable<ProjectModelSource["draft"]>["authoring"]>[number]["artworkOrigin"]): ComponentDefinition;
/** Explicit native removal forks only the departing graphical contacts and mappings. */
export declare function removeCircuitComponentTerminals(component: ComponentDefinition, terminalIds: readonly string[]): ComponentDefinition;
export declare class CircuitComponentMappingError extends Error {
    constructor(issue: ComponentInterfaceIssue);
}
/**
 * Initialize only a complete, exact same-name correspondence to the selected
 * owner; an optional supply pin no terminal names stays unmapped.
 */
export declare function initializeCircuitComponent(component: ComponentDefinition, definition: ExternalSubcircuitDefinition): ComponentDefinition;
/** An owner terminal custom artwork maps: stable identity and formal name. */
export interface MappedSymbolTerminal {
    readonly id: string;
    readonly name: string;
    readonly signalMembers?: readonly {
        id: string;
        name: string;
    }[];
}
/** One correspondence authority for Project validation, Apply and symbol resolution. */
export declare function circuitComponentIssues(component: ComponentDefinition, definition: ExternalSubcircuitDefinition): ComponentInterfaceIssue[];
/** Drawing names are presentation; ordinary runtime endpoints use native names. */
export declare function circuitComponentTerminals(component: ComponentDefinition, definition: ExternalSubcircuitDefinition): {
    targetName: string;
    pinName: string;
    interaction: "canvas" | "property";
    supply?: "VDD" | "VSS";
}[];
/** Drawing names are presentation; ordinary runtime endpoints use native names. */
export declare function projectCircuitSymbol(component: ComponentDefinition, definition: ExternalSubcircuitDefinition): SymbolDefinition;
/**
 * A Cell's custom block artwork against its Cell Pins (the projected
 * interface's ports): the source-backed correspondence rule, worded for
 * Cells. Paths are relative to the artwork.
 */
export declare function cellSymbolArtworkIssues(artwork: CellSymbolArtwork, ports: readonly MappedSymbolTerminal[]): ComponentInterfaceIssue[];
/** A Cell's custom block as its callers draw it, or null while its map is invalid. */
export declare function projectCellSymbolArtwork(artwork: CellSymbolArtwork, ports: readonly MappedSymbolTerminal[], identity: {
    readonly id: string;
    readonly name: string;
}): SymbolDefinition | null;
