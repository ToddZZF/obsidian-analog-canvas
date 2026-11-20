import type { Instance, Net, RouteBranch, RouteEndpoint, SchematicDocument } from "@icm/model";
import { type ResolvedDocumentLogicalNets } from "./logical-net.js";
import { type SupplyDomain } from "./supply-marker.js";
export type MosBulkKind = "nmos" | "pmos";
export type MosBulkResolution = {
    status: "explicit" | "cell-default" | "instance-override" | "supply-default";
    instance: Instance;
    net: Net;
    materialized: boolean;
} | {
    status: "no-connect" | "unresolved";
    instance: Instance;
    net: undefined;
    materialized: false;
};
export declare function mosBulkKind(instance: Instance): MosBulkKind | undefined;
/**
 * The letter `B` is overloaded by SPICE symbols: it is MOS bulk but BJT base.
 * Keep that distinction at the semantic boundary so presentation and editing
 * code never turn an ordinary BJT base wire into a MOS bulk route.
 */
export declare function isMosBulkTerminal(document: SchematicDocument, endpoint: RouteEndpoint): boolean;
export interface MosBulkRouteFamily {
    routeIds: string[];
    instanceIds: string[];
}
/**
 * Resolve every dashed segment in the connected visual path that originates
 * at one or more MOS B terminals. Route splitting can move the B terminal off
 * the selected segment, so direct terminal incidence is not a sufficient
 * family test.
 */
export declare function deriveMosBulkRouteFamily(document: SchematicDocument, seedRoute: RouteBranch): MosBulkRouteFamily | undefined;
export declare function hasExplicitMosBulkRoute(document: SchematicDocument, instanceId: string): boolean;
/** A dashed Route is meaningful only when it belongs to a MOS bulk family. */
export declare function isMosBulkRoute(document: SchematicDocument, route: RouteBranch): boolean;
/**
 * The Cell's one Net in a supply domain, or nothing.
 *
 * "The supply the author drew" is an explicit classification, never a guess:
 * a placed `ground` or `vdd-port` marker, a name claim that says which power
 * domain a Net belongs to, or a unique formal VSS/VDD Cell Port. The formal
 * interface is an authored supply declaration; an ordinary Net name hint is
 * not. Nothing here guesses from an internal Net's spelling or nearby wire.
 *
 * Several candidates (AVDD beside DVDD, AGND beside DGND) is a question for
 * the author rather than a vote, so the answer is then nothing and whoever
 * asked has to be told to name one. A marker nobody wired yet names no Net,
 * so it neither answers nor competes.
 */
export declare function drawnSupplyNet(document: SchematicDocument, domain: SupplyDomain, logicalNets?: ResolvedDocumentLogicalNets): Net | undefined;
/**
 * Whether the author drew anything in a supply domain at all: one supply,
 * several competing, or a marker on a Net of the other domain. A Cell that
 * drew none takes the conventional default; one that drew several is asked.
 */
export declare function drawsSupply(document: SchematicDocument, domain: SupplyDomain, logicalNets?: ResolvedDocumentLogicalNets): boolean;
/**
 * Every supply the author drew in a domain, by Logical-Net ID: the candidates
 * {@link drawnSupplyNet} weighs, under the same classification. Where that
 * asks for the one supply, this answers whether a Net is a supply at all, so
 * a Cell with two positive supplies has both here.
 */
export declare function drawnSupplyLogicalNetIds(document: SchematicDocument, domain: SupplyDomain, logicalNets?: ResolvedDocumentLogicalNets): ReadonlySet<string>;
/**
 * Whether a Net name reads as a negative rail (VEE, VSS, VNEG; an a/d
 * prefix, any suffix). The one rule {@link drawnNegativeSupplyNet} and the
 * export's lowest-supply check share, so a substrate the Process puts on that
 * rail is never also reported off the lowest supply (#1530).
 */
export declare function namesNegativeSupply(name: string): boolean;
/**
 * The Cell's one drawn negative supply, or nothing (#1530). A negative rail
 * is drawn with the same supply marker as VDD, so its domain says only that
 * it is a supply; which one sits below ground is a voltage the drawing does
 * not hold. The name the author gave that drawn supply does: VEE, or VSS
 * and VNEG on a supply marker rather than ground. An internal Net's name
 * still decides nothing, and two such supplies are a question, not a vote.
 */
export declare function drawnNegativeSupplyNet(document: SchematicDocument, logicalNets?: ResolvedDocumentLogicalNets): Net | undefined;
/**
 * The Net the Process binds a hidden PDK substrate terminal to (#1530): an
 * NPN's S, a poly resistor's or varactor's B, an inductor's SUB. The PDK
 * ties them to the p-substrate, the node the NMOS bodies sit on, which
 * belongs on the lowest supply. A Cell that draws one negative supply puts
 * it there while its NMOS body default is unset or ground, as a Cell's first
 * ground marker sets it; an NMOS default on another Net (VSUB) names it; else
 * it is ground. Undefined when the Cell has none of these. `nmosNetId` asks
 * under another NMOS body default (`null` for none), as a change of that
 * default does before it commits.
 */
