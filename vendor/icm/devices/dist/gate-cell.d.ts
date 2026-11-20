import { type CircuitProject, type ExternalSubcircuitDefinition, type SchematicDocument } from "@icm/model";
import type { ParameterOwner } from "./instance-parameters.js";
/**
 * Whether a Library symbol keeps its look while a Cell of its Project
 * implements it: every Library part whose call goes to a generated body,
 * the chopper and the magnetic parts too (#1928).
 */
export declare function bindsProjectCell(symbolId: string): boolean;
/**
 * Whether a part bound to an external definition meets its ports by the
 * Library part's Pins (#1928). A Circuit Component of the Project that takes
 * a Library symbol's id is drawn with its definition's own terminals.
 */
export declare function bindsExternalByPartPins(project: Partial<Pick<CircuitProject, "componentDefinitions">>, symbolId: string): boolean;
/**
 * Whether a symbol draws a Library part with a generated body: the Library's
 * own, or a Project's captured copy that still names that body. A component
 * whose subcircuit names another master calls the author's own.
 */
export declare function isLibraryPart(project: Partial<Pick<CircuitProject, "componentDefinitions">>, symbolId: string): boolean;
/**
 * Whose name a part's call reaches (#1928): `bound`, the author's Cell or
 * external definition it is bound to by identity; `component`, a User
 * Component's or imported block's own subcircuit, by name; `library`, for a
 * Library part, magnetic device or the chopper, a generated body or a master
 * of the reader's libraries, never the author's by name.
 */
export declare function callOwner(project: Partial<Pick<CircuitProject, "componentDefinitions">>, instance: ParameterOwner): "bound" | "component" | "library";
/**
 * The parameters a part keeps once bound to a Cell or external definition:
 * those it declares. The body's own (an adder's signs, a gate's vt) give way
 * (#1450, #1928).
 */
export declare function boundPartParameters(parameters: Readonly<Record<string, string>>, formalParameters: readonly {
    readonly name: string;
}[]): Record<string, string>;
/**
 * Whether the master a Library part stores is the generated body it is
 * placed with, which leaves the part unbound (#1928): its own target, or
 * either body of the ideal comparator. An older comparator's `comparator`
 * names no body.
 */
export declare function namesOwnBody(symbolId: string, name: string): boolean;
/**
 * A terminal of a part that a binding meets: one of its pins, its VDD or VSS
 * terminal, or the clock a chopper's label names.
 */
export interface PartTerminal {
    readonly pinName: string;
    readonly supply?: "VDD" | "VSS";
    readonly clock?: true;
}
/** One Pin of the Cell a gate calls, and the gate terminal on it. */
export interface GateCellPin extends PartTerminal {
    /** The Cell's Pin, as its `.subckt` line spells it. */
    readonly portName: string;
    /**
     * The part's pin (A, Y; D, CK, Q; IN+, OUT), its VDD or VSS terminal, or a
     * chopper's CK.
     */
    readonly pinName: string;
}
export type GateCellPinMatch = {
    /** The Cell's Pins that meet a gate terminal, in the Cell's order. */
    readonly pins: readonly GateCellPin[];
} & ({
    readonly ok: true;
} | {
    readonly ok: false;
    /** The gate's pins the Cell has no Pin for. */
    readonly missing: readonly string[];
    /** The Cell's Pins that are no terminal of the gate. */
    readonly extra: readonly string[];
    readonly message: string;
});
/**
 * A Library part's pins, then its VDD and VSS terminals. A chopper's clock is
 * no pin of it: the phase its label names reaches its body's CK.
 */
export declare function libraryGateTerminals(symbolId: string): readonly PartTerminal[];
/** A Library part's own signal pins as a refusal spells them: IN+, IN- and OUT. */
export declare function spokenGatePins(symbolId: string): string;
/**
 * How a Library gate meets the Pins of a Cell that implements it: each of its
 * pins the Pin of that name, and its VDD and VSS terminals the Pins of theirs
 * where the Cell has them, since a Cell may take its supplies globally
 * instead. Names compare as SPICE compares them, without case. Undefined for
 * a symbol no Cell may implement.
 */
export declare function matchGateCellPins(symbolId: string, cell: {
    readonly name: string;
    readonly portNames: readonly string[];
}): GateCellPinMatch | undefined;
/**
 * How a Library part meets the ports of an external definition that
 * implements it (#1928), as it meets a Cell's Pins. A definition that names
 * its ports only by position fits no part.
 */
export declare function matchGateExternalPins(symbolId: string, definition: Pick<ExternalSubcircuitDefinition, "name" | "terminals" | "interfaceStatus">): GateCellPinMatch | undefined;
/**
 * The Cell a Library gate or op-amp is bound to, and how it meets its Pins.
 * Undefined for any other Instance, or a Cell that is gone.
 */
export declare function gateCellBinding(project: Pick<CircuitProject, "documents">, instance: ParameterOwner): {
    cell: SchematicDocument;
    match: GateCellPinMatch;
} | undefined;
/**
 * The external definition a Library part is bound to (#1928), and how it
 * meets the definition's ports. Undefined for a reviewed standard cell or PDK
 * device, which its reviewed terminal order maps, for a definition that is
 * gone, and for any other Instance.
 */
export declare function gateExternalBinding(project: Pick<CircuitProject, "externalSubcircuitDefinitions"> & Partial<Pick<CircuitProject, "componentDefinitions">>, instance: ParameterOwner): {
    definition: ExternalSubcircuitDefinition;
    match: GateCellPinMatch;
} | undefined;
/**
 * The Cell or external definition a Library part is bound to, by its name,
 * and how it meets its Pins (#1450, #1928).
 */
export declare function libraryPartBinding(project: Pick<CircuitProject, "documents" | "externalSubcircuitDefinitions"> & Partial<Pick<CircuitProject, "componentDefinitions">>, instance: ParameterOwner): {
    name: string;
    match: GateCellPinMatch;
} | undefined;
