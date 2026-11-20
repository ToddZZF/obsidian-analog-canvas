import type { DesignNetlistCell } from "./ir.js";
export declare function lowerTerminalCurrentControls(cell: DesignNetlistCell): {
    cell: DesignNetlistCell;
    issues: {
        instanceId: string;
        targetId: string;
        message: string;
    }[];
};
export declare function signedControlGain(raw: string, sign: 1 | -1 | undefined, format: "spice" | "spectre"): string;
