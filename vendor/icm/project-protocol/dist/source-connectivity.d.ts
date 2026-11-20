import { type CircuitProject, type SchematicDocument } from "@icm/model";
import { type SymbolResolver } from "@icm/symbols";
type Endpoint = ({
    terminal: [string, string];
} | {
    junction: string;
}) & {
    memberId?: string;
};
type Identity = {
    id: string;
    at: Endpoint | null;
};
export interface SourceConnectivity {
    nets: Identity[];
    connections: {
        contacts: Endpoint[][];
        unrouted: Endpoint[][];
    };
}
/** Capture only edges absent from the drawn paths; never repeat wire membership. */
export declare function captureSourceConnectivity(project: CircuitProject): SourceConnectivity[];
/** Materialize compatibility indexes using the same graph kernel as wire commits. */
export declare function materializeSourceConnectivity(document: SchematicDocument, source: SourceConnectivity, resolver: SymbolResolver): void;
/** Runtime terminal-array order is an index, not an authored circuit property. */
export declare function canonicalConnectionIndexes(project: CircuitProject): CircuitProject;
export {};
