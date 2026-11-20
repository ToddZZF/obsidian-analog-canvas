import { z } from "zod";
declare const ComponentDefinitionSourceSchema: z.ZodObject<{
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
}, z.core.$strict>;
export type ComponentDefinitionSource = z.infer<typeof ComponentDefinitionSourceSchema>;
/** One local class, referenced by Instance.symbolId and floating symbols. */
export declare const ComponentLibraryOriginSchema: z.ZodObject<{
    componentId: z.ZodString;
    revision: z.ZodNumber;
    authorId: z.ZodString;
    contentVersion: z.ZodLiteral<1>;
    digest: z.ZodString;
}, z.core.$strict>;
export declare const ComponentDefinitionSchema: z.ZodObject<{
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
export type ComponentDefinition = z.infer<typeof ComponentDefinitionSchema>;
export {};
