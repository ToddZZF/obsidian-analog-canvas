/** Upgrade schema 38 to 39 without inventing a raw simulation draft. */
export function upgradeSchema38To39WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 39;
    return { project, report: { changed: false } };
}
export function upgradeSchema38To39(raw) {
    return upgradeSchema38To39WithReport(raw).project;
}
