import type { SchematicDocument } from "@icm/model";
/** The visually continuous subset of one stored VDD rail. */
export interface PowerRailComponent {
    routeIds: string[];
    junctionIds: string[];
    endpointJunctionIds: string[];
}
export declare function derivePowerRailComponent(document: SchematicDocument, routeId: string): PowerRailComponent | null;
export interface InternalGroupSelection {
    netIds: string[];
    routeIds: string[];
    junctionIds: string[];
}
export declare function deriveInternalGroupSelection(document: SchematicDocument, instanceIds: readonly string[]): InternalGroupSelection;
