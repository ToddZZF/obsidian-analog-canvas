import { z } from "zod";
export declare const SimulationPostprocessorOriginSchema: z.ZodObject<{
    logLine: z.ZodNumber;
}, z.core.$strict>;
export declare const SimulationRawPlotOrdinalsSchema: z.ZodArray<z.ZodNumber>;
export declare const SimulationResultDataSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    analyses: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        rawPlotOrdinals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        analysis: z.ZodLiteral<"op">;
        postprocessor: z.ZodOptional<z.ZodObject<{
            logLine: z.ZodNumber;
        }, z.core.$strict>>;
        scalars: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            value: z.ZodNumber;
            imaginary: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        plotName: z.ZodString;
        probes: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            value: z.ZodNumber;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        analysis: z.ZodLiteral<"ac">;
        postprocessor: z.ZodOptional<z.ZodObject<{
            logLine: z.ZodNumber;
        }, z.core.$strict>>;
        scalars: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            value: z.ZodNumber;
            imaginary: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        rawPlotOrdinals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        plotName: z.ZodString;
        frequencyHz: z.ZodArray<z.ZodNumber>;
        probes: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            real: z.ZodArray<z.ZodNumber>;
            imag: z.ZodArray<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        analysis: z.ZodLiteral<"dc">;
        postprocessor: z.ZodOptional<z.ZodObject<{
            logLine: z.ZodNumber;
        }, z.core.$strict>>;
        scalars: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            value: z.ZodNumber;
            imaginary: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        rawPlotOrdinals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        plotName: z.ZodString;
        sweep: z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            values: z.ZodArray<z.ZodNumber>;
        }, z.core.$strict>;
        probes: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            value: z.ZodArray<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        analysis: z.ZodLiteral<"tran">;
        postprocessor: z.ZodOptional<z.ZodObject<{
            logLine: z.ZodNumber;
        }, z.core.$strict>>;
        scalars: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            value: z.ZodNumber;
            imaginary: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        rawPlotOrdinals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        plotName: z.ZodString;
        timeSeconds: z.ZodArray<z.ZodNumber>;
        probes: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            value: z.ZodArray<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        analysis: z.ZodLiteral<"noise">;
        postprocessor: z.ZodOptional<z.ZodObject<{
            logLine: z.ZodNumber;
        }, z.core.$strict>>;
        scalars: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            value: z.ZodNumber;
            imaginary: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        rawPlotOrdinals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        plotName: z.ZodLiteral<"Noise Analysis">;
        frequencyHz: z.ZodArray<z.ZodNumber>;
        outputNoiseDensity: z.ZodArray<z.ZodNumber>;
        inputNoiseDensity: z.ZodArray<z.ZodNullable<z.ZodNumber>>;
        integratedOutputNoise: z.ZodOptional<z.ZodNumber>;
        integratedInputNoise: z.ZodOptional<z.ZodNumber>;
        integrationMethod: z.ZodOptional<z.ZodLiteral<"trapezoidal-psd">>;
        probes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            quantity: z.ZodString;
            unit: z.ZodNullable<z.ZodString>;
            value: z.ZodArray<z.ZodNumber>;
        }, z.core.$strict>>>;
        units: z.ZodObject<{
            outputDensity: z.ZodLiteral<"V/sqrt(Hz)">;
            inputDensity: z.ZodEnum<{
                "A/sqrt(Hz)": "A/sqrt(Hz)";
                "V/sqrt(Hz)": "V/sqrt(Hz)";
            }>;
            integratedOutput: z.ZodLiteral<"V">;
            integratedInput: z.ZodEnum<{
                A: "A";
                V: "V";
            }>;
        }, z.core.$strict>;
    }, z.core.$strict>], "analysis">>;
    rawPlots: z.ZodOptional<z.ZodArray<z.ZodObject<{
        ordinal: z.ZodNumber;
        artifactPath: z.ZodOptional<z.ZodString>;
        artifactPlotOrdinal: z.ZodOptional<z.ZodNumber>;
        plotName: z.ZodString;
        pointCount: z.ZodNumber;
        variables: z.ZodArray<z.ZodString>;
        analysisIndex: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
/**
 * `SimulationResult` from `@icm/spice-run`, plus the hosted route's own
 * `execution` note about which executor answered. Strict: see the file header.
 */
export declare const SimulationResultSchema: z.ZodObject<{
    outcome: z.ZodDiscriminatedUnion<[z.ZodObject<{
        status: z.ZodLiteral<"completed">;
    }, z.core.$strict>, z.ZodObject<{
        status: z.ZodLiteral<"completed-with-dropped-input">;
    }, z.core.$strict>, z.ZodObject<{
        status: z.ZodLiteral<"failed">;
    }, z.core.$strict>, z.ZodObject<{
        status: z.ZodLiteral<"timed-out">;
        timeoutMs: z.ZodNumber;
    }, z.core.$strict>], "status">;
    diagnostics: z.ZodArray<z.ZodObject<{
        severity: z.ZodEnum<{
            error: "error";
            info: "info";
            warning: "warning";
        }>;
        text: z.ZodString;
        location: z.ZodOptional<z.ZodObject<{
            file: z.ZodString;
            line: z.ZodNumber;
        }, z.core.$strict>>;
        count: z.ZodOptional<z.ZodNumber>;
        droppedInput: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    log: z.ZodString;
    durationMs: z.ZodNumber;
    metadata: z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        input: z.ZodObject<{
            inputRevision: z.ZodNullable<z.ZodString>;
            netlistSha256: z.ZodString;
            testbenchSha256: z.ZodString;
            deckSha256: z.ZodString;
        }, z.core.$strict>;
        configuration: z.ZodObject<{
            modelLibrary: z.ZodNullable<z.ZodUnion<readonly [z.ZodObject<{
                directive: z.ZodLiteral<"include">;
                section: z.ZodNull;
            }, z.core.$strict>, z.ZodObject<{
                directive: z.ZodLiteral<"lib">;
                section: z.ZodString;
            }, z.core.$strict>]>>;
        }, z.core.$strict>;
        environment: z.ZodObject<{
            executor: z.ZodEnum<{
                "hosted-container": "hosted-container";
                "local-host": "local-host";
            }>;
            reproducibility: z.ZodEnum<{
                observed: "observed";
                pinned: "pinned";
            }>;
            profileId: z.ZodNullable<z.ZodString>;
            platform: z.ZodString;
            simulator: z.ZodObject<{
                name: z.ZodEnum<{
                    ngspice: "ngspice";
                    vacask: "vacask";
                }>;
                version: z.ZodString;
                binarySha256: z.ZodNullable<z.ZodString>;
            }, z.core.$strict>;
            models: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                contentSha256: z.ZodString;
            }, z.core.$strict>>;
            startupSha256: z.ZodNullable<z.ZodString>;
            fingerprint: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>;
    data: z.ZodOptional<z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        analyses: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            rawPlotOrdinals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            analysis: z.ZodLiteral<"op">;
            postprocessor: z.ZodOptional<z.ZodObject<{
                logLine: z.ZodNumber;
            }, z.core.$strict>>;
            scalars: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                value: z.ZodNumber;
                imaginary: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>>;
            plotName: z.ZodString;
            probes: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                value: z.ZodNumber;
            }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
            analysis: z.ZodLiteral<"ac">;
            postprocessor: z.ZodOptional<z.ZodObject<{
                logLine: z.ZodNumber;
            }, z.core.$strict>>;
            scalars: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                value: z.ZodNumber;
                imaginary: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>>;
            rawPlotOrdinals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            plotName: z.ZodString;
            frequencyHz: z.ZodArray<z.ZodNumber>;
            probes: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                real: z.ZodArray<z.ZodNumber>;
                imag: z.ZodArray<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
            analysis: z.ZodLiteral<"dc">;
            postprocessor: z.ZodOptional<z.ZodObject<{
                logLine: z.ZodNumber;
            }, z.core.$strict>>;
            scalars: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                value: z.ZodNumber;
                imaginary: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>>;
            rawPlotOrdinals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            plotName: z.ZodString;
            sweep: z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                values: z.ZodArray<z.ZodNumber>;
            }, z.core.$strict>;
            probes: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                value: z.ZodArray<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
            analysis: z.ZodLiteral<"tran">;
            postprocessor: z.ZodOptional<z.ZodObject<{
                logLine: z.ZodNumber;
            }, z.core.$strict>>;
            scalars: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                value: z.ZodNumber;
                imaginary: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>>;
            rawPlotOrdinals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            plotName: z.ZodString;
            timeSeconds: z.ZodArray<z.ZodNumber>;
            probes: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                value: z.ZodArray<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
            analysis: z.ZodLiteral<"noise">;
            postprocessor: z.ZodOptional<z.ZodObject<{
                logLine: z.ZodNumber;
            }, z.core.$strict>>;
            scalars: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                value: z.ZodNumber;
                imaginary: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>>;
            rawPlotOrdinals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            plotName: z.ZodLiteral<"Noise Analysis">;
            frequencyHz: z.ZodArray<z.ZodNumber>;
            outputNoiseDensity: z.ZodArray<z.ZodNumber>;
            inputNoiseDensity: z.ZodArray<z.ZodNullable<z.ZodNumber>>;
            integratedOutputNoise: z.ZodOptional<z.ZodNumber>;
            integratedInputNoise: z.ZodOptional<z.ZodNumber>;
            integrationMethod: z.ZodOptional<z.ZodLiteral<"trapezoidal-psd">>;
            probes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                quantity: z.ZodString;
                unit: z.ZodNullable<z.ZodString>;
                value: z.ZodArray<z.ZodNumber>;
            }, z.core.$strict>>>;
            units: z.ZodObject<{
                outputDensity: z.ZodLiteral<"V/sqrt(Hz)">;
                inputDensity: z.ZodEnum<{
                    "A/sqrt(Hz)": "A/sqrt(Hz)";
                    "V/sqrt(Hz)": "V/sqrt(Hz)";
                }>;
                integratedOutput: z.ZodLiteral<"V">;
                integratedInput: z.ZodEnum<{
                    A: "A";
                    V: "V";
                }>;
            }, z.core.$strict>;
        }, z.core.$strict>], "analysis">>;
        rawPlots: z.ZodOptional<z.ZodArray<z.ZodObject<{
            ordinal: z.ZodNumber;
            artifactPath: z.ZodOptional<z.ZodString>;
            artifactPlotOrdinal: z.ZodOptional<z.ZodNumber>;
            plotName: z.ZodString;
            pointCount: z.ZodNumber;
            variables: z.ZodArray<z.ZodString>;
            analysisIndex: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    execution: z.ZodOptional<z.ZodObject<{
        target: z.ZodEnum<{
            "cloudflare-container": "cloudflare-container";
            "operator-host": "operator-host";
        }>;
    }, z.core.$strict>>;
}, z.core.$strict>;
