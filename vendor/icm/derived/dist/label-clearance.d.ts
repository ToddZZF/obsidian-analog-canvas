import type { Annotation, Point, Rect, RichTextDocument, SchematicDocument } from "@icm/model";
import { type SymbolResolver } from "@icm/symbols";
import { type AnnotationPresentation } from "./annotation-presentation.js";
import { type VisualDiagnostic } from "./visual.js";
/** One bounded read model shared by optional arrangement and Agent observations. */
export declare function createLabelClearanceContext(document: SchematicDocument, resolver: SymbolResolver): {
    visible: {
        id: string;
        kind: "instance-label" | "instance-value" | "net-label" | "power-label" | "route-marker";
        content?: RichTextDocument | undefined;
        binding?: {
            kind: "instance-reference";
            instanceId: string;
        } | {
            kind: "instance-value";
            instanceId: string;
            parameter?: string | undefined;
            showValue?: false | undefined;
        } | {
            kind: "net-name";
            netId: string;
            memberEndpoint?: {
                kind: "terminal";
                instanceId: string;
                pinName: string;
                memberId?: string | undefined;
            } | {
                kind: "junction";
                junctionId: string;
                memberId?: string | undefined;
            } | undefined;
            memberEndpoints?: ({
                kind: "terminal";
                instanceId: string;
                pinName: string;
                memberId?: string | undefined;
            } | {
                kind: "junction";
                junctionId: string;
                memberId?: string | undefined;
            })[] | undefined;
        } | {
            kind: "cell-terminal-name";
            terminalId: string;
        } | undefined;
        formatOverride?: RichTextDocument | undefined;
        anchor: {
            kind: "free";
            position: {
                x: number;
                y: number;
            };
        } | {
            kind: "object";
            objectId: string;
            localOffset: {
                x: number;
                y: number;
            };
            fallbackPosition: {
                x: number;
                y: number;
            };
        } | {
            kind: "route";
            routeId: string;
            legId: string;
            t: number;
            normalOffset: number;
            direction: "forward" | "reverse";
            orientation: "follow" | "horizontal";
            fallbackPosition: {
                x: number;
                y: number;
            };
        };
        netId?: string | undefined;
        alignment: "end" | "middle" | "start";
        rotation: 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;
        locked: boolean;
        sizeScale?: number | undefined;
        markerKind?: "current" | "voltage" | undefined;
        visible?: boolean | undefined;
        textColor?: string | undefined;
        documentStyle?: {
            fontScale?: number | undefined;
            wireStrokeScale?: number | undefined;
            symbolStrokeScale?: number | undefined;
            annotationStrokeScale?: number | undefined;
            junctionRadiusScale?: number | undefined;
        } | undefined;
    }[];
    /** The Document's wire geometry this context measured against. */
    routing: import("./resolved-route-geometry.js").ResolvedDocumentRoutingGeometry;
    symbols: {
        id: string;
        bounds: Rect;
    }[];
    measure: (annotation: Annotation) => AnnotationPresentation;
    struckAt: (box: Rect, annotationId: string) => string[];
    ownerGapAt: (annotation: Annotation, box: Rect) => number | undefined;
    runsOnAt: (annotation: Annotation, box: Rect, ignore?: ReadonlySet<string>) => string[];
    findingsAt: (annotation: Annotation, box?: Rect, ignore?: ReadonlySet<string>) => LabelSpotFindings;
    /** Whether `annotation` at `box` raises none of the label findings. */
    clearAt: (annotation: Annotation, box?: Rect, ignore?: ReadonlySet<string>) => boolean;
    conflicts: (annotation: Annotation) => string[];
    conflictsAt: (box: Rect, annotationId: string) => string[];
    /** Other labels drawn over `box` itself, not only too close to it. */
    overlapsAt: (box: Rect, annotationId: string) => string[];
    /** Other labels whose ink comes within `reach` of `box`. */
    labelsWithin: (box: Rect, annotationId: string, reach: number) => string[];
    /** Where a label or free text is drawn, as moved in this pass. */
    labelBounds: (id: string) => Rect | undefined;
    wiresAt: (box: Rect) => string[];
    dotsAt: (box: Rect) => string[];
    enclosedAt: (box: Rect) => boolean;
    crossings: (from: Point, to: Point) => string[];
    accept: (a: Annotation) => Map<string, {
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
};
/** Observations only; never part of GUI gestures or transaction acceptance.
 * A label drawn over a wire or a part warns as label over label does
 * (#1105); a label far from its owner is information. */
export declare function diagnoseLabelClearance(document: SchematicDocument, resolver: SymbolResolver): VisualDiagnostic[];
/** What the label diagnostics would report of one label at one spot. */
export interface LabelSpotFindings {
    /** Parts and wires drawn over it, a junction dot's wires among them. */
    readonly struck: readonly string[];
    /** Other labels and free text its ink meets. */
    readonly overlapped: readonly string[];
    /** Its gap from its part, where that is past the review threshold. */
    readonly ownerGap?: number;
    /** Other parts' names or values it runs on with along its row. */
    readonly runsOn: readonly string[];
}
