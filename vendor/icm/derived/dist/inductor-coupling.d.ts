import type { DerivedPoint as Point, InductorCoupling, Instance, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import { type ArrowArtwork } from "./arrow-artwork.js";
import type { SchematicStyleProfile } from "./style-profile.js";
/** The plain two-pin inductors; T-coils and transformers couple themselves. */
export declare const COUPLABLE_INDUCTOR_SYMBOL_IDS: ReadonlySet<string>;
/** The two pins of a couplable inductor in netlist order, or null. */
export declare function couplableInductorPins(symbolId: string): readonly [string, string] | null;
export declare function isCouplableInductor(instance: Pick<Instance, "symbolId">): boolean;
export declare function inductorCouplingsOf(document: Pick<SchematicDocument, "inductorCouplings">, instanceId: string): InductorCoupling[];
export declare function couplesInstances(coupling: InductorCoupling, first: string, second: string): boolean;
/** The next free `TFn`, compared without case as the model does. */
export declare function nextInductorCouplingName(taken: Iterable<string>, prefix?: string): string;
/** A name kept unless taken; otherwise its stem with the next free number. */
export declare function uniqueInductorCouplingName(name: string, taken: Iterable<string>): string;
export declare const INDUCTOR_COUPLING_DOT_RADIUS = 2.2903;
export interface InductorCouplingDot {
    instanceId: string;
    pinName: string;
    center: Point;
    radius: number;
}
export interface ResolvedInductorCoupling {
    coupling: InductorCoupling;
    /** One per placed member. */
    dots: InductorCouplingDot[];
    /** Absent when hidden or when a member is not placed. */
    arrow?: {
        points: [Point, Point];
        control: Point;
        artwork: ArrowArtwork;
        label: {
            /** Baseline anchor of the italic name. */
            position: Point;
            anchor: "start" | "middle" | "end";
            base: string;
            subscript: string;
        };
    };
}
/**
 * Where each coupling of the Document is drawn: a filled dot at each
 * inductor's dotted end and, unless hidden, a double-headed arrow bowing
 * between the dots with the coupling's name at its middle. Read from the
 * records, so it follows the inductors wherever they move.
 */
export declare function resolveInductorCouplingGeometry(document: SchematicDocument, resolver: SymbolResolver, profile: SchematicStyleProfile): ResolvedInductorCoupling[];
