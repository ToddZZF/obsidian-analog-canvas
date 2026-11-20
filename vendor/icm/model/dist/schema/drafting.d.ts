import { z } from "zod";
export declare const ArrowEndStyleSchema: z.ZodEnum<{
    dot: "dot";
    "large-arrow": "large-arrow";
    "medium-arrow": "medium-arrow";
    none: "none";
    "open-arrow": "open-arrow";
    "small-arrow": "small-arrow";
}>;
export type ArrowEndStyle = z.infer<typeof ArrowEndStyleSchema>;
export declare const DraftTextSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const DraftArrowSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const DraftingObjectSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strict>], "kind">;
export declare const DraftingLayerSchema: z.ZodObject<{
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
}, z.core.$strict>;
