// What every extraction stage shares: the resolved options, the portable
// identifier subset, name order, and how a finding is recorded.
import { directObjectLocator } from "@icm/derived";
const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/u;
export function isIdentifier(value, allowGround = false) {
    return (allowGround && value === "0") || IDENTIFIER.test(value);
}
export function compareText(left, right) {
    return left.localeCompare(right, "en", { sensitivity: "base" });
}
export function diagnostic(diagnostics, documentId, code, message, objectIds = [], severity = "error", parameter) {
    diagnostics.push({
        code,
        severity,
        documentId,
        objectIds,
        primary: directObjectLocator(documentId, "document", documentId),
        message,
        ...(parameter === undefined ? {} : { parameter }),
    });
}
