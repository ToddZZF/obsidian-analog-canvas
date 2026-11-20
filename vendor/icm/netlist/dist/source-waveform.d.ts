import type { DesignNetlistParameter } from "./ir.js";
export type IndependentSourceWaveform = "dc" | "pulse" | "sin" | "pwl";
export interface SourceParameterIssue {
    readonly code: "INVALID_SOURCE_WAVEFORM" | "MISSING_SOURCE_WAVEFORM_PARAMETER" | "INVALID_PWL_POINTS";
    readonly parameter: string;
    readonly message: string;
}
export type NormalizedTransientWaveform = {
    readonly kind: "dc";
} | {
    readonly kind: "pulse";
    readonly low: string | undefined;
    readonly high: string | undefined;
    readonly delay: string | undefined;
    readonly rise: string | undefined;
    readonly fall: string | undefined;
    readonly width: string | undefined;
    readonly period: string | undefined;
} | {
    readonly kind: "sin";
    readonly offset: string | undefined;
    readonly amplitude: string | undefined;
    readonly frequency: string | undefined;
    readonly delay: string;
    readonly damping: string;
    readonly phase: string;
} | {
    readonly kind: "pwl";
    readonly points: readonly {
        readonly time: string;
        readonly value: string;
    }[];
};
export interface NormalizedIndependentSource {
    /** Parameters with an explicit canonical waveform projection. */
    readonly parameters: readonly DesignNetlistParameter[];
    readonly dc?: string;
    readonly ac?: {
        readonly magnitude: string;
        readonly phase: string;
    };
    readonly transient: NormalizedTransientWaveform;
    readonly extraParameters: readonly DesignNetlistParameter[];
    readonly issues: readonly SourceParameterIssue[];
}
/**
 * Normalize every independent source through one explicit waveform contract.
 * The caller supplies a descriptor-owned default only for pre-contract
 * projects. Presence of `period` or another timing field never selects a
 * waveform.
 */
export declare function normalizeIndependentSource(parameters: readonly DesignNetlistParameter[], defaultWaveform?: IndependentSourceWaveform): NormalizedIndependentSource;
