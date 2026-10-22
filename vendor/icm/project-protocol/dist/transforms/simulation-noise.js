/**
 * Schema 46 permits structured Noise analyses. Existing Projects carry no
 * implicit Noise intent, so migration advances only the protocol version.
 */
export function upgradeSchema45To46WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 46;
    return { project, report: { changed: false } };
}
export function upgradeSchema45To46(raw) {
    return upgradeSchema45To46WithReport(raw).project;
}
