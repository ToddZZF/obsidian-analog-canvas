import type { FilledRegion, SchematicStyleProfile } from "@icm/derived";
import type { Orientation, SchematicDocument } from "@icm/model";
import type { SignalFlowLayoutParameters, SymbolDefinition, SymbolPrimitive, SymbolResolver } from "@icm/symbols";
export declare function renderFilledRegion(region: FilledRegion, attributes: string): string;
export declare function renderSymbolDefinitionBody(definition: SymbolDefinition, hiddenPrimitiveParts?: readonly string[], additionalPrimitives?: readonly SymbolPrimitive[], profile?: SchematicStyleProfile, foregroundOverride?: string, signalFlowParameters?: SignalFlowLayoutParameters, orientation?: Pick<Orientation, "rotation" | "mirror">): string;
export declare function instanceTransform(instance: SchematicDocument["instances"][number]): string;
/**
 * The symbol artwork of the named instances as bare geometry: no colour of
 * our choosing, no pin names, no formula text.
 *
 * A caller that wants to mark a component by tracing the component's own
 * lines — rather than by drawing a box around it — paints this layer beneath
 * the scene and styles it entirely in CSS. Leaving the markup unstyled is the
 * point: the copy in the scene above keeps whatever colour the instance
 * overrides to, so marking a component never repaints it.
 */
export declare function renderInstanceOutlineGeometry(document: SchematicDocument, resolver: SymbolResolver, instanceIds: readonly string[], profile?: SchematicStyleProfile): string;
export declare function renderVisiblePinNames(definition: SymbolDefinition, hiddenPinNames: readonly string[], instance: SchematicDocument["instances"][number], profile: SchematicStyleProfile, foregroundOverride?: string, presentation?: SchematicDocument["presentation"]): string;
