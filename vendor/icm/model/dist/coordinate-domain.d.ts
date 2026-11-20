import type { DerivedPoint, GridPoint } from "./schema.js";
/** The common lattice of a Document's placement pitch and fine Symbol pins. */
export declare function electricalConnectionGrid(documentGrid: number): number;
/**
 * Read-only geometry (text metrics, curves, pointer previews) can be
 * fractional. This is the only conversion back into the persisted document
 * coordinate domain.
 */
export declare function snapGridCoordinate(value: number, grid: number): number;
export declare function snapGridPoint(point: Pick<DerivedPoint, "x" | "y">, grid: number): GridPoint;
export declare function isGridAlignedCoordinate(value: number, grid: number): boolean;
