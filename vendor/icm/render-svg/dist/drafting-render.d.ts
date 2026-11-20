import type { ResolvedDocumentRoutingGeometry, SchematicStyleProfile } from "@icm/derived";
import type { DraftingObject, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
export declare function renderDraftingObject(document: SchematicDocument, resolver: SymbolResolver, profile: SchematicStyleProfile, routingGeometry: ResolvedDocumentRoutingGeometry, object: DraftingObject): string;
