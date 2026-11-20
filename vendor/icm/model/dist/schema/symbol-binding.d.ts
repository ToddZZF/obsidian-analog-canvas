import { z } from "zod";
/**
 * One stable native terminal drawn by one graphical pin of custom artwork,
 * or taken as the `VDD`/`VSS` property supply. Shared by source-backed
 * `circuitBinding` and a Cell's custom block artwork.
 */
export declare const SymbolTerminalMappingSchema: z.ZodUnion<readonly [z.ZodObject<{
    terminalId: z.ZodString;
    pinName: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    terminalId: z.ZodString;
    supply: z.ZodEnum<{
        VDD: "VDD";
        VSS: "VSS";
    }>;
}, z.core.$strict>]>;
export type SymbolTerminalMapping = z.infer<typeof SymbolTerminalMappingSchema>;
