import type { EndpointJoin, SchematicStyleProfile } from "@icm/derived";
import { type Point, type RouteBranch, type SchematicDocument } from "@icm/model";
import { type SymbolResolver } from "@icm/symbols";
/** Aggregate ink stays an appearance choice on top of the kept Wire style. */
export declare function busStrokeProfile(profile: SchematicStyleProfile, memberCount: number): SchematicStyleProfile;
/** A small slash identifies a member takeoff without implying a bus-wide dot. */
export declare function busTapMarks(document: SchematicDocument, resolver: SymbolResolver, route: RouteBranch, centerline: readonly Point[]): Array<{
    memberIds: readonly string[];
    from: Point;
    to: Point;
}>;
export declare function renderRouteDirectionArrow(centerline: ReadonlyArray<{
    x: number;
    y: number;
}>, placement: "middle" | "end" | undefined, color: string, profile: SchematicStyleProfile): string;
/**
 * A No Connect declaration is electrical intent, not an editor-only hint.
 * Keep its mark in the formal scene so canvas rendering and SVG/PDF export
 * cannot disagree.  It is deliberately centred on the real endpoint rather
 * than offset along a lead: the declaration applies to that exact terminal or
 * port origin.
 */
export declare function noConnectMarkerLayouts(document: SchematicDocument, resolver: SymbolResolver, profile: SchematicStyleProfile, objectIds?: ReadonlySet<string>): {
    id: string;
    point: {
        x: number;
        y: number;
    };
    halfExtent: number;
    profile: SchematicStyleProfile;
    label: {
        text: string;
        x: number;
        y: number;
        fontSize: number;
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    } | undefined;
}[];
export declare function renderNoConnectMarkers(document: SchematicDocument, resolver: SymbolResolver, profile: SchematicStyleProfile, objectIds?: ReadonlySet<string>): string;
/**
 * Route topology always terminates at the exact electrical pin origin. Draw a
 * short path from inside a terminal lead, through the exact pin, into the
 * actual route segment. SVG then owns the sharp miter at the corner, removing
 * the separate-stroke anti-alias seam without adding route geometry.
 */
export declare function terminalMiterBridgePaths(joins: readonly EndpointJoin[], profile: SchematicStyleProfile): string[];
/**
 * Any retained degree-two Junction is visually one dotless conductor even
 * when storage keeps two Route strokes (for example because an annotation or
 * constraint owns the Junction). Bridge the strokes through one SVG miter so
 * storage history cannot expose a butt-cap seam. A true branch has more than
 * two incident Route directions and therefore produces no recipe here.
 */
export declare function junctionMiterBridgePaths(joins: readonly EndpointJoin[], profileOf: (junctionId: string) => SchematicStyleProfile, strokeColors: ReadonlyMap<string, string>): Array<{
    strokeColor: string;
    strokeWidth: number;
    d: string;
}>;
