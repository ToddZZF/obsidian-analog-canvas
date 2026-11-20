import type { CircuitProject, SchematicDocument } from "@icm/model";
import type { DesignNetlistInstance, DesignNetlistModel, NetlistDiagnostic } from "./ir.js";
/**
 * The model a diode takes in a Process with no diode of its own (#1310):
 * Abstract, SKY130, IHP SG13G2 and Custom bind each diode placed from the
 * library to `DIODE`, a name no library defines, so every run of that
 * netlist failed on the missing model while the export said ready. Like the
 * ideal switch, each Cell using the name carries this card in its own body:
 * SPICE's default junction, with its saturation current and emission
 * coefficient stated. It is a stand-in, reported as information, and a model
 * of the same name that the Project defines itself replaces it.
 */
export declare const GENERIC_DIODE_MODEL: DesignNetlistModel;
/**
 * The model a Schottky diode takes in every Process, none of which ships one:
 * each Schottky Diode placed from the library binds to `DSCH`, carried and
 * replaced as the generic diode is. A placeholder barrier junction with its
 * saturation current, emission coefficient and series resistance stated, not
 * any real device: about 0.3 V forward at 1 mA, where `DIODE` drops 0.7 V.
 */
export declare const GENERIC_SCHOTTKY_MODEL: DesignNetlistModel;
/**
 * The models a bipolar transistor takes in a Process with no BJT of its own
 * (#1420): Abstract and Custom bind each NPN and PNP placed from the library
 * to `NPN` and `PNP`, names no library defines, so a run of that netlist
 * stopped on the missing model as a diode's did (#1310). They are carried
 * and replaced as the generic diode is: Gummel-Poon placeholders with their
 * saturation current, forward gain and Early voltage stated, not any real
 * device.
 */
export declare const GENERIC_NPN_MODEL: DesignNetlistModel;
export declare const GENERIC_PNP_MODEL: DesignNetlistModel;
/**
 * The models a junction FET takes in every Process, none of which ships one:
 * each NJFET and PJFET placed from the library binds to `NJF` and `PJF`,
 * carried and replaced as the generic diode is. Shichman-Hodges placeholders
 * with their pinch-off voltage, transconductance coefficient and channel-
 * length modulation stated, not any real device: IDSS = BETA*VTO^2 = 4 mA.
 * SPICE's PJF takes VTO negative as NJF does, so both state -2.
 */
export declare const GENERIC_NJF_MODEL: DesignNetlistModel;
export declare const GENERIC_PJF_MODEL: DesignNetlistModel;
/**
 * Whether the author's own text defines a generic model's name, `.model
 * DIODE …` in SPICE or `model DIODE …` in VACASK and Spectre: a source file
 * of the run this netlist is for, or the SPICE the Project was imported
 * from. That model is the author's. The card inside a Cell would shadow it
 * there, so no Cell carries one. Another simulation folder's files do not
 * count: a testbench defining DIODE for its own run left a second folder's
 * run, and the design export, with no model at all. The stand-in card
 * itself, as the export writes it in SPICE or Spectre, is not the author's:
 * a netlist the editor wrote and imported again holds it (#1789).
 */
export declare function definesGenericModel(project: CircuitProject, deckSources: readonly string[], model: DesignNetlistModel): boolean;
/**
 * Which diodes run on the generic card (#1310). Information, as a default
 * body supply is: the netlist now runs, but on a stand-in junction, not on a
 * device anyone chose.
 */
export declare function reportGenericDiodes(document: SchematicDocument, diodes: readonly DesignNetlistInstance[], diagnostics: NetlistDiagnostic[]): void;
/**
 * Which Schottky diodes run on the generic card, one finding for the Cell as
 * for its plain diodes: information, since the netlist runs, but on a
 * stand-in barrier, not on a device anyone chose.
 */
