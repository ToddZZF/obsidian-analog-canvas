export function mapSimulationFile(path, text, origin = { kind: "authored", path, startOffset: 0 }) {
    return {
        path,
        text,
        segments: text.length
            ? [{ startOffset: 0, endOffset: text.length, origin }]
            : [],
    };
}
function sliceSegment(segment, start, end) {
    return {
        startOffset: start,
        endOffset: end,
        origin: segment.origin.kind !== "generated" &&
            !(segment.origin.kind === "model-source" && segment.origin.derived)
            ? {
                ...segment.origin,
                startOffset: segment.origin.startOffset + start - segment.startOffset,
            }
            : { ...segment.origin },
    };
}
/** Insert only generated text; every unaffected author offset keeps its owner. */
export function insertSimulationText(file, offset, text, origin) {
    return replaceSimulationText(file, offset, offset, text, origin);
}
/** Replace one run-only range without reformatting unaffected source or losing its offsets. */
export function replaceSimulationText(file, start, end, text, origin) {
    if (!Number.isSafeInteger(start) ||
        !Number.isSafeInteger(end) ||
        start < 0 ||
        start > end ||
        end > file.text.length)
        throw new RangeError("Invalid execution composition offset");
    const shift = text.length - (end - start);
    const before = [];
    const after = [];
    for (const segment of file.segments) {
        if (segment.startOffset < start)
            before.push(sliceSegment(segment, segment.startOffset, Math.min(start, segment.endOffset)));
        if (segment.endOffset > end) {
            const right = sliceSegment(segment, Math.max(end, segment.startOffset), segment.endOffset);
            after.push({
                ...right,
                startOffset: right.startOffset + shift,
                endOffset: right.endOffset + shift,
            });
        }
    }
    return {
        path: file.path,
        text: file.text.slice(0, start) + text + file.text.slice(end),
        segments: [
            ...before,
            ...(text.length
                ? [{ startOffset: start, endOffset: start + text.length, origin }]
                : []),
            ...after,
        ],
    };
}
export function locateSimulationText(map, offset) {
    const segment = map.segments.find((item) => offset >= item.startOffset && offset < item.endOffset);
    if (!segment)
        return null;
    return segment.origin.kind !== "generated" &&
        !(segment.origin.kind === "model-source" && segment.origin.derived)
        ? {
            ...segment.origin,
            startOffset: segment.origin.startOffset + offset - segment.startOffset,
        }
        : { ...segment.origin };
}
