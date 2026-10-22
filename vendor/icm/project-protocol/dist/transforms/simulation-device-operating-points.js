/**
 * Schema 47 permits selected MOS operating-point detail requests. Existing
 * Projects carry no implicit selection, so migration advances only the
 * protocol version.
 */
export function upgradeSchema46To47WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 47;
    return { project, report: { changed: false } };
}
export function upgradeSchema46To47(raw) {
    return upgradeSchema46To47WithReport(raw).project;
}
