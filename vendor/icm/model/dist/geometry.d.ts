import type { DerivedPoint, GridPoint, Orientation, SymbolLocalPoint } from "./schema.js";
export declare function transformPoint(localPoint: GridPoint | SymbolLocalPoint, origin: GridPoint, orientation: Orientation): DerivedPoint;
export declare function inverseTransformPoint(worldPoint: DerivedPoint, origin: GridPoint, orientation: Orientation): DerivedPoint;
