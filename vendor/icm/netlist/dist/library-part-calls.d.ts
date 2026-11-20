import type { CircuitProject, SchematicDocument } from "@icm/model";
import type { DesignNetlistIR } from "./ir.js";
import type { NetlistFormat } from "./net-name-codec.js";
/**
 * The subcircuit names the author's definitions take, folded as SPICE folds
 * them, each with what takes it: the Cells, external definitions and model
 * sources given. For the whole Project, so each root of it writes a body
 * under one name.
 */
export declare function authorSubcircuitNames(project: Pick<CircuitProject, "documents" | "externalSubcircuitDefinitions" | "modelSources">): ReadonlyMap<string, string>;
/**
 * The names the author's definitions take in one output: the Cells it prints,
 * the external definitions they call and those definitions' model sources.
 */
export declare function outputSubcircuitNames(project: Pick<CircuitProject, "externalSubcircuitDefinitions" | "modelSources">, documents: readonly SchematicDocument[]): ReadonlyMap<string, string>;
/** The name a generated body is written under, or why it has none. */
export type WrittenBodyName = {
    readonly ok: true;
    readonly name: string;
} | {
    readonly ok: false;
    readonly message: string;
};
/**
 * The name a generated body is written under: its own, or, where an author's
 * definition takes that, the reserved one. None where the reserved name is
 * taken too, or the body's own name is already reserved; the message follows
 * the calling part's Reference.
 */
export declare function writtenBodyName(plain: string, owners: ReadonlyMap<string, string>): WrittenBodyName;
/** A written name without the reserved prefix a yielding body takes, if it has it. */
export declare function withoutReservedPrefix(name: string): string | undefined;
/** The generated body's own name that a name the IR writes stands for. */
export declare function plainBodyName(ir: DesignNetlistIR, written: string): string;
/**
 * Why a Library part's call by name cannot be written: the name is the
 * reader's interface, yet one of the author's definitions takes it. Undefined
 * where it can.
 */
export declare function libraryCallCollision(call: {
    readonly reference: string;
    readonly target: string;
}, owner: string | undefined, kind: "call-only" | "undeclared", format: NetlistFormat): string | undefined;
/**
 * The Project with each Library part retargeted to a name it defines bound
 * to that definition, as set-model would bind it: Pins by name, never by
 * position, and the body's own parameters dropped. A part retargeted to any
 * other name keeps its call to the reader's libraries. The Project passed in
 * is not changed.
 */
export declare function withRetargetBindings(project: CircuitProject): CircuitProject;
