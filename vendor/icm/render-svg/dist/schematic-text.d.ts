import type { SchematicStyleProfile } from "@icm/derived";
export type SchematicTextKind = "default-instance" | "instance-label" | "instance-value" | "net-label" | "power-label" | "pin-name" | "route-marker";
export declare function schematicTextFontSize(kind: SchematicTextKind, profile: SchematicStyleProfile): number;
export declare function schematicTextSizeAttribute(kind: SchematicTextKind, profile: SchematicStyleProfile, sizeScale?: number): string;
