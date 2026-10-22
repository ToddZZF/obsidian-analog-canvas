/**
 * Upgrade schema 30 to 31. Signal Flow parameters are additive, so every
 * valid schema-30 project is already valid schema-31 data.
 */
export function upgradeSchema30To31WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 31;
    return { project, report: { changed: false } };
}
export function upgradeSchema30To31(raw) {
    return upgradeSchema30To31WithReport(raw).project;
}
