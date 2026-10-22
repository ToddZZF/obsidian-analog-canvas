/**
 * Schema 45 permits authored measurement rules on structured Simulation
 * setups. Existing Projects have no such intent, so migration advances only
 * the protocol version and deliberately invents no measurements.
 */
export function upgradeSchema44To45WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 45;
    return { project, report: { changed: false } };
}
export function upgradeSchema44To45(raw) {
    return upgradeSchema44To45WithReport(raw).project;
}
