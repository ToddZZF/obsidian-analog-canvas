import type { DeviceParameterDefinition } from "./contract.js";
export type ReviewedExternalBindingId = "sky130-nfet-01v8" | "sky130-pfet-01v8" | "sky130-nfet-01v8-lvt" | "sky130-pfet-01v8-lvt" | "sky130-nfet-03v3-nvt" | "sky130-nfet-05v0-nvt" | "sky130-nfet-g5v0d10v5" | "sky130-nfet-g5v0d16v0" | "sky130-nfet-20v0" | "sky130-nfet-20v0-nvt" | "sky130-nfet-20v0-zvt" | "sky130-pfet-01v8-hvt" | "sky130-pfet-g5v0d10v5" | "sky130-pfet-g5v0d16v0" | "sky130-pfet-20v0" | "sky130-res-generic-po" | "sky130-res-high-po" | "sky130-res-xhigh-po" | "sky130-cap-mim-m3-1" | "sky130-cap-mim-m3-2" | "sky130-cap-var-lvt" | "sky130-ind-03-90" | "sky130-ind-05-125" | "sky130-ind-05-220" | "sky130-ind-03-90-two-pin" | "sky130-ind-05-125-two-pin" | "sky130-ind-05-220-two-pin" | "sky130-pnp-05v5-w0p68l0p68" | "sky130-pnp-05v5-w3p40l3p40" | "sky130-npn-05v5-w1p00l1p00" | "sg13g2-lv-nmos" | "sg13g2-lv-pmos" | "sg13g2-hv-nmos" | "sg13g2-hv-pmos" | "sg13g2-npn13g2" | "sg13g2-npn13g2l" | "sg13g2-npn13g2v" | "sg13g2-pnpmpa" | "sg13g2-rsil" | "sg13g2-rppd" | "sg13g2-rhigh" | "sg13g2-cap-cmim" | "sg13g2-cap-rfcmim" | "sg13g2-svaricap-hv" | `std-cell-${string}`;
export interface ReviewedExternalTerminalBinding {
    /** Public target terminal spelling and order from the external wrapper. */
    readonly targetName: string;
    /** Stable local electrical terminal recorded in Net.terminals. */
    readonly pinName: string;
    /** Property terminals have no Symbol pin and cannot be routed on canvas. */
    readonly interaction: "canvas" | "property";
    /**
     * `substrate`: the PDK ties this terminal to the p-substrate, which belongs
     * on ground or the lowest supply; the export warns otherwise
     * (PDK_SUBSTRATE_TERMINAL). `floating`: may be left unconnected.
     */
    readonly role?: "substrate" | "floating";
    /**
     * A standard cell's rail: with no Net chosen it takes the Cell's drawn
     * supply of that domain, or the conventional one, as the Library gate it
     * replaces does. VPWR and VPB both read the gate's VDD, VGND and VNB its VSS.
     */
    readonly supply?: "VDD" | "VSS";
}
export interface ReviewedExternalParameterBinding extends DeviceParameterDefinition {
    readonly targetUnit?: "micrometre";
    readonly targetDefaultValue?: string;
    readonly spiceOrder: number;
    readonly numericLimits?: {
        readonly minimum?: number;
        readonly maximum?: number;
        readonly exclusiveMinimum?: boolean;
        readonly integer?: boolean;
    };
}
/** The Library logic gates a standard cell can stand behind (#1450). */
export type StandardCellGateSymbolId = "inverter" | "buffer" | "nand-gate" | "nand-gate-3" | "nand-gate-4" | "nor-gate" | "nor-gate-3" | "nor-gate-4" | "and-gate" | "and-gate-3" | "and-gate-4" | "or-gate" | "or-gate-3" | "or-gate-4" | "xor-gate" | "xor-gate-3" | "xor-gate-4" | "xnor-gate" | "xnor-gate-3" | "xnor-gate-4";
/** Standard-cell libraries whose gate cells a Library gate may take (#1450). */
export type StandardCellLibraryId = "sky130_fd_sc_hd" | "sg13g2_stdcell" | "tcbn28hpcplusbwp12t30p140";
export interface ReviewedExternalDeviceBinding {
    readonly id: ReviewedExternalBindingId;
    readonly libraryId: "sky130_fd_pr" | "sg13g2_pr" | StandardCellLibraryId;
    readonly masterName: string;
    readonly invocationKind: "external-subcircuit";
    readonly symbolId: "nmos" | "pmos" | "ndmos" | "pdmos" | "resistor" | "capacitor" | "inductor" | "center-tap-inductor" | "mos-varactor" | "npn" | "pnp" | StandardCellGateSymbolId;
    readonly deviceClass: "mos" | "resistor" | "capacitor" | "inductor" | "bjt" | "logic";
    readonly terminals: readonly ReviewedExternalTerminalBinding[];
    readonly parameters: readonly ReviewedExternalParameterBinding[];
    /**
     * An older drawing of a device another binding of the same master now
     * draws: parts drawn this way keep working, and no new part is offered it
     * (#1832).
     */
    readonly legacy?: true;
    /**
     * The MOS primitive's path inside the wrapper, for operating-point
     * vectors. A plain SKY130 MOS wrapper holds one `m<masterName>`; the
     * high-voltage ones nest it or name it otherwise.
     */
    readonly nativeElement?: string;
    /** PSP uses an OSDI N instance and its own terminal-current output names. */
    readonly nativeMosModel?: "psp103";
    /**
     * The only sizes the process library models, for a device it models at a
     * few sizes rather than over a range (SKY130's 16 V pair). ngspice picks a
     * model by the W and L the X line gives (by total W, as the hosted profile
     * runs it; a PDK spinit with `ngbehavior=hsa` takes W per finger) and stops
     * with "could not find a valid modelname" at any other size (#1483).
     */
    readonly modelledSizes?: ReviewedModelledSizes;
    /**
     * Supported L range and narrowest W per finger, in metres. SKY130's model
     * bins stop ngspice outside these bounds (#1474, #1492); SG13G2's bounds
     * follow its pinned PCell technology parameters.
     */
    readonly sizeLimits?: {
        readonly length: readonly [shortest: number, longest: number];
        readonly widthPerFinger: number;
    };
    /**
     * Parameters the X line always gives this device, ahead of the part's own
     * and in this order: a channel the device has only one of (#1486).
     */
    readonly fixedParameters?: readonly {
        readonly name: string;
        readonly value: string;
    }[];
}
/** A device's model bins, in metres as its library gives them. */
export interface ReviewedModelledSizes {
    readonly bins: readonly {
        readonly length: readonly [min: number, max: number];
        readonly width: readonly [min: number, max: number];
    }[];
    /** The bins for people, as a finding names them. */
    readonly description: string;
}
/** Canonical Project length (metres) to the reviewed SKY130 plain-um form. */
export declare function projectLengthToSky130Micrometres(value: string): string;
/** Which of a device's sizes: its W or its L. */
export type ReviewedSizeRole = "width" | "length";
/**
 * The reviewed device an external definition calls, unless the Project gives
 * the definition its own artwork or body.
 */
