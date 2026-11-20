import { type SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import { type CoincidentContact } from "./contact.js";
/** One visible contact has one style owner, independent of its incident Wires. */
export declare function junctionForContact(contact: CoincidentContact, junctions: ReadonlyMap<string, SchematicDocument["junctions"][number]>): SchematicDocument["junctions"][number] | undefined;
/** A styled contact marker follows its pins when every pin at the contact travels. */
export declare function carriedContactJunctionIds(document: SchematicDocument, resolver: SymbolResolver, instanceIds: ReadonlySet<string>): string[];
