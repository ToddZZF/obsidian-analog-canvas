import { mirrorScale } from "./orientation-reflect.js";
function mirrorLocal(point, mirror) {
    const scale = mirrorScale(mirror);
    return { x: point.x * scale.x, y: point.y * scale.y };
}
function rotateLocal(point, rotation) {
    switch (rotation) {
        case 0:
            return point;
        case 90:
            return { x: -point.y, y: point.x };
        case 180:
            return { x: -point.x, y: -point.y };
        case 270:
            return { x: point.y, y: -point.x };
        case 45:
        case 135:
        case 225:
        case 315: {
            const radians = (rotation * Math.PI) / 180;
            const cosine = Math.cos(radians);
            const sine = Math.sin(radians);
            return {
                x: point.x * cosine - point.y * sine,
                y: point.x * sine + point.y * cosine,
            };
        }
    }
}
function inverseRotateLocal(point, rotation) {
    return rotateLocal(point, ((360 - rotation) % 360));
}
export function transformPoint(localPoint, origin, orientation) {
    const transformed = mirrorLocal(rotateLocal(localPoint, orientation.rotation), orientation.mirror);
    return {
        x: origin.x + transformed.x,
        y: origin.y + transformed.y,
    };
}
export function inverseTransformPoint(worldPoint, origin, orientation) {
    const translated = {
        x: worldPoint.x - origin.x,
        y: worldPoint.y - origin.y,
    };
    const mirrored = mirrorLocal(translated, orientation.mirror);
    return inverseRotateLocal(mirrored, orientation.rotation);
}
