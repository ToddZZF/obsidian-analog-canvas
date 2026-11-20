import type { CommandA, CommandC } from "svg-pathdata";
import type { DerivedPoint } from "./schema/types.js";
export interface BodyCurve {
    readonly from: DerivedPoint;
    readonly to: DerivedPoint;
    readonly at: (t: number) => DerivedPoint;
    readonly xExtrema: readonly number[];
    readonly yExtrema: readonly number[];
    readonly linear: boolean;
    readonly projectionExtrema: (x: number, y: number) => readonly number[];
}
export declare function bodyLine(from: DerivedPoint, to: DerivedPoint): BodyCurve;
export declare function bodyCubic(from: DerivedPoint, to: DerivedPoint, command: CommandC): BodyCurve;
export declare function bodyArc(from: DerivedPoint, to: DerivedPoint, command: CommandA): BodyCurve | undefined;
export declare function bodyCurvePoint(curve: BodyCurve, t: number): DerivedPoint;
