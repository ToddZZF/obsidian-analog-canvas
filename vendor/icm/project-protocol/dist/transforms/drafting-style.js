/**
 * Upgrade schema 26 to 27. Schema 27 widens the drafting per-object
 * strokeScale from the fixed four-step ladder to a bounded free multiplier
 * and adds an optional explicit stroke color; every schema-26 value is
 * already valid schema-27 data, so the upgrade is a version stamp.
 */
export function upgradeSchema26To27WithReport(raw) {
    const project = structuredClone(raw);
    project.schemaVersion = 27;
    return { project, report: { changed: false } };
}
export function upgradeSchema26To27(raw) {
    return upgradeSchema26To27WithReport(raw).project;
}
