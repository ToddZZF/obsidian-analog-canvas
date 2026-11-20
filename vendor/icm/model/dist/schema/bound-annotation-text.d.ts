/**
 * The Document shape this reader needs. It is stated structurally rather than
 * as the parsed `SchematicDocument` so the compatibility layer can call it on
 * a Project that has not been through the schema yet — which is exactly when
 * a stale format override has to be repaired.
 */
interface BoundAnnotationSource {
    instances?: readonly {
        id: string;
        reference?: string | undefined;
    }[];
    netlist?: {
        terminals: readonly {
            id: string;
            name: string;
        }[];
    } | undefined;
    connectivityEvidence?: readonly {
        kind: string;
        netId?: string | undefined;
        name?: string | undefined;
        owner?: {
            kind: string;
            annotationId?: string | undefined;
            objectId?: string | undefined;
        } | undefined;
    }[];
}
interface BoundAnnotationLike {
    id: string;
    kind: string;
    anchor: {
        kind: string;
        objectId?: string | undefined;
    };
    binding?: {
        kind: string;
        instanceId?: string | undefined;
        terminalId?: string | undefined;
        netId?: string | undefined;
        memberEndpoint?: unknown;
        memberEndpoints?: unknown;
    } | undefined;
}
/**
 * The text a bound Annotation is obliged to read as: its Instance's Reference,
 * its Cell terminal's name, or the Net name it claims, compiled to the house
 * style.
 *
 * This is the single authority for that question. The schema uses it to refuse
 * a format override that no longer says the name it presents, and the
 * compatibility layer uses it to repair one — and those two must never drift,
 * because a repair computed differently from the check either fails to fix the
 * file or reports success on a file that still cannot load.
 *
 * Returns null when the Annotation binds to nothing, which has no obligation.
 */
export declare function boundAnnotationName(document: BoundAnnotationSource, annotation: BoundAnnotationLike): string | null;
export {};