export declare function pdkSubstrateDefaultNet(document: SchematicDocument, logicalNets?: ResolvedDocumentLogicalNets, nmosNetId?: string | null): Net | undefined;
/**
 * The Net a MOS body follows when nobody has said otherwise: an unambiguous
 * drawn supply or formal VSS/VDD Cell Port. The answer needs no per-Cell
 * setting and survives copy/paste into a Cell with the same supply authority.
 */
export declare function supplyDefaultMosBulkNet(document: SchematicDocument, kind: MosBulkKind, logicalNets?: ResolvedDocumentLogicalNets): Net | undefined;
/**
 * Single authority for MOS body intent. Net membership remains the electrical
 * truth; this function only explains where that truth came from: explicit B
 * wiring, a configured Cell default, or — when the Cell configures nothing —
 * an authored supply marker or formal VSS/VDD Port. MOS polarity never creates
 * a supply Net, and the fallback stays silent when those authorities disagree.
 */
export declare function resolveMosBulkConnection(document: SchematicDocument, instanceOrId: Instance | string, logicalNets?: ResolvedDocumentLogicalNets): MosBulkResolution | undefined;
/**
 * Where a netlist projection put a MOS body that has no Net: on the Cell's
 * MOS body default (an imported part with no fourth node takes it), or, with
 * none set, on the conventional VDD or ground.
 */
export type PlacedMosBody = "cell-default" | "conventional";
/**
 * The bodies a netlist projection of a Document placed, by instance ID. In
 * the projected Document such a body is a member of that Net and reads as
 * wired; this says it was not.
 */
export type PlacedMosBodies = ReadonlyMap<string, PlacedMosBody>;
/** A MOS whose default body is one supply while its source is on another. */
export interface MosBodyOffSourceSupply {
    instance: Instance;
    /**
     * How the body came to its supply: a default, never a drawn wire.
     * `conventional`: it has no Net, and the netlist gave it the conventional
     * VDD or ground.
     */
    status: "instance-override" | "supply-default" | PlacedMosBody;
    /** The supply the body follows. */
    bodyNet: Net;
    /** The other supply of the same domain, which the source is on. */
    sourceNet: Net;
}
/**
 * The MOS whose body follows a default onto one supply while its source is on
 * another supply of the same domain: a PMOS on a Cell's second positive
 * supply, whose body the Cell's PMOS default put on the first. A level
 * shifter's VDDH devices with their bodies on VDDL are forward-biased when
 * VDDH is the higher supply. Which one is higher is a voltage the drawing does
 * not hold, so this names the question rather than a fault; a body wired
 * explicitly has been answered and is not listed. A supply is what
 * {@link drawnSupplyLogicalNetIds} classifies as one, the same reading a body
 * default takes, so a source on an internal node is never compared.
 *
 * Two supplies of a domain are also why a body can have no default at all:
 * the netlist then gives it the conventional VDD or ground, which may be
 * neither of the two, or the one its source is not on. Given the bodies a
 * netlist projection of this Document placed, those are compared too, the
 * body on whatever Net the projection chose.
 */
export declare function mosBodiesOffSourceSupply(document: SchematicDocument, logicalNets?: ResolvedDocumentLogicalNets, placedBodies?: PlacedMosBodies): MosBodyOffSourceSupply[];
/**
 * The Net a MOS body sits on when that membership is only policy residue: a
 * binding points at it, this one body is its only terminal, and it owns no
 * geometry, claims no name and carries no Cell terminal, so it is not a
 * conductor anybody authored. Copy/paste materialized Cell policy into such
 * a Net, and deleting the supply marker that named it leaves the body
 * stranded there, out of reach of the Cell default it should follow.
 * Authored membership (no binding) and a body bias Net shared by several
 * bodies are connections, never residue.
 */
export declare function strandedMosBulkNet(document: SchematicDocument, instanceOrId: Instance | string): Net | undefined;
/**
 * Recognize the narrow legacy failure produced when an imported source Net was
 * physically split around hidden body terminals. SPICE source Evidence is
 * provenance, never electrical union; it is used here only as repair evidence
 * when the detached Net contains MOS B terminals and no authored geometry.
 */
export declare function resolveDetachedMosBulkDefault(document: SchematicDocument, instanceOrId: Instance | string): Net | undefined;
export declare function mosBulkShouldBeVisible(document: SchematicDocument, instanceOrId: Instance | string, logicalNets?: ResolvedDocumentLogicalNets): boolean;
