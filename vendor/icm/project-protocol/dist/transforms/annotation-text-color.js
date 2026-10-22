/** Upgrade schema 31 to 32 without materializing any color override. */
export function upgradeSchema31To32WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 32;
    return { project, report: { changed: false } };
}
export function upgradeSchema31To32(raw) {
    return upgradeSchema31To32WithReport(raw).project;
}
