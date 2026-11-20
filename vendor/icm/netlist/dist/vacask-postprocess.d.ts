/** Explicit output framing, not an input/analysis protocol or a numeric evaluator. */
export declare const VACASK_MEASUREMENT_PREFIX = "ICM_MEASUREMENT_V1 ";
export declare const VACASK_PLOT_PREFIX = "ICM_PLOT_V1 ";
/** Declare the meaning of an authored native ASCII raw record after writing it.
 * This helper does not evaluate expressions, write waveforms or read files. */
export declare function vacaskPlotPythonSource(): string;
/** Ordinary authored Python for a native postprocess program. No hidden runner,
 * imports outside the standard library, or frontend evaluation of expressions.
 * Call with a lambda so one failed measurement does not abort later reports. */
export declare function vacaskMeasurementPythonSource(): string;
