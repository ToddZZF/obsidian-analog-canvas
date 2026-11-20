import { type CircuitProject, type SchematicDocument } from "@icm/model";
/**
 * Shared exported Cell spelling for both checks and netlist generation. Greek
 * letters keep their meaning as standard names (Φgen is PHIgen) before any
 * other character is folded away.
 */
export declare function portableCellIdentifier(name: string, documentId: string): string;
/**
 * Calls by name that a local Cell of the same exported name would shadow:
 * two of the author's definitions under one name. An unbound Library part
 * calls its generated body, and one retargeted to the Cell's name is bound
 * to that Cell, so neither collides (#1928).
 */
export declare function findExternalMasterCollisions(project: CircuitProject, documents?: readonly SchematicDocument[]): {
    documentId: string;
    instanceId: string;
    localDocumentId: string;
    masterName: string;
    localName: string;
}[];
/**
 * The master a Library part names in place of its own body (#1928), if any.
 * An older part with no binding names its symbol's own master, which for a
 * comparator placed before the ideal comparator is `comparator`.
 */
export declare function libraryPartMaster(project: Pick<CircuitProject, "componentDefinitions">, instance: SchematicDocument["instances"][number]): string | undefined;
/**
 * The Cell or external definition of the master a Library part names in
 * place of its own body (#1928), and the parameters it declares: the part is
 * bound to it, Pins by name, as set-model binds it. Undefined for an unbound
 * part and for a name the Project does not define, which stays a call to the
 * reader's libraries.
 */
export declare function libraryPartRetarget(project: Pick<CircuitProject, "documents" | "externalSubcircuitDefinitions" | "componentDefinitions">, instance: SchematicDocument["instances"][number]): {
    binding: {
        kind: "subcircuit";
        childDocumentId: string;
    } | {
        kind: "external-subcircuit";
        definitionId: string;
    };
    formalParameters: readonly {
        readonly name: string;
    }[];
} | undefined;
