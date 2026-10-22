/** Upgrade schema 36 to 37 without inventing any simulation intent. */
export function upgradeSchema36To37WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 37;
    return { project, report: { changed: false } };
}
export function upgradeSchema36To37(raw) {
    return upgradeSchema36To37WithReport(raw).project;
}
