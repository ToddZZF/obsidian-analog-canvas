import { buildProjectConnectivityIndex } from "./connectivity-index.js";
import { runErcChecks } from "./diagnostics/erc.js";
const FLOATING_CODES = new Set([
    "ERC_UNCONNECTED_PIN",
    "ERC_FLOATING_GATE",
    "ERC_BULK_UNRESOLVED",
]);
const EXAMPLE_LIMIT = 5;
function terminalLabel(parameters) {
    const instanceId = parameters.instanceId;
    const pinName = parameters.pinName;
    return typeof instanceId === "string" && typeof pinName === "string"
        ? `${instanceId}.${pinName}`
        : "(terminal)";
}
export function evaluateSubmissionGates(project, resolver) {
    const failures = [];
    const diagnostics = runErcChecks(project, buildProjectConnectivityIndex(project, resolver), resolver);
    const errors = diagnostics.filter((diagnostic) => diagnostic.severity === "error");
    if (errors.length > 0) {
        failures.push({
            code: "erc-errors",
            message: "The schematic has electrical rule errors",
            count: errors.length,
            examples: errors
                .slice(0, EXAMPLE_LIMIT)
                .map((diagnostic) => `${diagnostic.code}: ${diagnostic.primary.objectId}`),
        });
    }
    const floating = diagnostics.filter((diagnostic) => FLOATING_CODES.has(diagnostic.code));
    if (floating.length > 0) {
        failures.push({
            code: "floating-endpoints",
            message: "Floating endpoints: wire each pin, declare a formal/global boundary, or mark it NoConnect",
            count: floating.length,
            examples: floating
                .slice(0, EXAMPLE_LIMIT)
                .map((diagnostic) => terminalLabel(diagnostic.parameters)),
        });
    }
    const instanceCount = project.documents.reduce((total, document) => total + document.instances.length, 0);
    const draftingObjects = project.documents.flatMap((document) => document.drafting?.objects ?? []);
    const drawingSubstantial = draftingObjects.length >= 3 &&
        draftingObjects.some((object) => object.kind === "text");
    if (instanceCount < 2 && !drawingSubstantial) {
        failures.push({
            code: "empty-project",
            message: "Too little content: place at least 2 components, or a drawing with 3+ objects including text",
            count: 1,
            examples: [],
        });
    }
    return { ok: failures.length === 0, failures };
}
