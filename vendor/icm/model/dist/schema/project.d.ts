import { z } from "zod";
export declare const ComponentAuthoringDraftSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    baselineSymbolId: z.ZodOptional<z.ZodString>;
    library: z.ZodOptional<z.ZodObject<{
        componentId: z.ZodString;
        revision: z.ZodNumber;
    }, z.core.$strict>>;
    target: z.ZodOptional<z.ZodObject<{
        documentId: z.ZodString;
        instanceId: z.ZodString;
        expectedSymbolId: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ComponentAuthoringDraft = z.infer<typeof ComponentAuthoringDraftSchema>;
export declare const ExternalSubcircuitDefinitionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    libraryOrigin: z.ZodOptional<z.ZodObject<{
        componentId: z.ZodString;
        revision: z.ZodNumber;
        authorId: z.ZodString;
        contentVersion: z.ZodLiteral<1>;
        digest: z.ZodString;
    }, z.core.$strict>>;
    terminals: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        direction: z.ZodEnum<{
            inout: "inout";
            input: "input";
            output: "output";
            passive: "passive";
        }>;
    }, z.core.$strict>>;
    formalParameters: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        defaultValue: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    interfaceStatus: z.ZodEnum<{
        declared: "declared";
        "inferred-positional": "inferred-positional";
    }>;
    presentation: z.ZodOptional<z.ZodObject<{
        minimumBodySize: z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>>;
        bodyBounds: z.ZodOptional<z.ZodObject<{
            left: z.ZodNumber;
            right: z.ZodNumber;
            top: z.ZodNumber;
            bottom: z.ZodNumber;
        }, z.core.$strict>>;
        pinPlacements: z.ZodOptional<z.ZodArray<z.ZodObject<{
            terminalId: z.ZodString;
            side: z.ZodEnum<{
                east: "east";
                north: "north";
                south: "south";
                west: "west";
            }>;
            offset: z.ZodNumber;
        }, z.core.$strict>>>;
        artwork: z.ZodOptional<z.ZodType<import("./presentation.js").CellSymbolArtwork, unknown, z.core.$ZodTypeInternals<import("./presentation.js").CellSymbolArtwork, unknown>>>;
    }, z.core.$strict>>;
    symbolId: z.ZodOptional<z.ZodString>;
    implementation: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        sourceId: z.ZodString;
        entry: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"placeholder">;
        sourceId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "kind">>;
}, z.core.$strict>;
export declare const CircuitProjectSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<58>;
    id: z.ZodString;
    name: z.ZodString;
    source: z.ZodObject<{
        entry: z.ZodNullable<z.ZodString>;
        dialect: z.ZodString;
        sourcePolicy: z.ZodEnum<{
            copy: "copy";
            reference: "reference";
        }>;
        files: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
            hash: z.ZodString;
            content: z.ZodOptional<z.ZodObject<{
                text: z.ZodString;
                encoding: z.ZodEnum<{
                    "utf-16-be": "utf-16-be";
                    "utf-16-le": "utf-16-le";
                    "utf-8": "utf-8";
                    "utf-8-bom": "utf-8-bom";
                }>;
            }, z.core.$strict>>;
            originalContent: z.ZodOptional<z.ZodObject<{
                text: z.ZodString;
                encoding: z.ZodEnum<{
                    "utf-16-be": "utf-16-be";
                    "utf-16-le": "utf-16-le";
                    "utf-8": "utf-8";
                    "utf-8-bom": "utf-8-bom";
                }>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    symbolLibrary: z.ZodObject<{
        id: z.ZodString;
        version: z.ZodString;
        hash: z.ZodString;
    }, z.core.$strict>;
    componentDefinitions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        symbol: z.ZodObject<{
            schemaVersion: z.ZodLiteral<1>;
            id: z.ZodString;
            name: z.ZodString;
            viewBox: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>;
            pins: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                signalMembers: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    name: z.ZodString;
                }, z.core.$strict>>>;
                role: z.ZodString;
                at: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
                direction: z.ZodEnum<{
                    east: "east";
                    north: "north";
                    south: "south";
                    west: "west";
                }>;
                routing: z.ZodOptional<z.ZodObject<{
                    escape: z.ZodLiteral<"outward">;
                    preferredLanding: z.ZodOptional<z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                presentation: z.ZodObject<{
                    visibility: z.ZodEnum<{
                        conditional: "conditional";
                        implicit: "implicit";
                        visible: "visible";
                    }>;
                    leadLength: z.ZodOptional<z.ZodNumber>;
                    showName: z.ZodOptional<z.ZodBoolean>;
                    displayName: z.ZodOptional<z.ZodString>;
                    nameContent: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
                    textStyle: z.ZodOptional<z.ZodEnum<{
                        "math-symbol": "math-symbol";
                        plain: "plain";
                    }>>;
                    textSizeScale: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            primitives: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"line">;
                from: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
                to: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
                part: z.ZodOptional<z.ZodString>;
                style: z.ZodOptional<z.ZodObject<{
                    strokeRole: z.ZodOptional<z.ZodEnum<{
                        annotation: "annotation";
                        emphasis: "emphasis";
                        ground: "ground";
                        normal: "normal";
                        supply: "supply";
                    }>>;
                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                    lineCap: z.ZodOptional<z.ZodEnum<{
                        butt: "butt";
                        round: "round";
                        square: "square";
                    }>>;
                    lineJoin: z.ZodOptional<z.ZodEnum<{
                        bevel: "bevel";
                        miter: "miter";
                        round: "round";
                    }>>;
                    miterLimit: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"polyline">;
                points: z.ZodArray<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>;
                part: z.ZodOptional<z.ZodString>;
                style: z.ZodOptional<z.ZodObject<{
                    strokeRole: z.ZodOptional<z.ZodEnum<{
                        annotation: "annotation";
                        emphasis: "emphasis";
                        ground: "ground";
                        normal: "normal";
                        supply: "supply";
                    }>>;
                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                    lineCap: z.ZodOptional<z.ZodEnum<{
                        butt: "butt";
                        round: "round";
                        square: "square";
                    }>>;
                    lineJoin: z.ZodOptional<z.ZodEnum<{
                        bevel: "bevel";
                        miter: "miter";
                        round: "round";
                    }>>;
                    miterLimit: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"circle">;
                center: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
                radius: z.ZodNumber;
                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                fill: z.ZodOptional<z.ZodEnum<{
                    foreground: "foreground";
                    none: "none";
                }>>;
                stroke: z.ZodOptional<z.ZodEnum<{
                    foreground: "foreground";
                    none: "none";
                }>>;
                part: z.ZodOptional<z.ZodString>;
                style: z.ZodOptional<z.ZodObject<{
                    strokeRole: z.ZodOptional<z.ZodEnum<{
                        annotation: "annotation";
                        emphasis: "emphasis";
                        ground: "ground";
                        normal: "normal";
                        supply: "supply";
                    }>>;
                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                    lineCap: z.ZodOptional<z.ZodEnum<{
                        butt: "butt";
                        round: "round";
                        square: "square";
                    }>>;
                    lineJoin: z.ZodOptional<z.ZodEnum<{
                        bevel: "bevel";
                        miter: "miter";
                        round: "round";
                    }>>;
                    miterLimit: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"rectangle">;
                bounds: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                }, z.core.$strict>;
                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                fill: z.ZodOptional<z.ZodEnum<{
                    foreground: "foreground";
                    none: "none";
                }>>;
                stroke: z.ZodOptional<z.ZodEnum<{
                    foreground: "foreground";
                    none: "none";
                }>>;
                part: z.ZodOptional<z.ZodString>;
                style: z.ZodOptional<z.ZodObject<{
                    strokeRole: z.ZodOptional<z.ZodEnum<{
                        annotation: "annotation";
                        emphasis: "emphasis";
                        ground: "ground";
                        normal: "normal";
                        supply: "supply";
                    }>>;
                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                    lineCap: z.ZodOptional<z.ZodEnum<{
                        butt: "butt";
                        round: "round";
                        square: "square";
                    }>>;
                    lineJoin: z.ZodOptional<z.ZodEnum<{
                        bevel: "bevel";
                        miter: "miter";
                        round: "round";
                    }>>;
                    miterLimit: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"path">;
                data: z.ZodString;
                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                bounds: z.ZodOptional<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                }, z.core.$strict>>;
                part: z.ZodOptional<z.ZodString>;
                style: z.ZodOptional<z.ZodObject<{
                    strokeRole: z.ZodOptional<z.ZodEnum<{
                        annotation: "annotation";
                        emphasis: "emphasis";
                        ground: "ground";
                        normal: "normal";
                        supply: "supply";
                    }>>;
                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                    lineCap: z.ZodOptional<z.ZodEnum<{
                        butt: "butt";
                        round: "round";
                        square: "square";
                    }>>;
                    lineJoin: z.ZodOptional<z.ZodEnum<{
                        bevel: "bevel";
                        miter: "miter";
                        round: "round";
                    }>>;
                    miterLimit: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"polygon">;
                points: z.ZodArray<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>;
                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                fill: z.ZodEnum<{
                    foreground: "foreground";
                    none: "none";
                }>;
                stroke: z.ZodOptional<z.ZodEnum<{
                    foreground: "foreground";
                    none: "none";
                }>>;
                part: z.ZodOptional<z.ZodString>;
                style: z.ZodOptional<z.ZodObject<{
                    strokeRole: z.ZodOptional<z.ZodEnum<{
                        annotation: "annotation";
                        emphasis: "emphasis";
                        ground: "ground";
                        normal: "normal";
                        supply: "supply";
                    }>>;
                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                    lineCap: z.ZodOptional<z.ZodEnum<{
                        butt: "butt";
                        round: "round";
                        square: "square";
                    }>>;
                    lineJoin: z.ZodOptional<z.ZodEnum<{
                        bevel: "bevel";
                        miter: "miter";
                        round: "round";
                    }>>;
                    miterLimit: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
            }, z.core.$strict>], "kind">>;
            variants: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                hiddenPinNames: z.ZodArray<z.ZodString>;
                auxiliaryPins: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    at: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    direction: z.ZodEnum<{
                        east: "east";
                        north: "north";
                        south: "south";
                        west: "west";
                    }>;
                    routing: z.ZodOptional<z.ZodObject<{
                        escape: z.ZodLiteral<"outward">;
                        preferredLanding: z.ZodOptional<z.ZodObject<{
                            x: z.ZodNumber;
                            y: z.ZodNumber;
                        }, z.core.$strict>>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>>;
                hiddenPrimitiveParts: z.ZodOptional<z.ZodArray<z.ZodString>>;
                additionalPrimitives: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"line">;
                    from: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    to: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    part: z.ZodOptional<z.ZodString>;
                    style: z.ZodOptional<z.ZodObject<{
                        strokeRole: z.ZodOptional<z.ZodEnum<{
                            annotation: "annotation";
                            emphasis: "emphasis";
                            ground: "ground";
                            normal: "normal";
                            supply: "supply";
                        }>>;
                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                        lineCap: z.ZodOptional<z.ZodEnum<{
                            butt: "butt";
                            round: "round";
                            square: "square";
                        }>>;
                        lineJoin: z.ZodOptional<z.ZodEnum<{
                            bevel: "bevel";
                            miter: "miter";
                            round: "round";
                        }>>;
                        miterLimit: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"polyline">;
                    points: z.ZodArray<z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>>;
                    part: z.ZodOptional<z.ZodString>;
                    style: z.ZodOptional<z.ZodObject<{
                        strokeRole: z.ZodOptional<z.ZodEnum<{
                            annotation: "annotation";
                            emphasis: "emphasis";
                            ground: "ground";
                            normal: "normal";
                            supply: "supply";
                        }>>;
                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                        lineCap: z.ZodOptional<z.ZodEnum<{
                            butt: "butt";
                            round: "round";
                            square: "square";
                        }>>;
                        lineJoin: z.ZodOptional<z.ZodEnum<{
                            bevel: "bevel";
                            miter: "miter";
                            round: "round";
                        }>>;
                        miterLimit: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"circle">;
                    center: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    radius: z.ZodNumber;
                    fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                    fill: z.ZodOptional<z.ZodEnum<{
                        foreground: "foreground";
                        none: "none";
                    }>>;
                    stroke: z.ZodOptional<z.ZodEnum<{
                        foreground: "foreground";
                        none: "none";
                    }>>;
                    part: z.ZodOptional<z.ZodString>;
                    style: z.ZodOptional<z.ZodObject<{
                        strokeRole: z.ZodOptional<z.ZodEnum<{
                            annotation: "annotation";
                            emphasis: "emphasis";
                            ground: "ground";
                            normal: "normal";
                            supply: "supply";
                        }>>;
                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                        lineCap: z.ZodOptional<z.ZodEnum<{
                            butt: "butt";
                            round: "round";
                            square: "square";
                        }>>;
                        lineJoin: z.ZodOptional<z.ZodEnum<{
                            bevel: "bevel";
                            miter: "miter";
                            round: "round";
                        }>>;
                        miterLimit: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"rectangle">;
                    bounds: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                        width: z.ZodNumber;
                        height: z.ZodNumber;
                    }, z.core.$strict>;
                    fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                    fill: z.ZodOptional<z.ZodEnum<{
                        foreground: "foreground";
                        none: "none";
                    }>>;
                    stroke: z.ZodOptional<z.ZodEnum<{
                        foreground: "foreground";
                        none: "none";
                    }>>;
                    part: z.ZodOptional<z.ZodString>;
                    style: z.ZodOptional<z.ZodObject<{
                        strokeRole: z.ZodOptional<z.ZodEnum<{
                            annotation: "annotation";
                            emphasis: "emphasis";
                            ground: "ground";
                            normal: "normal";
                            supply: "supply";
                        }>>;
                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                        lineCap: z.ZodOptional<z.ZodEnum<{
                            butt: "butt";
                            round: "round";
                            square: "square";
                        }>>;
                        lineJoin: z.ZodOptional<z.ZodEnum<{
                            bevel: "bevel";
                            miter: "miter";
                            round: "round";
                        }>>;
                        miterLimit: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"path">;
                    data: z.ZodString;
                    fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                    bounds: z.ZodOptional<z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                        width: z.ZodNumber;
                        height: z.ZodNumber;
                    }, z.core.$strict>>;
                    part: z.ZodOptional<z.ZodString>;
                    style: z.ZodOptional<z.ZodObject<{
                        strokeRole: z.ZodOptional<z.ZodEnum<{
                            annotation: "annotation";
                            emphasis: "emphasis";
                            ground: "ground";
                            normal: "normal";
                            supply: "supply";
                        }>>;
                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                        lineCap: z.ZodOptional<z.ZodEnum<{
                            butt: "butt";
                            round: "round";
                            square: "square";
                        }>>;
                        lineJoin: z.ZodOptional<z.ZodEnum<{
                            bevel: "bevel";
                            miter: "miter";
                            round: "round";
                        }>>;
                        miterLimit: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"polygon">;
                    points: z.ZodArray<z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>>;
                    fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                    fill: z.ZodEnum<{
                        foreground: "foreground";
                        none: "none";
                    }>;
                    stroke: z.ZodOptional<z.ZodEnum<{
                        foreground: "foreground";
                        none: "none";
                    }>>;
                    part: z.ZodOptional<z.ZodString>;
                    style: z.ZodOptional<z.ZodObject<{
                        strokeRole: z.ZodOptional<z.ZodEnum<{
                            annotation: "annotation";
                            emphasis: "emphasis";
                            ground: "ground";
                            normal: "normal";
                            supply: "supply";
                        }>>;
                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                        lineCap: z.ZodOptional<z.ZodEnum<{
                            butt: "butt";
                            round: "round";
                            square: "square";
                        }>>;
                        lineJoin: z.ZodOptional<z.ZodEnum<{
                            bevel: "bevel";
                            miter: "miter";
                            round: "round";
                        }>>;
                        miterLimit: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>;
                }, z.core.$strict>], "kind">>>;
            }, z.core.$strict>>;
            defaultVariantId: z.ZodOptional<z.ZodString>;
            labelVisibility: z.ZodOptional<z.ZodEnum<{
                hidden: "hidden";
                shown: "shown";
            }>>;
            decorative: z.ZodOptional<z.ZodBoolean>;
            hierarchicalBlock: z.ZodOptional<z.ZodLiteral<true>>;
            formulaPresentation: z.ZodOptional<z.ZodObject<{
                defaultFormula: z.ZodString;
                supportsCoefficient: z.ZodBoolean;
                center: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
                fontSize: z.ZodNumber;
                fractionBarWidth: z.ZodOptional<z.ZodNumber>;
                adaptiveFrame: z.ZodOptional<z.ZodObject<{
                    shape: z.ZodOptional<z.ZodEnum<{
                        rectangle: "rectangle";
                        "right-tapered-trapezoid": "right-tapered-trapezoid";
                    }>>;
                    minBodyWidth: z.ZodNumber;
                    minBodyHeight: z.ZodNumber;
                    horizontalPadding: z.ZodNumber;
                    verticalPadding: z.ZodNumber;
                    leadLength: z.ZodNumber;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        generatedFrom: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            terminals: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                direction: z.ZodEnum<{
                    inout: "inout";
                    input: "input";
                    output: "output";
                    passive: "passive";
                }>;
                nameContent: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
            }, z.core.$strict>>;
            presentation: z.ZodOptional<z.ZodObject<{
                minimumBodySize: z.ZodOptional<z.ZodObject<{
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                }, z.core.$strict>>;
                bodyBounds: z.ZodOptional<z.ZodObject<{
                    left: z.ZodNumber;
                    right: z.ZodNumber;
                    top: z.ZodNumber;
                    bottom: z.ZodNumber;
                }, z.core.$strict>>;
                pinPlacements: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    terminalId: z.ZodString;
                    side: z.ZodEnum<{
                        east: "east";
                        north: "north";
                        south: "south";
                        west: "west";
                    }>;
                    offset: z.ZodNumber;
                }, z.core.$strict>>>;
                artwork: z.ZodOptional<z.ZodType<import("./presentation.js").CellSymbolArtwork, unknown, z.core.$ZodTypeInternals<import("./presentation.js").CellSymbolArtwork, unknown>>>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        electrical: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            symbolId: z.ZodString;
            deviceClass: z.ZodEnum<{
                bjt: "bjt";
                capacitor: "capacitor";
                cccs: "cccs";
                ccvs: "ccvs";
                "current-source": "current-source";
                diode: "diode";
                inductor: "inductor";
                jfet: "jfet";
                mos: "mos";
                "net-marker": "net-marker";
                resistor: "resistor";
                switch: "switch";
                vccs: "vccs";
                vcvs: "vcvs";
                "voltage-source": "voltage-source";
            }>;
            mosBulkClass: z.ZodOptional<z.ZodEnum<{
                nmos: "nmos";
                pmos: "pmos";
            }>>;
            referencePrefix: z.ZodNullable<z.ZodString>;
            pinOrder: z.ZodArray<z.ZodString>;
            seriesInsertionPinPair: z.ZodOptional<z.ZodTuple<[z.ZodString, z.ZodString], null>>;
            pinSemantics: z.ZodOptional<z.ZodArray<z.ZodObject<{
                pinName: z.ZodString;
                role: z.ZodEnum<{
                    "capacitor-bottom-plate": "capacitor-bottom-plate";
                    "capacitor-top-plate": "capacitor-top-plate";
                }>;
            }, z.core.$strict>>>;
            targetPolicy: z.ZodEnum<{
                builtin: "builtin";
                "child-cell": "child-cell";
                none: "none";
                "required-model": "required-model";
            }>;
            sourceWaveformDefault: z.ZodOptional<z.ZodEnum<{
                dc: "dc";
                pulse: "pulse";
                pwl: "pwl";
                sin: "sin";
            }>>;
            parameters: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                label: z.ZodString;
                required: z.ZodBoolean;
                editor: z.ZodEnum<{
                    decimal: "decimal";
                    select: "select";
                    text: "text";
                }>;
                options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                }, z.core.$strict>>>;
                visibleForSourceWaveforms: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    pulse: "pulse";
                    pwl: "pwl";
                    sin: "sin";
                }>>>;
                unitHint: z.ZodOptional<z.ZodString>;
                placeholder: z.ZodString;
                help: z.ZodString;
                authoringVisibility: z.ZodOptional<z.ZodEnum<{
                    compatibility: "compatibility";
                    primary: "primary";
                }>>;
                defaultValue: z.ZodOptional<z.ZodString>;
                displayRole: z.ZodEnum<{
                    "finger-count": "finger-count";
                    length: "length";
                    multiplier: "multiplier";
                    none: "none";
                    value: "value";
                    width: "width";
                }>;
            }, z.core.$strict>>;
            dialects: z.ZodTuple<[z.ZodLiteral<"spice">, z.ZodLiteral<"spectre">], null>;
            capabilities: z.ZodObject<{
                supportsModel: z.ZodBoolean;
                supportsBulkBinding: z.ZodBoolean;
                supportsValueAnnotation: z.ZodBoolean;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        subcircuit: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            symbolId: z.ZodString;
            target: z.ZodString;
            ports: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                name: z.ZodString;
                direction: z.ZodEnum<{
                    inout: "inout";
                    input: "input";
                    output: "output";
                    passive: "passive";
                }>;
                pinName: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                name: z.ZodString;
                direction: z.ZodEnum<{
                    inout: "inout";
                    input: "input";
                    output: "output";
                    passive: "passive";
                }>;
                supply: z.ZodEnum<{
                    VDD: "VDD";
                    VSS: "VSS";
                }>;
            }, z.core.$strict>]>>;
        }, z.core.$strict>>;
        circuitBinding: z.ZodOptional<z.ZodObject<{
            definitionId: z.ZodString;
            terminals: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                terminalId: z.ZodString;
                pinName: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                terminalId: z.ZodString;
                supply: z.ZodEnum<{
                    VDD: "VDD";
                    VSS: "VSS";
                }>;
            }, z.core.$strict>]>>;
        }, z.core.$strict>>;
        libraryOrigin: z.ZodOptional<z.ZodObject<{
            componentId: z.ZodString;
            revision: z.ZodNumber;
            authorId: z.ZodString;
            contentVersion: z.ZodLiteral<1>;
            digest: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    componentAuthoringDrafts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        baselineSymbolId: z.ZodOptional<z.ZodString>;
        library: z.ZodOptional<z.ZodObject<{
            componentId: z.ZodString;
            revision: z.ZodNumber;
        }, z.core.$strict>>;
        target: z.ZodOptional<z.ZodObject<{
            documentId: z.ZodString;
            instanceId: z.ZodString;
            expectedSymbolId: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    structureRevision: z.ZodNumber;
    topDocumentId: z.ZodString;
    documents: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        revision: z.ZodNumber;
        sourceBinding: z.ZodOptional<z.ZodObject<{
            cellName: z.ZodString;
            sourceRef: z.ZodObject<{
                fileId: z.ZodString;
                start: z.ZodObject<{
                    offset: z.ZodNumber;
                    line: z.ZodNumber;
                    column: z.ZodNumber;
                }, z.core.$strict>;
                end: z.ZodObject<{
                    offset: z.ZodNumber;
                    line: z.ZodNumber;
                    column: z.ZodNumber;
                }, z.core.$strict>;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        importReference: z.ZodOptional<z.ZodObject<{
            files: z.ZodDefault<z.ZodArray<z.ZodObject<{
                fileId: z.ZodString;
            }, z.core.$strict>>>;
            nets: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                scope: z.ZodEnum<{
                    global: "global";
                    local: "local";
                }>;
                terminals: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                    instanceId: z.ZodString;
                    sourcePosition: z.ZodNumber;
                }, z.core.$strict>, z.ZodObject<{
                    instanceId: z.ZodString;
                    pinName: z.ZodString;
                }, z.core.$strict>]>>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        sourceStatus: z.ZodEnum<{
            "connectivity-modified": "connectivity-modified";
            "geometry-only-changed": "geometry-only-changed";
            "in-sync": "in-sync";
        }>;
        netlist: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            terminals: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                name: z.ZodString;
                netId: z.ZodString;
                direction: z.ZodEnum<{
                    inout: "inout";
                    input: "input";
                    output: "output";
                    passive: "passive";
                }>;
                interfaceInstanceIds: z.ZodArray<z.ZodString>;
                interfaceAnnotationId: z.ZodOptional<z.ZodString>;
                signal: z.ZodOptional<z.ZodObject<{
                    expression: z.ZodString;
                    members: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        name: z.ZodString;
                        netId: z.ZodString;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            formalParameters: z.ZodDefault<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                defaultValue: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>>;
        }, z.core.$strict>>;
        instances: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            symbolId: z.ZodString;
            symbolVariantId: z.ZodOptional<z.ZodString>;
            sourceRef: z.ZodOptional<z.ZodObject<{
                fileId: z.ZodString;
                start: z.ZodObject<{
                    offset: z.ZodNumber;
                    line: z.ZodNumber;
                    column: z.ZodNumber;
                }, z.core.$strict>;
                end: z.ZodObject<{
                    offset: z.ZodNumber;
                    line: z.ZodNumber;
                    column: z.ZodNumber;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            importProvenance: z.ZodOptional<z.ZodObject<{
                kind: z.ZodEnum<{
                    model: "model";
                    opaque: "opaque";
                    primitive: "primitive";
                    subcircuit: "subcircuit";
                }>;
                sourceMasterName: z.ZodString;
                sourceTarget: z.ZodString;
                status: z.ZodOptional<z.ZodEnum<{
                    missing: "missing";
                    resolved: "resolved";
                    unsupported: "unsupported";
                }>>;
                modelType: z.ZodOptional<z.ZodString>;
                symbolMappingRegistryId: z.ZodOptional<z.ZodString>;
                terminalMapping: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    sourcePosition: z.ZodNumber;
                    pinName: z.ZodString;
                }, z.core.$strict>>>;
            }, z.core.$strict>>;
            mosBulkBinding: z.ZodOptional<z.ZodObject<{
                origin: z.ZodEnum<{
                    "cell-default": "cell-default";
                    "instance-override": "instance-override";
                    "supply-default": "supply-default";
                }>;
                netId: z.ZodString;
            }, z.core.$strict>>;
            placement: z.ZodNullable<z.ZodObject<{
                position: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
                rotation: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<45>, z.ZodLiteral<90>, z.ZodLiteral<135>, z.ZodLiteral<180>, z.ZodLiteral<225>, z.ZodLiteral<270>, z.ZodLiteral<315>]>;
                mirror: z.ZodEnum<{
                    both: "both";
                    horizontal: "horizontal";
                    none: "none";
                    vertical: "vertical";
                }>;
            }, z.core.$strict>>;
            reference: z.ZodOptional<z.ZodString>;
            netlist: z.ZodOptional<z.ZodObject<{
                binding: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"primitive">;
                    deviceClass: z.ZodEnum<{
                        bjt: "bjt";
                        capacitor: "capacitor";
                        cccs: "cccs";
                        ccvs: "ccvs";
                        "current-source": "current-source";
                        diode: "diode";
                        inductor: "inductor";
                        jfet: "jfet";
                        mos: "mos";
                        "net-marker": "net-marker";
                        resistor: "resistor";
                        switch: "switch";
                        vccs: "vccs";
                        vcvs: "vcvs";
                        "voltage-source": "voltage-source";
                    }>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"model">;
                    deviceClass: z.ZodEnum<{
                        bjt: "bjt";
                        capacitor: "capacitor";
                        cccs: "cccs";
                        ccvs: "ccvs";
                        "current-source": "current-source";
                        diode: "diode";
                        inductor: "inductor";
                        jfet: "jfet";
                        mos: "mos";
                        "net-marker": "net-marker";
                        resistor: "resistor";
                        switch: "switch";
                        vccs: "vccs";
                        vcvs: "vcvs";
                        "voltage-source": "voltage-source";
                    }>;
                    name: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"subcircuit">;
                    childDocumentId: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"external-subcircuit">;
                    definitionId: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"unresolved-subcircuit">;
                    name: z.ZodString;
                }, z.core.$strict>], "kind">>;
                control: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"voltage">;
                    positiveNetId: z.ZodOptional<z.ZodString>;
                    negativeNetId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"current">;
                    sensorInstanceId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"terminal-current">;
                    instanceId: z.ZodOptional<z.ZodString>;
                    pinName: z.ZodOptional<z.ZodString>;
                    direction: z.ZodEnum<{
                        into: "into";
                        out: "out";
                    }>;
                }, z.core.$strict>], "kind">>;
                parameters: z.ZodRecord<z.ZodString, z.ZodString>;
            }, z.core.$strict>>;
            styleOverride: z.ZodOptional<z.ZodObject<{
                foreground: z.ZodOptional<z.ZodString>;
                background: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            bodyFill: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"background">;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"color">;
                color: z.ZodString;
            }, z.core.$strict>], "kind">>;
            documentStyle: z.ZodOptional<z.ZodObject<{
                fontScale: z.ZodOptional<z.ZodNumber>;
                wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
            signalFlowParameters: z.ZodOptional<z.ZodObject<{
                formula: z.ZodOptional<z.ZodString>;
                formulaFormat: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
                coefficient: z.ZodOptional<z.ZodString>;
                bodyWidth: z.ZodOptional<z.ZodNumber>;
                bodyHeight: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        nets: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            terminals: z.ZodArray<z.ZodObject<{
                instanceId: z.ZodString;
                pinName: z.ZodString;
                memberId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        connectivityEvidence: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodLiteral<"name-claim">;
            netId: z.ZodString;
            name: z.ZodString;
            signal: z.ZodOptional<z.ZodObject<{
                expression: z.ZodString;
                members: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    name: z.ZodString;
                    netId: z.ZodString;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            owner: z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"net-label">;
                annotationId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"power-marker">;
                objectId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"global-declaration">;
                sourceNetId: z.ZodString;
            }, z.core.$strict>], "kind">;
            scope: z.ZodEnum<{
                global: "global";
                local: "local";
            }>;
            powerDomain: z.ZodOptional<z.ZodEnum<{
                ground: "ground";
                vdd: "vdd";
            }>>;
        }, z.core.$strict>, z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodLiteral<"spice-source">;
            netId: z.ZodString;
            sourceNetId: z.ZodString;
            sourceRef: z.ZodOptional<z.ZodObject<{
                fileId: z.ZodString;
                start: z.ZodObject<{
                    offset: z.ZodNumber;
                    line: z.ZodNumber;
                    column: z.ZodNumber;
                }, z.core.$strict>;
                end: z.ZodObject<{
                    offset: z.ZodNumber;
                    line: z.ZodNumber;
                    column: z.ZodNumber;
                }, z.core.$strict>;
            }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodLiteral<"net-name-hint">;
            netId: z.ZodString;
            sourceName: z.ZodString;
            origin: z.ZodEnum<{
                "legacy-explicit-net-property": "legacy-explicit-net-property";
                "spice-import": "spice-import";
            }>;
        }, z.core.$strict>], "kind">>;
        routes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            netId: z.ZodString;
            start: z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"terminal">;
                instanceId: z.ZodString;
                pinName: z.ZodString;
                memberId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"junction">;
                junctionId: z.ZodString;
                memberId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>], "kind">;
            members: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                netId: z.ZodString;
                startMemberId: z.ZodString;
                endMemberId: z.ZodString;
            }, z.core.$strict>>>;
            legs: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                to: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"bend">;
                    bendId: z.ZodString;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"endpoint">;
                    endpoint: z.ZodDiscriminatedUnion<[z.ZodObject<{
                        kind: z.ZodLiteral<"terminal">;
                        instanceId: z.ZodString;
                        pinName: z.ZodString;
                        memberId: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>, z.ZodObject<{
                        kind: z.ZodLiteral<"junction">;
                        junctionId: z.ZodString;
                        memberId: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>], "kind">;
                }, z.core.$strict>], "kind">;
                mode: z.ZodEnum<{
                    auto: "auto";
                    escape: "escape";
                    locked: "locked";
                    manual: "manual";
                    trunk: "trunk";
                }>;
            }, z.core.$strict>>;
            presentation: z.ZodOptional<z.ZodEnum<{
                "bulk-dashed": "bulk-dashed";
                "power-rail": "power-rail";
                wire: "wire";
            }>>;
            styleOverride: z.ZodOptional<z.ZodObject<{
                color: z.ZodOptional<z.ZodString>;
                lineStyle: z.ZodOptional<z.ZodEnum<{
                    dashed: "dashed";
                    dotted: "dotted";
                    solid: "solid";
                }>>;
                arrow: z.ZodOptional<z.ZodEnum<{
                    end: "end";
                    middle: "middle";
                }>>;
            }, z.core.$strict>>;
            documentStyle: z.ZodOptional<z.ZodObject<{
                fontScale: z.ZodOptional<z.ZodNumber>;
                wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        junctions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            netId: z.ZodString;
            members: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                netId: z.ZodString;
            }, z.core.$strict>>>;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strict>;
            role: z.ZodOptional<z.ZodEnum<{
                branch: "branch";
                "label-anchor": "label-anchor";
                "route-anchor": "route-anchor";
                "style-anchor": "style-anchor";
            }>>;
            styleOverride: z.ZodOptional<z.ZodObject<{
                color: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            contactAnchor: z.ZodOptional<z.ZodObject<{
                instanceId: z.ZodString;
                pinName: z.ZodString;
                memberId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            documentStyle: z.ZodOptional<z.ZodObject<{
                fontScale: z.ZodOptional<z.ZodNumber>;
                wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        annotations: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<{
                "instance-label": "instance-label";
                "instance-value": "instance-value";
                "net-label": "net-label";
                "power-label": "power-label";
                "route-marker": "route-marker";
            }>;
            content: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
            binding: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"instance-reference">;
                instanceId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"instance-value">;
                instanceId: z.ZodString;
                parameter: z.ZodOptional<z.ZodString>;
                showValue: z.ZodOptional<z.ZodLiteral<false>>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"net-name">;
                netId: z.ZodString;
                memberEndpoint: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"terminal">;
                    instanceId: z.ZodString;
                    pinName: z.ZodString;
                    memberId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"junction">;
                    junctionId: z.ZodString;
                    memberId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>], "kind">>;
                memberEndpoints: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"terminal">;
                    instanceId: z.ZodString;
                    pinName: z.ZodString;
                    memberId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"junction">;
                    junctionId: z.ZodString;
                    memberId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>], "kind">>>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"cell-terminal-name">;
                terminalId: z.ZodString;
            }, z.core.$strict>], "kind">>;
            formatOverride: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
            anchor: z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"free">;
                position: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"object">;
                objectId: z.ZodString;
                localOffset: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
                fallbackPosition: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"route">;
                routeId: z.ZodString;
                legId: z.ZodString;
                t: z.ZodNumber;
                normalOffset: z.ZodNumber;
                direction: z.ZodEnum<{
                    forward: "forward";
                    reverse: "reverse";
                }>;
                orientation: z.ZodEnum<{
                    follow: "follow";
                    horizontal: "horizontal";
                }>;
                fallbackPosition: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
            }, z.core.$strict>], "kind">;
            netId: z.ZodOptional<z.ZodString>;
            alignment: z.ZodEnum<{
                end: "end";
                middle: "middle";
                start: "start";
            }>;
            rotation: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<45>, z.ZodLiteral<90>, z.ZodLiteral<135>, z.ZodLiteral<180>, z.ZodLiteral<225>, z.ZodLiteral<270>, z.ZodLiteral<315>]>;
            locked: z.ZodBoolean;
            sizeScale: z.ZodOptional<z.ZodNumber>;
            markerKind: z.ZodOptional<z.ZodEnum<{
                current: "current";
                voltage: "voltage";
            }>>;
            visible: z.ZodOptional<z.ZodBoolean>;
            textColor: z.ZodOptional<z.ZodString>;
            documentStyle: z.ZodOptional<z.ZodObject<{
                fontScale: z.ZodOptional<z.ZodNumber>;
                wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        presentation: z.ZodObject<{
            styleProfileId: z.ZodString;
            grid: z.ZodNumber;
            compactness: z.ZodEnum<{
                compact: "compact";
                loose: "loose";
                normal: "normal";
            }>;
            styleOverrides: z.ZodOptional<z.ZodObject<{
                fontScale: z.ZodOptional<z.ZodNumber>;
                wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
            labelSubscriptCase: z.ZodOptional<z.ZodEnum<{
                lowercase: "lowercase";
                preserve: "preserve";
                uppercase: "uppercase";
            }>>;
            labelSubscriptItalic: z.ZodOptional<z.ZodBoolean>;
            labelUnderscoreSubscript: z.ZodOptional<z.ZodBoolean>;
            labelSubscriptAfterFirst: z.ZodOptional<z.ZodBoolean>;
            labelFirstLetterItalic: z.ZodOptional<z.ZodBoolean>;
            textFace: z.ZodOptional<z.ZodEnum<{
                "latin-modern": "latin-modern";
                sans: "sans";
                serif: "serif";
            }>>;
            crossingStyle: z.ZodOptional<z.ZodEnum<{
                hop: "hop";
            }>>;
            flow: z.ZodOptional<z.ZodObject<{
                power: z.ZodOptional<z.ZodLiteral<"top">>;
                ground: z.ZodOptional<z.ZodLiteral<"bottom">>;
                input: z.ZodOptional<z.ZodLiteral<"left">>;
                output: z.ZodOptional<z.ZodLiteral<"right">>;
            }, z.core.$strict>>;
            cellSymbol: z.ZodOptional<z.ZodObject<{
                minimumBodySize: z.ZodOptional<z.ZodObject<{
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                }, z.core.$strict>>;
                bodyBounds: z.ZodOptional<z.ZodObject<{
                    left: z.ZodNumber;
                    right: z.ZodNumber;
                    top: z.ZodNumber;
                    bottom: z.ZodNumber;
                }, z.core.$strict>>;
                pinPlacements: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    terminalId: z.ZodString;
                    side: z.ZodEnum<{
                        east: "east";
                        north: "north";
                        south: "south";
                        west: "west";
                    }>;
                    offset: z.ZodNumber;
                }, z.core.$strict>>>;
                artwork: z.ZodOptional<z.ZodType<import("./presentation.js").CellSymbolArtwork, unknown, z.core.$ZodTypeInternals<import("./presentation.js").CellSymbolArtwork, unknown>>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        mosBulkDefaults: z.ZodOptional<z.ZodObject<{
            nmosNetId: z.ZodOptional<z.ZodString>;
            pmosNetId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        layoutGroups: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<{
                "current-mirror": "current-mirror";
                custom: "custom";
                "differential-pair": "differential-pair";
                "matched-pair": "matched-pair";
            }>;
            objectIds: z.ZodArray<z.ZodString>;
            locked: z.ZodBoolean;
        }, z.core.$strict>>;
        constraints: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<{
                "align-x": "align-x";
                "align-y": "align-y";
                "equal-spacing": "equal-spacing";
                "keep-clear": "keep-clear";
                symmetric: "symmetric";
            }>;
            objectIds: z.ZodArray<z.ZodString>;
            locked: z.ZodBoolean;
        }, z.core.$strict>>;
        noConnects: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            endpoint: z.ZodObject<{
                kind: z.ZodLiteral<"terminal">;
                instanceId: z.ZodString;
                pinName: z.ZodString;
                memberId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>;
            reason: z.ZodOptional<z.ZodString>;
            documentStyle: z.ZodOptional<z.ZodObject<{
                fontScale: z.ZodOptional<z.ZodNumber>;
                wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
        inductorCouplings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            members: z.ZodTuple<[z.ZodObject<{
                instanceId: z.ZodString;
                dotPin: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                instanceId: z.ZodString;
                dotPin: z.ZodString;
            }, z.core.$strict>], null>;
            k: z.ZodString;
            arrow: z.ZodOptional<z.ZodLiteral<false>>;
        }, z.core.$strict>>>;
        drafting: z.ZodOptional<z.ZodObject<{
            objects: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                id: z.ZodString;
                locked: z.ZodBoolean;
                zIndex: z.ZodNumber;
                anchor: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
                styleOverride: z.ZodOptional<z.ZodObject<{
                    sizeScale: z.ZodOptional<z.ZodNumber>;
                    weight: z.ZodOptional<z.ZodEnum<{
                        bold: "bold";
                        normal: "normal";
                    }>>;
                    italic: z.ZodOptional<z.ZodBoolean>;
                    lineStyle: z.ZodOptional<z.ZodEnum<{
                        dashed: "dashed";
                        dotted: "dotted";
                        solid: "solid";
                    }>>;
                    arrowHead: z.ZodOptional<z.ZodEnum<{
                        filled: "filled";
                        none: "none";
                        open: "open";
                    }>>;
                    arrowHeadAt: z.ZodOptional<z.ZodEnum<{
                        both: "both";
                        end: "end";
                        start: "start";
                    }>>;
                    arrowStart: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    arrowEnd: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    strokeScale: z.ZodOptional<z.ZodNumber>;
                    color: z.ZodOptional<z.ZodString>;
                    fillColor: z.ZodOptional<z.ZodString>;
                    arrowHeadScale: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0.75>, z.ZodLiteral<1>, z.ZodLiteral<1.25>, z.ZodLiteral<1.5>]>>;
                }, z.core.$strict>>;
                documentStyle: z.ZodOptional<z.ZodObject<{
                    fontScale: z.ZodOptional<z.ZodNumber>;
                    wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                    symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                    annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                    junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                kind: z.ZodLiteral<"text">;
                content: z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>;
                alignment: z.ZodEnum<{
                    end: "end";
                    middle: "middle";
                    start: "start";
                }>;
                rotation: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<45>, z.ZodLiteral<90>, z.ZodLiteral<135>, z.ZodLiteral<180>, z.ZodLiteral<225>, z.ZodLiteral<270>, z.ZodLiteral<315>]>;
                typographyToken: z.ZodOptional<z.ZodEnum<{
                    body: "body";
                    caption: "caption";
                    label: "label";
                }>>;
                polarity: z.ZodOptional<z.ZodEnum<{
                    both: "both";
                    negative: "negative";
                    positive: "positive";
                }>>;
            }, z.core.$strict>, z.ZodObject<{
                id: z.ZodString;
                locked: z.ZodBoolean;
                zIndex: z.ZodNumber;
                anchor: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
                styleOverride: z.ZodOptional<z.ZodObject<{
                    sizeScale: z.ZodOptional<z.ZodNumber>;
                    weight: z.ZodOptional<z.ZodEnum<{
                        bold: "bold";
                        normal: "normal";
                    }>>;
                    italic: z.ZodOptional<z.ZodBoolean>;
                    lineStyle: z.ZodOptional<z.ZodEnum<{
                        dashed: "dashed";
                        dotted: "dotted";
                        solid: "solid";
                    }>>;
                    arrowHead: z.ZodOptional<z.ZodEnum<{
                        filled: "filled";
                        none: "none";
                        open: "open";
                    }>>;
                    arrowHeadAt: z.ZodOptional<z.ZodEnum<{
                        both: "both";
                        end: "end";
                        start: "start";
                    }>>;
                    arrowStart: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    arrowEnd: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    strokeScale: z.ZodOptional<z.ZodNumber>;
                    color: z.ZodOptional<z.ZodString>;
                    fillColor: z.ZodOptional<z.ZodString>;
                    arrowHeadScale: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0.75>, z.ZodLiteral<1>, z.ZodLiteral<1.25>, z.ZodLiteral<1.5>]>>;
                }, z.core.$strict>>;
                documentStyle: z.ZodOptional<z.ZodObject<{
                    fontScale: z.ZodOptional<z.ZodNumber>;
                    wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                    symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                    annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                    junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                kind: z.ZodLiteral<"arrow">;
                from: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
                to: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
                waypoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>>;
                curveControls: z.ZodOptional<z.ZodArray<z.ZodNullable<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>>>;
                outline: z.ZodOptional<z.ZodObject<{
                    width: z.ZodNumber;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                id: z.ZodString;
                locked: z.ZodBoolean;
                zIndex: z.ZodNumber;
                anchor: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
                styleOverride: z.ZodOptional<z.ZodObject<{
                    sizeScale: z.ZodOptional<z.ZodNumber>;
                    weight: z.ZodOptional<z.ZodEnum<{
                        bold: "bold";
                        normal: "normal";
                    }>>;
                    italic: z.ZodOptional<z.ZodBoolean>;
                    lineStyle: z.ZodOptional<z.ZodEnum<{
                        dashed: "dashed";
                        dotted: "dotted";
                        solid: "solid";
                    }>>;
                    arrowHead: z.ZodOptional<z.ZodEnum<{
                        filled: "filled";
                        none: "none";
                        open: "open";
                    }>>;
                    arrowHeadAt: z.ZodOptional<z.ZodEnum<{
                        both: "both";
                        end: "end";
                        start: "start";
                    }>>;
                    arrowStart: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    arrowEnd: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    strokeScale: z.ZodOptional<z.ZodNumber>;
                    color: z.ZodOptional<z.ZodString>;
                    fillColor: z.ZodOptional<z.ZodString>;
                    arrowHeadScale: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0.75>, z.ZodLiteral<1>, z.ZodLiteral<1.25>, z.ZodLiteral<1.5>]>>;
                }, z.core.$strict>>;
                documentStyle: z.ZodOptional<z.ZodObject<{
                    fontScale: z.ZodOptional<z.ZodNumber>;
                    wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                    symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                    annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                    junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                kind: z.ZodLiteral<"leader">;
                target: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
            }, z.core.$strict>, z.ZodObject<{
                id: z.ZodString;
                locked: z.ZodBoolean;
                zIndex: z.ZodNumber;
                anchor: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
                styleOverride: z.ZodOptional<z.ZodObject<{
                    sizeScale: z.ZodOptional<z.ZodNumber>;
                    weight: z.ZodOptional<z.ZodEnum<{
                        bold: "bold";
                        normal: "normal";
                    }>>;
                    italic: z.ZodOptional<z.ZodBoolean>;
                    lineStyle: z.ZodOptional<z.ZodEnum<{
                        dashed: "dashed";
                        dotted: "dotted";
                        solid: "solid";
                    }>>;
                    arrowHead: z.ZodOptional<z.ZodEnum<{
                        filled: "filled";
                        none: "none";
                        open: "open";
                    }>>;
                    arrowHeadAt: z.ZodOptional<z.ZodEnum<{
                        both: "both";
                        end: "end";
                        start: "start";
                    }>>;
                    arrowStart: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    arrowEnd: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    strokeScale: z.ZodOptional<z.ZodNumber>;
                    color: z.ZodOptional<z.ZodString>;
                    fillColor: z.ZodOptional<z.ZodString>;
                    arrowHeadScale: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0.75>, z.ZodLiteral<1>, z.ZodLiteral<1.25>, z.ZodLiteral<1.5>]>>;
                }, z.core.$strict>>;
                documentStyle: z.ZodOptional<z.ZodObject<{
                    fontScale: z.ZodOptional<z.ZodNumber>;
                    wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                    symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                    annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                    junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                kind: z.ZodLiteral<"callout">;
                content: z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>;
                alignment: z.ZodEnum<{
                    end: "end";
                    middle: "middle";
                    start: "start";
                }>;
                rotation: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<45>, z.ZodLiteral<90>, z.ZodLiteral<135>, z.ZodLiteral<180>, z.ZodLiteral<225>, z.ZodLiteral<270>, z.ZodLiteral<315>]>;
                typographyToken: z.ZodOptional<z.ZodEnum<{
                    body: "body";
                    caption: "caption";
                    label: "label";
                }>>;
                target: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
            }, z.core.$strict>, z.ZodObject<{
                id: z.ZodString;
                locked: z.ZodBoolean;
                zIndex: z.ZodNumber;
                anchor: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
                styleOverride: z.ZodOptional<z.ZodObject<{
                    sizeScale: z.ZodOptional<z.ZodNumber>;
                    weight: z.ZodOptional<z.ZodEnum<{
                        bold: "bold";
                        normal: "normal";
                    }>>;
                    italic: z.ZodOptional<z.ZodBoolean>;
                    lineStyle: z.ZodOptional<z.ZodEnum<{
                        dashed: "dashed";
                        dotted: "dotted";
                        solid: "solid";
                    }>>;
                    arrowHead: z.ZodOptional<z.ZodEnum<{
                        filled: "filled";
                        none: "none";
                        open: "open";
                    }>>;
                    arrowHeadAt: z.ZodOptional<z.ZodEnum<{
                        both: "both";
                        end: "end";
                        start: "start";
                    }>>;
                    arrowStart: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    arrowEnd: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    strokeScale: z.ZodOptional<z.ZodNumber>;
                    color: z.ZodOptional<z.ZodString>;
                    fillColor: z.ZodOptional<z.ZodString>;
                    arrowHeadScale: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0.75>, z.ZodLiteral<1>, z.ZodLiteral<1.25>, z.ZodLiteral<1.5>]>>;
                }, z.core.$strict>>;
                documentStyle: z.ZodOptional<z.ZodObject<{
                    fontScale: z.ZodOptional<z.ZodNumber>;
                    wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                    symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                    annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                    junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                kind: z.ZodLiteral<"construction-line">;
                points: z.ZodArray<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>;
                curveControls: z.ZodOptional<z.ZodArray<z.ZodNullable<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>>>;
                lineStyle: z.ZodEnum<{
                    dashed: "dashed";
                    dotted: "dotted";
                    solid: "solid";
                }>;
            }, z.core.$strict>, z.ZodObject<{
                id: z.ZodString;
                locked: z.ZodBoolean;
                zIndex: z.ZodNumber;
                anchor: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
                styleOverride: z.ZodOptional<z.ZodObject<{
                    sizeScale: z.ZodOptional<z.ZodNumber>;
                    weight: z.ZodOptional<z.ZodEnum<{
                        bold: "bold";
                        normal: "normal";
                    }>>;
                    italic: z.ZodOptional<z.ZodBoolean>;
                    lineStyle: z.ZodOptional<z.ZodEnum<{
                        dashed: "dashed";
                        dotted: "dotted";
                        solid: "solid";
                    }>>;
                    arrowHead: z.ZodOptional<z.ZodEnum<{
                        filled: "filled";
                        none: "none";
                        open: "open";
                    }>>;
                    arrowHeadAt: z.ZodOptional<z.ZodEnum<{
                        both: "both";
                        end: "end";
                        start: "start";
                    }>>;
                    arrowStart: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    arrowEnd: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    strokeScale: z.ZodOptional<z.ZodNumber>;
                    color: z.ZodOptional<z.ZodString>;
                    fillColor: z.ZodOptional<z.ZodString>;
                    arrowHeadScale: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0.75>, z.ZodLiteral<1>, z.ZodLiteral<1.25>, z.ZodLiteral<1.5>]>>;
                }, z.core.$strict>>;
                documentStyle: z.ZodOptional<z.ZodObject<{
                    fontScale: z.ZodOptional<z.ZodNumber>;
                    wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                    symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                    annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                    junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                kind: z.ZodLiteral<"rectangle">;
                center: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
                width: z.ZodNumber;
                height: z.ZodNumber;
                rotation: z.ZodNumber;
                lineStyle: z.ZodEnum<{
                    dashed: "dashed";
                    dotted: "dotted";
                    solid: "solid";
                }>;
                layer: z.ZodOptional<z.ZodEnum<{
                    background: "background";
                    foreground: "foreground";
                }>>;
            }, z.core.$strict>, z.ZodObject<{
                id: z.ZodString;
                locked: z.ZodBoolean;
                zIndex: z.ZodNumber;
                anchor: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
                styleOverride: z.ZodOptional<z.ZodObject<{
                    sizeScale: z.ZodOptional<z.ZodNumber>;
                    weight: z.ZodOptional<z.ZodEnum<{
                        bold: "bold";
                        normal: "normal";
                    }>>;
                    italic: z.ZodOptional<z.ZodBoolean>;
                    lineStyle: z.ZodOptional<z.ZodEnum<{
                        dashed: "dashed";
                        dotted: "dotted";
                        solid: "solid";
                    }>>;
                    arrowHead: z.ZodOptional<z.ZodEnum<{
                        filled: "filled";
                        none: "none";
                        open: "open";
                    }>>;
                    arrowHeadAt: z.ZodOptional<z.ZodEnum<{
                        both: "both";
                        end: "end";
                        start: "start";
                    }>>;
                    arrowStart: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    arrowEnd: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    strokeScale: z.ZodOptional<z.ZodNumber>;
                    color: z.ZodOptional<z.ZodString>;
                    fillColor: z.ZodOptional<z.ZodString>;
                    arrowHeadScale: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0.75>, z.ZodLiteral<1>, z.ZodLiteral<1.25>, z.ZodLiteral<1.5>]>>;
                }, z.core.$strict>>;
                documentStyle: z.ZodOptional<z.ZodObject<{
                    fontScale: z.ZodOptional<z.ZodNumber>;
                    wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                    symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                    annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                    junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                kind: z.ZodLiteral<"circle">;
                center: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>;
                radius: z.ZodNumber;
                lineStyle: z.ZodEnum<{
                    dashed: "dashed";
                    dotted: "dotted";
                    solid: "solid";
                }>;
                layer: z.ZodOptional<z.ZodEnum<{
                    background: "background";
                    foreground: "foreground";
                }>>;
            }, z.core.$strict>, z.ZodObject<{
                id: z.ZodString;
                locked: z.ZodBoolean;
                zIndex: z.ZodNumber;
                anchor: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"free">;
                    position: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"object">;
                    objectId: z.ZodString;
                    localOffset: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>, z.ZodObject<{
                    kind: z.ZodLiteral<"route">;
                    routeId: z.ZodString;
                    legId: z.ZodString;
                    t: z.ZodNumber;
                    normalOffset: z.ZodNumber;
                    direction: z.ZodEnum<{
                        forward: "forward";
                        reverse: "reverse";
                    }>;
                    orientation: z.ZodEnum<{
                        follow: "follow";
                        horizontal: "horizontal";
                    }>;
                    fallbackPosition: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>], "kind">;
                styleOverride: z.ZodOptional<z.ZodObject<{
                    sizeScale: z.ZodOptional<z.ZodNumber>;
                    weight: z.ZodOptional<z.ZodEnum<{
                        bold: "bold";
                        normal: "normal";
                    }>>;
                    italic: z.ZodOptional<z.ZodBoolean>;
                    lineStyle: z.ZodOptional<z.ZodEnum<{
                        dashed: "dashed";
                        dotted: "dotted";
                        solid: "solid";
                    }>>;
                    arrowHead: z.ZodOptional<z.ZodEnum<{
                        filled: "filled";
                        none: "none";
                        open: "open";
                    }>>;
                    arrowHeadAt: z.ZodOptional<z.ZodEnum<{
                        both: "both";
                        end: "end";
                        start: "start";
                    }>>;
                    arrowStart: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    arrowEnd: z.ZodOptional<z.ZodEnum<{
                        dot: "dot";
                        "large-arrow": "large-arrow";
                        "medium-arrow": "medium-arrow";
                        none: "none";
                        "open-arrow": "open-arrow";
                        "small-arrow": "small-arrow";
                    }>>;
                    strokeScale: z.ZodOptional<z.ZodNumber>;
                    color: z.ZodOptional<z.ZodString>;
                    fillColor: z.ZodOptional<z.ZodString>;
                    arrowHeadScale: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0.75>, z.ZodLiteral<1>, z.ZodLiteral<1.25>, z.ZodLiteral<1.5>]>>;
                }, z.core.$strict>>;
                documentStyle: z.ZodOptional<z.ZodObject<{
                    fontScale: z.ZodOptional<z.ZodNumber>;
                    wireStrokeScale: z.ZodOptional<z.ZodNumber>;
                    symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
                    annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
                    junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                kind: z.ZodLiteral<"floating-symbol">;
                symbolId: z.ZodString;
                transform: z.ZodObject<{
                    rotation: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<45>, z.ZodLiteral<90>, z.ZodLiteral<135>, z.ZodLiteral<180>, z.ZodLiteral<225>, z.ZodLiteral<270>, z.ZodLiteral<315>]>;
                    mirror: z.ZodEnum<{
                        both: "both";
                        horizontal: "horizontal";
                        none: "none";
                        vertical: "vertical";
                    }>;
                }, z.core.$strict>;
            }, z.core.$strict>], "kind">>;
        }, z.core.$strict>>;
        drawingOrder: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"instance">;
            id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"annotation">;
            id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"drafting">;
            id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"electrical">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"circuit-marks">;
        }, z.core.$strict>], "kind">>>;
    }, z.core.$strict>>;
    externalSubcircuitDefinitions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        libraryOrigin: z.ZodOptional<z.ZodObject<{
            componentId: z.ZodString;
            revision: z.ZodNumber;
            authorId: z.ZodString;
            contentVersion: z.ZodLiteral<1>;
            digest: z.ZodString;
        }, z.core.$strict>>;
        terminals: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            direction: z.ZodEnum<{
                inout: "inout";
                input: "input";
                output: "output";
                passive: "passive";
            }>;
        }, z.core.$strict>>;
        formalParameters: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            defaultValue: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        interfaceStatus: z.ZodEnum<{
            declared: "declared";
            "inferred-positional": "inferred-positional";
        }>;
        presentation: z.ZodOptional<z.ZodObject<{
            minimumBodySize: z.ZodOptional<z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>>;
            bodyBounds: z.ZodOptional<z.ZodObject<{
                left: z.ZodNumber;
                right: z.ZodNumber;
                top: z.ZodNumber;
                bottom: z.ZodNumber;
            }, z.core.$strict>>;
            pinPlacements: z.ZodOptional<z.ZodArray<z.ZodObject<{
                terminalId: z.ZodString;
                side: z.ZodEnum<{
                    east: "east";
                    north: "north";
                    south: "south";
                    west: "west";
                }>;
                offset: z.ZodNumber;
            }, z.core.$strict>>>;
            artwork: z.ZodOptional<z.ZodType<import("./presentation.js").CellSymbolArtwork, unknown, z.core.$ZodTypeInternals<import("./presentation.js").CellSymbolArtwork, unknown>>>;
        }, z.core.$strict>>;
        symbolId: z.ZodOptional<z.ZodString>;
        implementation: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            sourceId: z.ZodString;
            entry: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"placeholder">;
            sourceId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "kind">>;
    }, z.core.$strict>>>;
    simulationFolders: z.ZodArray<z.ZodObject<{
        version: z.ZodLiteral<4>;
        input: z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            entry: z.ZodString;
            configPath: z.ZodString;
            files: z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                text: z.ZodString;
            }, z.core.$strict>>;
            circuitBindings: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                path: z.ZodString;
                documentId: z.ZodString;
                emission: z.ZodEnum<{
                    subcircuit: "subcircuit";
                    "top-level": "top-level";
                }>;
            }, z.core.$strict>>;
            dependencies: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                mountPath: z.ZodString;
                sha256: z.ZodString;
            }, z.core.$strict>>;
            drafts: z.ZodOptional<z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                base: z.ZodString;
                text: z.ZodString;
                binding: z.ZodOptional<z.ZodObject<{
                    id: z.ZodString;
                    path: z.ZodString;
                    documentId: z.ZodString;
                    emission: z.ZodEnum<{
                        subcircuit: "subcircuit";
                        "top-level": "top-level";
                    }>;
                }, z.core.$strict>>;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strict>>;
    modelSources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        language: z.ZodEnum<{
            spectre: "spectre";
            spice: "spice";
        }>;
        entry: z.ZodString;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            text: z.ZodString;
        }, z.core.$strict>>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            mountPath: z.ZodString;
            sha256: z.ZodString;
        }, z.core.$strict>>>;
        revision: z.ZodNumber;
        draft: z.ZodOptional<z.ZodObject<{
            language: z.ZodOptional<z.ZodEnum<{
                spectre: "spectre";
                spice: "spice";
            }>>;
            entry: z.ZodString;
            files: z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                text: z.ZodString;
            }, z.core.$strict>>;
            baseRevision: z.ZodNumber;
            authoring: z.ZodOptional<z.ZodArray<z.ZodObject<{
                definitionId: z.ZodString;
                entry: z.ZodString;
                symbolMode: z.ZodEnum<{
                    automatic: "automatic";
                    custom: "custom";
                }>;
                artworkText: z.ZodString;
                artworkInitialized: z.ZodOptional<z.ZodBoolean>;
                lastValidArtwork: z.ZodOptional<z.ZodObject<{
                    symbol: z.ZodObject<{
                        schemaVersion: z.ZodLiteral<1>;
                        id: z.ZodString;
                        name: z.ZodString;
                        viewBox: z.ZodObject<{
                            x: z.ZodNumber;
                            y: z.ZodNumber;
                            width: z.ZodNumber;
                            height: z.ZodNumber;
                        }, z.core.$strict>;
                        pins: z.ZodArray<z.ZodObject<{
                            name: z.ZodString;
                            signalMembers: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                id: z.ZodString;
                                name: z.ZodString;
                            }, z.core.$strict>>>;
                            role: z.ZodString;
                            at: z.ZodObject<{
                                x: z.ZodNumber;
                                y: z.ZodNumber;
                            }, z.core.$strict>;
                            direction: z.ZodEnum<{
                                east: "east";
                                north: "north";
                                south: "south";
                                west: "west";
                            }>;
                            routing: z.ZodOptional<z.ZodObject<{
                                escape: z.ZodLiteral<"outward">;
                                preferredLanding: z.ZodOptional<z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>>;
                            }, z.core.$strict>>;
                            presentation: z.ZodObject<{
                                visibility: z.ZodEnum<{
                                    conditional: "conditional";
                                    implicit: "implicit";
                                    visible: "visible";
                                }>;
                                leadLength: z.ZodOptional<z.ZodNumber>;
                                showName: z.ZodOptional<z.ZodBoolean>;
                                displayName: z.ZodOptional<z.ZodString>;
                                nameContent: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
                                textStyle: z.ZodOptional<z.ZodEnum<{
                                    "math-symbol": "math-symbol";
                                    plain: "plain";
                                }>>;
                                textSizeScale: z.ZodOptional<z.ZodNumber>;
                            }, z.core.$strict>;
                        }, z.core.$strict>>;
                        primitives: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                            kind: z.ZodLiteral<"line">;
                            from: z.ZodObject<{
                                x: z.ZodNumber;
                                y: z.ZodNumber;
                            }, z.core.$strict>;
                            to: z.ZodObject<{
                                x: z.ZodNumber;
                                y: z.ZodNumber;
                            }, z.core.$strict>;
                            part: z.ZodOptional<z.ZodString>;
                            style: z.ZodOptional<z.ZodObject<{
                                strokeRole: z.ZodOptional<z.ZodEnum<{
                                    annotation: "annotation";
                                    emphasis: "emphasis";
                                    ground: "ground";
                                    normal: "normal";
                                    supply: "supply";
                                }>>;
                                strokeWidth: z.ZodOptional<z.ZodNumber>;
                                lineCap: z.ZodOptional<z.ZodEnum<{
                                    butt: "butt";
                                    round: "round";
                                    square: "square";
                                }>>;
                                lineJoin: z.ZodOptional<z.ZodEnum<{
                                    bevel: "bevel";
                                    miter: "miter";
                                    round: "round";
                                }>>;
                                miterLimit: z.ZodOptional<z.ZodNumber>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>, z.ZodObject<{
                            kind: z.ZodLiteral<"polyline">;
                            points: z.ZodArray<z.ZodObject<{
                                x: z.ZodNumber;
                                y: z.ZodNumber;
                            }, z.core.$strict>>;
                            part: z.ZodOptional<z.ZodString>;
                            style: z.ZodOptional<z.ZodObject<{
                                strokeRole: z.ZodOptional<z.ZodEnum<{
                                    annotation: "annotation";
                                    emphasis: "emphasis";
                                    ground: "ground";
                                    normal: "normal";
                                    supply: "supply";
                                }>>;
                                strokeWidth: z.ZodOptional<z.ZodNumber>;
                                lineCap: z.ZodOptional<z.ZodEnum<{
                                    butt: "butt";
                                    round: "round";
                                    square: "square";
                                }>>;
                                lineJoin: z.ZodOptional<z.ZodEnum<{
                                    bevel: "bevel";
                                    miter: "miter";
                                    round: "round";
                                }>>;
                                miterLimit: z.ZodOptional<z.ZodNumber>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>, z.ZodObject<{
                            kind: z.ZodLiteral<"circle">;
                            center: z.ZodObject<{
                                x: z.ZodNumber;
                                y: z.ZodNumber;
                            }, z.core.$strict>;
                            radius: z.ZodNumber;
                            fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                            fill: z.ZodOptional<z.ZodEnum<{
                                foreground: "foreground";
                                none: "none";
                            }>>;
                            stroke: z.ZodOptional<z.ZodEnum<{
                                foreground: "foreground";
                                none: "none";
                            }>>;
                            part: z.ZodOptional<z.ZodString>;
                            style: z.ZodOptional<z.ZodObject<{
                                strokeRole: z.ZodOptional<z.ZodEnum<{
                                    annotation: "annotation";
                                    emphasis: "emphasis";
                                    ground: "ground";
                                    normal: "normal";
                                    supply: "supply";
                                }>>;
                                strokeWidth: z.ZodOptional<z.ZodNumber>;
                                lineCap: z.ZodOptional<z.ZodEnum<{
                                    butt: "butt";
                                    round: "round";
                                    square: "square";
                                }>>;
                                lineJoin: z.ZodOptional<z.ZodEnum<{
                                    bevel: "bevel";
                                    miter: "miter";
                                    round: "round";
                                }>>;
                                miterLimit: z.ZodOptional<z.ZodNumber>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>, z.ZodObject<{
                            kind: z.ZodLiteral<"rectangle">;
                            bounds: z.ZodObject<{
                                x: z.ZodNumber;
                                y: z.ZodNumber;
                                width: z.ZodNumber;
                                height: z.ZodNumber;
                            }, z.core.$strict>;
                            fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                            fill: z.ZodOptional<z.ZodEnum<{
                                foreground: "foreground";
                                none: "none";
                            }>>;
                            stroke: z.ZodOptional<z.ZodEnum<{
                                foreground: "foreground";
                                none: "none";
                            }>>;
                            part: z.ZodOptional<z.ZodString>;
                            style: z.ZodOptional<z.ZodObject<{
                                strokeRole: z.ZodOptional<z.ZodEnum<{
                                    annotation: "annotation";
                                    emphasis: "emphasis";
                                    ground: "ground";
                                    normal: "normal";
                                    supply: "supply";
                                }>>;
                                strokeWidth: z.ZodOptional<z.ZodNumber>;
                                lineCap: z.ZodOptional<z.ZodEnum<{
                                    butt: "butt";
                                    round: "round";
                                    square: "square";
                                }>>;
                                lineJoin: z.ZodOptional<z.ZodEnum<{
                                    bevel: "bevel";
                                    miter: "miter";
                                    round: "round";
                                }>>;
                                miterLimit: z.ZodOptional<z.ZodNumber>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>, z.ZodObject<{
                            kind: z.ZodLiteral<"path">;
                            data: z.ZodString;
                            fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                            bounds: z.ZodOptional<z.ZodObject<{
                                x: z.ZodNumber;
                                y: z.ZodNumber;
                                width: z.ZodNumber;
                                height: z.ZodNumber;
                            }, z.core.$strict>>;
                            part: z.ZodOptional<z.ZodString>;
                            style: z.ZodOptional<z.ZodObject<{
                                strokeRole: z.ZodOptional<z.ZodEnum<{
                                    annotation: "annotation";
                                    emphasis: "emphasis";
                                    ground: "ground";
                                    normal: "normal";
                                    supply: "supply";
                                }>>;
                                strokeWidth: z.ZodOptional<z.ZodNumber>;
                                lineCap: z.ZodOptional<z.ZodEnum<{
                                    butt: "butt";
                                    round: "round";
                                    square: "square";
                                }>>;
                                lineJoin: z.ZodOptional<z.ZodEnum<{
                                    bevel: "bevel";
                                    miter: "miter";
                                    round: "round";
                                }>>;
                                miterLimit: z.ZodOptional<z.ZodNumber>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>, z.ZodObject<{
                            kind: z.ZodLiteral<"polygon">;
                            points: z.ZodArray<z.ZodObject<{
                                x: z.ZodNumber;
                                y: z.ZodNumber;
                            }, z.core.$strict>>;
                            fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                            fill: z.ZodEnum<{
                                foreground: "foreground";
                                none: "none";
                            }>;
                            stroke: z.ZodOptional<z.ZodEnum<{
                                foreground: "foreground";
                                none: "none";
                            }>>;
                            part: z.ZodOptional<z.ZodString>;
                            style: z.ZodOptional<z.ZodObject<{
                                strokeRole: z.ZodOptional<z.ZodEnum<{
                                    annotation: "annotation";
                                    emphasis: "emphasis";
                                    ground: "ground";
                                    normal: "normal";
                                    supply: "supply";
                                }>>;
                                strokeWidth: z.ZodOptional<z.ZodNumber>;
                                lineCap: z.ZodOptional<z.ZodEnum<{
                                    butt: "butt";
                                    round: "round";
                                    square: "square";
                                }>>;
                                lineJoin: z.ZodOptional<z.ZodEnum<{
                                    bevel: "bevel";
                                    miter: "miter";
                                    round: "round";
                                }>>;
                                miterLimit: z.ZodOptional<z.ZodNumber>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>], "kind">>;
                        variants: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            hiddenPinNames: z.ZodArray<z.ZodString>;
                            auxiliaryPins: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                name: z.ZodString;
                                at: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>;
                                direction: z.ZodEnum<{
                                    east: "east";
                                    north: "north";
                                    south: "south";
                                    west: "west";
                                }>;
                                routing: z.ZodOptional<z.ZodObject<{
                                    escape: z.ZodLiteral<"outward">;
                                    preferredLanding: z.ZodOptional<z.ZodObject<{
                                        x: z.ZodNumber;
                                        y: z.ZodNumber;
                                    }, z.core.$strict>>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>>>;
                            hiddenPrimitiveParts: z.ZodOptional<z.ZodArray<z.ZodString>>;
                            additionalPrimitives: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                                kind: z.ZodLiteral<"line">;
                                from: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>;
                                to: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>, z.ZodObject<{
                                kind: z.ZodLiteral<"polyline">;
                                points: z.ZodArray<z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>, z.ZodObject<{
                                kind: z.ZodLiteral<"circle">;
                                center: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>;
                                radius: z.ZodNumber;
                                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                fill: z.ZodOptional<z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>>;
                                stroke: z.ZodOptional<z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>, z.ZodObject<{
                                kind: z.ZodLiteral<"rectangle">;
                                bounds: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                    width: z.ZodNumber;
                                    height: z.ZodNumber;
                                }, z.core.$strict>;
                                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                fill: z.ZodOptional<z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>>;
                                stroke: z.ZodOptional<z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>, z.ZodObject<{
                                kind: z.ZodLiteral<"path">;
                                data: z.ZodString;
                                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                bounds: z.ZodOptional<z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                    width: z.ZodNumber;
                                    height: z.ZodNumber;
                                }, z.core.$strict>>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>, z.ZodObject<{
                                kind: z.ZodLiteral<"polygon">;
                                points: z.ZodArray<z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>>;
                                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                fill: z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>;
                                stroke: z.ZodOptional<z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>], "kind">>>;
                        }, z.core.$strict>>;
                        defaultVariantId: z.ZodOptional<z.ZodString>;
                        labelVisibility: z.ZodOptional<z.ZodEnum<{
                            hidden: "hidden";
                            shown: "shown";
                        }>>;
                        decorative: z.ZodOptional<z.ZodBoolean>;
                        hierarchicalBlock: z.ZodOptional<z.ZodLiteral<true>>;
                        formulaPresentation: z.ZodOptional<z.ZodObject<{
                            defaultFormula: z.ZodString;
                            supportsCoefficient: z.ZodBoolean;
                            center: z.ZodObject<{
                                x: z.ZodNumber;
                                y: z.ZodNumber;
                            }, z.core.$strict>;
                            fontSize: z.ZodNumber;
                            fractionBarWidth: z.ZodOptional<z.ZodNumber>;
                            adaptiveFrame: z.ZodOptional<z.ZodObject<{
                                shape: z.ZodOptional<z.ZodEnum<{
                                    rectangle: "rectangle";
                                    "right-tapered-trapezoid": "right-tapered-trapezoid";
                                }>>;
                                minBodyWidth: z.ZodNumber;
                                minBodyHeight: z.ZodNumber;
                                horizontalPadding: z.ZodNumber;
                                verticalPadding: z.ZodNumber;
                                leadLength: z.ZodNumber;
                            }, z.core.$strict>>;
                        }, z.core.$strict>>;
                    }, z.core.$strict>;
                    generatedFrom: z.ZodOptional<z.ZodObject<{
                        name: z.ZodString;
                        terminals: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            name: z.ZodString;
                            direction: z.ZodEnum<{
                                inout: "inout";
                                input: "input";
                                output: "output";
                                passive: "passive";
                            }>;
                            nameContent: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
                        }, z.core.$strict>>;
                        presentation: z.ZodOptional<z.ZodObject<{
                            minimumBodySize: z.ZodOptional<z.ZodObject<{
                                width: z.ZodNumber;
                                height: z.ZodNumber;
                            }, z.core.$strict>>;
                            bodyBounds: z.ZodOptional<z.ZodObject<{
                                left: z.ZodNumber;
                                right: z.ZodNumber;
                                top: z.ZodNumber;
                                bottom: z.ZodNumber;
                            }, z.core.$strict>>;
                            pinPlacements: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                terminalId: z.ZodString;
                                side: z.ZodEnum<{
                                    east: "east";
                                    north: "north";
                                    south: "south";
                                    west: "west";
                                }>;
                                offset: z.ZodNumber;
                            }, z.core.$strict>>>;
                            artwork: z.ZodOptional<z.ZodType<import("./presentation.js").CellSymbolArtwork, unknown, z.core.$ZodTypeInternals<import("./presentation.js").CellSymbolArtwork, unknown>>>;
                        }, z.core.$strict>>;
                    }, z.core.$strict>>;
                    electrical: z.ZodOptional<z.ZodObject<{
                        id: z.ZodString;
                        symbolId: z.ZodString;
                        deviceClass: z.ZodEnum<{
                            bjt: "bjt";
                            capacitor: "capacitor";
                            cccs: "cccs";
                            ccvs: "ccvs";
                            "current-source": "current-source";
                            diode: "diode";
                            inductor: "inductor";
                            jfet: "jfet";
                            mos: "mos";
                            "net-marker": "net-marker";
                            resistor: "resistor";
                            switch: "switch";
                            vccs: "vccs";
                            vcvs: "vcvs";
                            "voltage-source": "voltage-source";
                        }>;
                        mosBulkClass: z.ZodOptional<z.ZodEnum<{
                            nmos: "nmos";
                            pmos: "pmos";
                        }>>;
                        referencePrefix: z.ZodNullable<z.ZodString>;
                        pinOrder: z.ZodArray<z.ZodString>;
                        seriesInsertionPinPair: z.ZodOptional<z.ZodTuple<[z.ZodString, z.ZodString], null>>;
                        pinSemantics: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            pinName: z.ZodString;
                            role: z.ZodEnum<{
                                "capacitor-bottom-plate": "capacitor-bottom-plate";
                                "capacitor-top-plate": "capacitor-top-plate";
                            }>;
                        }, z.core.$strict>>>;
                        targetPolicy: z.ZodEnum<{
                            builtin: "builtin";
                            "child-cell": "child-cell";
                            none: "none";
                            "required-model": "required-model";
                        }>;
                        sourceWaveformDefault: z.ZodOptional<z.ZodEnum<{
                            dc: "dc";
                            pulse: "pulse";
                            pwl: "pwl";
                            sin: "sin";
                        }>>;
                        parameters: z.ZodArray<z.ZodObject<{
                            name: z.ZodString;
                            label: z.ZodString;
                            required: z.ZodBoolean;
                            editor: z.ZodEnum<{
                                decimal: "decimal";
                                select: "select";
                                text: "text";
                            }>;
                            options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                value: z.ZodString;
                                label: z.ZodString;
                            }, z.core.$strict>>>;
                            visibleForSourceWaveforms: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                                pulse: "pulse";
                                pwl: "pwl";
                                sin: "sin";
                            }>>>;
                            unitHint: z.ZodOptional<z.ZodString>;
                            placeholder: z.ZodString;
                            help: z.ZodString;
                            authoringVisibility: z.ZodOptional<z.ZodEnum<{
                                compatibility: "compatibility";
                                primary: "primary";
                            }>>;
                            defaultValue: z.ZodOptional<z.ZodString>;
                            displayRole: z.ZodEnum<{
                                "finger-count": "finger-count";
                                length: "length";
                                multiplier: "multiplier";
                                none: "none";
                                value: "value";
                                width: "width";
                            }>;
                        }, z.core.$strict>>;
                        dialects: z.ZodTuple<[z.ZodLiteral<"spice">, z.ZodLiteral<"spectre">], null>;
                        capabilities: z.ZodObject<{
                            supportsModel: z.ZodBoolean;
                            supportsBulkBinding: z.ZodBoolean;
                            supportsValueAnnotation: z.ZodBoolean;
                        }, z.core.$strict>;
                    }, z.core.$strict>>;
                    subcircuit: z.ZodOptional<z.ZodObject<{
                        id: z.ZodString;
                        symbolId: z.ZodString;
                        target: z.ZodString;
                        ports: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                            name: z.ZodString;
                            direction: z.ZodEnum<{
                                inout: "inout";
                                input: "input";
                                output: "output";
                                passive: "passive";
                            }>;
                            pinName: z.ZodString;
                        }, z.core.$strict>, z.ZodObject<{
                            name: z.ZodString;
                            direction: z.ZodEnum<{
                                inout: "inout";
                                input: "input";
                                output: "output";
                                passive: "passive";
                            }>;
                            supply: z.ZodEnum<{
                                VDD: "VDD";
                                VSS: "VSS";
                            }>;
                        }, z.core.$strict>]>>;
                    }, z.core.$strict>>;
                    circuitBinding: z.ZodOptional<z.ZodObject<{
                        definitionId: z.ZodString;
                        terminals: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                            terminalId: z.ZodString;
                            pinName: z.ZodString;
                        }, z.core.$strict>, z.ZodObject<{
                            terminalId: z.ZodString;
                            supply: z.ZodEnum<{
                                VDD: "VDD";
                                VSS: "VSS";
                            }>;
                        }, z.core.$strict>]>>;
                    }, z.core.$strict>>;
                    libraryOrigin: z.ZodOptional<z.ZodObject<{
                        componentId: z.ZodString;
                        revision: z.ZodNumber;
                        authorId: z.ZodString;
                        contentVersion: z.ZodLiteral<1>;
                        digest: z.ZodString;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                artworkOrigin: z.ZodOptional<z.ZodObject<{
                    definitionId: z.ZodString;
                    terminalIds: z.ZodRecord<z.ZodString, z.ZodString>;
                }, z.core.$strict>>;
                terminalDirections: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
                    inout: "inout";
                    input: "input";
                    output: "output";
                    passive: "passive";
                }>>>;
                presentation: z.ZodOptional<z.ZodObject<{
                    minimumBodySize: z.ZodOptional<z.ZodObject<{
                        width: z.ZodNumber;
                        height: z.ZodNumber;
                    }, z.core.$strict>>;
                    bodyBounds: z.ZodOptional<z.ZodObject<{
                        left: z.ZodNumber;
                        right: z.ZodNumber;
                        top: z.ZodNumber;
                        bottom: z.ZodNumber;
                    }, z.core.$strict>>;
                    pinPlacements: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        terminalId: z.ZodString;
                        side: z.ZodEnum<{
                            east: "east";
                            north: "north";
                            south: "south";
                            west: "west";
                        }>;
                        offset: z.ZodNumber;
                    }, z.core.$strict>>>;
                    artwork: z.ZodOptional<z.ZodType<import("./presentation.js").CellSymbolArtwork, unknown, z.core.$ZodTypeInternals<import("./presentation.js").CellSymbolArtwork, unknown>>>;
                }, z.core.$strict>>;
                portMaps: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
                legacyRepair: z.ZodOptional<z.ZodObject<{
                    identity: z.ZodString;
                    baseline: z.ZodObject<{
                        symbol: z.ZodObject<{
                            schemaVersion: z.ZodLiteral<1>;
                            id: z.ZodString;
                            name: z.ZodString;
                            viewBox: z.ZodObject<{
                                x: z.ZodNumber;
                                y: z.ZodNumber;
                                width: z.ZodNumber;
                                height: z.ZodNumber;
                            }, z.core.$strict>;
                            pins: z.ZodArray<z.ZodObject<{
                                name: z.ZodString;
                                signalMembers: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                    id: z.ZodString;
                                    name: z.ZodString;
                                }, z.core.$strict>>>;
                                role: z.ZodString;
                                at: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>;
                                direction: z.ZodEnum<{
                                    east: "east";
                                    north: "north";
                                    south: "south";
                                    west: "west";
                                }>;
                                routing: z.ZodOptional<z.ZodObject<{
                                    escape: z.ZodLiteral<"outward">;
                                    preferredLanding: z.ZodOptional<z.ZodObject<{
                                        x: z.ZodNumber;
                                        y: z.ZodNumber;
                                    }, z.core.$strict>>;
                                }, z.core.$strict>>;
                                presentation: z.ZodObject<{
                                    visibility: z.ZodEnum<{
                                        conditional: "conditional";
                                        implicit: "implicit";
                                        visible: "visible";
                                    }>;
                                    leadLength: z.ZodOptional<z.ZodNumber>;
                                    showName: z.ZodOptional<z.ZodBoolean>;
                                    displayName: z.ZodOptional<z.ZodString>;
                                    nameContent: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
                                    textStyle: z.ZodOptional<z.ZodEnum<{
                                        "math-symbol": "math-symbol";
                                        plain: "plain";
                                    }>>;
                                    textSizeScale: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>;
                            }, z.core.$strict>>;
                            primitives: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                                kind: z.ZodLiteral<"line">;
                                from: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>;
                                to: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>, z.ZodObject<{
                                kind: z.ZodLiteral<"polyline">;
                                points: z.ZodArray<z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>, z.ZodObject<{
                                kind: z.ZodLiteral<"circle">;
                                center: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>;
                                radius: z.ZodNumber;
                                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                fill: z.ZodOptional<z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>>;
                                stroke: z.ZodOptional<z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>, z.ZodObject<{
                                kind: z.ZodLiteral<"rectangle">;
                                bounds: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                    width: z.ZodNumber;
                                    height: z.ZodNumber;
                                }, z.core.$strict>;
                                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                fill: z.ZodOptional<z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>>;
                                stroke: z.ZodOptional<z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>, z.ZodObject<{
                                kind: z.ZodLiteral<"path">;
                                data: z.ZodString;
                                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                bounds: z.ZodOptional<z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                    width: z.ZodNumber;
                                    height: z.ZodNumber;
                                }, z.core.$strict>>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>, z.ZodObject<{
                                kind: z.ZodLiteral<"polygon">;
                                points: z.ZodArray<z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>>;
                                fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                fill: z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>;
                                stroke: z.ZodOptional<z.ZodEnum<{
                                    foreground: "foreground";
                                    none: "none";
                                }>>;
                                part: z.ZodOptional<z.ZodString>;
                                style: z.ZodOptional<z.ZodObject<{
                                    strokeRole: z.ZodOptional<z.ZodEnum<{
                                        annotation: "annotation";
                                        emphasis: "emphasis";
                                        ground: "ground";
                                        normal: "normal";
                                        supply: "supply";
                                    }>>;
                                    strokeWidth: z.ZodOptional<z.ZodNumber>;
                                    lineCap: z.ZodOptional<z.ZodEnum<{
                                        butt: "butt";
                                        round: "round";
                                        square: "square";
                                    }>>;
                                    lineJoin: z.ZodOptional<z.ZodEnum<{
                                        bevel: "bevel";
                                        miter: "miter";
                                        round: "round";
                                    }>>;
                                    miterLimit: z.ZodOptional<z.ZodNumber>;
                                }, z.core.$strict>>;
                            }, z.core.$strict>], "kind">>;
                            variants: z.ZodArray<z.ZodObject<{
                                id: z.ZodString;
                                hiddenPinNames: z.ZodArray<z.ZodString>;
                                auxiliaryPins: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                    name: z.ZodString;
                                    at: z.ZodObject<{
                                        x: z.ZodNumber;
                                        y: z.ZodNumber;
                                    }, z.core.$strict>;
                                    direction: z.ZodEnum<{
                                        east: "east";
                                        north: "north";
                                        south: "south";
                                        west: "west";
                                    }>;
                                    routing: z.ZodOptional<z.ZodObject<{
                                        escape: z.ZodLiteral<"outward">;
                                        preferredLanding: z.ZodOptional<z.ZodObject<{
                                            x: z.ZodNumber;
                                            y: z.ZodNumber;
                                        }, z.core.$strict>>;
                                    }, z.core.$strict>>;
                                }, z.core.$strict>>>;
                                hiddenPrimitiveParts: z.ZodOptional<z.ZodArray<z.ZodString>>;
                                additionalPrimitives: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                                    kind: z.ZodLiteral<"line">;
                                    from: z.ZodObject<{
                                        x: z.ZodNumber;
                                        y: z.ZodNumber;
                                    }, z.core.$strict>;
                                    to: z.ZodObject<{
                                        x: z.ZodNumber;
                                        y: z.ZodNumber;
                                    }, z.core.$strict>;
                                    part: z.ZodOptional<z.ZodString>;
                                    style: z.ZodOptional<z.ZodObject<{
                                        strokeRole: z.ZodOptional<z.ZodEnum<{
                                            annotation: "annotation";
                                            emphasis: "emphasis";
                                            ground: "ground";
                                            normal: "normal";
                                            supply: "supply";
                                        }>>;
                                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                                        lineCap: z.ZodOptional<z.ZodEnum<{
                                            butt: "butt";
                                            round: "round";
                                            square: "square";
                                        }>>;
                                        lineJoin: z.ZodOptional<z.ZodEnum<{
                                            bevel: "bevel";
                                            miter: "miter";
                                            round: "round";
                                        }>>;
                                        miterLimit: z.ZodOptional<z.ZodNumber>;
                                    }, z.core.$strict>>;
                                }, z.core.$strict>, z.ZodObject<{
                                    kind: z.ZodLiteral<"polyline">;
                                    points: z.ZodArray<z.ZodObject<{
                                        x: z.ZodNumber;
                                        y: z.ZodNumber;
                                    }, z.core.$strict>>;
                                    part: z.ZodOptional<z.ZodString>;
                                    style: z.ZodOptional<z.ZodObject<{
                                        strokeRole: z.ZodOptional<z.ZodEnum<{
                                            annotation: "annotation";
                                            emphasis: "emphasis";
                                            ground: "ground";
                                            normal: "normal";
                                            supply: "supply";
                                        }>>;
                                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                                        lineCap: z.ZodOptional<z.ZodEnum<{
                                            butt: "butt";
                                            round: "round";
                                            square: "square";
                                        }>>;
                                        lineJoin: z.ZodOptional<z.ZodEnum<{
                                            bevel: "bevel";
                                            miter: "miter";
                                            round: "round";
                                        }>>;
                                        miterLimit: z.ZodOptional<z.ZodNumber>;
                                    }, z.core.$strict>>;
                                }, z.core.$strict>, z.ZodObject<{
                                    kind: z.ZodLiteral<"circle">;
                                    center: z.ZodObject<{
                                        x: z.ZodNumber;
                                        y: z.ZodNumber;
                                    }, z.core.$strict>;
                                    radius: z.ZodNumber;
                                    fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                    fill: z.ZodOptional<z.ZodEnum<{
                                        foreground: "foreground";
                                        none: "none";
                                    }>>;
                                    stroke: z.ZodOptional<z.ZodEnum<{
                                        foreground: "foreground";
                                        none: "none";
                                    }>>;
                                    part: z.ZodOptional<z.ZodString>;
                                    style: z.ZodOptional<z.ZodObject<{
                                        strokeRole: z.ZodOptional<z.ZodEnum<{
                                            annotation: "annotation";
                                            emphasis: "emphasis";
                                            ground: "ground";
                                            normal: "normal";
                                            supply: "supply";
                                        }>>;
                                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                                        lineCap: z.ZodOptional<z.ZodEnum<{
                                            butt: "butt";
                                            round: "round";
                                            square: "square";
                                        }>>;
                                        lineJoin: z.ZodOptional<z.ZodEnum<{
                                            bevel: "bevel";
                                            miter: "miter";
                                            round: "round";
                                        }>>;
                                        miterLimit: z.ZodOptional<z.ZodNumber>;
                                    }, z.core.$strict>>;
                                }, z.core.$strict>, z.ZodObject<{
                                    kind: z.ZodLiteral<"rectangle">;
                                    bounds: z.ZodObject<{
                                        x: z.ZodNumber;
                                        y: z.ZodNumber;
                                        width: z.ZodNumber;
                                        height: z.ZodNumber;
                                    }, z.core.$strict>;
                                    fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                    fill: z.ZodOptional<z.ZodEnum<{
                                        foreground: "foreground";
                                        none: "none";
                                    }>>;
                                    stroke: z.ZodOptional<z.ZodEnum<{
                                        foreground: "foreground";
                                        none: "none";
                                    }>>;
                                    part: z.ZodOptional<z.ZodString>;
                                    style: z.ZodOptional<z.ZodObject<{
                                        strokeRole: z.ZodOptional<z.ZodEnum<{
                                            annotation: "annotation";
                                            emphasis: "emphasis";
                                            ground: "ground";
                                            normal: "normal";
                                            supply: "supply";
                                        }>>;
                                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                                        lineCap: z.ZodOptional<z.ZodEnum<{
                                            butt: "butt";
                                            round: "round";
                                            square: "square";
                                        }>>;
                                        lineJoin: z.ZodOptional<z.ZodEnum<{
                                            bevel: "bevel";
                                            miter: "miter";
                                            round: "round";
                                        }>>;
                                        miterLimit: z.ZodOptional<z.ZodNumber>;
                                    }, z.core.$strict>>;
                                }, z.core.$strict>, z.ZodObject<{
                                    kind: z.ZodLiteral<"path">;
                                    data: z.ZodString;
                                    fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                    bounds: z.ZodOptional<z.ZodObject<{
                                        x: z.ZodNumber;
                                        y: z.ZodNumber;
                                        width: z.ZodNumber;
                                        height: z.ZodNumber;
                                    }, z.core.$strict>>;
                                    part: z.ZodOptional<z.ZodString>;
                                    style: z.ZodOptional<z.ZodObject<{
                                        strokeRole: z.ZodOptional<z.ZodEnum<{
                                            annotation: "annotation";
                                            emphasis: "emphasis";
                                            ground: "ground";
                                            normal: "normal";
                                            supply: "supply";
                                        }>>;
                                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                                        lineCap: z.ZodOptional<z.ZodEnum<{
                                            butt: "butt";
                                            round: "round";
                                            square: "square";
                                        }>>;
                                        lineJoin: z.ZodOptional<z.ZodEnum<{
                                            bevel: "bevel";
                                            miter: "miter";
                                            round: "round";
                                        }>>;
                                        miterLimit: z.ZodOptional<z.ZodNumber>;
                                    }, z.core.$strict>>;
                                }, z.core.$strict>, z.ZodObject<{
                                    kind: z.ZodLiteral<"polygon">;
                                    points: z.ZodArray<z.ZodObject<{
                                        x: z.ZodNumber;
                                        y: z.ZodNumber;
                                    }, z.core.$strict>>;
                                    fillableBody: z.ZodOptional<z.ZodLiteral<true>>;
                                    fill: z.ZodEnum<{
                                        foreground: "foreground";
                                        none: "none";
                                    }>;
                                    stroke: z.ZodOptional<z.ZodEnum<{
                                        foreground: "foreground";
                                        none: "none";
                                    }>>;
                                    part: z.ZodOptional<z.ZodString>;
                                    style: z.ZodOptional<z.ZodObject<{
                                        strokeRole: z.ZodOptional<z.ZodEnum<{
                                            annotation: "annotation";
                                            emphasis: "emphasis";
                                            ground: "ground";
                                            normal: "normal";
                                            supply: "supply";
                                        }>>;
                                        strokeWidth: z.ZodOptional<z.ZodNumber>;
                                        lineCap: z.ZodOptional<z.ZodEnum<{
                                            butt: "butt";
                                            round: "round";
                                            square: "square";
                                        }>>;
                                        lineJoin: z.ZodOptional<z.ZodEnum<{
                                            bevel: "bevel";
                                            miter: "miter";
                                            round: "round";
                                        }>>;
                                        miterLimit: z.ZodOptional<z.ZodNumber>;
                                    }, z.core.$strict>>;
                                }, z.core.$strict>], "kind">>>;
                            }, z.core.$strict>>;
                            defaultVariantId: z.ZodOptional<z.ZodString>;
                            labelVisibility: z.ZodOptional<z.ZodEnum<{
                                hidden: "hidden";
                                shown: "shown";
                            }>>;
                            decorative: z.ZodOptional<z.ZodBoolean>;
                            hierarchicalBlock: z.ZodOptional<z.ZodLiteral<true>>;
                            formulaPresentation: z.ZodOptional<z.ZodObject<{
                                defaultFormula: z.ZodString;
                                supportsCoefficient: z.ZodBoolean;
                                center: z.ZodObject<{
                                    x: z.ZodNumber;
                                    y: z.ZodNumber;
                                }, z.core.$strict>;
                                fontSize: z.ZodNumber;
                                fractionBarWidth: z.ZodOptional<z.ZodNumber>;
                                adaptiveFrame: z.ZodOptional<z.ZodObject<{
                                    shape: z.ZodOptional<z.ZodEnum<{
                                        rectangle: "rectangle";
                                        "right-tapered-trapezoid": "right-tapered-trapezoid";
                                    }>>;
                                    minBodyWidth: z.ZodNumber;
                                    minBodyHeight: z.ZodNumber;
                                    horizontalPadding: z.ZodNumber;
                                    verticalPadding: z.ZodNumber;
                                    leadLength: z.ZodNumber;
                                }, z.core.$strict>>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>;
                        generatedFrom: z.ZodOptional<z.ZodObject<{
                            name: z.ZodString;
                            terminals: z.ZodArray<z.ZodObject<{
                                id: z.ZodString;
                                name: z.ZodString;
                                direction: z.ZodEnum<{
                                    inout: "inout";
                                    input: "input";
                                    output: "output";
                                    passive: "passive";
                                }>;
                                nameContent: z.ZodOptional<z.ZodType<import("./rich-text.js").RichTextDocument, unknown, z.core.$ZodTypeInternals<import("./rich-text.js").RichTextDocument, unknown>>>;
                            }, z.core.$strict>>;
                            presentation: z.ZodOptional<z.ZodObject<{
                                minimumBodySize: z.ZodOptional<z.ZodObject<{
                                    width: z.ZodNumber;
                                    height: z.ZodNumber;
                                }, z.core.$strict>>;
                                bodyBounds: z.ZodOptional<z.ZodObject<{
                                    left: z.ZodNumber;
                                    right: z.ZodNumber;
                                    top: z.ZodNumber;
                                    bottom: z.ZodNumber;
                                }, z.core.$strict>>;
                                pinPlacements: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                    terminalId: z.ZodString;
                                    side: z.ZodEnum<{
                                        east: "east";
                                        north: "north";
                                        south: "south";
                                        west: "west";
                                    }>;
                                    offset: z.ZodNumber;
                                }, z.core.$strict>>>;
                                artwork: z.ZodOptional<z.ZodType<import("./presentation.js").CellSymbolArtwork, unknown, z.core.$ZodTypeInternals<import("./presentation.js").CellSymbolArtwork, unknown>>>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>>;
                        electrical: z.ZodOptional<z.ZodObject<{
                            id: z.ZodString;
                            symbolId: z.ZodString;
                            deviceClass: z.ZodEnum<{
                                bjt: "bjt";
                                capacitor: "capacitor";
                                cccs: "cccs";
                                ccvs: "ccvs";
                                "current-source": "current-source";
                                diode: "diode";
                                inductor: "inductor";
                                jfet: "jfet";
                                mos: "mos";
                                "net-marker": "net-marker";
                                resistor: "resistor";
                                switch: "switch";
                                vccs: "vccs";
                                vcvs: "vcvs";
                                "voltage-source": "voltage-source";
                            }>;
                            mosBulkClass: z.ZodOptional<z.ZodEnum<{
                                nmos: "nmos";
                                pmos: "pmos";
                            }>>;
                            referencePrefix: z.ZodNullable<z.ZodString>;
                            pinOrder: z.ZodArray<z.ZodString>;
                            seriesInsertionPinPair: z.ZodOptional<z.ZodTuple<[z.ZodString, z.ZodString], null>>;
                            pinSemantics: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                pinName: z.ZodString;
                                role: z.ZodEnum<{
                                    "capacitor-bottom-plate": "capacitor-bottom-plate";
                                    "capacitor-top-plate": "capacitor-top-plate";
                                }>;
                            }, z.core.$strict>>>;
                            targetPolicy: z.ZodEnum<{
                                builtin: "builtin";
                                "child-cell": "child-cell";
                                none: "none";
                                "required-model": "required-model";
                            }>;
                            sourceWaveformDefault: z.ZodOptional<z.ZodEnum<{
                                dc: "dc";
                                pulse: "pulse";
                                pwl: "pwl";
                                sin: "sin";
                            }>>;
                            parameters: z.ZodArray<z.ZodObject<{
                                name: z.ZodString;
                                label: z.ZodString;
                                required: z.ZodBoolean;
                                editor: z.ZodEnum<{
                                    decimal: "decimal";
                                    select: "select";
                                    text: "text";
                                }>;
                                options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                    value: z.ZodString;
                                    label: z.ZodString;
                                }, z.core.$strict>>>;
                                visibleForSourceWaveforms: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                                    pulse: "pulse";
                                    pwl: "pwl";
                                    sin: "sin";
                                }>>>;
                                unitHint: z.ZodOptional<z.ZodString>;
                                placeholder: z.ZodString;
                                help: z.ZodString;
                                authoringVisibility: z.ZodOptional<z.ZodEnum<{
                                    compatibility: "compatibility";
                                    primary: "primary";
                                }>>;
                                defaultValue: z.ZodOptional<z.ZodString>;
                                displayRole: z.ZodEnum<{
                                    "finger-count": "finger-count";
                                    length: "length";
                                    multiplier: "multiplier";
                                    none: "none";
                                    value: "value";
                                    width: "width";
                                }>;
                            }, z.core.$strict>>;
                            dialects: z.ZodTuple<[z.ZodLiteral<"spice">, z.ZodLiteral<"spectre">], null>;
                            capabilities: z.ZodObject<{
                                supportsModel: z.ZodBoolean;
                                supportsBulkBinding: z.ZodBoolean;
                                supportsValueAnnotation: z.ZodBoolean;
                            }, z.core.$strict>;
                        }, z.core.$strict>>;
                        subcircuit: z.ZodOptional<z.ZodObject<{
                            id: z.ZodString;
                            symbolId: z.ZodString;
                            target: z.ZodString;
                            ports: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                                name: z.ZodString;
                                direction: z.ZodEnum<{
                                    inout: "inout";
                                    input: "input";
                                    output: "output";
                                    passive: "passive";
                                }>;
                                pinName: z.ZodString;
                            }, z.core.$strict>, z.ZodObject<{
                                name: z.ZodString;
                                direction: z.ZodEnum<{
                                    inout: "inout";
                                    input: "input";
                                    output: "output";
                                    passive: "passive";
                                }>;
                                supply: z.ZodEnum<{
                                    VDD: "VDD";
                                    VSS: "VSS";
                                }>;
                            }, z.core.$strict>]>>;
                        }, z.core.$strict>>;
                        circuitBinding: z.ZodOptional<z.ZodObject<{
                            definitionId: z.ZodString;
                            terminals: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                                terminalId: z.ZodString;
                                pinName: z.ZodString;
                            }, z.core.$strict>, z.ZodObject<{
                                terminalId: z.ZodString;
                                supply: z.ZodEnum<{
                                    VDD: "VDD";
                                    VSS: "VSS";
                                }>;
                            }, z.core.$strict>]>>;
                        }, z.core.$strict>>;
                        libraryOrigin: z.ZodOptional<z.ZodObject<{
                            componentId: z.ZodString;
                            revision: z.ZodNumber;
                            authorId: z.ZodString;
                            contentVersion: z.ZodLiteral<1>;
                            digest: z.ZodString;
                        }, z.core.$strict>>;
                    }, z.core.$strict>;
                    selected: z.ZodOptional<z.ZodObject<{
                        documentId: z.ZodString;
                        instanceId: z.ZodString;
                    }, z.core.$strict>>;
                    disconnectPorts: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    useAppliedSource: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>>;
            }, z.core.$strict>>>;
            dependencies: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                mountPath: z.ZodString;
                sha256: z.ZodString;
            }, z.core.$strict>>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
