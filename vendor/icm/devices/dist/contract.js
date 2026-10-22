/** A placed comparator is bound to the ideal comparator, whose call names the
 * body its high level chooses (ideal-comparator.ts); a numeric one calls this
 * signal-only body. The historical `comparator` target remains the five-port
 * external interface. */
export const IDEAL_COMPARATOR_TARGET = "icm_ideal_comparator";
export function requiredParameterNames(descriptor) {
    return descriptor.parameters
        .filter((parameter) => parameter.required)
        .map((parameter) => parameter.name);
}
