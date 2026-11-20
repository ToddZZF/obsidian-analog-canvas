import type { Mirror, Orientation } from "./schema.js";
/** The visible direction of a reflection in document coordinates. */
export type ScreenFlip = "left-right" | "top-bottom";
/**
 * Compose a screen-space reflection with the canonical orientation transform.
 * Horizontal and vertical are independent bits; neither operation rewrites
 * rotation. Applying the same reflection twice therefore restores the exact
 * authored orientation, while applying both axes records `both` explicitly.
 *
 * This lives beside the Orientation it transforms because both the editor's
 * placement preview and the edit engine's group reflection need it, and they
 * have to agree — a part reflected one way while the arrangement reflects the
 * other would come apart.
 */
export declare function reflectOrientation(orientation: Orientation, direction: ScreenFlip): Orientation;
/** SVG/model scale for a persisted screen-space mirror mode. */
export declare function mirrorScale(mirror: Mirror): {
    readonly x: 1 | -1;
    readonly y: 1 | -1;
};
