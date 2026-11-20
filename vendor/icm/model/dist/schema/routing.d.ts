import { z } from "zod";
export declare const RouteEndpointSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"terminal">;
    instanceId: z.ZodString;
    pinName: z.ZodString;
    memberId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"junction">;
    junctionId: z.ZodString;
    memberId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>], "kind">;
export declare const SegmentModeSchema: z.ZodEnum<{
    auto: "auto";
    escape: "escape";
    locked: "locked";
    manual: "manual";
    trunk: "trunk";
}>;
export declare const RoutePresentationSchema: z.ZodEnum<{
    "bulk-dashed": "bulk-dashed";
    "power-rail": "power-rail";
    wire: "wire";
}>;
/** Optional visual overrides for one electrical Route. */
export declare const RouteStyleOverrideSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const RouteLegSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const RouteBranchSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const JunctionRoleSchema: z.ZodEnum<{
    branch: "branch";
    "label-anchor": "label-anchor";
    "route-anchor": "route-anchor";
    "style-anchor": "style-anchor";
}>;
export declare const JunctionStyleOverrideSchema: z.ZodObject<{
    color: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const JunctionSchema: z.ZodObject<{
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
}, z.core.$strict>;
