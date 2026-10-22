/** Schema 41 adds structured DC-sweep intent; existing Projects need no rewrite. */
export function upgradeSchema40To41WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 41;
    return { project, report: { changed: false } };
}
export function upgradeSchema40To41(raw) {
    return upgradeSchema40To41WithReport(raw).project;
}
