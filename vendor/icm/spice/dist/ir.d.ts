import { z } from "zod";
export declare const CircuitNetIRSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    scope: z.ZodEnum<{
        global: "global";
        local: "local";
    }>;
}, z.core.$strict>;
export declare const CircuitInstanceTargetIRSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"primitive">;
    family: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"model">;
    modelName: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"subcircuit">;
    cellName: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"external-subcircuit">;
    masterName: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"opaque">;
    sourceName: z.ZodString;
}, z.core.$strict>], "kind">;
export declare const CircuitParameterDeclarationIRSchema: z.ZodObject<{
    name: z.ZodString;
    rawText: z.ZodString;
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
}, z.core.$strict>;
export declare const CircuitInstanceIRSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    target: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"primitive">;
        family: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"model">;
        modelName: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"subcircuit">;
        cellName: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"external-subcircuit">;
        masterName: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"opaque">;
        sourceName: z.ZodString;
    }, z.core.$strict>], "kind">;
    terminals: z.ZodArray<z.ZodObject<{
        position: z.ZodNumber;
        name: z.ZodOptional<z.ZodString>;
        netId: z.ZodString;
    }, z.core.$strict>>;
    parameters: z.ZodRecord<z.ZodString, z.ZodObject<{
        rawText: z.ZodString;
        normalizedName: z.ZodString;
    }, z.core.$strict>>;
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
}, z.core.$strict>;
export declare const CircuitCellIRSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    ports: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        position: z.ZodNumber;
        netId: z.ZodString;
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
    }, z.core.$strict>>;
    nets: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        scope: z.ZodEnum<{
            global: "global";
            local: "local";
        }>;
    }, z.core.$strict>>;
    instances: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        target: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"primitive">;
            family: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"model">;
            modelName: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"subcircuit">;
            cellName: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"external-subcircuit">;
            masterName: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"opaque">;
            sourceName: z.ZodString;
        }, z.core.$strict>], "kind">;
        terminals: z.ZodArray<z.ZodObject<{
            position: z.ZodNumber;
            name: z.ZodOptional<z.ZodString>;
            netId: z.ZodString;
        }, z.core.$strict>>;
        parameters: z.ZodRecord<z.ZodString, z.ZodObject<{
            rawText: z.ZodString;
            normalizedName: z.ZodString;
        }, z.core.$strict>>;
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
    parameters: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        rawText: z.ZodString;
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
}, z.core.$strict>;
export declare const ModelDeclarationIRSchema: z.ZodObject<{
    name: z.ZodString;
    modelType: z.ZodString;
    rawParameters: z.ZodString;
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
}, z.core.$strict>;
export declare const OpaqueStatementSchema: z.ZodObject<{
    kind: z.ZodLiteral<"opaque">;
    rawText: z.ZodString;
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
    probableType: z.ZodOptional<z.ZodEnum<{
        control: "control";
        directive: "directive";
        element: "element";
    }>>;
}, z.core.$strict>;
export declare const PreservedStatementIRSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        conditional: "conditional";
        control: "control";
        directive: "directive";
        function: "function";
        library: "library";
    }>;
    name: z.ZodString;
    rawText: z.ZodString;
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
}, z.core.$strict>;
export declare const CircuitIRSchema: z.ZodObject<{
    dialect: z.ZodString;
    topCells: z.ZodArray<z.ZodString>;
    cells: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        ports: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            position: z.ZodNumber;
            netId: z.ZodString;
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
        }, z.core.$strict>>;
        nets: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            scope: z.ZodEnum<{
                global: "global";
                local: "local";
            }>;
        }, z.core.$strict>>;
        instances: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            target: z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"primitive">;
                family: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"model">;
                modelName: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"subcircuit">;
                cellName: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"external-subcircuit">;
                masterName: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"opaque">;
                sourceName: z.ZodString;
            }, z.core.$strict>], "kind">;
            terminals: z.ZodArray<z.ZodObject<{
                position: z.ZodNumber;
                name: z.ZodOptional<z.ZodString>;
                netId: z.ZodString;
            }, z.core.$strict>>;
            parameters: z.ZodRecord<z.ZodString, z.ZodObject<{
                rawText: z.ZodString;
                normalizedName: z.ZodString;
            }, z.core.$strict>>;
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
        parameters: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            rawText: z.ZodString;
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
    parameters: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        rawText: z.ZodString;
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
    models: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        modelType: z.ZodString;
        rawParameters: z.ZodString;
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
    preservedStatements: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            conditional: "conditional";
            control: "control";
            directive: "directive";
            function: "function";
            library: "library";
        }>;
        name: z.ZodString;
        rawText: z.ZodString;
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
    unresolvedStatements: z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"opaque">;
        rawText: z.ZodString;
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
        probableType: z.ZodOptional<z.ZodEnum<{
            control: "control";
            directive: "directive";
            element: "element";
        }>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type CircuitNetIR = z.infer<typeof CircuitNetIRSchema>;
export type CircuitInstanceIR = z.infer<typeof CircuitInstanceIRSchema>;
export type CircuitCellIR = z.infer<typeof CircuitCellIRSchema>;
export type CircuitParameterDeclarationIR = z.infer<typeof CircuitParameterDeclarationIRSchema>;
export type ModelDeclarationIR = z.infer<typeof ModelDeclarationIRSchema>;
export type OpaqueStatement = z.infer<typeof OpaqueStatementSchema>;
export type PreservedStatementIR = z.infer<typeof PreservedStatementIRSchema>;
export type CircuitIR = z.infer<typeof CircuitIRSchema>;
