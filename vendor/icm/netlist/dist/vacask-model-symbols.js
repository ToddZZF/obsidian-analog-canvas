import { authoredModelSymbols, } from "./authored-circuit-scopes.js";
import { inspectVacaskSourceGraph } from "./vacask-source.js";
import { vacaskAuthoredCircuitEvents } from "./vacask-source-scopes.js";
/** Offline/runtime provisioning reads the actual library files. The same
 * scope table handles local shadows, ambiguous models and conditional calls. */
export function inspectNativeModelLibrarySymbols(input, names) {
    const graph = inspectVacaskSourceGraph(input);
    return {
        masters: graph.diagnostics.some((d) => d.severity === "error")
            ? []
            : authoredModelSymbols(vacaskAuthoredCircuitEvents(graph), names, {
                key: (name) => name,
            }),
        diagnostics: graph.diagnostics,
    };
}
/** A summary without a matching declared content digest is not evidence. */
export function resolveNativeModelLibraries(input, libraries) {
    return libraries.flatMap((library) => input.dependencies
        .filter((d) => d.id === library.dependencyId && d.sha256 === library.sha256)
        .map((d) => ({
        mountPath: d.mountPath,
        section: library.section,
        masters: library.masters,
    })));
}
