export function upgradeSchema29To30WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 30;
    return { project, report: { changed: false } };
}
export function upgradeSchema29To30(raw) {
    return upgradeSchema29To30WithReport(raw).project;
}
