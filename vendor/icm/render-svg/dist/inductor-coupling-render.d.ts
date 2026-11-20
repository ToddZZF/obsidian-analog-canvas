import type { SchematicStyleProfile } from "@icm/derived";
import type { DerivedRect, SchematicDocument } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
export declare function renderInductorCouplingLayer(document: SchematicDocument, resolver: SymbolResolver, profile: SchematicStyleProfile, objectIds?: ReadonlySet<string>): string;
/** Everything the coupling layer paints, for the scene's formal bounds. */
export declare function inductorCouplingBounds(document: SchematicDocument, resolver: SymbolResolver, profile: SchematicStyleProfile, objectIds?: ReadonlySet<string>): DerivedRect[];