export declare function reportGenericSchottkys(document: SchematicDocument, diodes: readonly DesignNetlistInstance[], diagnostics: NetlistDiagnostic[]): void;
/**
 * The stand-ins a MOS takes in a netlist the editor hands out (its panel,
 * copy and save, SPICE+RNL and Spectre+RNL among them) from a Process with no
 * MOS of its own: Abstract binds each NMOS and PMOS placed from the library to
 * `NMOS` and `PMOS`, names no library defines, so that netlist left them
 * undefined and reading it back could not tell an n-channel part from a
 * p-channel one (the user's choice after a hands-on test, 2026-10-17). They
 * are BSIM4 with its defaults, which take the nf every MOS carries where a
 * level-1 card refuses it: level 54 in SPICE, Spectre's own `bsim4`, so the
 * netlist reads in ngspice and Spectre alike (no other simulator is
 * promised). They are carried and replaced as the generic diode is. A
 * simulation run's deck carries none (#1420): VACASK has no mapping for a
 * Cell's own MOS card, and the run says it needs one.
 */
export declare const GENERIC_NMOS_MODEL: DesignNetlistModel;
export declare const GENERIC_PMOS_MODEL: DesignNetlistModel;
/**
 * The models a depletion MOS takes in every Process, none of which ships
 * one: each depletion NMOS and PMOS placed from the library binds to
 * `NMOS_DEP` and `PMOS_DEP`, carried and replaced as the JFETs' cards are, in
 * a run's SPICE deck too. They are the generic BSIM4 with its threshold moved
 * past zero, on for VGS = 0 (VTH0 -1 for n-channel, +1 for p-channel), so
 * they take the nf every MOS carries, which a level-1 card refuses; not any
 * real device.
 */
export declare const GENERIC_NMOS_DEPLETION_MODEL: DesignNetlistModel;
export declare const GENERIC_PMOS_DEPLETION_MODEL: DesignNetlistModel;
export declare function reportUndefinedGenericModels(project: CircuitProject, document: SchematicDocument, instances: readonly DesignNetlistInstance[], deckSources: readonly string[], diagnostics: NetlistDiagnostic[], 
/** Names this netlist carries a stand-in card for. */
carried?: ReadonlySet<string>): void;
/**
 * Which MOS parts a netlist handed out names on the stand-in cards: one
 * finding for the Cell, information, as for its diodes and transistors.
 */
export declare function reportGenericMos(document: SchematicDocument, used: ReadonlyArray<{
    model: DesignNetlistModel;
    parts: readonly DesignNetlistInstance[];
}>, diagnostics: NetlistDiagnostic[]): void;
/**
 * Which depletion MOS run on the generic cards, one finding for the Cell as
 * for its JFETs: information, since the netlist runs, but on stand-in
 * transistors, not on devices anyone chose.
 */
export declare function reportGenericDepletionMos(document: SchematicDocument, used: ReadonlyArray<{
    model: DesignNetlistModel;
    parts: readonly DesignNetlistInstance[];
}>, diagnostics: NetlistDiagnostic[]): void;
/**
 * Which bipolar transistors run on the generic cards (#1420), one finding
 * for the Cell as for its diodes: information, since the netlist runs, but
 * on stand-in transistors, not on devices anyone chose.
 */
export declare function reportGenericBjts(document: SchematicDocument, used: ReadonlyArray<{
    model: DesignNetlistModel;
    parts: readonly DesignNetlistInstance[];
}>, diagnostics: NetlistDiagnostic[]): void;
/**
 * Which junction FETs run on the generic cards, one finding for the Cell as
 * for its bipolar transistors: information, since the netlist runs, but on
 * stand-in transistors, not on devices anyone chose.
 */
export declare function reportGenericJfets(document: SchematicDocument, used: ReadonlyArray<{
    model: DesignNetlistModel;
    parts: readonly DesignNetlistInstance[];
}>, diagnostics: NetlistDiagnostic[]): void;
