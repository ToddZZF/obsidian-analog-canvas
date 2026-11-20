import type { SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
export interface NameClaimFact {
    readonly evidenceId: string;
    readonly netId: string;
    readonly name: string;
    readonly scope: "local" | "global";
    readonly powerDomain?: "vdd" | "ground";
    readonly signal?: {
        expression: string;
        members: ReadonlyArray<{
            id: string;
            name: string;
            netId: string;
        }>;
    };
}
export interface ElectricalTopologyProjection {
    readonly endpointToBaseNet: ReadonlyMap<string, string>;
    readonly endpointToPhysicalComponent: ReadonlyMap<string, string>;
    readonly logicalNetByBaseNet: ReadonlyMap<string, string>;
    readonly nameClaimsByOwner: ReadonlyMap<string, NameClaimFact>;
    readonly routeIncidence: ReadonlyMap<string, readonly string[]>;
    readonly junctionIncidence: ReadonlyMap<string, readonly string[]>;
}
/**
 * Derive the electrical facts used to validate a planned routing operation.
 * The projection is independent of a planner's changed-object report.
 */
export declare function deriveElectricalTopologyProjection(document: SchematicDocument, resolver?: SymbolResolver): ElectricalTopologyProjection;
