import { z } from "zod";
/** Source ownership, not a second copy of generated electrical facts. */
export declare const SimulationCircuitBindingSchema: z.ZodObject<{
    id: z.ZodString;
    path: z.ZodString;
    documentId: z.ZodString;
    emission: z.ZodEnum<{
        subcircuit: "subcircuit";
        "top-level": "top-level";
    }>;
}, z.core.$strict>;
/** Unapplied editing buffer, never an electrical override or executable source. */
export declare const SimulationSourceDraftSchema: z.ZodObject<{
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
}, z.core.$strict>;
/** A Project may save broken references and invalid author text for repair. */
export declare const SimulationSourceInputSchema: z.ZodObject<{
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
export declare const ProjectSimulationFolderSchema: z.ZodObject<{
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
}, z.core.$strict>;
/** Execution-only point override, shared by compiler, service and Agent; never saved as nominal intent. */
export declare const SimulationRunVariantSchema: z.ZodObject<{
    environment: z.ZodOptional<z.ZodObject<{
        corner: z.ZodOptional<z.ZodString>;
        temperatureC: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    parameters: z.ZodOptional<z.ZodArray<z.ZodObject<{
        documentId: z.ZodString;
        instanceId: z.ZodString;
        parameter: z.ZodString;
        value: z.ZodString;
    }, z.core.$strict>>>;
    variables: z.ZodOptional<z.ZodArray<z.ZodObject<{
        variableId: z.ZodString;
        value: z.ZodString;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export type SimulationRunVariant = z.infer<typeof SimulationRunVariantSchema>;
export declare const SimulationCircuitScopeSchema: z.ZodObject<{
    bindingId: z.ZodString;
    callPath: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
declare const Voltage: z.ZodObject<{
    documentId: z.ZodString;
    anchor: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"terminal">;
        instanceId: z.ZodString;
        pinName: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"junction">;
        junctionId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"route">;
        routeId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"base-net">;
        netId: z.ZodString;
    }, z.core.$strict>], "kind">;
    occurrence: z.ZodArray<z.ZodString>;
    kind: z.ZodLiteral<"voltage">;
    circuit: z.ZodObject<{
        bindingId: z.ZodString;
        callPath: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
declare const Current: z.ZodObject<{
    kind: z.ZodLiteral<"current">;
    documentId: z.ZodString;
    instanceId: z.ZodString;
    pinName: z.ZodString;
    occurrence: z.ZodArray<z.ZodString>;
    circuit: z.ZodObject<{
        bindingId: z.ZodString;
        callPath: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
declare const Vector: z.ZodObject<{
    kind: z.ZodLiteral<"vector">;
    vector: z.ZodString;
}, z.core.$strict>;
declare const unary: readonly ["negate", "magnitude", "db20", "phase", "real", "imaginary", "absolute"];
declare const binary: readonly ["add", "subtract", "multiply", "divide"];
export type SimulationSourceExpression = z.infer<typeof Voltage> | z.infer<typeof Current> | z.infer<typeof Vector> | {
    kind: "constant";
    value: number;
} | {
    kind: (typeof unary)[number];
    operand: SimulationSourceExpression;
} | {
    kind: (typeof binary)[number];
    left: SimulationSourceExpression;
    right: SimulationSourceExpression;
};
export declare const SimulationSourceExpressionSchema: z.ZodType<SimulationSourceExpression, unknown, z.core.$ZodTypeInternals<SimulationSourceExpression, unknown>>;
export declare const SimulationSourceDeviceOperatingPointSchema: z.ZodObject<{
    id: z.ZodString;
    documentId: z.ZodString;
    instanceId: z.ZodString;
    occurrence: z.ZodArray<z.ZodString>;
    circuit: z.ZodObject<{
        bindingId: z.ZodString;
        callPath: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
/** Native experiments define all electrical behavior in SPICE, not a sidecar. */
export declare const NativeSimulationExperimentConfigSchema: z.ZodObject<{
    version: z.ZodLiteral<2>;
    environment: z.ZodObject<{
        profileId: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
/** Version-1 compatibility reader. New experiments use the native version-2 contract. */
export declare const SimulationExperimentConfigSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    environment: z.ZodObject<{
        profileId: z.ZodString;
        corner: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    runPlan: z.ZodDefault<z.ZodDiscriminatedUnion<[z.ZodObject<{
        mode: z.ZodLiteral<"nominal">;
    }, z.core.$strict>, z.ZodObject<{
        mode: z.ZodLiteral<"sweep">;
        axes: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"corner">;
            values: z.ZodArray<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"temperature">;
            values: z.ZodArray<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"variable">;
            variableId: z.ZodString;
            values: z.ZodArray<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"parameter">;
            documentId: z.ZodString;
            instanceId: z.ZodString;
            parameter: z.ZodString;
            values: z.ZodArray<z.ZodString>;
        }, z.core.$strict>], "kind">>;
    }, z.core.$strict>], "mode">>;
    variables: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        bindings: z.ZodArray<z.ZodObject<{
            documentId: z.ZodString;
            instanceId: z.ZodString;
            parameter: z.ZodString;
        }, z.core.$strict>>;
        sourcePath: z.ZodString;
    }, z.core.$strict>>>;
    outputs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        expression: z.ZodType<SimulationSourceExpression, unknown, z.core.$ZodTypeInternals<SimulationSourceExpression, unknown>>;
    }, z.core.$strict>>>;
    deviceOperatingPoints: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        documentId: z.ZodString;
        instanceId: z.ZodString;
        occurrence: z.ZodArray<z.ZodString>;
        circuit: z.ZodObject<{
            bindingId: z.ZodString;
            callPath: z.ZodArray<z.ZodString>;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    measurements: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        analysis: z.ZodEnum<{
            ac: "ac";
            dc: "dc";
            noise: "noise";
            op: "op";
            tran: "tran";
        }>;
        outputId: z.ZodString;
        method: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"value">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"sample-at">;
            coordinate: z.ZodNumber;
        }, z.core.$strict>, ...(z.ZodObject<{
            kind: z.ZodLiteral<"maximum" | "minimum" | "peak-to-peak">;
            window: z.ZodOptional<z.ZodObject<{
                start: z.ZodNumber;
                stop: z.ZodNumber;
            }, z.core.$strict>>;
        }, z.core.$strict> | z.ZodObject<{
            kind: z.ZodLiteral<"mean" | "rms">;
            window: z.ZodObject<{
                start: z.ZodNumber;
                stop: z.ZodNumber;
            }, z.core.$strict>;
        }, z.core.$strict>)[]], "kind">;
    }, z.core.$strict>>>;
    collection: z.ZodDefault<z.ZodObject<{
        rawfile: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type SimulationSourceInput = z.infer<typeof SimulationSourceInputSchema>;
export type SimulationCircuitBinding = z.infer<typeof SimulationCircuitBindingSchema>;
export type SimulationCircuitScope = z.infer<typeof SimulationCircuitScopeSchema>;
export type SimulationExperimentConfig = z.infer<typeof SimulationExperimentConfigSchema>;
export {};
