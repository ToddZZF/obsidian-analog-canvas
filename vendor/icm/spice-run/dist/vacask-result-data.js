import { parseVacaskRawfile } from "./vacask-rawfile.js";
class ProjectionFault extends Error {
}
const keyOf = (path, ordinal) => JSON.stringify([path, ordinal]);
/**
 * Native records -> the same numerical contract used by charts, CSV and MCP.
 * Caller retains the original artifacts. No filenames, plot titles, column
 * positions or vector spellings are interpreted as acquisition semantics.
 * A readable partial result is not a successful Run: errors remain diagnostics
 * for the execution verdict. Outer sweeps still need explicit projections.
 */
export function readVacaskSimulationData(artifacts, projections) {
    const diagnostics = [];
    const fail = (text) => diagnostics.push({ severity: "error", text });
    const plans = new Map();
    for (const plan of projections) {
        const key = keyOf(plan.artifactPath, plan.plotOrdinal);
        if (!Number.isSafeInteger(plan.plotOrdinal) ||
            plan.plotOrdinal < 0 ||
            plans.has(key))
            return {
                status: "unusable",
                diagnostics: [
                    {
                        severity: "error",
                        text: `Invalid or duplicate VACASK record mapping: ${key}.`,
                    },
                ],
            };
        plans.set(key, plan);
    }
    const paths = new Set();
    const seen = new Set();
    const analyses = [];
    const rawPlots = [];
    for (const artifact of artifacts) {
        if (!artifact.path || paths.has(artifact.path))
            return {
                status: "unusable",
                diagnostics: [
                    {
                        severity: "error",
                        text: `Duplicate or empty VACASK artifact path: ${artifact.path}.`,
                    },
                ],
            };
        paths.add(artifact.path);
        const parsed = parseVacaskRawfile(artifact.text);
        if (!parsed.ok) {
            fail(`${artifact.path}: ${parsed.error.message}${parsed.error.line === null ? "" : ` (line ${parsed.error.line})`}`);
            continue;
        }
        for (const [artifactPlotOrdinal, plot] of parsed.plots.entries()) {
            const key = keyOf(artifact.path, artifactPlotOrdinal);
            seen.add(key);
            const plan = plans.get(key);
            const ordinal = rawPlots.length;
            let analysisIndex;
            if (plan) {
                try {
                    const result = projectPlot(plot, plan, (message) => diagnostics.push({
                        severity: "warning",
                        text: `${artifact.path} record ${artifactPlotOrdinal}: ${message}`,
                    }));
                    analysisIndex = analyses.length;
                    analyses.push({
                        ...result,
                        rawPlotOrdinals: [ordinal],
                        ...(plan.postprocessor
                            ? { postprocessor: plan.postprocessor }
                            : {}),
                    });
                }
                catch (error) {
                    if (!(error instanceof ProjectionFault))
                        throw error;
                    fail(`${artifact.path} record ${artifactPlotOrdinal}: ${error.message}`);
                }
            }
            else
                diagnostics.push({
                    severity: "warning",
                    text: `${artifact.path} record ${artifactPlotOrdinal} (${plot.plotName}) has no qualified numerical projection; inspect the original artifact.`,
                });
            rawPlots.push({
                ordinal,
                artifactPath: artifact.path,
                artifactPlotOrdinal,
                plotName: plot.plotName,
                pointCount: plot.pointCount,
                variables: plot.vectors.map((v) => v.variable.name),
                ...(analysisIndex === undefined ? {} : { analysisIndex }),
            });
        }
    }
    for (const [key, plan] of plans)
        if (!seen.has(key))
            fail(`Missing VACASK output ${plan.artifactPath} record ${plan.plotOrdinal}.`);
    if (!analyses.length)
        return {
            status: "unusable",
            diagnostics: diagnostics.length
                ? diagnostics
                : [
                    {
                        severity: "error",
                        text: "VACASK returned no numerical records.",
                    },
                ],
        };
    return {
        status: "read",
        data: { schemaVersion: 1, analyses, rawPlots },
        diagnostics,
    };
}
function projectPlot(plot, plan, warn) {
    const variables = new Map(plot.vectors.map((v) => [v.variable.name, v]));
    const required = (name) => {
        const value = variables.get(name);
        if (!value)
            throw new ProjectionFault(`Required vector ${JSON.stringify(name)} is missing; no zero value was substituted.`);
        return value;
    };
    const meanings = new Map();
    for (const probe of plan.probes ?? []) {
        if (meanings.has(probe.name))
            throw new ProjectionFault(`Duplicate acquisition mapping for ${probe.name}.`);
        required(probe.name);
        meanings.set(probe.name, probe);
    }
    const probeOf = (v) => meanings.get(v.variable.name) ?? {
        name: v.variable.name,
        quantity: v.variable.quantity,
        unit: null,
    };
    if (plan.analysis === "op") {
        if (plot.complex || plot.pointCount !== 1)
            throw new ProjectionFault("Operating point requires one real sample; a swept OP cannot be collapsed to its first point.");
        return {
            analysis: "op",
            plotName: plot.plotName,
            probes: plot.vectors.map((v) => ({ ...probeOf(v), value: v.real[0] })),
        };
    }
    const axisName = typeof plan.axis === "string" ? plan.axis : plan.axis.name;
    const axis = required(axisName);
    if (axis.imag?.some((value) => value !== 0))
        throw new ProjectionFault(`Axis ${axisName} is complex, not a real independent variable.`);
    if (plot.complex !== (plan.analysis === "ac"))
        throw new ProjectionFault(`${plan.analysis} mapping disagrees with the native real/complex record.`);
    const probes = plot.vectors.filter((v) => v !== axis);
    if (!probes.length)
        throw new ProjectionFault("The record contains an axis but no measured vectors.");
    if (plan.analysis === "noise") {
        const psd = required(plan.outputPsd);
        const gain = required(plan.powerGain);
        if (new Set([axisName, plan.outputPsd, plan.powerGain]).size !== 3)
            throw new ProjectionFault("Noise frequency, output PSD and power gain must identify different vectors.");
        if (axis.real.some((value) => value < 0) ||
            psd.real.some((value) => value < 0))
            throw new ProjectionFault("Noise frequency and total output PSD must be nonnegative.");
        const inputPsd = psd.real.map((value, index) => gain.real[index] > 0 ? value / gain.real[index] : null);
        const inputDensity = psd.real.map((value, index) => {
            const result = gain.real[index] > 0
                ? Math.sqrt(value) / Math.sqrt(gain.real[index])
                : NaN;
            return Number.isFinite(result) ? result : null;
        });
        if (inputDensity.some((value) => value === null))
            warn("Input-referred noise is unavailable where power gain is nonpositive or the amplitude is non-finite. Those samples remain gaps, not zero.");
        const integratedOutputNoise = integrateNoisePsd(axis.real, psd.real);
        const integratedInputNoise = integrateNoisePsd(axis.real, inputPsd);
        if (integratedOutputNoise === undefined ||
            integratedInputNoise === undefined)
            warn("One or both noise integrals are unavailable: integration requires at least two increasing frequencies and finite nonnegative PSD samples.");
        return {
            analysis: "noise",
            plotName: "Noise Analysis",
            frequencyHz: axis.real,
            outputNoiseDensity: psd.real.map(Math.sqrt),
            inputNoiseDensity: inputDensity,
            ...(integratedOutputNoise === undefined ? {} : { integratedOutputNoise }),
            ...(integratedInputNoise === undefined ? {} : { integratedInputNoise }),
            integrationMethod: "trapezoidal-psd",
            units: {
                outputDensity: "V/sqrt(Hz)",
                integratedOutput: "V",
                inputDensity: plan.inputQuantity === "voltage" ? "V/sqrt(Hz)" : "A/sqrt(Hz)",
                integratedInput: plan.inputQuantity === "voltage" ? "V" : "A",
            },
            probes: probes.map((v) => ({
                ...probeOf(v),
                value: v.real,
                ...(v === psd
                    ? { quantity: "voltage-noise-psd", unit: "V²/Hz" }
                    : v === gain
                        ? {
                            quantity: "noise-transfer-squared",
                            unit: plan.inputQuantity === "voltage" ? "1" : "V²/A²",
                        }
                        : {}),
            })),
        };
    }
    if (plan.analysis === "ac")
        return {
            analysis: "ac",
            plotName: plot.plotName,
            frequencyHz: axis.real,
            probes: probes.map((v) => ({
                ...probeOf(v),
                real: v.real,
                imag: v.imag,
            })),
        };
    if (plan.analysis === "tran")
        return {
            analysis: "tran",
            plotName: plot.plotName,
            timeSeconds: axis.real,
            probes: probes.map((v) => ({ ...probeOf(v), value: v.real })),
        };
    return {
        analysis: "dc",
        plotName: plot.plotName,
        sweep: { ...plan.axis, values: axis.real },
        probes: probes.map((v) => ({ ...probeOf(v), value: v.real })),
    };
}
/** Explicit sampled-spectrum estimate, not a simulator-reported integral.
 * Integrate PSD (never ASD), over exactly the recorded band. Do not sort,
 * extrapolate or bridge missing samples. A single frequency has no bandwidth. */
function integrateNoisePsd(frequency, psd) {
    if (frequency.length < 2 ||
        psd.some((v) => v === null || !Number.isFinite(v) || v < 0))
        return undefined;
    let integral = 0;
    for (let i = 1; i < frequency.length; i++) {
        const width = frequency[i] - frequency[i - 1];
        if (!(width > 0))
            return undefined;
        integral += (psd[i - 1] / 2 + psd[i] / 2) * width;
        if (!Number.isFinite(integral))
            return undefined;
    }
    return Math.sqrt(integral);
}
