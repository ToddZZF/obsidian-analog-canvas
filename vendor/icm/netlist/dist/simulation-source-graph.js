import { inspectSimulationSource, unquoteSimulationToken, } from "@icm/spice";
import { inspectSourceFileGraph, } from "./source-file-graph.js";
/** Existing SPICE source adapter. Native VACASK replaces this adapter at the
 * compiler boundary, not the virtual-file ownership and traversal contract. */
export function inspectSimulationSourceGraph(input) {
    return inspectSourceFileGraph(input, (path, text, entry) => {
        const parsed = inspectSimulationSource({ path, text, id: path, hash: "", encoding: "utf-8" }, entry);
        return {
            items: parsed.statements.map((statement) => ({
                statement,
                sourceRef: statement.sourceRef,
                ...(statement.kind === "include"
                    ? {
                        include: {
                            requestedPath: unquoteSimulationToken(statement.requestedPath),
                        },
                    }
                    : statement.kind === "library" && statement.mode === "include"
                        ? {
                            include: {
                                requestedPath: unquoteSimulationToken(statement.requestedPath ?? ""),
                                section: statement.section,
                            },
                        }
                        : statement.kind === "library"
                            ? {
                                section: {
                                    kind: statement.mode === "section-start"
                                        ? "start"
                                        : "end",
                                    name: statement.section,
                                },
                            }
                            : {}),
            })),
            diagnostics: parsed.diagnostics.map(({ stage: _stage, ...item }) => item),
        };
    }, { sectionKey: (name) => name.toLowerCase() });
}
