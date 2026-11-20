import { z } from "zod";
/** Stable Noise result ids shared by Setup measurements, service, and clients. */
export declare const SIMULATION_NOISE_OUTPUT_DENSITY_ID = "noise-output-density";
export declare const SIMULATION_NOISE_INPUT_DENSITY_ID = "noise-input-density";
/**
 * Hierarchy Instance ids from the simulation root down to the Document that
 * owns the probed object; empty when that object is in the root itself.
 */
export declare const SimulationProbeOccurrenceSchema: z.ZodArray<z.ZodString>;
/**
 * A concrete object that locates a voltage measurement on its current Base
 * Net. The referenced object may later be deleted; that leaves an unresolved
 * authored probe for preparation to diagnose instead of making the Project
 * invalid or silently rebinding it.
 */
export declare const SimulationVoltageProbeAnchorSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
/** One hierarchy-aware voltage location, shared by Outputs and Noise. */
export declare const SimulationVoltageProbeSchema: z.ZodObject<{
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
}, z.core.$strict>;
declare const SimulationVoltageExpressionSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const SimulationAnalysisSpecSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"op">;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"dc">;
    sourceInstanceId: z.ZodString;
    startValue: z.ZodNumber;
    stopValue: z.ZodNumber;
    stepValue: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"ac">;
    sweep: z.ZodEnum<{
        dec: "dec";
        lin: "lin";
        oct: "oct";
    }>;
    points: z.ZodNumber;
    startHz: z.ZodNumber;
    stopHz: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"tran">;
    stepSeconds: z.ZodNumber;
    stopSeconds: z.ZodNumber;
    startSeconds: z.ZodOptional<z.ZodNumber>;
    maxStepSeconds: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"noise">;
    output: z.ZodObject<{
        positive: z.ZodObject<{
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
        }, z.core.$strict>;
        negative: z.ZodOptional<z.ZodObject<{
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
        }, z.core.$strict>>;
    }, z.core.$strict>;
    inputSourceInstanceId: z.ZodString;
    sweep: z.ZodEnum<{
        dec: "dec";
        lin: "lin";
        oct: "oct";
    }>;
    points: z.ZodNumber;
    startHz: z.ZodNumber;
    stopHz: z.ZodNumber;
}, z.core.$strict>], "kind">;
declare const SimulationCurrentExpressionSchema: z.ZodObject<{
    kind: z.ZodLiteral<"current">;
    documentId: z.ZodString;
    instanceId: z.ZodString;
    pinName: z.ZodString;
    occurrence: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export type SimulationExpression = z.infer<typeof SimulationVoltageExpressionSchema> | z.infer<typeof SimulationCurrentExpressionSchema> | {
    readonly kind: "constant";
    readonly value: number;
} | {
    readonly kind: "negate" | "magnitude" | "db20" | "phase" | "real" | "imaginary" | "absolute";
    readonly operand: SimulationExpression;
} | {
    readonly kind: "add" | "subtract" | "multiply" | "divide";
    readonly left: SimulationExpression;
    readonly right: SimulationExpression;
};
/**
 * One concrete MOS occurrence whose terminal-derived operating-point details
 * should be collected. The compiler resolves the device and its Bulk binding;
 * persisted folder state never stores simulator vector names or model-private
 * parameters.
 */
export declare const SimulationDeviceOperatingPointSpecSchema: z.ZodObject<{
    id: z.ZodString;
    documentId: z.ZodString;
    instanceId: z.ZodString;
    occurrence: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
/** A saved rule that reduces one authored Output to one scalar per Run. */
export declare const SimulationMeasurementSpecSchema: z.ZodObject<{
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
}, z.core.$strict>;
/**
 * Only the stable Profile ID plus the author's allowed selections. A Profile
 * manifest, model path, simulator digest, or measured fingerprint is resolved
 * at preparation time and reported by the run, never copied into the Project.
 */
export declare const SimulationEnvironmentSelectionSchema: z.ZodObject<{
    profileId: z.ZodString;
    corner: z.ZodOptional<z.ZodString>;
    temperatureC: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
/**
 * A Setup-local scalar shared by one or more exact Instance parameters.
 * Values stay textual so the existing SPICE parameter grammar remains the
 * single authority for suffixes and expressions.
 */
export declare const SimulationDesignVariableSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    value: z.ZodString;
    bindings: z.ZodArray<z.ZodObject<{
        documentId: z.ZodString;
        instanceId: z.ZodString;
        parameter: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const SimulationRunPlanAxisSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strict>], "kind">;
export declare const SimulationRunPlanSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strict>], "mode">;
/**
 * Raw simulation inputs use a virtual, relative namespace. The same rule is
 * shared by persisted folders and transient Agent workspaces; it never grants
 * access to a browser or host filesystem.
 */
export declare const MAX_SIMULATION_INPUT_FILES = 24;
export declare const MAX_SIMULATION_INPUT_BYTES: number;
export declare function isSimulationInputPath(path: string): boolean;
/** Resolve a decoded filename inside the virtual source root; no language parsing or IO. */
export declare function resolveSimulationInputPath(sourcePath: string, requested: string): string | null;
export declare const SimulationInputPathSchema: z.ZodString;
export declare const SimulationRawFileSchema: z.ZodObject<{
    path: z.ZodString;
    text: z.ZodString;
}, z.core.$strict>;
/**
 * A large or environment-owned file that is not copied into the Project.
 * `id` is the resolver-facing logical identity, `mountPath` is the relative
 * path authored SPICE refers to, and the digest prevents silent substitution.
 */
export declare const SimulationRawDependencySchema: z.ZodObject<{
    id: z.ZodString;
    mountPath: z.ZodString;
    sha256: z.ZodString;
}, z.core.$strict>;
export declare const SimulationRawInputSchema: z.ZodObject<{
    kind: z.ZodLiteral<"raw">;
    entry: z.ZodString;
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        text: z.ZodString;
    }, z.core.$strict>>;
    dependencies: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        mountPath: z.ZodString;
        sha256: z.ZodString;
    }, z.core.$strict>>;
    environment: z.ZodObject<{
        profileId: z.ZodString;
        corner: z.ZodOptional<z.ZodString>;
        temperatureC: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const SimulationStructuredInputSchema: z.ZodObject<{
    kind: z.ZodLiteral<"structured">;
    rootDocumentId: z.ZodString;
    analyses: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"op">;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"dc">;
        sourceInstanceId: z.ZodString;
        startValue: z.ZodNumber;
        stopValue: z.ZodNumber;
        stepValue: z.ZodNumber;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"ac">;
        sweep: z.ZodEnum<{
            dec: "dec";
            lin: "lin";
            oct: "oct";
        }>;
        points: z.ZodNumber;
        startHz: z.ZodNumber;
        stopHz: z.ZodNumber;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"tran">;
        stepSeconds: z.ZodNumber;
        stopSeconds: z.ZodNumber;
        startSeconds: z.ZodOptional<z.ZodNumber>;
        maxStepSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"noise">;
        output: z.ZodObject<{
            positive: z.ZodObject<{
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
            }, z.core.$strict>;
            negative: z.ZodOptional<z.ZodObject<{
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
            }, z.core.$strict>>;
        }, z.core.$strict>;
        inputSourceInstanceId: z.ZodString;
        sweep: z.ZodEnum<{
            dec: "dec";
            lin: "lin";
            oct: "oct";
        }>;
        points: z.ZodNumber;
        startHz: z.ZodNumber;
        stopHz: z.ZodNumber;
    }, z.core.$strict>], "kind">>;
    outputs: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        expression: z.ZodType<SimulationExpression, unknown, z.core.$ZodTypeInternals<SimulationExpression, unknown>>;
    }, z.core.$strict>>;
    deviceOperatingPoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        documentId: z.ZodString;
        instanceId: z.ZodString;
        occurrence: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>>;
    measurements: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    designVariables: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        value: z.ZodString;
        bindings: z.ZodArray<z.ZodObject<{
            documentId: z.ZodString;
            instanceId: z.ZodString;
            parameter: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    runPlan: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    }, z.core.$strict>], "mode">;
    environment: z.ZodObject<{
        profileId: z.ZodString;
        corner: z.ZodOptional<z.ZodString>;
        temperatureC: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
}, z.core.$strict>;
/** Read-only historical input for the one-way source migration; never a current Project writer. */
export declare const LegacySimulationSetupSchema: z.ZodObject<{
    version: z.ZodLiteral<3>;
    input: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"structured">;
        rootDocumentId: z.ZodString;
        analyses: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"op">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"dc">;
            sourceInstanceId: z.ZodString;
            startValue: z.ZodNumber;
            stopValue: z.ZodNumber;
            stepValue: z.ZodNumber;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"ac">;
            sweep: z.ZodEnum<{
                dec: "dec";
                lin: "lin";
                oct: "oct";
            }>;
            points: z.ZodNumber;
            startHz: z.ZodNumber;
            stopHz: z.ZodNumber;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"tran">;
            stepSeconds: z.ZodNumber;
            stopSeconds: z.ZodNumber;
            startSeconds: z.ZodOptional<z.ZodNumber>;
            maxStepSeconds: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"noise">;
            output: z.ZodObject<{
                positive: z.ZodObject<{
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
                }, z.core.$strict>;
                negative: z.ZodOptional<z.ZodObject<{
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
                }, z.core.$strict>>;
            }, z.core.$strict>;
            inputSourceInstanceId: z.ZodString;
            sweep: z.ZodEnum<{
                dec: "dec";
                lin: "lin";
                oct: "oct";
            }>;
            points: z.ZodNumber;
            startHz: z.ZodNumber;
            stopHz: z.ZodNumber;
        }, z.core.$strict>], "kind">>;
        outputs: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            expression: z.ZodType<SimulationExpression, unknown, z.core.$ZodTypeInternals<SimulationExpression, unknown>>;
        }, z.core.$strict>>;
        deviceOperatingPoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            documentId: z.ZodString;
            instanceId: z.ZodString;
            occurrence: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>>;
        measurements: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
        designVariables: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            value: z.ZodString;
            bindings: z.ZodArray<z.ZodObject<{
                documentId: z.ZodString;
                instanceId: z.ZodString;
                parameter: z.ZodString;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        runPlan: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
        }, z.core.$strict>], "mode">;
        environment: z.ZodObject<{
            profileId: z.ZodString;
            corner: z.ZodOptional<z.ZodString>;
            temperatureC: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"raw">;
        entry: z.ZodString;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            text: z.ZodString;
        }, z.core.$strict>>;
        dependencies: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            mountPath: z.ZodString;
            sha256: z.ZodString;
        }, z.core.$strict>>;
        environment: z.ZodObject<{
            profileId: z.ZodString;
            corner: z.ZodOptional<z.ZodString>;
            temperatureC: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
    }, z.core.$strict>], "kind">;
}, z.core.$strict>;
/** A named Project-owned folder. The id is the durable run/selection address;
 * the name is presentation and may change independently. */
