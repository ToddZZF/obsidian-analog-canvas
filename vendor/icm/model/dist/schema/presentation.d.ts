import { z } from "zod";
import { type SymbolDefinition } from "./symbol-definition.js";
import { type SymbolTerminalMapping } from "./symbol-binding.js";
export declare const CellSymbolSideSchema: z.ZodEnum<{
    east: "east";
    north: "north";
    south: "south";
    west: "west";
}>;
export declare const CellSymbolPinPlacementSchema: z.ZodObject<{
    terminalId: z.ZodString;
    side: z.ZodEnum<{
        east: "east";
        north: "north";
        south: "south";
        west: "west";
    }>;
    offset: z.ZodNumber;
}, z.core.$strict>;
/**
 * A Cell's author-drawn block: raw Symbol JSON artwork and the map from each
 * stable Cell Pin (terminalId) to one graphical pin or a `VDD`/`VSS`
 * property supply, as source-backed `circuitBinding` maps native terminals.
 * Present means Custom; the automatic layout fields beside it stay inactive.
 */
export interface CellSymbolArtwork {
    symbol: SymbolDefinition;
    terminals: SymbolTerminalMapping[];
}
export declare const CellSymbolPresentationSchema: z.ZodObject<{
    minimumBodySize: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strict>>;
    bodyBounds: z.ZodOptional<z.ZodObject<{
        left: z.ZodNumber;
        right: z.ZodNumber;
        top: z.ZodNumber;
        bottom: z.ZodNumber;
    }, z.core.$strict>>;
    pinPlacements: z.ZodOptional<z.ZodArray<z.ZodObject<{
        terminalId: z.ZodString;
        side: z.ZodEnum<{
            east: "east";
            north: "north";
            south: "south";
            west: "west";
        }>;
        offset: z.ZodNumber;
    }, z.core.$strict>>>;
    artwork: z.ZodOptional<z.ZodType<CellSymbolArtwork, unknown, z.core.$ZodTypeInternals<CellSymbolArtwork, unknown>>>;
}, z.core.$strict>;
/**
 * Optional document-wide style intent composed over the base profile:
 * uniform typography scale, wire stroke, symbol-artwork strokes, drafting
 * and annotation strokes, and the junction-dot radius.
 */
export declare const StyleOverridesSchema: z.ZodObject<{
    fontScale: z.ZodOptional<z.ZodNumber>;
    wireStrokeScale: z.ZodOptional<z.ZodNumber>;
    symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
    annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
    junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
/**
 * The Document style one object keeps from the drawing it was copied from.
 * It holds the same factors as `styleOverrides` and replaces its Document's
 * overrides for this object alone; an absent factor means 1. Copy writes it
 * only when the source and target style defaults differ, so a copy draws
 * exactly like its source. An object without it follows its Document.
 */
export declare const ObjectDocumentStyleSchema: z.ZodObject<{
    fontScale: z.ZodOptional<z.ZodNumber>;
    wireStrokeScale: z.ZodOptional<z.ZodNumber>;
    symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
    annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
    junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
/**
 * The faces a Document may set all its text in instead of Metropolis
 * (#1725): Times New Roman's metrics ("serif", Liberation Serif), Arial's
 * ("sans", Liberation Sans) or LaTeX's ("latin-modern", Latin Modern Roman).
 */
export declare const DOCUMENT_TEXT_FACES: readonly ["serif", "sans", "latin-modern"];
export type DocumentTextFace = (typeof DOCUMENT_TEXT_FACES)[number];
export declare const PresentationIntentSchema: z.ZodObject<{
    styleProfileId: z.ZodString;
    grid: z.ZodNumber;
    compactness: z.ZodEnum<{
        compact: "compact";
        loose: "loose";
        normal: "normal";
    }>;
    styleOverrides: z.ZodOptional<z.ZodObject<{
        fontScale: z.ZodOptional<z.ZodNumber>;
        wireStrokeScale: z.ZodOptional<z.ZodNumber>;
        symbolStrokeScale: z.ZodOptional<z.ZodNumber>;
        annotationStrokeScale: z.ZodOptional<z.ZodNumber>;
        junctionRadiusScale: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    labelSubscriptCase: z.ZodOptional<z.ZodEnum<{
        lowercase: "lowercase";
        preserve: "preserve";
        uppercase: "uppercase";
    }>>;
    labelSubscriptItalic: z.ZodOptional<z.ZodBoolean>;
    labelUnderscoreSubscript: z.ZodOptional<z.ZodBoolean>;
    labelSubscriptAfterFirst: z.ZodOptional<z.ZodBoolean>;
    labelFirstLetterItalic: z.ZodOptional<z.ZodBoolean>;
    textFace: z.ZodOptional<z.ZodEnum<{
        "latin-modern": "latin-modern";
        sans: "sans";
        serif: "serif";
    }>>;
    crossingStyle: z.ZodOptional<z.ZodEnum<{
        hop: "hop";
    }>>;
    flow: z.ZodOptional<z.ZodObject<{
        power: z.ZodOptional<z.ZodLiteral<"top">>;
        ground: z.ZodOptional<z.ZodLiteral<"bottom">>;
        input: z.ZodOptional<z.ZodLiteral<"left">>;
        output: z.ZodOptional<z.ZodLiteral<"right">>;
    }, z.core.$strict>>;
    cellSymbol: z.ZodOptional<z.ZodObject<{
        minimumBodySize: z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>>;
        bodyBounds: z.ZodOptional<z.ZodObject<{
            left: z.ZodNumber;
            right: z.ZodNumber;
            top: z.ZodNumber;
            bottom: z.ZodNumber;
        }, z.core.$strict>>;
        pinPlacements: z.ZodOptional<z.ZodArray<z.ZodObject<{
            terminalId: z.ZodString;
            side: z.ZodEnum<{
                east: "east";
                north: "north";
                south: "south";
                west: "west";
            }>;
            offset: z.ZodNumber;
        }, z.core.$strict>>>;
        artwork: z.ZodOptional<z.ZodType<CellSymbolArtwork, unknown, z.core.$ZodTypeInternals<CellSymbolArtwork, unknown>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const MosBulkDefaultsSchema: z.ZodObject<{
    nmosNetId: z.ZodOptional<z.ZodString>;
    pmosNetId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const LayoutGroupSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
        "current-mirror": "current-mirror";
        custom: "custom";
        "differential-pair": "differential-pair";
        "matched-pair": "matched-pair";
    }>;
    objectIds: z.ZodArray<z.ZodString>;
    locked: z.ZodBoolean;
}, z.core.$strict>;
export declare const LayoutConstraintSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
        "align-x": "align-x";
        "align-y": "align-y";
        "equal-spacing": "equal-spacing";
        "keep-clear": "keep-clear";
        symmetric: "symmetric";
    }>;
    objectIds: z.ZodArray<z.ZodString>;
    locked: z.ZodBoolean;
}, z.core.$strict>;
export type CellSymbolSide = z.infer<typeof CellSymbolSideSchema>;
export type CellSymbolPinPlacement = z.infer<typeof CellSymbolPinPlacementSchema>;
export type CellSymbolPresentation = z.infer<typeof CellSymbolPresentationSchema>;
export type StyleOverrides = z.infer<typeof StyleOverridesSchema>;
