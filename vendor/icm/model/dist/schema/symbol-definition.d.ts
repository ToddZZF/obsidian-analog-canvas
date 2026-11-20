import { z } from "zod";
/** Smallest legal electrical pin pitch; ordinary placement still uses the Document grid. */
export declare const SYMBOL_CONNECTION_GRID = 2;
/** Existing symbols and free placement retain this coarser visual pitch. */
export declare const SYMBOL_STANDARD_GRID = 10;
export declare const SymbolPinSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const SymbolStrokeRoleSchema: z.ZodEnum<{
    annotation: "annotation";
    emphasis: "emphasis";
    ground: "ground";
    normal: "normal";
    supply: "supply";
}>;
export declare const SymbolPrimitiveSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strict>], "kind">;
export declare const SymbolFormulaPresentationSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const SymbolVariantSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const SymbolDefinitionSchema: z.ZodObject<{
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
export type SymbolPin = z.infer<typeof SymbolPinSchema>;
export type SymbolFormulaPresentation = z.infer<typeof SymbolFormulaPresentationSchema>;
export type SymbolStrokeRole = z.infer<typeof SymbolStrokeRoleSchema>;
export type SymbolPrimitive = z.infer<typeof SymbolPrimitiveSchema>;
export type SymbolVariant = z.infer<typeof SymbolVariantSchema>;
export type SymbolDefinition = z.infer<typeof SymbolDefinitionSchema>;
