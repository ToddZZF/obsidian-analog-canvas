import { z } from "zod";
export declare const VisualAnchorSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
/**
 * A bound Annotation is a display of one electrical/domain fact, never a
 * second copy of that fact's text. Literal content is reserved for drawing
 * annotations such as current and voltage markers.
 */
export declare const AnnotationTextBindingSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strict>], "kind">;
export declare const RouteAnnotationAttachmentSchema: z.ZodObject<{
    routeId: z.ZodString;
    legId: z.ZodString;
    t: z.ZodNumber;
    direction: z.ZodEnum<{
        forward: "forward";
        reverse: "reverse";
    }>;
    normalOffset: z.ZodNumber;
}, z.core.$strict>;
export declare const AnnotationSchema: z.ZodObject<{
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
}, z.core.$strict>;
