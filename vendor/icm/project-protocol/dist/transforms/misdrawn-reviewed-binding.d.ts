import type { CircuitProject } from "@icm/model";
/**
 * Return a part bound to a reviewed PDK device drawn for another symbol to the
 * ideal device its own symbol stands for.
 *
 * From 2026-10-01 (#1272) until #1298 the SKY130 varactor
 * `sky130_fd_pr__cap_var_lvt` was offered to the Variable Capacitor. Its
 * terminals name the plain capacitor's pins 1 and 2 (and a substrate B set in
 * Properties), while a Var Cap's pins are P1 and P2, so a bound Var Cap could
 * be neither wired nor exported, and every Project edit was refused while one
 * existed. A Var Cap is a generic tunable capacitor and takes no reviewed
 * model, so it opens as an ideal Var Cap again.
 *
 * Only a part that could never work is touched: one drawn as a built-in ideal
 * device whose pins the reviewed device's drawn terminals are not. What the
 * binding added goes — the binding itself, the device's parameters (`w`, `l`,
 * `vm`) and its Net memberships at pins the symbol does not have (the
 * substrate). Its wires, labels and any authored `value` stay. No value is
 * invented: the binding removed the Var Cap's value when it was set, and the
 * netlist asks for one until the author enters it. The definition stays, as
 * clearing a model leaves it.
 *
 * This runs on every load rather than as a numbered migration step, like the
 * bound format override repair: a reviewed device drawn with a symbol whose
 * pins it lacks is never valid, whichever version or client wrote the file.
 */
export declare function repairMisdrawnReviewedBindings(project: CircuitProject): CircuitProject;
