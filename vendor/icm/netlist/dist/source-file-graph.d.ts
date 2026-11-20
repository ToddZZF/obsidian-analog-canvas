import { type SimulationSourceInput, type SourceSpan, type ObjectLocator } from "@icm/model";
export interface SimulationSourceDiagnostic {
    code: string;
    severity: "info" | "warning" | "error";
    message: string;
    sourceRef?: SourceSpan;
    related?: {
        message: string;
        sourceRef: SourceSpan;
    }[];
    path?: string;
    field?: string;
    modelSource?: {
        sourceId: string;
        revision: number;
    };
    primary?: Omit<ObjectLocator, "hierarchyPath"> & {
        hierarchyPath: ObjectLocator["hierarchyPath"][number][];
    };
}
export interface InspectedSourceItem<T> {
    statement: T;
    sourceRef: SourceSpan;
    include?: {
        requestedPath: string;
        section?: string;
    };
    section?: {
        kind: "start" | "end";
        name: string;
    };
}
export interface SourceFileGraph<T> {
    statements: {
        path: string;
        statement: T;
    }[];
    includes: {
        path: string;
        target: string;
        section?: string;
        sourceRef: SourceSpan;
    }[];
    /** Repeated includes remain repeated, in execution order. */
    paths: string[];
    diagnostics: SimulationSourceDiagnostic[];
}
/** Bindings are executable owners only when the entry's include graph reaches them. */
export declare function reachableCircuitBindings(input: SimulationSourceInput, graph: Pick<SourceFileGraph<unknown>, "paths">): {
    id: string;
    path: string;
    documentId: string;
    emission: "subcircuit" | "top-level";
}[];
/** One virtual-file ownership/expansion boundary. Syntax adapters supply events;
 * this traversal neither rewrites source nor reads the host filesystem. */
export declare function inspectSourceFileGraph<T>(input: SimulationSourceInput, inspect: (path: string, text: string, entry: boolean) => {
    items: InspectedSourceItem<T>[];
    diagnostics: SimulationSourceDiagnostic[];
}, options: {
    sectionKey: (name: string, path: string, declaration?: SourceSpan) => string;
    rootFallback?: boolean;
    flatSections?: boolean;
}): SourceFileGraph<T>;
