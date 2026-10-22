const EPSILON = 1e-9;
/**
 * The tolerance `pointOnSegment` accepts by default. Exported because a
 * bounding-box broad phases must account for its cross/dot-product units;
 * it is not a coordinate-distance tolerance.
 */
export const SEGMENT_EPSILON = EPSILON;
export function samePoint(left, right) {
    return left.x === right.x && left.y === right.y;
}
export function classifySegment(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (dx === 0 && dy === 0)
        return "zero";
    if (dy === 0)
        return "horizontal";
    if (dx === 0)
        return "vertical";
    if (Math.abs(dx) === Math.abs(dy)) {
        return dx * dy > 0 ? "diagonal-positive" : "diagonal-negative";
    }
    return "other";
}
export function isSegmentAllowed(from, to, constraint) {
    const heading = classifySegment(from, to);
    if (heading === "zero")
        return false;
    if (constraint === "any-angle")
        return true;
    if (constraint === "orthogonal") {
        return heading === "horizontal" || heading === "vertical";
    }
    return heading !== "other";
}
export function polylineSatisfiesConstraint(points, constraint) {
    return points
        .slice(1)
        .every((point, index) => isSegmentAllowed(points[index], point, constraint));
}
/** Unit direction is intentionally normalized for accurate render joins. */
export function unitDirection(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy);
    return length === 0 ? null : { x: dx / length, y: dy / length };
}
export function segmentLength(from, to) {
    return Math.hypot(to.x - from.x, to.y - from.y);
}
function cross(first, second) {
    return first.x * second.y - first.y * second.x;
}
function subtract(left, right) {
    return { x: left.x - right.x, y: left.y - right.y };
}
export function areCollinear(first, middle, last) {
    const firstVector = subtract(middle, first);
    const secondVector = subtract(last, middle);
    return (cross(firstVector, secondVector) === 0 &&
        firstVector.x * secondVector.x + firstVector.y * secondVector.y > 0);
}
export function projectPointToSegment(point, from, to) {
    const direction = subtract(to, from);
    const lengthSquared = direction.x ** 2 + direction.y ** 2;
    if (lengthSquared === 0)
        return null;
    const unclamped = ((point.x - from.x) * direction.x + (point.y - from.y) * direction.y) /
        lengthSquared;
    const t = Math.max(0, Math.min(1, unclamped));
    const projected = {
        x: from.x + direction.x * t,
        y: from.y + direction.y * t,
    };
    return {
        point: projected,
        t,
        distanceSquared: (point.x - projected.x) ** 2 + (point.y - projected.y) ** 2,
    };
}
export function pointOnSegment(point, from, to, options = {}) {
    const epsilon = options.epsilon ?? EPSILON;
    const direction = subtract(to, from);
    const relative = subtract(point, from);
    const lengthSquared = direction.x ** 2 + direction.y ** 2;
    if (lengthSquared === 0)
        return false;
    if (Math.abs(cross(direction, relative)) > epsilon)
        return false;
    const dot = relative.x * direction.x + relative.y * direction.y;
    return options.interior
        ? dot > epsilon && dot < lengthSquared - epsilon
        : dot >= -epsilon && dot <= lengthSquared + epsilon;
}
/**
 * Generic finite-segment intersection.  Collinear overlap reports its first
 * deterministic point; callers only use that point as a diagnostic anchor.
 */
export function intersectSegments(a, b, c, d) {
    const r = subtract(b, a);
    const s = subtract(d, c);
    const denominator = cross(r, s);
    const cMinusA = subtract(c, a);
    if (Math.abs(denominator) <= EPSILON) {
        if (Math.abs(cross(cMinusA, r)) > EPSILON)
            return null;
        const rLengthSquared = r.x ** 2 + r.y ** 2;
        if (rLengthSquared === 0)
            return null;
        const t0 = (cMinusA.x * r.x + cMinusA.y * r.y) / rLengthSquared;
        const t1 = ((d.x - a.x) * r.x + (d.y - a.y) * r.y) / rLengthSquared;
        const start = Math.max(0, Math.min(t0, t1));
        const end = Math.min(1, Math.max(t0, t1));
        return start <= end + EPSILON
            ? {
                point: { x: a.x + r.x * start, y: a.y + r.y * start },
                kind: "overlap",
            }
            : null;
    }
    const t = cross(cMinusA, s) / denominator;
    const u = cross(cMinusA, r) / denominator;
    if (t < -EPSILON || t > 1 + EPSILON || u < -EPSILON || u > 1 + EPSILON) {
        return null;
    }
    return { point: { x: a.x + r.x * t, y: a.y + r.y * t }, kind: "crossing" };
}
