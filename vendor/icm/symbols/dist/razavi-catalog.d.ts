import { razaviCatalogSymbols, razaviSemanticPrimitives, razaviSymbolCatalogEntries, razaviSymbolCatalogIdentity } from "./razavi-catalog.generated.js";
import type { SymbolDefinition } from "./schema.js";
export interface RazaviSymbolCatalogEntry {
    symbolId: string;
    name: string;
    category: string;
    reviewStatus: "reviewed" | "provisional";
    /**
     * Where the artwork comes from. `razavi-reference-v1` answers to the
     * reviewed textbook authority and pins its evidence; `house` is drawn here
     * for a primitive the textbook never contained, and says so rather than
     * borrowing an authority it does not have. Absent means Razavi, which is
     * what every reviewed entry is.
     */
    provenance?: "razavi-reference-v1" | "house";
    /** Required on a house entry: why the reference does not cover it. */
    houseReason?: string;
    /** Present exactly when the provenance is `razavi-reference-v1`. */
    visualAuthority?: {
        kind: "razavi-reference-v1";
        referenceManifestPath: string;
        referencePaths: string[];
        calibrationPath?: string;
    };
    pinOrder: string[];
    /**
     * The letter a block is drawn with while its Reference stays the X call
     * SPICE needs: a unijunction X1 is drawn Q1, by a display alias.
     */
    drawnReferencePrefix?: string;
    palette: boolean;
    automaticMappings: string[];
    manualOnlyReason?: string;
    assetPath: string;
    assetHash: string;
    generation?: {
        kind: "razavi-raster-reference" | "razavi-pdf-vector-reference";
        referenceManifestPath: string;
        referencePath: string;
        converterPath: string;
        converterVersion: number;
        /**
         * Uniform factor applied to the reference geometry so this Symbol
         * shares the pin span of its sibling family. Absent means
         * evidence-exact.
         */
        pinSpanScale?: number;
        /** Product shape normalization; original PDF evidence remains unchanged. */
        bodyNormalization?: "equilateral-triangle" | "left-grid-anchor";
    } | {
        /**
         * Derived from another reviewed Symbol rather than from the reference
         * itself, so its visual authority is that Symbol's. The converter
         * states the one transformation it applies and its `:check` gate
         * keeps the pair from drifting apart. `derived-input-swap` exchanges
         * a marked differential pair; `derived-output-drop` leaves an output
         * unbrought-out, for a part that exists in both widths;
         * `derived-lettered-body` adds the body letter an amplifier is named
         * by, whose text each Instance then owns; `derived-reset-pin` adds an
         * active-high reset terminal to an otherwise shared sequential body.
         */
        kind: "derived-input-swap" | "derived-output-drop" | "derived-lettered-body" | "derived-wide-amplifier" | "derived-reset-pin" | "derived-differential-comparator";
        sourceSymbolId: string;
        converterPath: string;
        converterVersion: number;
    } | {
        kind: "derived-multi-input-and-gate";
        sourceSymbolId: "and-gate";
        inputCount: 3 | 4;
        converterPath: string;
        converterVersion: number;
    } | {
        kind: "derived-multi-input-logic-gate";
        sourceSymbolId: "nand-gate" | "or-gate" | "nor-gate" | "xor-gate" | "xnor-gate";
        inputCount: 3 | 4;
        converterPath: string;
        converterVersion: number;
    };
}
export interface RazaviSemanticPrimitiveEntry {
    id: string;
    disposition: "semantic-primitive";
    geometry: {
        kind: "circle";
        sourceDiameterIU: number;
        fill: "foreground";
        stroke: "none";
    };
    runtimeOwner: string;
}
export declare const razaviLibrarySymbols: readonly {
    schemaVersion: 1;
    id: string;
    name: string;
    viewBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    pins: {
        name: string;
        signalMembers?: {
            id: string;
            name: string;
        }[] | undefined;
        role: string;
        at: {
            x: number;
            y: number;
        };
        direction: "east" | "north" | "south" | "west";
        routing?: {
            escape: "outward";
            preferredLanding?: {
                x: number;
                y: number;
            } | undefined;
        } | undefined;
        presentation: {
            visibility: "conditional" | "implicit" | "visible";
            leadLength?: number | undefined;
            showName?: boolean | undefined;
            displayName?: string | undefined;
            nameContent?: import("@icm/model").RichTextDocument | undefined;
            textStyle?: "math-symbol" | "plain" | undefined;
            textSizeScale?: number | undefined;
        };
    }[];
    primitives: ({
        kind: "line";
        from: {
            x: number;
            y: number;
        };
        to: {
            x: number;
            y: number;
        };
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "polyline";
        points: {
            x: number;
            y: number;
        }[];
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "circle";
        center: {
            x: number;
            y: number;
        };
        radius: number;
        fillableBody?: true | undefined;
        fill?: "foreground" | "none" | undefined;
        stroke?: "foreground" | "none" | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "rectangle";
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        fillableBody?: true | undefined;
        fill?: "foreground" | "none" | undefined;
        stroke?: "foreground" | "none" | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "path";
        data: string;
        fillableBody?: true | undefined;
        bounds?: {
            x: number;
            y: number;
            width: number;
            height: number;
        } | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "polygon";
        points: {
            x: number;
            y: number;
        }[];
        fillableBody?: true | undefined;
        fill: "foreground" | "none";
        stroke?: "foreground" | "none" | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    })[];
    variants: {
        id: string;
        hiddenPinNames: string[];
        auxiliaryPins?: {
            name: string;
            at: {
                x: number;
                y: number;
            };
            direction: "east" | "north" | "south" | "west";
            routing?: {
                escape: "outward";
                preferredLanding?: {
                    x: number;
                    y: number;
                } | undefined;
            } | undefined;
        }[] | undefined;
        hiddenPrimitiveParts?: string[] | undefined;
        additionalPrimitives?: ({
            kind: "line";
            from: {
                x: number;
                y: number;
            };
            to: {
                x: number;
                y: number;
            };
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        } | {
            kind: "polyline";
            points: {
                x: number;
                y: number;
            }[];
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        } | {
            kind: "circle";
            center: {
                x: number;
                y: number;
            };
            radius: number;
            fillableBody?: true | undefined;
            fill?: "foreground" | "none" | undefined;
            stroke?: "foreground" | "none" | undefined;
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        } | {
            kind: "rectangle";
            bounds: {
                x: number;
                y: number;
                width: number;
                height: number;
            };
            fillableBody?: true | undefined;
            fill?: "foreground" | "none" | undefined;
            stroke?: "foreground" | "none" | undefined;
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        } | {
            kind: "path";
            data: string;
            fillableBody?: true | undefined;
            bounds?: {
                x: number;
                y: number;
                width: number;
                height: number;
            } | undefined;
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        } | {
            kind: "polygon";
            points: {
                x: number;
                y: number;
            }[];
            fillableBody?: true | undefined;
            fill: "foreground" | "none";
            stroke?: "foreground" | "none" | undefined;
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        })[] | undefined;
    }[];
    defaultVariantId?: string | undefined;
    labelVisibility?: "hidden" | "shown" | undefined;
    decorative?: boolean | undefined;
    hierarchicalBlock?: true | undefined;
    formulaPresentation?: {
        defaultFormula: string;
        supportsCoefficient: boolean;
        center: {
            x: number;
            y: number;
        };
        fontSize: number;
        fractionBarWidth?: number | undefined;
        adaptiveFrame?: {
            shape?: "rectangle" | "right-tapered-trapezoid" | undefined;
            minBodyWidth: number;
            minBodyHeight: number;
            horizontalPadding: number;
            verticalPadding: number;
            leadLength: number;
        } | undefined;
    } | undefined;
}[];
export declare const razaviProductSymbols: readonly {
    schemaVersion: 1;
    id: string;
    name: string;
    viewBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    pins: {
        name: string;
        signalMembers?: {
            id: string;
            name: string;
        }[] | undefined;
        role: string;
        at: {
            x: number;
            y: number;
        };
        direction: "east" | "north" | "south" | "west";
        routing?: {
            escape: "outward";
            preferredLanding?: {
                x: number;
                y: number;
            } | undefined;
        } | undefined;
        presentation: {
            visibility: "conditional" | "implicit" | "visible";
            leadLength?: number | undefined;
            showName?: boolean | undefined;
            displayName?: string | undefined;
            nameContent?: import("@icm/model").RichTextDocument | undefined;
            textStyle?: "math-symbol" | "plain" | undefined;
            textSizeScale?: number | undefined;
        };
    }[];
    primitives: ({
        kind: "line";
        from: {
            x: number;
            y: number;
        };
        to: {
            x: number;
            y: number;
        };
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "polyline";
        points: {
            x: number;
            y: number;
        }[];
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "circle";
        center: {
            x: number;
            y: number;
        };
        radius: number;
        fillableBody?: true | undefined;
        fill?: "foreground" | "none" | undefined;
        stroke?: "foreground" | "none" | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "rectangle";
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        fillableBody?: true | undefined;
        fill?: "foreground" | "none" | undefined;
        stroke?: "foreground" | "none" | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "path";
        data: string;
        fillableBody?: true | undefined;
        bounds?: {
            x: number;
            y: number;
            width: number;
            height: number;
        } | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    } | {
        kind: "polygon";
        points: {
            x: number;
            y: number;
        }[];
        fillableBody?: true | undefined;
        fill: "foreground" | "none";
        stroke?: "foreground" | "none" | undefined;
        part?: string | undefined;
        style?: {
            strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
            strokeWidth?: number | undefined;
            lineCap?: "butt" | "round" | "square" | undefined;
            lineJoin?: "bevel" | "miter" | "round" | undefined;
            miterLimit?: number | undefined;
        } | undefined;
    })[];
    variants: {
        id: string;
        hiddenPinNames: string[];
        auxiliaryPins?: {
            name: string;
            at: {
                x: number;
                y: number;
            };
            direction: "east" | "north" | "south" | "west";
            routing?: {
                escape: "outward";
                preferredLanding?: {
                    x: number;
                    y: number;
                } | undefined;
            } | undefined;
        }[] | undefined;
        hiddenPrimitiveParts?: string[] | undefined;
        additionalPrimitives?: ({
            kind: "line";
            from: {
                x: number;
                y: number;
            };
            to: {
                x: number;
                y: number;
            };
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        } | {
            kind: "polyline";
            points: {
                x: number;
                y: number;
            }[];
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        } | {
            kind: "circle";
            center: {
                x: number;
                y: number;
            };
            radius: number;
            fillableBody?: true | undefined;
            fill?: "foreground" | "none" | undefined;
            stroke?: "foreground" | "none" | undefined;
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        } | {
            kind: "rectangle";
            bounds: {
                x: number;
                y: number;
                width: number;
                height: number;
            };
            fillableBody?: true | undefined;
            fill?: "foreground" | "none" | undefined;
            stroke?: "foreground" | "none" | undefined;
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        } | {
            kind: "path";
            data: string;
            fillableBody?: true | undefined;
            bounds?: {
                x: number;
                y: number;
                width: number;
                height: number;
            } | undefined;
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        } | {
            kind: "polygon";
            points: {
                x: number;
                y: number;
            }[];
            fillableBody?: true | undefined;
            fill: "foreground" | "none";
            stroke?: "foreground" | "none" | undefined;
            part?: string | undefined;
            style?: {
                strokeRole?: "annotation" | "emphasis" | "ground" | "normal" | "supply" | undefined;
                strokeWidth?: number | undefined;
                lineCap?: "butt" | "round" | "square" | undefined;
                lineJoin?: "bevel" | "miter" | "round" | undefined;
                miterLimit?: number | undefined;
            } | undefined;
        })[] | undefined;
    }[];
    defaultVariantId?: string | undefined;
    labelVisibility?: "hidden" | "shown" | undefined;
    decorative?: boolean | undefined;
    hierarchicalBlock?: true | undefined;
    formulaPresentation?: {
        defaultFormula: string;
        supportsCoefficient: boolean;
        center: {
            x: number;
            y: number;
        };
        fontSize: number;
        fractionBarWidth?: number | undefined;
        adaptiveFrame?: {
            shape?: "rectangle" | "right-tapered-trapezoid" | undefined;
            minBodyWidth: number;
            minBodyHeight: number;
            horizontalPadding: number;
            verticalPadding: number;
            leadLength: number;
        } | undefined;
    } | undefined;
}[];
export { razaviCatalogSymbols, razaviSymbolCatalogEntries };
/** @internal Catalog tests pin the generated identity and primitives. */
export { razaviSemanticPrimitives, razaviSymbolCatalogIdentity };
export declare function getRazaviCatalogSymbol(symbolId: string): SymbolDefinition | undefined;
/** @internal Tests across packages fetch catalog Symbols by id with it. */
export declare function requireRazaviCatalogSymbol(symbolId: string): SymbolDefinition;
export declare function getRazaviCatalogEntry(symbolId: string): RazaviSymbolCatalogEntry | undefined;
/**
 * The letter a built-in block is drawn with while its Reference stays its X
 * call: a UJT or PUT is drawn Q1, a Shockley diode D1, by a display alias.
 */
export declare function drawnReferencePrefix(symbolId: string): string | undefined;
/** Whether `name` is one such a block is drawn with rather than its Reference. */
export declare function isDrawnReferenceName(name: string, prefix: string | undefined): boolean;
export declare function isRazaviProductSymbolId(symbolId: string): boolean;
