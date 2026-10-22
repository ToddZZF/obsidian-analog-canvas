/**
 * Upgrade schema 28 to 29. Fine-grid annotation/drafting coordinates are a
 * validation relaxation, and instance appearance overrides are optional, so
 * every valid schema-28 project is already valid schema-29 data.
 */
export function upgradeSchema28To29WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 29;
    return { project, report: { changed: false } };
}
export function upgradeSchema28To29(raw) {
    return upgradeSchema28To29WithReport(raw).project;
}
