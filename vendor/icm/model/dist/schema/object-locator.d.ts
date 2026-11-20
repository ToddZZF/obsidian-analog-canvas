import { z } from "zod";
/** Canonical Project-scoped object kinds used by diagnostics and navigation. */
export declare const ObjectLocatorKindSchema: z.ZodEnum<{
    annotation: "annotation";
    document: "document";
    instance: "instance";
    junction: "junction";
    net: "net";
    "no-connect": "no-connect";
    route: "route";
    terminal: "terminal";
}>;
/** One parent-instance step in an occurrence-aware hierarchy address. */
export declare const HierarchyFrameSchema: z.ZodObject<{
    parentDocumentId: z.ZodString;
    instanceId: z.ZodString;
    childDocumentId: z.ZodString;
}, z.core.$strict>;
/**
 * Canonical Project-scoped object address (Net connectivity rationale).
 *
 * A direct object in a Document has `hierarchyPath: []`; an object reached
 * through hierarchy carries the explicit parent-instance chain rather than
 * relying on a Document id alone.
 */
export declare const ObjectLocatorSchema: z.ZodObject<{
    documentId: z.ZodString;
    hierarchyPath: z.ZodArray<z.ZodObject<{
        parentDocumentId: z.ZodString;
        instanceId: z.ZodString;
        childDocumentId: z.ZodString;
    }, z.core.$strict>>;
    kind: z.ZodEnum<{
        annotation: "annotation";
        document: "document";
        instance: "instance";
        junction: "junction";
        net: "net";
        "no-connect": "no-connect";
        route: "route";
        terminal: "terminal";
    }>;
    objectId: z.ZodString;
    endpoint: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"terminal">;
        instanceId: z.ZodString;
        pinName: z.ZodString;
        memberId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"junction">;
        junctionId: z.ZodString;
        memberId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "kind">>;
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
}, z.core.$strict>;
