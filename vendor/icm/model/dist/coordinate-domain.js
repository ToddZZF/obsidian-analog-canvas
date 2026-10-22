import { SYMBOL_CONNECTION_GRID } from "./schema/symbol-definition.js";
/** The common lattice of a Document's placement pitch and fine Symbol pins. */
export function electricalConnectionGrid(documentGrid) {
    let left = documentGrid;
    let right = SYMBOL_CONNECTION_GRID;
    while (right !== 0)
        [left, right] = [right, left % right];
    return left;
}
/**
 * Read-only geometry (text metrics, curves, pointer previews) can be
 * fractional. This is the only conversion back into the persisted document
 * coordinate domain.
 */
export function snapGridCoordinate(value, grid) {
    if (!Number.isFinite(value) || !Number.isInteger(grid) || grid <= 0) {
        throw new Error("Grid normalization requires finite coordinates and a positive integer grid");
    }
    return Math.round(value / grid) * grid;
}
export function snapGridPoint(point, grid) {
    return {
        x: snapGridCoordinate(point.x, grid),
        y: snapGridCoordinate(point.y, grid),
    };
}
export function isGridAlignedCoordinate(value, grid) {
    return (Number.isInteger(value) &&
        Number.isInteger(grid) &&
        grid > 0 &&
        value % grid === 0);
}
