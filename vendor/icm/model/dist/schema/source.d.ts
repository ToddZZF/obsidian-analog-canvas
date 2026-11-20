import { z } from "zod";
export declare const SourceSpanSchema: z.ZodObject<{
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
export declare const SourceFileRecordSchema: z.ZodObject<{
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
}, z.core.$strict>;
/** Frozen terminal membership, independent of mutable Base Net provenance. */
export declare const ImportReferenceSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const SourceManifestSchema: z.ZodObject<{
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
export declare const SymbolLibraryLockSchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodString;
    hash: z.ZodString;
}, z.core.$strict>;
