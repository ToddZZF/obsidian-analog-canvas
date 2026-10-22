/**
 * Reading the ASCII rawfile ngspice writes.
 *
 * The format is not self-describing enough to guess at. Two properties of it
 * decide the shape of this reader, and both were taken from files ngspice 46
 * actually wrote rather than from a description of the format:
 *
 * **Points are separated by a blank line, not by a line count.** One point is
 * an indexed line followed by one line per remaining variable, then a blank
 * line. A reader that advances a fixed number of lines per point happens to
 * work on a real-valued file and silently misreads a complex one, because the
 * two have the same line stride and different meanings. So the value section
 * is split on the blank line and the recovered count is checked against the
 * header's `No. Points`; a mismatch is an error, never a shorter result.
 *
 * **A missing number is never filled in.** A short point block, a truncated
 * file, a `nan`, or an `inf` produces a diagnostic naming the line and the
 * variable. Nothing here substitutes a zero, an interpolation, or a previous
 * value, because a fabricated number is indistinguishable from a measured one
 * once it reaches a chart.
 */
/** Thrown internally so the reader reads top-to-bottom; never escapes. */
class RawfileFault extends Error {
    detail;
    constructor(detail) {
        super(detail.message);
        this.detail = detail;
    }
}
function fault(code, message, line) {
    throw new RawfileFault({ code, message, line });
}
/**
 * A finite decimal literal, and nothing else. `nan`, `inf`, `1.#INF`, an empty
 * field, and a stray name all fail here rather than becoming a silent `NaN`
 * further downstream.
 */
