export function schematicTextFontSize(kind, profile) {
    const typography = profile.typography;
    switch (kind) {
        case "default-instance":
        case "instance-label":
        case "instance-value":
            return typography.instanceFontSize;
        case "net-label":
        case "pin-name":
            return typography.netFontSize;
        case "power-label":
            return typography.powerFontSize;
        case "route-marker":
            return typography.annotationFontSize;
    }
}
export function schematicTextSizeAttribute(kind, profile, sizeScale) {
    const base = schematicTextFontSize(kind, profile);
    const size = sizeScale !== undefined && Number.isFinite(sizeScale) && sizeScale > 0
        ? Math.round(base * sizeScale * 100) / 100
        : base;
    return ` font-size="${size}"`;
}
