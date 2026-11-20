import { z } from "zod";
export declare const SignalDeclarationSchema: z.ZodObject<{
    expression: z.ZodString;
    members: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        netId: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
/** Logical-Net electrical role shared by derived and Agent contracts. */
export declare const NetPowerDomainSchema: z.ZodEnum<{
    conflict: "conflict";
    ground: "ground";
    none: "none";
    vdd: "vdd";
}>;
export declare const NetSchema: z.ZodObject<{
    id: z.ZodString;
    terminals: z.ZodArray<z.ZodObject<{
        instanceId: z.ZodString;
        pinName: z.ZodString;
        memberId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
/** Persisted typed naming and import provenance for one Base Net. */
export declare const ConnectivityEvidenceSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strict>], "kind">;
export declare const NoConnectSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const InductorCouplingSchema: z.ZodObject<{
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
}, z.core.$strict>;