const FINITE_LITERAL = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/u;
function readNumber(token, where, line) {
    const text = token.trim();
    if (text.length === 0) {
        fault("value-malformed", `${where} has no value on this line.`, line);
    }
    if (!FINITE_LITERAL.test(text)) {
        // `nan` and `inf` are what ngspice writes when the solver diverged. The
        // run produced a number-shaped thing that is not a number, and saying so
        // is the whole point; a chart cannot.
        const looksNonFinite = /^[+-]?(?:nan|inf(?:inity)?|1\.#(?:inf|ind|qnan))/iu;
        if (looksNonFinite.test(text)) {
            fault("value-not-finite", `${where} is "${text}", which is not a finite number. The simulator did not converge to a value here.`, line);
        }
        fault("value-malformed", `${where} is "${text}", not a number.`, line);
    }
    const value = Number(text);
    if (!Number.isFinite(value)) {
        fault("value-not-finite", `${where} is "${text}", which is outside the range of a finite number.`, line);
    }
    return value;
}
function readCount(value, key, line) {
    const text = value.trim();
    if (!/^\d+$/u.test(text)) {
        fault("header-invalid", `"${key}: ${value}" is not a count.`, line);
    }
    return Number(text);
}
/**
 * The rawfile ngspice writes is one or more plots back to back: a header, a
 * `Variables:` block, then a `Values:` block, then the next plot's `Title:`.
 */
export function parseNgspiceRawfile(text) {
    try {
        return { ok: true, plots: readPlots(text) };
    }
    catch (error) {
        if (error instanceof RawfileFault)
            return { ok: false, error: error.detail };
        throw error;
    }
}
function readPlots(text) {
    const source = text.replace(/^﻿/u, "");
    const lines = source.split(/\r?\n/u);
    if (lines.every((line) => line.trim().length === 0)) {
        fault("empty-file", "The simulator wrote no rawfile content, so this run produced no vectors to read.", null);
    }
    const plots = [];
    let cursor = 0;
    while (cursor < lines.length) {
        // Skip the blank line each plot's value block ends with.
        const line = lines[cursor];
        if (line === undefined || line.trim().length === 0) {
            cursor += 1;
            continue;
        }
        if (/^\s*Binary:/u.test(line)) {
            fault("unsupported-format", "This is a binary rawfile. Only the ASCII rawfile is read; add `set filetype=ascii` before `write` in the testbench.", cursor + 1);
        }
        if (!/^Title:/u.test(line)) {
            fault("unsupported-format", `Line ${cursor + 1} is "${line.trim().slice(0, 60)}", where a rawfile plot header was expected. This does not look like an ngspice rawfile.`, cursor + 1);
        }
        const plot = readPlot(lines, cursor);
        plots.push(plot.plot);
        cursor = plot.next;
    }
    return plots;
}
function readPlot(lines, start) {
    const header = readHeader(lines, start);
    const variables = readVariables(lines, header.next, header.fields.variableCount);
    return readValues(lines, variables.next, header.fields, variables.variables);
}
function readHeader(lines, start) {
    const seen = new Map();
    let cursor = start;
    while (cursor < lines.length) {
        const line = lines[cursor];
        if (line === undefined)
            break;
        if (/^\s*Variables:/u.test(line))
            break;
        if (line.trim().length === 0) {
            cursor += 1;
            continue;
        }
        const match = /^([^:]+):(.*)$/u.exec(line);
        if (!match || match[1] === undefined || match[2] === undefined) {
            fault("header-invalid", `Line ${cursor + 1} of the rawfile header is "${line.trim().slice(0, 60)}", which is not a "Key: value" line.`, cursor + 1);
        }
        seen.set(match[1].trim().toLowerCase(), {
            value: match[2].trim(),
            line: cursor + 1,
        });
        cursor += 1;
    }
    if (cursor >= lines.length) {
        fault("header-incomplete", "The rawfile ends before its `Variables:` block, so the plot it describes is incomplete.", lines.length);
    }
    const required = (key) => {
        const entry = seen.get(key.toLowerCase());
        if (!entry) {
            fault("header-invalid", `The rawfile plot header has no "${key}" line.`, start + 1);
        }
        return entry;
    };
    const optional = (key) => seen.get(key.toLowerCase())?.value ?? "";
    const plotName = required("Plotname");
    const flags = required("Flags");
    const variableCount = required("No. Variables");
    const pointCount = required("No. Points");
    const flagList = flags.value.split(/\s+/u).filter((word) => word.length > 0);
    return {
        fields: {
            title: optional("Title"),
            date: optional("Date"),
            command: optional("Command"),
            plotName: plotName.value,
            flags: flagList,
            variableCount: readCount(variableCount.value, "No. Variables", variableCount.line),
            pointCount: readCount(pointCount.value, "No. Points", pointCount.line),
        },
        next: cursor,
    };
}
function readVariables(lines, variablesLine, expected) {
    const variables = [];
    // Some builds put the first variable on the `Variables:` line itself.
    const head = lines[variablesLine];
    const inlineFirst = head === undefined ? "" : head.replace(/^\s*Variables:/u, "");
    let cursor = variablesLine + 1;
    const pending = [];
    if (inlineFirst.trim().length > 0) {
        pending.push({ text: inlineFirst, line: variablesLine + 1 });
    }
    while (pending.length < expected && cursor < lines.length) {
        const line = lines[cursor];
        if (line === undefined)
            break;
        if (/^\s*Values:/u.test(line) || /^\s*Binary:/u.test(line))
            break;
        if (line.trim().length > 0)
            pending.push({ text: line, line: cursor + 1 });
        cursor += 1;
    }
    for (const entry of pending) {
        variables.push(readVariableLine(entry.text, entry.line));
    }
    if (variables.length !== expected) {
        fault("header-incomplete", `The rawfile header declares ${expected} variables but the \`Variables:\` block lists ${variables.length}.`, cursor + 1);
    }
    for (const [position, variable] of variables.entries()) {
        if (variable.index !== position) {
            fault("variable-line-invalid", `Variable ${position} is declared with index ${variable.index}. The rawfile's variable order is its column order and cannot be reordered.`, variablesLine + 2 + position);
        }
    }
    return { variables, next: cursor };
}
function readVariableLine(text, line) {
    // Tab-delimited in the files ngspice 46 writes, space-delimited in others.
    const fields = text.trim().split(/\s+/u);
    const [rawIndex, name, quantity, ...qualifiers] = fields;
    if (rawIndex === undefined ||
        name === undefined ||
        quantity === undefined ||
        !/^\d+$/u.test(rawIndex)) {
        fault("variable-line-invalid", `Line ${line} of the \`Variables:\` block is "${text.trim().slice(0, 60)}", which does not declare an index, a name, and a quantity.`, line);
    }
    return { index: Number(rawIndex), name, quantity, qualifiers };
}
function readValues(lines, valuesLine, fields, variables) {
    const header = lines[valuesLine];
    if (header === undefined) {
        fault("header-incomplete", "The rawfile ends before its `Values:` block, so the plot it describes has no data.", lines.length);
    }
    if (/^\s*Binary:/u.test(header)) {
        fault("unsupported-format", "This is a binary rawfile. Only the ASCII rawfile is read; add `set filetype=ascii` before `write` in the testbench.", valuesLine + 1);
    }
    if (!/^\s*Values:/u.test(header)) {
        fault("header-invalid", `Line ${valuesLine + 1} is "${header.trim().slice(0, 60)}", where the plot's \`Values:\` block was expected.`, valuesLine + 1);
    }
    // The value block runs to the next plot's `Title:` line, or to end of file.
    let end = valuesLine + 1;
    while (end < lines.length) {
        const line = lines[end];
        if (line !== undefined && /^Title:/u.test(line))
            break;
        end += 1;
    }
    // Split on the blank line, which is what actually separates two points.
    const blocks = [];
    let current = [];
    for (let index = valuesLine + 1; index < end; index += 1) {
        const line = lines[index];
        if (line === undefined)
            continue;
        if (line.trim().length === 0) {
            if (current.length > 0)
                blocks.push({ lines: current });
            current = [];
            continue;
        }
        current.push({ text: line, line: index + 1 });
    }
    if (current.length > 0)
        blocks.push({ lines: current });
    if (blocks.length !== fields.pointCount) {
        fault("point-count-mismatch", `The rawfile header declares ${fields.pointCount} points but the \`Values:\` block holds ${blocks.length}. The file is truncated or was written by something that does not separate points with a blank line.`, valuesLine + 1);
    }
    const complex = fields.flags.some((flag) => flag.toLowerCase() === "complex");
    const columns = variables.map((variable) => ({
        variable,
        real: [],
        imag: complex ? [] : null,
    }));
    for (const [pointIndex, block] of blocks.entries()) {
        const first = block.lines[0];
        if (first === undefined || block.lines.length !== variables.length) {
            fault("point-block-invalid", `Point ${pointIndex} holds ${block.lines.length} values but the plot declares ${variables.length} variables.`, first?.line ?? valuesLine + 1);
        }
        const indexed = /^\s*(\d+)\s+(\S.*)$/u.exec(first.text);
        if (!indexed || indexed[1] === undefined || indexed[2] === undefined) {
            fault("point-block-invalid", `Point ${pointIndex} starts with "${first.text.trim().slice(0, 60)}", which carries no point index.`, first.line);
        }
        if (Number(indexed[1]) !== pointIndex) {
            fault("point-block-invalid", `The ${pointIndex + 1}th point block is numbered ${indexed[1]}. Points are out of order or one is missing.`, first.line);
        }
        for (const [variableIndex, column] of columns.entries()) {
            const entry = block.lines[variableIndex];
            // Both are guaranteed by the two length checks above; a fault rather
            // than a skip, because skipping a column is how a gap gets filled in.
            if (entry === undefined) {
                fault("point-block-invalid", `Point ${pointIndex} has no value for "${column.variable.name}".`, first.line);
            }
            const token = variableIndex === 0 ? indexed[2] : entry.text;
            const where = `"${column.variable.name}" at point ${pointIndex}`;
            if (column.imag === null) {
                column.real.push(readNumber(token, `The value of ${where}`, entry.line));
                continue;
            }
            const parts = token.trim().split(",");
            const [reText, imText, ...extra] = parts;
            if (reText === undefined || imText === undefined || extra.length > 0) {
                fault("value-malformed", `${where} is "${token.trim().slice(0, 60)}". A complex plot writes every value as "real,imaginary".`, entry.line);
            }
            // Read both before storing either, so a rejected imaginary part can
            // never leave a real column one entry longer than its pair.
            const re = readNumber(reText, `The real part of ${where}`, entry.line);
            const im = readNumber(imText, `The imaginary part of ${where}`, entry.line);
            column.real.push(re);
            column.imag.push(im);
        }
    }
    const vectors = columns.map((column) => ({
        variable: column.variable,
        real: column.real,
        imag: column.imag,
    }));
    return {
        plot: {
            title: fields.title,
            date: fields.date,
            command: fields.command,
            plotName: fields.plotName,
            flags: fields.flags,
            complex,
            pointCount: fields.pointCount,
            vectors,
        },
        next: end,
    };
}
