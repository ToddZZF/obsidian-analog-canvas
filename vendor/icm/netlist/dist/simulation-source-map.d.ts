/** UTF-16 source mapping for execution-only text composition. Not persisted. */
export type SimulationTextOrigin = {
    kind: "authored";
    path: string;
    startOffset: number;
} | {
    kind: "model-source";
    sourceId: string;
    revision: number;
    path: string;
    startOffset: number;
    derived?: boolean;
    sourceLength?: number;
} | {
    kind: "generated";
    purpose: "canvas-circuit" | "canvas-acquisitions" | "environment" | "run-variant";
    bindingId?: string;
    /** Location of the nominal text replaced for this execution point. */
    nominal?: {
        path: string;
        startOffset: number;
        endOffset: number;
    };
};
export interface SimulationTextSegment {
    startOffset: number;
    endOffset: number;
    origin: SimulationTextOrigin;
}
export interface SimulationFileSourceMap {
    path: string;
    segments: SimulationTextSegment[];
}
export interface MappedSimulationFile extends SimulationFileSourceMap {
    text: string;
}
export declare function mapSimulationFile(path: string, text: string, origin?: SimulationTextOrigin): MappedSimulationFile;
/** Insert only generated text; every unaffected author offset keeps its owner. */
export declare function insertSimulationText(file: MappedSimulationFile, offset: number, text: string, origin: Extract<SimulationTextOrigin, {
    kind: "generated";
}>): MappedSimulationFile;
/** Replace one run-only range without reformatting unaffected source or losing its offsets. */
export declare function replaceSimulationText(file: MappedSimulationFile, start: number, end: number, text: string, origin: Extract<SimulationTextOrigin, {
    kind: "generated";
}>): MappedSimulationFile;
export declare function locateSimulationText(map: SimulationFileSourceMap, offset: number): SimulationTextOrigin | null;