export declare const LegacyProjectSimulationSetupSchema: z.ZodObject<{
    version: z.ZodLiteral<3>;
    input: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"structured">;
        rootDocumentId: z.ZodString;
        analyses: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"op">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"dc">;
            sourceInstanceId: z.ZodString;
            startValue: z.ZodNumber;
            stopValue: z.ZodNumber;
            stepValue: z.ZodNumber;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"ac">;
            sweep: z.ZodEnum<{
                dec: "dec";
                lin: "lin";
                oct: "oct";
            }>;
            points: z.ZodNumber;
            startHz: z.ZodNumber;
            stopHz: z.ZodNumber;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"tran">;
            stepSeconds: z.ZodNumber;
            stopSeconds: z.ZodNumber;
            startSeconds: z.ZodOptional<z.ZodNumber>;
            maxStepSeconds: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"noise">;
            output: z.ZodObject<{
                positive: z.ZodObject<{
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
                }, z.core.$strict>;
                negative: z.ZodOptional<z.ZodObject<{
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
                }, z.core.$strict>>;
            }, z.core.$strict>;
            inputSourceInstanceId: z.ZodString;
            sweep: z.ZodEnum<{
                dec: "dec";
                lin: "lin";
                oct: "oct";
            }>;
            points: z.ZodNumber;
            startHz: z.ZodNumber;
            stopHz: z.ZodNumber;
        }, z.core.$strict>], "kind">>;
        outputs: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            expression: z.ZodType<SimulationExpression, unknown, z.core.$ZodTypeInternals<SimulationExpression, unknown>>;
        }, z.core.$strict>>;
        deviceOperatingPoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            documentId: z.ZodString;
            instanceId: z.ZodString;
            occurrence: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>>;
        measurements: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
        designVariables: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            value: z.ZodString;
            bindings: z.ZodArray<z.ZodObject<{
                documentId: z.ZodString;
                instanceId: z.ZodString;
                parameter: z.ZodString;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        runPlan: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
        }, z.core.$strict>], "mode">;
        environment: z.ZodObject<{
            profileId: z.ZodString;
            corner: z.ZodOptional<z.ZodString>;
            temperatureC: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"raw">;
        entry: z.ZodString;
        files: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            text: z.ZodString;
        }, z.core.$strict>>;
        dependencies: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            mountPath: z.ZodString;
            sha256: z.ZodString;
        }, z.core.$strict>>;
        environment: z.ZodObject<{
            profileId: z.ZodString;
            corner: z.ZodOptional<z.ZodString>;
            temperatureC: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
    }, z.core.$strict>], "kind">;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strict>;
export {};
