/**
 * The complete runtime resolver library. The Reference-calibrated Razavi core
 * remains authoritative for its own style, while deliberately separated
 * Extended Devices add optional device families without claiming that
 * authority.
 *
 * Everything reviewed resolves here, browsable or not: a Symbol an action
 * switches an Instance to must draw even though nobody picks it from the
 * Library. Browsable lists are owned by `razaviProductSymbols` and
 * `expandedDeviceSymbols`.
 */
export declare const builtInSymbols: {
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
