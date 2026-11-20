import type { CircuitProject, HierarchyFrame } from "@icm/model";
interface CellOccurrence {
    rootDocumentId: string;
    documentId: string;
    path: readonly HierarchyFrame[];
}
/** Shared structural calls, independent of resolved Symbols, Pins or wiring. */
export declare function projectHierarchyCalls(project: CircuitProject): HierarchyFrame[];
/** Structural calls include unwired Cells; electrical edges do not define the tree. */
export declare function buildProjectHierarchy(project: CircuitProject): {
    roots: string[];
    document: (id: string) => {
        id: string;
        name: string;
        revision: number;
        sourceBinding?: {
            cellName: string;
            sourceRef: {
                fileId: string;
                start: {
                    offset: number;
                    line: number;
                    column: number;
                };
                end: {
                    offset: number;
                    line: number;
                    column: number;
                };
            };
        } | undefined;
        importReference?: {
            files: {
                fileId: string;
            }[];
            nets: {
                id: string;
                name: string;
                scope: "global" | "local";
                terminals: ({
                    instanceId: string;
                    sourcePosition: number;
                } | {
                    instanceId: string;
                    pinName: string;
                })[];
            }[];
        } | undefined;
        sourceStatus: "connectivity-modified" | "geometry-only-changed" | "in-sync";
        netlist?: {
            name: string;
            terminals: {
                id: string;
                name: string;
                netId: string;
                direction: "inout" | "input" | "output" | "passive";
                interfaceInstanceIds: string[];
                interfaceAnnotationId?: string | undefined;
                signal?: {
                    expression: string;
                    members: {
                        id: string;
                        name: string;
                        netId: string;
                    }[];
                } | undefined;
            }[];
            formalParameters: {
                name: string;
                defaultValue?: string | undefined;
            }[];
        } | undefined;
        instances: {
            id: string;
            symbolId: string;
            symbolVariantId?: string | undefined;
            sourceRef?: {
                fileId: string;
                start: {
                    offset: number;
                    line: number;
                    column: number;
                };
                end: {
                    offset: number;
                    line: number;
                    column: number;
                };
            } | undefined;
            importProvenance?: {
                kind: "model" | "opaque" | "primitive" | "subcircuit";
                sourceMasterName: string;
                sourceTarget: string;
                status?: "missing" | "resolved" | "unsupported" | undefined;
                modelType?: string | undefined;
                symbolMappingRegistryId?: string | undefined;
                terminalMapping?: {
                    sourcePosition: number;
                    pinName: string;
                }[] | undefined;
            } | undefined;
            mosBulkBinding?: {
                origin: "cell-default" | "instance-override" | "supply-default";
                netId: string;
            } | undefined;
            placement: {
                position: {
                    x: number;
                    y: number;
                };
                rotation: 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;
                mirror: "both" | "horizontal" | "none" | "vertical";
            } | null;
            reference?: string | undefined;
            netlist?: {
                binding?: {
                    kind: "primitive";
                    deviceClass: "bjt" | "capacitor" | "cccs" | "ccvs" | "current-source" | "diode" | "inductor" | "jfet" | "mos" | "net-marker" | "resistor" | "switch" | "vccs" | "vcvs" | "voltage-source";
                } | {
                    kind: "model";
                    deviceClass: "bjt" | "capacitor" | "cccs" | "ccvs" | "current-source" | "diode" | "inductor" | "jfet" | "mos" | "net-marker" | "resistor" | "switch" | "vccs" | "vcvs" | "voltage-source";
                    name: string;
                } | {
                    kind: "subcircuit";
                    childDocumentId: string;
                } | {
                    kind: "external-subcircuit";
                    definitionId: string;
                } | {
                    kind: "unresolved-subcircuit";
                    name: string;
                } | undefined;
                control?: {
                    kind: "voltage";
                    positiveNetId?: string | undefined;
                    negativeNetId?: string | undefined;
                } | {
                    kind: "current";
                    sensorInstanceId?: string | undefined;
                } | {
                    kind: "terminal-current";
                    instanceId?: string | undefined;
                    pinName?: string | undefined;
                    direction: "into" | "out";
                } | undefined;
                parameters: Record<string, string>;
            } | undefined;
            styleOverride?: {
                foreground?: string | undefined;
                background?: string | undefined;
            } | undefined;
            bodyFill?: {
                kind: "background";
            } | {
                kind: "color";
                color: string;
            } | undefined;
            documentStyle?: {
                fontScale?: number | undefined;
                wireStrokeScale?: number | undefined;
                symbolStrokeScale?: number | undefined;
                annotationStrokeScale?: number | undefined;
                junctionRadiusScale?: number | undefined;
            } | undefined;
            signalFlowParameters?: {
                formula?: string | undefined;
                formulaFormat?: import("@icm/model").RichTextDocument | undefined;
                coefficient?: string | undefined;
                bodyWidth?: number | undefined;
                bodyHeight?: number | undefined;
            } | undefined;
        }[];
        nets: {
            id: string;
            terminals: {
                instanceId: string;
                pinName: string;
                memberId?: string | undefined;
            }[];
        }[];
        connectivityEvidence: ({
            id: string;
            kind: "name-claim";
            netId: string;
            name: string;
            signal?: {
                expression: string;
                members: {
                    id: string;
                    name: string;
                    netId: string;
                }[];
            } | undefined;
            owner: {
                kind: "net-label";
                annotationId: string;
            } | {
                kind: "power-marker";
                objectId: string;
            } | {
                kind: "global-declaration";
                sourceNetId: string;
            };
            scope: "global" | "local";
            powerDomain?: "ground" | "vdd" | undefined;
        } | {
            id: string;
            kind: "spice-source";
            netId: string;
            sourceNetId: string;
            sourceRef?: {
                fileId: string;
                start: {
                    offset: number;
                    line: number;
                    column: number;
                };
                end: {
                    offset: number;
                    line: number;
                    column: number;
                };
            } | undefined;
        } | {
            id: string;
            kind: "net-name-hint";
            netId: string;
            sourceName: string;
            origin: "legacy-explicit-net-property" | "spice-import";
        })[];
        routes: {
            id: string;
            netId: string;
            start: {
                kind: "terminal";
                instanceId: string;
                pinName: string;
                memberId?: string | undefined;
            } | {
                kind: "junction";
                junctionId: string;
                memberId?: string | undefined;
            };
            members?: {
                id: string;
                netId: string;
                startMemberId: string;
                endMemberId: string;
            }[] | undefined;
            legs: {
                id: string;
                to: {
                    kind: "bend";
                    bendId: string;
                    position: {
                        x: number;
                        y: number;
                    };
                } | {
                    kind: "endpoint";
                    endpoint: {
                        kind: "terminal";
                        instanceId: string;
                        pinName: string;
                        memberId?: string | undefined;
                    } | {
                        kind: "junction";
                        junctionId: string;
                        memberId?: string | undefined;
                    };
                };
                mode: "auto" | "escape" | "locked" | "manual" | "trunk";
            }[];
            presentation?: "bulk-dashed" | "power-rail" | "wire" | undefined;
            styleOverride?: {
                color?: string | undefined;
                lineStyle?: "dashed" | "dotted" | "solid" | undefined;
                arrow?: "end" | "middle" | undefined;
            } | undefined;
            documentStyle?: {
                fontScale?: number | undefined;
                wireStrokeScale?: number | undefined;
                symbolStrokeScale?: number | undefined;
                annotationStrokeScale?: number | undefined;
                junctionRadiusScale?: number | undefined;
            } | undefined;
        }[];
        junctions: {
            id: string;
            netId: string;
            members?: {
                id: string;
                netId: string;
            }[] | undefined;
            position: {
                x: number;
                y: number;
            };
            role?: "branch" | "label-anchor" | "route-anchor" | "style-anchor" | undefined;
            styleOverride?: {
                color?: string | undefined;
            } | undefined;
            contactAnchor?: {
                instanceId: string;
                pinName: string;
                memberId?: string | undefined;
            } | undefined;
            documentStyle?: {
                fontScale?: number | undefined;
                wireStrokeScale?: number | undefined;
                symbolStrokeScale?: number | undefined;
                annotationStrokeScale?: number | undefined;
                junctionRadiusScale?: number | undefined;
            } | undefined;
        }[];
        annotations: {
            id: string;
            kind: "instance-label" | "instance-value" | "net-label" | "power-label" | "route-marker";
            content?: import("@icm/model").RichTextDocument | undefined;
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
            formatOverride?: import("@icm/model").RichTextDocument | undefined;
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
        presentation: {
            styleProfileId: string;
            grid: number;
            compactness: "compact" | "loose" | "normal";
            styleOverrides?: {
                fontScale?: number | undefined;
                wireStrokeScale?: number | undefined;
                symbolStrokeScale?: number | undefined;
                annotationStrokeScale?: number | undefined;
                junctionRadiusScale?: number | undefined;
            } | undefined;
            labelSubscriptCase?: "lowercase" | "preserve" | "uppercase" | undefined;
            labelSubscriptItalic?: boolean | undefined;
            labelUnderscoreSubscript?: boolean | undefined;
            labelSubscriptAfterFirst?: boolean | undefined;
            labelFirstLetterItalic?: boolean | undefined;
            textFace?: "latin-modern" | "sans" | "serif" | undefined;
            crossingStyle?: "hop" | undefined;
            flow?: {
                power?: "top" | undefined;
                ground?: "bottom" | undefined;
                input?: "left" | undefined;
                output?: "right" | undefined;
            } | undefined;
            cellSymbol?: {
                minimumBodySize?: {
                    width: number;
                    height: number;
                } | undefined;
                bodyBounds?: {
                    left: number;
                    right: number;
                    top: number;
                    bottom: number;
                } | undefined;
                pinPlacements?: {
                    terminalId: string;
                    side: "east" | "north" | "south" | "west";
                    offset: number;
                }[] | undefined;
                artwork?: import("@icm/model").CellSymbolArtwork | undefined;
            } | undefined;
        };
        mosBulkDefaults?: {
            nmosNetId?: string | undefined;
            pmosNetId?: string | undefined;
        } | undefined;
        layoutGroups: {
            id: string;
            kind: "current-mirror" | "custom" | "differential-pair" | "matched-pair";
            objectIds: string[];
            locked: boolean;
        }[];
        constraints: {
            id: string;
            kind: "align-x" | "align-y" | "equal-spacing" | "keep-clear" | "symmetric";
            objectIds: string[];
            locked: boolean;
        }[];
        noConnects: {
            id: string;
            endpoint: {
                kind: "terminal";
                instanceId: string;
                pinName: string;
                memberId?: string | undefined;
            };
            reason?: string | undefined;
            documentStyle?: {
                fontScale?: number | undefined;
                wireStrokeScale?: number | undefined;
                symbolStrokeScale?: number | undefined;
                annotationStrokeScale?: number | undefined;
                junctionRadiusScale?: number | undefined;
            } | undefined;
        }[];
        inductorCouplings?: {
            id: string;
            name: string;
            members: [{
                instanceId: string;
                dotPin: string;
            }, {
                instanceId: string;
                dotPin: string;
            }];
            k: string;
            arrow?: false | undefined;
        }[] | undefined;
        drafting?: {
            objects: ({
                id: string;
                locked: boolean;
                zIndex: number;
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
                styleOverride?: {
                    sizeScale?: number | undefined;
                    weight?: "bold" | "normal" | undefined;
                    italic?: boolean | undefined;
                    lineStyle?: "dashed" | "dotted" | "solid" | undefined;
                    arrowHead?: "filled" | "none" | "open" | undefined;
                    arrowHeadAt?: "both" | "end" | "start" | undefined;
                    arrowStart?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    arrowEnd?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    strokeScale?: number | undefined;
                    color?: string | undefined;
                    fillColor?: string | undefined;
                    arrowHeadScale?: 0.75 | 1 | 1.25 | 1.5 | undefined;
                } | undefined;
                documentStyle?: {
                    fontScale?: number | undefined;
                    wireStrokeScale?: number | undefined;
                    symbolStrokeScale?: number | undefined;
                    annotationStrokeScale?: number | undefined;
                    junctionRadiusScale?: number | undefined;
                } | undefined;
                kind: "text";
                content: import("@icm/model").RichTextDocument;
                alignment: "end" | "middle" | "start";
                rotation: 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;
                typographyToken?: "body" | "caption" | "label" | undefined;
                polarity?: "both" | "negative" | "positive" | undefined;
            } | {
                id: string;
                locked: boolean;
                zIndex: number;
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
                styleOverride?: {
                    sizeScale?: number | undefined;
                    weight?: "bold" | "normal" | undefined;
                    italic?: boolean | undefined;
                    lineStyle?: "dashed" | "dotted" | "solid" | undefined;
                    arrowHead?: "filled" | "none" | "open" | undefined;
                    arrowHeadAt?: "both" | "end" | "start" | undefined;
                    arrowStart?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    arrowEnd?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    strokeScale?: number | undefined;
                    color?: string | undefined;
                    fillColor?: string | undefined;
                    arrowHeadScale?: 0.75 | 1 | 1.25 | 1.5 | undefined;
                } | undefined;
                documentStyle?: {
                    fontScale?: number | undefined;
                    wireStrokeScale?: number | undefined;
                    symbolStrokeScale?: number | undefined;
                    annotationStrokeScale?: number | undefined;
                    junctionRadiusScale?: number | undefined;
                } | undefined;
                kind: "arrow";
                from: {
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
                to: {
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
                waypoints?: {
                    x: number;
                    y: number;
                }[] | undefined;
                curveControls?: ({
                    x: number;
                    y: number;
                } | null)[] | undefined;
                outline?: {
                    width: number;
                } | undefined;
            } | {
                id: string;
                locked: boolean;
                zIndex: number;
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
                styleOverride?: {
                    sizeScale?: number | undefined;
                    weight?: "bold" | "normal" | undefined;
                    italic?: boolean | undefined;
                    lineStyle?: "dashed" | "dotted" | "solid" | undefined;
                    arrowHead?: "filled" | "none" | "open" | undefined;
                    arrowHeadAt?: "both" | "end" | "start" | undefined;
                    arrowStart?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    arrowEnd?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    strokeScale?: number | undefined;
                    color?: string | undefined;
                    fillColor?: string | undefined;
                    arrowHeadScale?: 0.75 | 1 | 1.25 | 1.5 | undefined;
                } | undefined;
                documentStyle?: {
                    fontScale?: number | undefined;
                    wireStrokeScale?: number | undefined;
                    symbolStrokeScale?: number | undefined;
                    annotationStrokeScale?: number | undefined;
                    junctionRadiusScale?: number | undefined;
                } | undefined;
                kind: "leader";
                target: {
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
            } | {
                id: string;
                locked: boolean;
                zIndex: number;
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
                styleOverride?: {
                    sizeScale?: number | undefined;
                    weight?: "bold" | "normal" | undefined;
                    italic?: boolean | undefined;
                    lineStyle?: "dashed" | "dotted" | "solid" | undefined;
                    arrowHead?: "filled" | "none" | "open" | undefined;
                    arrowHeadAt?: "both" | "end" | "start" | undefined;
                    arrowStart?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    arrowEnd?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    strokeScale?: number | undefined;
                    color?: string | undefined;
                    fillColor?: string | undefined;
                    arrowHeadScale?: 0.75 | 1 | 1.25 | 1.5 | undefined;
                } | undefined;
                documentStyle?: {
                    fontScale?: number | undefined;
                    wireStrokeScale?: number | undefined;
                    symbolStrokeScale?: number | undefined;
                    annotationStrokeScale?: number | undefined;
                    junctionRadiusScale?: number | undefined;
                } | undefined;
                kind: "callout";
                content: import("@icm/model").RichTextDocument;
                alignment: "end" | "middle" | "start";
                rotation: 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;
                typographyToken?: "body" | "caption" | "label" | undefined;
                target: {
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
            } | {
                id: string;
                locked: boolean;
                zIndex: number;
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
                styleOverride?: {
                    sizeScale?: number | undefined;
                    weight?: "bold" | "normal" | undefined;
                    italic?: boolean | undefined;
                    lineStyle?: "dashed" | "dotted" | "solid" | undefined;
                    arrowHead?: "filled" | "none" | "open" | undefined;
                    arrowHeadAt?: "both" | "end" | "start" | undefined;
                    arrowStart?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    arrowEnd?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    strokeScale?: number | undefined;
                    color?: string | undefined;
                    fillColor?: string | undefined;
                    arrowHeadScale?: 0.75 | 1 | 1.25 | 1.5 | undefined;
                } | undefined;
                documentStyle?: {
                    fontScale?: number | undefined;
                    wireStrokeScale?: number | undefined;
                    symbolStrokeScale?: number | undefined;
                    annotationStrokeScale?: number | undefined;
                    junctionRadiusScale?: number | undefined;
                } | undefined;
                kind: "construction-line";
                points: {
                    x: number;
                    y: number;
                }[];
                curveControls?: ({
                    x: number;
                    y: number;
                } | null)[] | undefined;
                lineStyle: "dashed" | "dotted" | "solid";
            } | {
                id: string;
                locked: boolean;
                zIndex: number;
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
                styleOverride?: {
                    sizeScale?: number | undefined;
                    weight?: "bold" | "normal" | undefined;
                    italic?: boolean | undefined;
                    lineStyle?: "dashed" | "dotted" | "solid" | undefined;
                    arrowHead?: "filled" | "none" | "open" | undefined;
                    arrowHeadAt?: "both" | "end" | "start" | undefined;
                    arrowStart?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    arrowEnd?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    strokeScale?: number | undefined;
                    color?: string | undefined;
                    fillColor?: string | undefined;
                    arrowHeadScale?: 0.75 | 1 | 1.25 | 1.5 | undefined;
                } | undefined;
                documentStyle?: {
                    fontScale?: number | undefined;
                    wireStrokeScale?: number | undefined;
                    symbolStrokeScale?: number | undefined;
                    annotationStrokeScale?: number | undefined;
                    junctionRadiusScale?: number | undefined;
                } | undefined;
                kind: "rectangle";
                center: {
                    x: number;
                    y: number;
                };
                width: number;
                height: number;
                rotation: number;
                lineStyle: "dashed" | "dotted" | "solid";
                layer?: "background" | "foreground" | undefined;
            } | {
                id: string;
                locked: boolean;
                zIndex: number;
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
                styleOverride?: {
                    sizeScale?: number | undefined;
                    weight?: "bold" | "normal" | undefined;
                    italic?: boolean | undefined;
                    lineStyle?: "dashed" | "dotted" | "solid" | undefined;
                    arrowHead?: "filled" | "none" | "open" | undefined;
                    arrowHeadAt?: "both" | "end" | "start" | undefined;
                    arrowStart?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    arrowEnd?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    strokeScale?: number | undefined;
                    color?: string | undefined;
                    fillColor?: string | undefined;
                    arrowHeadScale?: 0.75 | 1 | 1.25 | 1.5 | undefined;
                } | undefined;
                documentStyle?: {
                    fontScale?: number | undefined;
                    wireStrokeScale?: number | undefined;
                    symbolStrokeScale?: number | undefined;
                    annotationStrokeScale?: number | undefined;
                    junctionRadiusScale?: number | undefined;
                } | undefined;
                kind: "circle";
                center: {
                    x: number;
                    y: number;
                };
                radius: number;
                lineStyle: "dashed" | "dotted" | "solid";
                layer?: "background" | "foreground" | undefined;
            } | {
                id: string;
                locked: boolean;
                zIndex: number;
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
                styleOverride?: {
                    sizeScale?: number | undefined;
                    weight?: "bold" | "normal" | undefined;
                    italic?: boolean | undefined;
                    lineStyle?: "dashed" | "dotted" | "solid" | undefined;
                    arrowHead?: "filled" | "none" | "open" | undefined;
                    arrowHeadAt?: "both" | "end" | "start" | undefined;
                    arrowStart?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    arrowEnd?: "dot" | "large-arrow" | "medium-arrow" | "none" | "open-arrow" | "small-arrow" | undefined;
                    strokeScale?: number | undefined;
                    color?: string | undefined;
                    fillColor?: string | undefined;
                    arrowHeadScale?: 0.75 | 1 | 1.25 | 1.5 | undefined;
                } | undefined;
                documentStyle?: {
                    fontScale?: number | undefined;
                    wireStrokeScale?: number | undefined;
                    symbolStrokeScale?: number | undefined;
                    annotationStrokeScale?: number | undefined;
                    junctionRadiusScale?: number | undefined;
                } | undefined;
                kind: "floating-symbol";
                symbolId: string;
                transform: {
                    rotation: 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;
                    mirror: "both" | "horizontal" | "none" | "vertical";
                };
            })[];
        } | undefined;
        drawingOrder?: ({
            kind: "instance";
            id: string;
        } | {
            kind: "annotation";
            id: string;
        } | {
            kind: "drafting";
            id: string;
        } | {
            kind: "electrical";
        } | {
            kind: "circuit-marks";
        })[] | undefined;
    } | undefined;
    children: (id: string) => readonly HierarchyFrame[];
    usage: (documentId: string, limit?: number) => {
        total: number;
        atLeast: boolean;
        occurrences: CellOccurrence[];
        truncated: boolean;
    };
};
export type ProjectHierarchy = ReturnType<typeof buildProjectHierarchy>;
/** A removed call returns to its surviving parent, even if its Cell still exists. */
export declare function reconcileHierarchyPath(project: CircuitProject, activeDocumentId: string, path: readonly HierarchyFrame[]): {
    documentId: string;
    path: HierarchyFrame[];
};
export {};
