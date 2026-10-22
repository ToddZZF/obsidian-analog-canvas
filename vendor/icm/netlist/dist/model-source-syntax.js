import { inspectSimulationSource, } from "@icm/spice";
import { inspectSourceFileGraph, } from "./source-file-graph.js";
import { inspectVacaskSource, } from "./vacask-source.js";
/** Spectre declaration inspection shares a lexical reader, not a VACASK executor.
 * Native bodies remain opaque and retain their original text and locations. */
export function inspectModelSourceFile(language, path, text) {
    if (language === "spice")
        return inspectSimulationSource({ path, id: path, text, hash: "", encoding: "utf-8" }, false);
    const original = inspectVacaskSource(path, text, false);
    const boundaries = [
        ...text.matchAll(/^[ \t]*simulator[ \t]+lang[ \t]*=[ \t]*([A-Za-z]+)[ \t]*(?:\/\/[^\n]*)?\r?$/gm),
    ].filter((m) => !original.comments.some((c) => m.index >= c.start && m.index < c.end));
    const spiceRanges = boundaries.flatMap((m, index) => m[1].toLowerCase() === "spice"
        ? [
            {
                start: m.index + m[0].length,
                end: boundaries[index + 1]?.index ?? text.length,
            },
        ]
        : []);
    const mask = (keepSpice) => {
        let rangeIndex = 0;
        return text
            .split("")
            .map((c, index) => {
            while (spiceRanges[rangeIndex] && index >= spiceRanges[rangeIndex].end)
                rangeIndex++;
            const range = spiceRanges[rangeIndex];
            const spice = Boolean(range && index >= range.start && index < range.end);
            return (keepSpice ? spice : !spice) || c === "\n" || c === "\r"
                ? c
                : " ";
        })
            .join("");
    };
    const parsed = inspectVacaskSource(path, spiceRanges.length ? mask(false) : text, false);
    const diagnostics = parsed.diagnostics.map((d) => ({ ...d, code: "MODEL_SOURCE_SYNTAX" }));
    const statements = [];
    for (const native of parsed.statements) {
        const { rawText, sourceRef, tokens } = native;
        const base = { rawText, sourceRef };
        const [head, name] = tokens;
        const fail = (message) => {
            diagnostics.push({
                code: "MODEL_SOURCE_DECLARATION",
                severity: "error",
                message,
                path,
                sourceRef,
            });
            statements.push({ ...base, kind: "opaque", reason: message });
        };
        if (head?.value === "subckt") {
            const opening = tokens[2]?.value === "(";
            const end = opening
                ? tokens.findIndex((t, i) => i > 2 && t.value === ")")
                : tokens.findIndex((_t, i) => i > 1 && tokens[i + 1]?.value === "=");
            const ports = tokens.slice(opening ? 3 : 2, end < 0 ? undefined : end);
            if (!name ||
                name.kind !== "word" ||
                (opening && end < 0) ||
                ports.some((t) => t.kind !== "word")) {
                fail("Use a named subckt with a literal ordered port list");
                continue;
            }
            statements.push({
                ...base,
                kind: "subckt_start",
                name: name.value,
                ports: ports.map((t) => t.value),
                parameters: nativeParameters(text, tokens.slice(end < 0 ? tokens.length : opening ? end + 1 : end), sourceRef, fail),
            });
        }
        else if (head?.value === "ends") {
            if (tokens.length > 2)
                fail("ends takes an optional subcircuit name");
            statements.push({
                ...base,
                kind: "subckt_end",
                ...(name ? { name: name.value } : {}),
            });
        }
        else if (head?.value === "parameters") {
            statements.push({
                ...base,
                kind: "parameter",
                parameters: nativeParameters(text, tokens.slice(1), sourceRef, fail),
            });
        }
        else if (head?.value === "include") {
            if (name?.kind !== "string" ||
                (tokens.length !== 2 &&
                    !(tokens.length === 5 &&
                        tokens[2]?.value === "section" &&
                        tokens[3]?.value === "="))) {
                fail("Use a literal include path with an optional section");
                continue;
            }
            statements.push(tokens.length === 2
                ? { ...base, kind: "include", requestedPath: name.value }
                : {
                    ...base,
                    kind: "library",
                    mode: "include",
                    requestedPath: name.value,
                    section: tokens[4].value,
                });
        }
        else if (head?.value === "section" || head?.value === "endsection") {
            statements.push({
                ...base,
                kind: "library",
                mode: head.value === "section" ? "section-start" : "section-end",
                section: name?.value ?? "",
            });
        }
        else if (head?.value === "model") {
            if (!name || !tokens[2]) {
                fail("Model name and type are required");
                continue;
            }
            statements.push({
                ...base,
                kind: "model",
                name: name.value,
                modelType: tokens[2].value,
                rawParameters: text.slice(tokens[3]?.start ?? sourceRef.end.offset, sourceRef.end.offset),
            });
        }
        else if (head?.value === "simulator") {
            if (tokens.length !== 4 ||
                tokens[1]?.value !== "lang" ||
                tokens[2]?.value !== "=" ||
                !["spice", "spectre"].includes(tokens[3]?.value ?? ""))
                fail("This model language boundary is unsupported; edit the native source");
        }
        else if ([
            "op",
            "dc",
            "ac",
            "tran",
            "noise",
            "save",
            "print",
            "control",
            "endc",
        ].includes(head?.value ?? "") ||
            ["op", "dc", "ac", "tran", "noise"].includes(name?.value ?? "")) {
            fail("Model sources contain definitions, not experiment analyses or controls");
        }
        else {
            statements.push({
                ...base,
                kind: "opaque",
                reason: "Native Spectre body; runtime qualification is separate",
            });
        }
    }
    if (spiceRanges.length) {
        const spice = inspectSimulationSource({ path, id: path, text: mask(true), hash: "", encoding: "utf-8" }, false);
        statements.push(...spice.statements.map((s) => ({
            ...s,
            sourceLanguage: "spice",
        })));
        diagnostics.push(...spice.diagnostics);
        statements.sort((a, b) => a.sourceRef.start.offset - b.sourceRef.start.offset);
    }
    return { statements, diagnostics };
}
function nativeParameters(text, tokens, sourceRef, fail) {
    const starts = [];
    let depth = 0;
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (!depth && t.kind === "word" && tokens[i + 1]?.value === "=")
            starts.push(i);
        if ("([{".includes(t.value) && t.kind === "symbol")
            depth++;
        if (")]}".includes(t.value) && t.kind === "symbol")
            depth--;
    }
    if (tokens.length && starts[0] !== 0)
        fail("Use named parameter assignments");
    return starts.map((start, index) => {
        const end = starts[index + 1] ?? tokens.length;
        const rawText = text
            .slice(tokens[start + 2]?.start ?? tokens[start + 1].end, tokens[end - 1].end)
            .trim();
        if (!rawText)
            fail("Parameter defaults cannot be empty");
        return { name: tokens[start].value, rawText, sourceRef };
    });
}
export function inspectModelSourceGraph(source) {
    return inspectSourceFileGraph({
        kind: "source",
        entry: source.entry,
        configPath: "__model_config.json",
        files: source.files,
        dependencies: source.dependencies,
        circuitBindings: [],
    }, (path, text) => {
        const parsed = inspectModelSourceFile(source.language, path, text);
        return {
            items: parsed.statements.map((statement) => ({
                statement,
                sourceRef: statement.sourceRef,
                ...(statement.kind === "include"
                    ? {
                        include: {
                            requestedPath: statement.requestedPath.replace(/^"|"$/g, ""),
                        },
                    }
                    : statement.kind === "library"
                        ? statement.mode === "include"
                            ? {
                                include: {
                                    requestedPath: statement.requestedPath.replace(/^"|"$/g, ""),
                                    section: statement.section,
                                },
                            }
                            : {
                                section: {
                                    kind: statement.mode === "section-start"
                                        ? "start"
                                        : "end",
                                    name: statement.section,
                                },
                            }
                        : {}),
            })),
            diagnostics: parsed.diagnostics,
        };
    }, {
        sectionKey: (name, path, declaration) => modelSourceSectionKey(source, path, name, declaration),
    });
}
/** A library section takes its case rule from its real declaration. */
export function modelSourceSectionKey(source, path, name, declaration) {
    const file = source.files.find((f) => f.path === path);
    if (!file)
        return name;
    const sections = inspectModelSourceFile(source.language, path, file.text).statements.filter((s) => s.kind === "library" && s.mode === "section-start");
    const key = (section) => (section.sourceLanguage ?? source.language) === "spice"
        ? `spice:${section.section.toLowerCase()}`
        : `spectre:${section.section}`;
    const matches = sections.filter((s) => declaration
        ? s.sourceRef.start.offset === declaration.start.offset
        : (s.sourceLanguage ?? source.language) === "spice"
            ? s.section.toLowerCase() === name.toLowerCase()
            : s.section === name);
    // An ambiguous load cannot select either definition silently.
    return matches.length === 1 ? key(matches[0]) : `\u0000unresolved:${name}`;
}
