export function diagnostic(code, severity, stage, message, sourceRef, related) {
    return {
        code,
        severity,
        stage,
        message,
        ...(sourceRef ? { sourceRef } : {}),
        ...(related && related.length > 0 ? { related } : {}),
    };
}
