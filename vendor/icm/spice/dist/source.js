import { deriveStableId } from "@icm/model";
import { diagnostic } from "./diagnostics.js";
import { parseSpiceSource } from "./syntax.js";
/** Whether a source is native Spectre, by its extension or its first lines. */
export function isSpectreSource(input) {
    const prefix = new TextDecoder().decode(input.bytes.subarray(0, 512));
    return (/\.scs$/iu.test(input.path) ||
        /^\s*(?:simulator\s+lang\s*=\s*spectre|subckt\s)/imu.test(prefix));
}
export function normalizeSourcePath(path) {
    const replaced = path.replaceAll("\\", "/").replace(/^\.\//u, "");
    if (!replaced ||
        replaced.startsWith("/") ||
        /^[a-z]:\//iu.test(replaced) ||
        replaced.includes("://")) {
        return null;
    }
    const parts = [];
    for (const part of replaced.split("/")) {
        if (!part || part === ".")
            continue;
        if (part === "..") {
            if (parts.length === 0)
                return null;
            parts.pop();
        }
        else {
            parts.push(part);
        }
    }
    return parts.join("/") || null;
}
function directory(path) {
    const separator = path.lastIndexOf("/");
    return separator < 0 ? "" : path.slice(0, separator);
}
function resolveInclude(sourcePath, requestedPath, rootDirectory) {
    if (requestedPath.startsWith("/") ||
        /^[a-z]:[\\/]/iu.test(requestedPath) ||
        requestedPath.includes("://")) {
        return null;
    }
    const combined = [directory(sourcePath), requestedPath]
        .filter(Boolean)
        .join("/");
    const normalized = normalizeSourcePath(combined);
    if (!normalized)
        return null;
    if (rootDirectory &&
        normalized !== rootDirectory &&
        !normalized.startsWith(`${rootDirectory}/`)) {
        return null;
    }
    if (!rootDirectory && normalized.startsWith("../"))
        return null;
    return normalized;
}
async function sha256(bytes) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", Uint8Array.from(bytes).buffer);
    return `sha256:${[...new Uint8Array(digest)]
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("")}`;
}
export function decodeSourceContent(bytes) {
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
        return {
            encoding: "utf-8-bom",
            text: new TextDecoder("utf-8").decode(bytes.slice(3)),
        };
    }
    if (bytes[0] === 0xff && bytes[1] === 0xfe) {
        return {
            encoding: "utf-16-le",
            text: new TextDecoder("utf-16le").decode(bytes.slice(2)),
        };
    }
    if (bytes[0] === 0xfe && bytes[1] === 0xff) {
        return {
            encoding: "utf-16-be",
            text: new TextDecoder("utf-16be").decode(bytes.slice(2)),
        };
    }
    return {
        encoding: "utf-8",
        text: new TextDecoder("utf-8", { fatal: true }).decode(bytes),
    };
}
async function loadInputs(inputs) {
    const files = new Map();
    const diagnostics = [];
    for (const input of inputs) {
        const path = normalizeSourcePath(input.path);
        if (!path) {
            diagnostics.push(diagnostic("SPICE_SOURCE_PATH_DENIED", "error", "source", `Invalid selected source path: ${input.path}`));
            continue;
        }
        if (files.has(path)) {
            diagnostics.push(diagnostic("SPICE_SOURCE_DUPLICATE_PATH", "error", "source", `Duplicate selected source path: ${path}`));
            continue;
        }
        try {
            const decoded = decodeSourceContent(input.bytes);
            files.set(path, {
                id: deriveStableId("source", path),
                path,
                hash: await sha256(input.bytes),
                encoding: decoded.encoding,
                text: decoded.text,
            });
        }
        catch (error) {
            diagnostics.push(diagnostic("SPICE_SOURCE_DECODE_FAILED", "error", "source", `Cannot decode ${path}: ${error instanceof Error ? error.message : String(error)}`));
        }
    }
    return { files, diagnostics };
}
export async function createSourceBundle(inputs, entryPath) {
    const normalizedEntry = normalizeSourcePath(entryPath) ?? entryPath;
    const loaded = await loadInputs(inputs);
    const entry = loaded.files.get(normalizedEntry);
    const diagnostics = [...loaded.diagnostics];
    const files = [];
    const syntaxFiles = [];
    const dependencies = [];
    if (!entry) {
        diagnostics.push(diagnostic("SPICE_SOURCE_ENTRY_MISSING", "error", "source", `Selected entry does not exist: ${normalizedEntry}`));
        return {
            entryPath: normalizedEntry,
            entryFileId: null,
            files,
            syntaxFiles,
            dependencies,
            diagnostics,
        };
    }
    const visited = new Set();
    const active = [];
    const rootDirectory = directory(normalizedEntry);
    function visit(path) {
        const source = loaded.files.get(path);
        visited.add(path);
        active.push(path);
        files.push(source);
        const syntax = parseSpiceSource(source);
        syntaxFiles.push(syntax);
        diagnostics.push(...syntax.diagnostics);
        for (const statement of syntax.statements) {
            if (statement.kind !== "include" &&
                !(statement.kind === "library" && statement.mode === "include")) {
                continue;
            }
            const includeStatement = statement;
            const resolvedPath = resolveInclude(path, includeStatement.requestedPath, rootDirectory);
            if (!resolvedPath) {
                dependencies.push({
                    sourceFileId: source.id,
                    requestedPath: includeStatement.requestedPath,
                    resolvedPath: null,
                    targetFileId: null,
                    status: "denied",
                    ...(includeStatement.kind === "library"
                        ? { section: includeStatement.section }
                        : {}),
                    sourceRef: includeStatement.sourceRef,
                });
                diagnostics.push(diagnostic("SPICE_SOURCE_INCLUDE_DENIED", "error", "source", `Include escapes the selected source root or is not local: ${includeStatement.requestedPath}`, includeStatement.sourceRef));
                continue;
            }
            const target = loaded.files.get(resolvedPath);
            if (!target) {
                dependencies.push({
                    sourceFileId: source.id,
                    requestedPath: includeStatement.requestedPath,
                    resolvedPath,
                    targetFileId: null,
                    status: "missing",
                    ...(includeStatement.kind === "library"
                        ? { section: includeStatement.section }
                        : {}),
                    sourceRef: includeStatement.sourceRef,
                });
                diagnostics.push(diagnostic("SPICE_SOURCE_INCLUDE_MISSING", "error", "source", `Include target was not selected or found: ${includeStatement.requestedPath}`, includeStatement.sourceRef));
                continue;
            }
            if (active.includes(resolvedPath)) {
                dependencies.push({
                    sourceFileId: source.id,
                    requestedPath: includeStatement.requestedPath,
                    resolvedPath,
                    targetFileId: target.id,
                    status: "cycle",
                    ...(includeStatement.kind === "library"
                        ? { section: includeStatement.section }
                        : {}),
                    sourceRef: includeStatement.sourceRef,
                });
                diagnostics.push(diagnostic("SPICE_SOURCE_INCLUDE_CYCLE", "error", "source", `Include cycle detected: ${[...active, resolvedPath].join(" -> ")}`, includeStatement.sourceRef));
                continue;
            }
            if (visited.has(resolvedPath)) {
                dependencies.push({
                    sourceFileId: source.id,
                    requestedPath: includeStatement.requestedPath,
                    resolvedPath,
                    targetFileId: target.id,
                    status: "duplicate",
                    ...(includeStatement.kind === "library"
                        ? { section: includeStatement.section }
                        : {}),
                    sourceRef: includeStatement.sourceRef,
                });
                diagnostics.push(diagnostic("SPICE_SOURCE_INCLUDE_DUPLICATE", "info", "source", `Duplicate include suppressed: ${includeStatement.requestedPath}`, includeStatement.sourceRef));
                continue;
            }
            dependencies.push({
                sourceFileId: source.id,
                requestedPath: includeStatement.requestedPath,
                resolvedPath,
                targetFileId: target.id,
                status: "resolved",
                ...(includeStatement.kind === "library"
                    ? { section: includeStatement.section }
                    : {}),
                sourceRef: includeStatement.sourceRef,
            });
            visit(resolvedPath);
        }
        active.pop();
    }
    visit(normalizedEntry);
    return {
        entryPath: normalizedEntry,
        entryFileId: entry.id,
        files,
        syntaxFiles,
        dependencies,
        diagnostics,
    };
}
