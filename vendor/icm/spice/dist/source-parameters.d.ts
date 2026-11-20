/** The fields of an independent source's transient waveform, in card order. */
export declare const PULSE_PARAMETER_NAMES: readonly ["low", "high", "delay", "rise", "fall", "width", "period"];
export declare const SIN_REQUIRED_PARAMETER_NAMES: readonly ["offset", "amplitude", "frequency"];
export declare const SIN_OPTIONAL_PARAMETER_NAMES: readonly ["delay", "damping", "phase"];
/**
 * An independent source's card tail (`0.9 AC 1 0 PULSE(...)`) as the fields a
 * Canvas source keeps: `dc`, `acMagnitude`, `acPhase`, and a `waveform`
 * (`pulse`, `sin`, `pwl`) with its arguments. The reversible Canvas subset,
 * not a general native-SPICE parser.
 */
export declare function parseNgspiceSourceParameters(text: string, options?: {
    requireDc?: boolean;
}): {
    ok: true;
    parameters: Record<string, string>;
} | {
    ok: false;
    message: string;
};
