import type { ArrowEndStyle, DerivedPoint as Point, DraftingObject } from "@icm/model";
import type { SchematicStyleProfile } from "./style-profile.js";
type Arrow = Extract<DraftingObject, {
    kind: "arrow";
}>;
export interface ArrowArtwork {
    shaft: Point[];
    controls: readonly (Point | null)[];
    heads: {
        points: Point[];
        style: "filled" | "open";
    }[];
    dots: {
        center: Point;
        radius: number;
    }[];
    outline: Point[] | null;
    strokeWidth: number;
}
/** Unset ends retain the old paired head placement and exact scale. */
export declare function arrowEndStyles(object: Pick<Arrow, "styleOverride" | "outline">): {
    start: {
        style: ArrowEndStyle;
        scale: number;
    };
    end: {
        style: ArrowEndStyle;
        scale: number;
    };
};
/** One construction for export, preview, picker icons and hit geometry. */
export declare function arrowArtwork(object: Pick<Arrow, "styleOverride" | "outline">, pathPoints: readonly Point[], pathControls: readonly (Point | null)[], profile: SchematicStyleProfile): ArrowArtwork;
export declare function arrowPathData(points: readonly Point[], controls: readonly (Point | null)[]): string;
/** Conservative Bézier hull plus all visible head/outline vertices. */
export declare function arrowArtworkBounds(artwork: ArrowArtwork): {
    x: number;
    y: number;
    width: number;
    height: number;
};
export {};