export declare function reviewedBindingOfDefinition(definition: {
    readonly name: string;
    readonly terminals: readonly {
        readonly name: string;
    }[];
    readonly presentation?: unknown;
    readonly implementation?: unknown;
}): ReviewedExternalDeviceBinding | undefined;
/** One of a part's sizes, as a reviewed device takes it. */
export interface ReviewedSize {
    /** The part's value, or the device's default when the part has none. */
    readonly text: string;
    /** In metres; undefined when an expression or unreadable text gives it. */
    readonly metres?: number;
}
/**
 * The W and L a part's parameters give a reviewed device. A missing one is
 * the device's default, as its wrapper takes it; undefined when the device
 * has no such size.
 */
export declare function reviewedSize(binding: ReviewedExternalDeviceBinding, parameters: Readonly<Record<string, string>>): {
    readonly width: ReviewedSize | undefined;
    readonly length: ReviewedSize | undefined;
};
/**
 * Whether a device's library has a model at the W and L a part's parameters
 * give it. Undefined when that cannot be said: the device declares no
 * modelled sizes, or an expression leaves it open.
 */
export declare function reviewedSizeModelled(binding: ReviewedExternalDeviceBinding, parameters: Readonly<Record<string, string>>): boolean | undefined;
/**
 * What gives a part a size its device has a model for, when its own is none.
 * One of its W and L, the first that is enough, becomes the device's own
 * value; both do when neither alone is enough. W goes before L, and a size in
 * `kept` (one an edit just set) after the other. An expression never changes.
 * Written under the part's own parameter names. Empty when the part's size is
 * modelled or open.
 */
export declare function reviewedModelledSizeChanges(binding: ReviewedExternalDeviceBinding, parameters: Readonly<Record<string, string>>, kept?: readonly ReviewedSizeRole[]): Record<string, string>;
/** One of a part's sizes that its device cannot have (#1474). */
export interface ReviewedSizeOutOfRange {
    readonly role: ReviewedSizeRole;
    /** The part's parameter, as it spells the name, or the device's. */
    readonly parameter: string;
    /** The part's value, or the device's default when the part has none. */
    readonly text: string;
    /** The whole size in metres: L, or W over all fingers. */
    readonly metres: number;
    /** The fingers W is shared among; 1 for L and for a device without them. */
    readonly fingers: number;
    /**
     * `minimum` or `maximum`: outside the device's
     * {@link ReviewedExternalDeviceBinding.sizeLimits}. `slip`: over
     * {@link REVIEWED_SIZE_SLIP_LIMIT}, on a device whose library takes
     * micrometres.
     */
    readonly bound: "minimum" | "maximum" | "slip";
    /** The bound in metres, for L or for W per finger. */
    readonly limit: number;
}
/**
 * The W and L of a part a reviewed device cannot have: an L, or a W per
 * finger, below the device's limits, an L above them, or either past 1 mm
 * where the library takes micrometres. W is compared per finger, as the PDK sizes a finger. A
 * size or finger count given by an expression is not checked, nor a device
 * modelled only at a few sizes, which REVIEWED_SIZE_UNMODELLED covers.
 */
