import type { BuiltInSubcircuitDescriptor, BuiltInSubcircuitPort } from "./contract.js";
/**
 * The ideal comparator, V(OUT) = vlow + (high − vlow)·½(1 + tanh(V(IN+, IN−)
 * / vtransition)) from ground: the one table every package that treats its
 * high level reads. The high level, `vhigh`, is a number or `VDD`, the
 * comparator's own supply. The logic a comparator drives reads a high above
 * half its supply, so a fixed 1 V never reached it at a VDD of 2 V or more
 * (#1306). Each kind of high level has a body of its own, chosen at the
 * call as an adder's signs choose its body, so no call carries `vhigh=VDD`.
 */
/** The parameter that holds the comparator's high level. */
export declare const HIGH_LEVEL_PARAMETER = "vhigh";
/** The word the high level takes for the comparator's own VDD, in any case. */
export declare const SUPPLY_HIGH_LEVEL = "VDD";
/** The body a comparator whose high level is its own VDD calls. */
export declare const IDEAL_COMPARATOR_SUPPLY_TARGET = "icm_ideal_comparator_vdd";
/** Complementary-output extension; the existing single-ended bodies stay stable. */
export declare const DIFFERENTIAL_COMPARATOR_TARGET = "icm_ideal_comparator_differential";
/**
 * The ideal comparator's bodies, each a name it reserves: the numeric body a
 * comparator with a number in `vhigh` calls, exactly as before VDD was a
 * choice, and the body that reads VDD.
 */
export declare const IDEAL_COMPARATOR_BODIES: readonly ["icm_ideal_comparator", "icm_ideal_comparator_vdd", "icm_ideal_comparator_differential", "icm_ideal_comparator_differential_vdd"];
export type IdealComparatorBody = (typeof IDEAL_COMPARATOR_BODIES)[number];
/** Whether a call names one of the ideal comparator's bodies. */
export declare function isIdealComparatorBody(target: string): target is IdealComparatorBody;
/** Whether a comparator's call names one of the ideal comparator's bodies. */
export declare function callsIdealComparatorBody(descriptor: Pick<BuiltInSubcircuitDescriptor, "target">, target: string): target is IdealComparatorBody;
/**
 * The body a Library part with this subcircuit target calls as placed: a
 * comparator's symbol names its historical master `comparator`, and calls
 * the ideal comparator.
 */
export declare function placedSubcircuitTarget(target: string): string;
/** The parameter contract shared by a comparator's numeric and supply bodies. */
export declare function idealComparatorModelTarget(body: IdealComparatorBody): string;
export declare function idealComparatorReadsSupply(body: IdealComparatorBody): boolean;
/** Whether a high level, as typed, is the comparator's own VDD. */
export declare function isSupplyHighLevel(value: string): boolean;
/**
 * The body an ideal comparator with these parameters calls, read as export
 * reads them. `VDD`, in any case, reads the supply; so does a comparator
 * with no `vhigh`, which has the default, as Properties shows it. Any other
 * value is a level for the numeric body, which export checks is a number.
 */
export declare function idealComparatorBodyFor(parameters: Readonly<Record<string, string>> | undefined, target?: string): IdealComparatorBody;
/**
 * The ports of the comparator's interface a body's call lowers, in their
 * order: the signals, and VDD for the body that reads it. Neither body
 * reads VSS.
 */
export declare function idealComparatorBodyPorts(body: IdealComparatorBody, ports: readonly BuiltInSubcircuitPort[]): readonly BuiltInSubcircuitPort[];
