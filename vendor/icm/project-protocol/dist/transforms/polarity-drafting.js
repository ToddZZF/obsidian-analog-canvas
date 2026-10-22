/**
 * Upgrade schema 27 to 28. The new DraftText polarity field is optional, so
 * every valid schema-27 project is already valid schema-28 data.
 */
export function upgradeSchema27To28WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 28;
    return { project, report: { changed: false } };
}
export function upgradeSchema27To28(raw) {
    return upgradeSchema27To28WithReport(raw).project;
}
