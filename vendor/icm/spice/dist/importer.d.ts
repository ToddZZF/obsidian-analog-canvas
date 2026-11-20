import type { PdkSymbolMappingOverride } from "@icm/symbols";
import type { CircuitProject } from "@icm/model";
import type { SpiceCompileResult } from "./compiler.js";
import type { SpiceCompileOptions } from "./dialect.js";
import type { SpiceSourceInput } from "./source-types.js";
export interface SpiceImportResult extends SpiceCompileResult {
    project: CircuitProject | null;
}
/**
 * A body Analog Canvas writes itself that the sources define, such as an
 * op-amp's subcircuit or the ideal switch's model card: each card naming it
 * imports as the part that wrote it, and a subcircuit body as no Cell. The
 * netlist package tells such a body from an author's own of the same name
 * (`findBuiltInBodies`); the importer only reads what it found.
 */
export interface SpiceBuiltInBody {
    /** The verified declaration in the prepared source, not just its name. */
    readonly source: {
        readonly path: string;
        readonly line: number;
    };
    /** The body's name, as the sources spell it. */
    readonly name: string;
    /**
     * What the name is: a subcircuit, which `X` calls name, or a model card,
     * which device cards such as `S` name.
     */
    readonly kind: "subcircuit" | "model";
    /** The part's Symbol. */
    readonly symbolId: string;
    /** The subcircuit the part is bound to, as a placed one is; a part that takes no binding, such as a switch, has none. */
    readonly target?: string;
    /**
     * The letters the part's reference starts with, where they are not X: a
     * card that writes an X before them, as SPICE writes a call and the
     * conversion from Spectre names one, keeps the reference without it.
     */
    readonly referencePrefix?: string;
    /** Parameters the body's name stands for, such as an adder's signs. */
    readonly parameters?: Readonly<Record<string, string>>;
    /**
     * The body's ports in the order it lists them: a Symbol pin; a supply the
     * part takes as a property; the Cell's ground, which a switch reads its
     * control against; or the clock its label names, as a chopper's. A supply
     * the body does not read is left unbound where a card passes ground,
     * which is what an unbound one exports as; bound, it could export as
     * another card.
     */
    readonly ports: readonly ({
        readonly pinName: string;
    } | {
        readonly supply: "VDD" | "VSS";
        readonly unboundAtGround: boolean;
    } | {
        readonly ground: true;
    } | {
        readonly phase: true;
    })[];
}
export interface SpiceImportOptions {
    /** Input before frontend conversion; never used as mutable connectivity. */
    originalSources?: readonly SpiceSourceInput[];
    symbolMappings?: readonly PdkSymbolMappingOverride[];
    /** Drawing evidence applies to unresolved external calls, without retyping devices. */
    externalSymbolMappings?: readonly PdkSymbolMappingOverride[];
    namingProfile?: "native" | "cadence-bang";
    /** Bodies Analog Canvas writes itself among the sources' subcircuits. */
    builtInBodies?: readonly SpiceBuiltInBody[];
    /**
     * The device type (`nmos`, `pmos`, `npn`, `pnp`, `d`) of a model the
     * sources call but no model card declares, by its name in any case, as
     * another reading of the same files says it, such as the symbols an RNL
     * drawing draws its parts with. A card the sources declare decides.
     */
    modelTypes?: ReadonlyMap<string, string>;
    /**
     * How a refused device whose model no card declares is told to recover:
     * by adding a card (the default), or, for a caller that takes device types
     * itself (an Agent's delivery), by giving its type in `modelTypes`.
     */
    undeclaredModels?: "add-card" | "give-type";
    /**
     * Library blocks the sources call but do not define, as Analog Canvas
     * writes a block whose body a simulator's libraries give (`callOnlyBlock`
     * of @icm/netlist), by the name its calls give, as another reading of the
     * same files says it, such as the RNL symbol its calls are drawn with.
     * Each call of one imports as that block; a definition the sources give
     * decides.
     */
    calledBlocks?: readonly ImportedBody[];
    /**
     * Subcircuits the sources define that are a library's, not the circuit's,
     * by name, as another reading of the same files says it, such as the
     * levels an RNL drawing leaves undrawn. None becomes a Cell, and nothing
     * in one needs a symbol: each call of one is a call of an external
     * subcircuit, its pins the body's ports, and the bodies stay the text they
     * are, with the file level's parameters, options, functions and model
     * cards, as a model source the Project keeps (`librarySource`). A built-in
     * body is the part that wrote it still; only a SPICE source is read so.
     */
    libraryBodies?: readonly string[];
}
/** What a built-in body imports as, wherever the sources have it. */
type ImportedBody = Omit<SpiceBuiltInBody, "source">;
/**
 * What a Cell Pin's name alone says it is, as imported Pins are read: a
 * supply, a ground or an output; undefined when the name says nothing.
 */
export declare function cellPinNameRole(name: string): "supply" | "ground" | "output" | undefined;
export declare function importCompileResult(result: SpiceCompileResult, options?: SpiceImportOptions): SpiceImportResult;
export declare function importSpiceSources(inputs: readonly SpiceSourceInput[], entryPath: string, compileOptions?: SpiceCompileOptions, importOptions?: SpiceImportOptions): Promise<SpiceImportResult>;
export {};
