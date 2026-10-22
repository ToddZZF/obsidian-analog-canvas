/** Schema 42 replaces the optional singleton setup with a named collection. */
export function upgradeSchema41To42WithReport(raw) {
    const project = structuredClone(raw);
    const legacy = project.simulation;
    delete project.simulation;
    project.simulationSetups =
        typeof legacy === "object" && legacy !== null && !Array.isArray(legacy)
            ? [
                {
                    id: "simulation-setup-1",
                    name: "Setup 1",
                    ...legacy,
                },
            ]
            : [];
    project.schemaVersion = 42;
    return {
        project,
        report: {
            changed: legacy !== undefined,
            migratedSetupCount: legacy === undefined ? 0 : 1,
        },
    };
}
export function upgradeSchema41To42(raw) {
    return upgradeSchema41To42WithReport(raw).project;
}
