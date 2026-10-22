/** Shared insertion defaults; explicit RichText is never restyled. */
export function createDraftText(options) {
    return {
        id: options.id,
        kind: "text",
        locked: false,
        zIndex: 0,
        anchor: { kind: "free", position: options.position },
        content: typeof options.content === "string"
            ? { runs: [{ kind: "text", value: options.content }] }
            : options.content,
        alignment: options.alignment ?? "middle",
        rotation: options.rotation ?? 0,
        typographyToken: "label",
    };
}
