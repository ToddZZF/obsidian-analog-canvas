// SVG attribute text every layer shares: escaped values and point lists.
export function escapeXml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
export function pointList(points) {
    return points.map((point) => `${point.x},${point.y}`).join(" ");
}
