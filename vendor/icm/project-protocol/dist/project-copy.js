import { parseProject } from "./load.js";
import { serializeProject } from "./save.js";
/** Copy through the canonical protocol so every persisted field travels together.
 * Storage, publication and recovery bindings live outside the Project. */
export function createIndependentProject(project, id, name = project.name) {
    const copy = parseProject(serializeProject(project));
    copy.id = id;
    copy.name = name;
    return copy;
}
