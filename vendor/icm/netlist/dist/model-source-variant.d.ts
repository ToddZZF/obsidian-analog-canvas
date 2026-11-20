import type { ProjectModelSource } from "@icm/model";
/** Namespace owned declarations and actual call/model targets; expressions remain authored bytes. */
export declare function namespaceModelSource(source: ProjectModelSource, suffix: string): {
    source: {
        id: string;
        language: "spectre" | "spice";
        entry: string;
        dependencies: {
            id: string;
            mountPath: string;
            sha256: string;
        }[];
        revision: number;
        draft?: {
            language?: "spectre" | "spice" | undefined;
            entry: string;
            files: {
                path: string;
                text: string;
            }[];
            baseRevision: number;
            authoring?: {
                definitionId: string;
                entry: string;
                symbolMode: "automatic" | "custom";
                artworkText: string;
                artworkInitialized?: boolean | undefined;
                lastValidArtwork?: {
                    symbol: {
                        schemaVersion: 1;
                        id: string;
                        name: string;
                        viewBox: {
                            x: number;
                            y: number;
                            width: number;
                            height: number;
                        };
                        pins: {
                            name: string;
                            signalMembers?: {
                                id: string;
                                name: string;
                            }[] | undefined;
                            role: string;
                            at: {
                                x: number;
                                y: number;
                            };
                            direction: "east" | "north" | "south" | "west";
                            routing?: {
                                escape: "outward";
                                preferredLanding?: {
                                    x: number;
                                    y: number;
                                } | undefined;
                            } | undefined;
                            presentation: {
                                visibility: "conditional" | "implicit" | "visible";
                                leadLength?: number | undefined;
                                showName?: boolean | undefined;
                                displayName?: string | undefined;
                                nameContent?: import("@icm/model").RichTextDocument | undefined;
                                textStyle?: "math-symbol" | "plain" | undefined;
                                textSizeScale?: number | undefined;
                            };
                        }[];
                        primitives: ({
                            kind: "line";
                            from: {
                                x: number;
                                y: number;
                            };
                            to: {
                                x: number;
                                y: number;
                            };
                            part?: string | undefined;
                            style?: {
                                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                strokeWidth?: number | undefined;
                                lineCap?: "butt" | "round" | "square" | undefined;
                                lineJoin?: "bevel" | "miter" | "round" | undefined;
                                miterLimit?: number | undefined;
                            } | undefined;
                        } | {
                            kind: "polyline";
                            points: {
                                x: number;
                                y: number;
                            }[];
                            part?: string | undefined;
                            style?: {
                                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                strokeWidth?: number | undefined;
                                lineCap?: "butt" | "round" | "square" | undefined;
                                lineJoin?: "bevel" | "miter" | "round" | undefined;
                                miterLimit?: number | undefined;
                            } | undefined;
                        } | {
                            kind: "circle";
                            center: {
                                x: number;
                                y: number;
                            };
                            radius: number;
                            fillableBody?: true | undefined;
                            fill?: "foreground" | "none" | undefined;
                            stroke?: "foreground" | "none" | undefined;
                            part?: string | undefined;
                            style?: {
                                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                strokeWidth?: number | undefined;
                                lineCap?: "butt" | "round" | "square" | undefined;
                                lineJoin?: "bevel" | "miter" | "round" | undefined;
                                miterLimit?: number | undefined;
                            } | undefined;
                        } | {
                            kind: "rectangle";
                            bounds: {
                                x: number;
                                y: number;
                                width: number;
                                height: number;
                            };
                            fillableBody?: true | undefined;
                            fill?: "foreground" | "none" | undefined;
                            stroke?: "foreground" | "none" | undefined;
                            part?: string | undefined;
                            style?: {
                                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                strokeWidth?: number | undefined;
                                lineCap?: "butt" | "round" | "square" | undefined;
                                lineJoin?: "bevel" | "miter" | "round" | undefined;
                                miterLimit?: number | undefined;
                            } | undefined;
                        } | {
                            kind: "path";
                            data: string;
                            fillableBody?: true | undefined;
                            bounds?: {
                                x: number;
                                y: number;
                                width: number;
                                height: number;
                            } | undefined;
                            part?: string | undefined;
                            style?: {
                                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                strokeWidth?: number | undefined;
                                lineCap?: "butt" | "round" | "square" | undefined;
                                lineJoin?: "bevel" | "miter" | "round" | undefined;
                                miterLimit?: number | undefined;
                            } | undefined;
                        } | {
                            kind: "polygon";
                            points: {
                                x: number;
                                y: number;
                            }[];
                            fillableBody?: true | undefined;
                            fill: "foreground" | "none";
                            stroke?: "foreground" | "none" | undefined;
                            part?: string | undefined;
                            style?: {
                                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                strokeWidth?: number | undefined;
                                lineCap?: "butt" | "round" | "square" | undefined;
                                lineJoin?: "bevel" | "miter" | "round" | undefined;
                                miterLimit?: number | undefined;
                            } | undefined;
                        })[];
                        variants: {
                            id: string;
                            hiddenPinNames: string[];
                            auxiliaryPins?: {
                                name: string;
                                at: {
                                    x: number;
                                    y: number;
                                };
                                direction: "east" | "north" | "south" | "west";
                                routing?: {
                                    escape: "outward";
                                    preferredLanding?: {
                                        x: number;
                                        y: number;
                                    } | undefined;
                                } | undefined;
                            }[] | undefined;
                            hiddenPrimitiveParts?: string[] | undefined;
                            additionalPrimitives?: ({
                                kind: "line";
                                from: {
                                    x: number;
                                    y: number;
                                };
                                to: {
                                    x: number;
                                    y: number;
                                };
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            } | {
                                kind: "polyline";
                                points: {
                                    x: number;
                                    y: number;
                                }[];
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            } | {
                                kind: "circle";
                                center: {
                                    x: number;
                                    y: number;
                                };
                                radius: number;
                                fillableBody?: true | undefined;
                                fill?: "foreground" | "none" | undefined;
                                stroke?: "foreground" | "none" | undefined;
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            } | {
                                kind: "rectangle";
                                bounds: {
                                    x: number;
                                    y: number;
                                    width: number;
                                    height: number;
                                };
                                fillableBody?: true | undefined;
                                fill?: "foreground" | "none" | undefined;
                                stroke?: "foreground" | "none" | undefined;
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            } | {
                                kind: "path";
                                data: string;
                                fillableBody?: true | undefined;
                                bounds?: {
                                    x: number;
                                    y: number;
                                    width: number;
                                    height: number;
                                } | undefined;
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            } | {
                                kind: "polygon";
                                points: {
                                    x: number;
                                    y: number;
                                }[];
                                fillableBody?: true | undefined;
                                fill: "foreground" | "none";
                                stroke?: "foreground" | "none" | undefined;
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            })[] | undefined;
                        }[];
                        defaultVariantId?: string | undefined;
                        labelVisibility?: "hidden" | "shown" | undefined;
                        decorative?: boolean | undefined;
                        hierarchicalBlock?: true | undefined;
                        formulaPresentation?: {
                            defaultFormula: string;
                            supportsCoefficient: boolean;
                            center: {
                                x: number;
                                y: number;
                            };
                            fontSize: number;
                            fractionBarWidth?: number | undefined;
                            adaptiveFrame?: {
                                shape?: "rectangle" | "right-tapered-trapezoid" | undefined;
                                minBodyWidth: number;
                                minBodyHeight: number;
                                horizontalPadding: number;
                                verticalPadding: number;
                                leadLength: number;
                            } | undefined;
                        } | undefined;
                    };
                    generatedFrom?: {
                        name: string;
                        terminals: {
                            id: string;
                            name: string;
                            direction: "inout" | "input" | "output" | "passive";
                            nameContent?: import("@icm/model").RichTextDocument | undefined;
                        }[];
                        presentation?: {
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
                    } | undefined;
                    electrical?: {
                        id: string;
                        symbolId: string;
                        deviceClass: "bjt" | "capacitor" | "cccs" | "ccvs" | "current-source" | "diode" | "inductor" | "jfet" | "mos" | "net-marker" | "resistor" | "switch" | "vccs" | "vcvs" | "voltage-source";
                        mosBulkClass?: "nmos" | "pmos" | undefined;
                        referencePrefix: string | null;
                        pinOrder: string[];
                        seriesInsertionPinPair?: [string, string] | undefined;
                        pinSemantics?: {
                            pinName: string;
                            role: "capacitor-bottom-plate" | "capacitor-top-plate";
                        }[] | undefined;
                        targetPolicy: "builtin" | "child-cell" | "none" | "required-model";
                        sourceWaveformDefault?: "dc" | "pulse" | "pwl" | "sin" | undefined;
                        parameters: {
                            name: string;
                            label: string;
                            required: boolean;
                            editor: "decimal" | "select" | "text";
                            options?: {
                                value: string;
                                label: string;
                            }[] | undefined;
                            visibleForSourceWaveforms?: ("pulse" | "pwl" | "sin")[] | undefined;
                            unitHint?: string | undefined;
                            placeholder: string;
                            help: string;
                            authoringVisibility?: "compatibility" | "primary" | undefined;
                            defaultValue?: string | undefined;
                            displayRole: "finger-count" | "length" | "multiplier" | "none" | "value" | "width";
                        }[];
                        dialects: ["spice", "spectre"];
                        capabilities: {
                            supportsModel: boolean;
                            supportsBulkBinding: boolean;
                            supportsValueAnnotation: boolean;
                        };
                    } | undefined;
                    subcircuit?: {
                        id: string;
                        symbolId: string;
                        target: string;
                        ports: ({
                            name: string;
                            direction: "inout" | "input" | "output" | "passive";
                            pinName: string;
                        } | {
                            name: string;
                            direction: "inout" | "input" | "output" | "passive";
                            supply: "VDD" | "VSS";
                        })[];
                    } | undefined;
                    circuitBinding?: {
                        definitionId: string;
                        terminals: ({
                            terminalId: string;
                            pinName: string;
                        } | {
                            terminalId: string;
                            supply: "VDD" | "VSS";
                        })[];
                    } | undefined;
                    libraryOrigin?: {
                        componentId: string;
                        revision: number;
                        authorId: string;
                        contentVersion: 1;
                        digest: string;
                    } | undefined;
                } | undefined;
                artworkOrigin?: {
                    definitionId: string;
                    terminalIds: Record<string, string>;
                } | undefined;
                terminalDirections?: Record<string, "inout" | "input" | "output" | "passive"> | undefined;
                presentation?: {
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
                portMaps: Record<string, Record<string, string | null>>;
                legacyRepair?: {
                    identity: string;
                    baseline: {
                        symbol: {
                            schemaVersion: 1;
                            id: string;
                            name: string;
                            viewBox: {
                                x: number;
                                y: number;
                                width: number;
                                height: number;
                            };
                            pins: {
                                name: string;
                                signalMembers?: {
                                    id: string;
                                    name: string;
                                }[] | undefined;
                                role: string;
                                at: {
                                    x: number;
                                    y: number;
                                };
                                direction: "east" | "north" | "south" | "west";
                                routing?: {
                                    escape: "outward";
                                    preferredLanding?: {
                                        x: number;
                                        y: number;
                                    } | undefined;
                                } | undefined;
                                presentation: {
                                    visibility: "conditional" | "implicit" | "visible";
                                    leadLength?: number | undefined;
                                    showName?: boolean | undefined;
                                    displayName?: string | undefined;
                                    nameContent?: import("@icm/model").RichTextDocument | undefined;
                                    textStyle?: "math-symbol" | "plain" | undefined;
                                    textSizeScale?: number | undefined;
                                };
                            }[];
                            primitives: ({
                                kind: "line";
                                from: {
                                    x: number;
                                    y: number;
                                };
                                to: {
                                    x: number;
                                    y: number;
                                };
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            } | {
                                kind: "polyline";
                                points: {
                                    x: number;
                                    y: number;
                                }[];
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            } | {
                                kind: "circle";
                                center: {
                                    x: number;
                                    y: number;
                                };
                                radius: number;
                                fillableBody?: true | undefined;
                                fill?: "foreground" | "none" | undefined;
                                stroke?: "foreground" | "none" | undefined;
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            } | {
                                kind: "rectangle";
                                bounds: {
                                    x: number;
                                    y: number;
                                    width: number;
                                    height: number;
                                };
                                fillableBody?: true | undefined;
                                fill?: "foreground" | "none" | undefined;
                                stroke?: "foreground" | "none" | undefined;
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            } | {
                                kind: "path";
                                data: string;
                                fillableBody?: true | undefined;
                                bounds?: {
                                    x: number;
                                    y: number;
                                    width: number;
                                    height: number;
                                } | undefined;
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            } | {
                                kind: "polygon";
                                points: {
                                    x: number;
                                    y: number;
                                }[];
                                fillableBody?: true | undefined;
                                fill: "foreground" | "none";
                                stroke?: "foreground" | "none" | undefined;
                                part?: string | undefined;
                                style?: {
                                    strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                    strokeWidth?: number | undefined;
                                    lineCap?: "butt" | "round" | "square" | undefined;
                                    lineJoin?: "bevel" | "miter" | "round" | undefined;
                                    miterLimit?: number | undefined;
                                } | undefined;
                            })[];
                            variants: {
                                id: string;
                                hiddenPinNames: string[];
                                auxiliaryPins?: {
                                    name: string;
                                    at: {
                                        x: number;
                                        y: number;
                                    };
                                    direction: "east" | "north" | "south" | "west";
                                    routing?: {
                                        escape: "outward";
                                        preferredLanding?: {
                                            x: number;
                                            y: number;
                                        } | undefined;
                                    } | undefined;
                                }[] | undefined;
                                hiddenPrimitiveParts?: string[] | undefined;
                                additionalPrimitives?: ({
                                    kind: "line";
                                    from: {
                                        x: number;
                                        y: number;
                                    };
                                    to: {
                                        x: number;
                                        y: number;
                                    };
                                    part?: string | undefined;
                                    style?: {
                                        strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                        strokeWidth?: number | undefined;
                                        lineCap?: "butt" | "round" | "square" | undefined;
                                        lineJoin?: "bevel" | "miter" | "round" | undefined;
                                        miterLimit?: number | undefined;
                                    } | undefined;
                                } | {
                                    kind: "polyline";
                                    points: {
                                        x: number;
                                        y: number;
                                    }[];
                                    part?: string | undefined;
                                    style?: {
                                        strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                        strokeWidth?: number | undefined;
                                        lineCap?: "butt" | "round" | "square" | undefined;
                                        lineJoin?: "bevel" | "miter" | "round" | undefined;
                                        miterLimit?: number | undefined;
                                    } | undefined;
                                } | {
                                    kind: "circle";
                                    center: {
                                        x: number;
                                        y: number;
                                    };
                                    radius: number;
                                    fillableBody?: true | undefined;
                                    fill?: "foreground" | "none" | undefined;
                                    stroke?: "foreground" | "none" | undefined;
                                    part?: string | undefined;
                                    style?: {
                                        strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                        strokeWidth?: number | undefined;
                                        lineCap?: "butt" | "round" | "square" | undefined;
                                        lineJoin?: "bevel" | "miter" | "round" | undefined;
                                        miterLimit?: number | undefined;
                                    } | undefined;
                                } | {
                                    kind: "rectangle";
                                    bounds: {
                                        x: number;
                                        y: number;
                                        width: number;
                                        height: number;
                                    };
                                    fillableBody?: true | undefined;
                                    fill?: "foreground" | "none" | undefined;
                                    stroke?: "foreground" | "none" | undefined;
                                    part?: string | undefined;
                                    style?: {
                                        strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                        strokeWidth?: number | undefined;
                                        lineCap?: "butt" | "round" | "square" | undefined;
                                        lineJoin?: "bevel" | "miter" | "round" | undefined;
                                        miterLimit?: number | undefined;
                                    } | undefined;
                                } | {
                                    kind: "path";
                                    data: string;
                                    fillableBody?: true | undefined;
                                    bounds?: {
                                        x: number;
                                        y: number;
                                        width: number;
                                        height: number;
                                    } | undefined;
                                    part?: string | undefined;
                                    style?: {
                                        strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                        strokeWidth?: number | undefined;
                                        lineCap?: "butt" | "round" | "square" | undefined;
                                        lineJoin?: "bevel" | "miter" | "round" | undefined;
                                        miterLimit?: number | undefined;
                                    } | undefined;
                                } | {
                                    kind: "polygon";
                                    points: {
                                        x: number;
                                        y: number;
                                    }[];
                                    fillableBody?: true | undefined;
                                    fill: "foreground" | "none";
                                    stroke?: "foreground" | "none" | undefined;
                                    part?: string | undefined;
                                    style?: {
                                        strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                                        strokeWidth?: number | undefined;
                                        lineCap?: "butt" | "round" | "square" | undefined;
                                        lineJoin?: "bevel" | "miter" | "round" | undefined;
                                        miterLimit?: number | undefined;
                                    } | undefined;
                                })[] | undefined;
                            }[];
                            defaultVariantId?: string | undefined;
                            labelVisibility?: "hidden" | "shown" | undefined;
                            decorative?: boolean | undefined;
                            hierarchicalBlock?: true | undefined;
                            formulaPresentation?: {
                                defaultFormula: string;
                                supportsCoefficient: boolean;
                                center: {
                                    x: number;
                                    y: number;
                                };
                                fontSize: number;
                                fractionBarWidth?: number | undefined;
                                adaptiveFrame?: {
                                    shape?: "rectangle" | "right-tapered-trapezoid" | undefined;
                                    minBodyWidth: number;
                                    minBodyHeight: number;
                                    horizontalPadding: number;
                                    verticalPadding: number;
                                    leadLength: number;
                                } | undefined;
                            } | undefined;
                        };
                        generatedFrom?: {
                            name: string;
                            terminals: {
                                id: string;
                                name: string;
                                direction: "inout" | "input" | "output" | "passive";
                                nameContent?: import("@icm/model").RichTextDocument | undefined;
                            }[];
                            presentation?: {
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
                        } | undefined;
                        electrical?: {
                            id: string;
                            symbolId: string;
                            deviceClass: "bjt" | "capacitor" | "cccs" | "ccvs" | "current-source" | "diode" | "inductor" | "jfet" | "mos" | "net-marker" | "resistor" | "switch" | "vccs" | "vcvs" | "voltage-source";
                            mosBulkClass?: "nmos" | "pmos" | undefined;
                            referencePrefix: string | null;
                            pinOrder: string[];
                            seriesInsertionPinPair?: [string, string] | undefined;
                            pinSemantics?: {
                                pinName: string;
                                role: "capacitor-bottom-plate" | "capacitor-top-plate";
                            }[] | undefined;
                            targetPolicy: "builtin" | "child-cell" | "none" | "required-model";
                            sourceWaveformDefault?: "dc" | "pulse" | "pwl" | "sin" | undefined;
                            parameters: {
                                name: string;
                                label: string;
                                required: boolean;
                                editor: "decimal" | "select" | "text";
                                options?: {
                                    value: string;
                                    label: string;
                                }[] | undefined;
                                visibleForSourceWaveforms?: ("pulse" | "pwl" | "sin")[] | undefined;
                                unitHint?: string | undefined;
                                placeholder: string;
                                help: string;
                                authoringVisibility?: "compatibility" | "primary" | undefined;
                                defaultValue?: string | undefined;
                                displayRole: "finger-count" | "length" | "multiplier" | "none" | "value" | "width";
                            }[];
                            dialects: ["spice", "spectre"];
                            capabilities: {
                                supportsModel: boolean;
                                supportsBulkBinding: boolean;
                                supportsValueAnnotation: boolean;
                            };
                        } | undefined;
                        subcircuit?: {
                            id: string;
                            symbolId: string;
                            target: string;
                            ports: ({
                                name: string;
                                direction: "inout" | "input" | "output" | "passive";
                                pinName: string;
                            } | {
                                name: string;
                                direction: "inout" | "input" | "output" | "passive";
                                supply: "VDD" | "VSS";
                            })[];
                        } | undefined;
                        circuitBinding?: {
                            definitionId: string;
                            terminals: ({
                                terminalId: string;
                                pinName: string;
                            } | {
                                terminalId: string;
                                supply: "VDD" | "VSS";
                            })[];
                        } | undefined;
                        libraryOrigin?: {
                            componentId: string;
                            revision: number;
                            authorId: string;
                            contentVersion: 1;
                            digest: string;
                        } | undefined;
                    };
                    selected?: {
                        documentId: string;
                        instanceId: string;
                    } | undefined;
                    disconnectPorts?: string[] | undefined;
                    useAppliedSource?: boolean | undefined;
                } | undefined;
            }[] | undefined;
            dependencies?: {
                id: string;
                mountPath: string;
                sha256: string;
            }[] | undefined;
        } | undefined;
        files: {
            path: string;
            text: string;
        }[];
    };
    names: Map<string, string>;
};
