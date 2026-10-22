/** Upgrade schema 37 to 38 without inventing a transient analysis. */
export function upgradeSchema37To38WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 38;
    return { project, report: { changed: false } };
}
export function upgradeSchema37To38(raw) {
    return upgradeSchema37To38WithReport(raw).project;
}
