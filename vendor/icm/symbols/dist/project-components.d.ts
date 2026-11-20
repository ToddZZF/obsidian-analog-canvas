import { type CircuitProject } from "@icm/model";
import { type InMemorySymbolResolver } from "./resolver.js";
import type { SymbolDefinition } from "./schema.js";
export declare function referencedProjectSymbolIds(project: Pick<CircuitProject, "documents"> & Partial<Pick<CircuitProject, "externalSubcircuitDefinitions">>): string[];
/** Snapshot actual dependencies once, sharing one definition across instances.
 * Unused snapshots are excluded; editor history retains its own definitions
 * so undo can restore a deleted custom component. */
export declare function withProjectComponentDefinitions(project: CircuitProject, baseDefinitions?: readonly SymbolDefinition[] | InMemorySymbolResolver): CircuitProject;
