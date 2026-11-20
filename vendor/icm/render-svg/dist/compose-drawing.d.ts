import type { DrawingOrderEntry } from "@icm/model";
interface DrawingInk {
    readonly electrical: string;
    readonly circuitMarks: string;
    readonly instances: ReadonlyMap<string, string>;
    readonly annotations: ReadonlyMap<string, string>;
    readonly drafting: ReadonlyMap<string, string>;
}
/** Emit consecutive runs of like paint without moving any object across another. */
export declare function composeDrawing(order: readonly DrawingOrderEntry[], ink: DrawingInk, implicitOrder: boolean): string;
export {};