export declare function reviewedSizeOutOfRange(binding: ReviewedExternalDeviceBinding, parameters: Readonly<Record<string, string>>): readonly ReviewedSizeOutOfRange[];
export declare const reviewedExternalDeviceBindings: readonly ReviewedExternalDeviceBinding[];
/** Whether a symbol is one of the Library logic gates (#1450). */
export declare function isLibraryLogicGate(symbolId: string): symbolId is StandardCellGateSymbolId;
/**
 * The standard-cell library a cell name belongs to, any cell of it, gate or
 * not (#1596): for telling a cell no Library gate takes from an unknown name.
 */
export declare function standardCellLibraryOfName(name: string): StandardCellLibraryId | undefined;
/**
 * A standard cell of a Library gate's function (#1450), read from its name,
 * whichever gate that is: the gate keeps its pins, and its VDD/VSS property
 * terminals feed each domain's rails. Only a gate's own model choice asks for
 * any cell; elsewhere a cell is reviewed only behind its gate (see
 * {@link reviewedExternalBindingForMaster}).
 */
export declare function standardCellBindingForMaster(name: string): ReviewedExternalDeviceBinding | undefined;
/**
 * The reviewed device of a master name. `symbolId` is the symbol the part is
 * drawn with: a device drawn two ways answers for that drawing (#1832), and a
 * standard cell is reviewed only behind the Library gate of its function
 * (#1450). Without it, as when importing a netlist or drawing a definition's
 * block, a device is the way new parts draw it, and a cell is an ordinary
 * external subcircuit.
 */
export declare function reviewedExternalBindingForMaster(masterName: string, symbolId?: string): ReviewedExternalDeviceBinding | undefined;
/** The binding a netlisted Instance recorded, standard cells included. */
export declare function reviewedExternalBindingById(id: string | undefined): ReviewedExternalDeviceBinding | undefined;
export declare function reviewedExternalBindingForTerminalCount(masterName: string, terminalCount: number): ReviewedExternalDeviceBinding | undefined;
/**
 * Exact master and exact public terminal order are both required; `symbolId`
 * as in {@link reviewedExternalBindingForMaster}.
 */
export declare function resolveReviewedExternalBinding(masterName: string, terminalNames: readonly string[], symbolId?: string): ReviewedExternalDeviceBinding | undefined;
/**
 * Whether a definition declares a reviewed library interface, a PDK device or
 * a standard cell (#1450) in its exact pin order, whichever symbol draws it:
 * the library supplies its body, so the Project need not.
 */
export declare function resolveReviewedLibraryInterface(masterName: string, terminalNames: readonly string[]): ReviewedExternalDeviceBinding | undefined;
/**
 * The process each reviewed library belongs to: a PDK's standard cells ride
 * with its primitives. A retired process's library belongs to Custom.
 */
export declare const LIBRARY_PROCESS: Readonly<Record<ReviewedExternalDeviceBinding["libraryId"], string>>;
/** Reviewed masters a part may take, from one PDK's libraries or all of them. */
export declare function reviewedExternalModelSuggestions(symbolId: string, libraryId?: ReviewedExternalDeviceBinding["libraryId"], libraries?: readonly {
    readonly cells: string;
    readonly masters?: readonly string[] | undefined;
}[]): readonly string[];
/**
 * Whether a part drawn with this symbol may take the reviewed device: a
 * binding of its master for that symbol does. The binding's terminals name
 * its symbol's pins, so on any other drawing they are pins the part does not
 * have, and it can be neither wired nor exported; resolve the master with the
 * drawn symbol for the terminals that part has.
 */
export declare function reviewedExternalBindingSupportsSymbol(binding: ReviewedExternalDeviceBinding, symbolId: string): boolean;
/** Reviewed SKY130 plain-um input to the canonical Project length spelling. */
export declare function sky130MicrometresToProjectLength(value: string): string;
export interface ReviewedParameterIssue {
    readonly code: string;
    readonly parameter: string;
    readonly message: string;
}
/** Shared literal model-parameter findings for Properties and design/simulation export. */
export declare function reviewedParameterIssues(binding: ReviewedExternalDeviceBinding, parameters: Readonly<Record<string, string>>, reference: string): readonly ReviewedParameterIssue[];
