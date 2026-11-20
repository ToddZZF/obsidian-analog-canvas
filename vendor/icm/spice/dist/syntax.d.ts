import type { SourceSpan } from "@icm/model";
import type { SpiceDiagnostic } from "./diagnostics.js";
import type { SpiceSourceFile } from "./source-types.js";
export interface LogicalLine {
    fileId: string;
    text: string;
    rawText: string;
    sourceRef: SourceSpan;
    physicalLines: number[];
    orphanContinuation: boolean;
}
export interface RawSpiceParameter {
    name: string;
    rawText: string;
    sourceRef: SourceSpan;
}
interface StatementBase {
    rawText: string;
    sourceRef: SourceSpan;
}
export interface IncludeStatement extends StatementBase {
    kind: "include";
    requestedPath: string;
}
export interface SubcircuitStartStatement extends StatementBase {
    kind: "subckt_start";
    name: string;
    ports: string[];
    parameters: RawSpiceParameter[];
}
export interface SubcircuitEndStatement extends StatementBase {
    kind: "subckt_end";
    name?: string;
}
export interface ParameterStatement extends StatementBase {
    kind: "parameter";
    parameters: RawSpiceParameter[];
}
export interface ModelStatement extends StatementBase {
    kind: "model";
    name: string;
    modelType: string;
    rawParameters: string;
}
export interface GlobalStatement extends StatementBase {
    kind: "global";
    names: string[];
}
export interface LibraryStatement extends StatementBase {
    kind: "library";
    mode: "include" | "section-start" | "section-end";
    section: string;
    requestedPath?: string;
}
export interface FunctionStatement extends StatementBase {
    kind: "function";
    name: string;
    arguments: string[];
    rawExpression: string;
}
export interface ConditionalStatement extends StatementBase {
    kind: "conditional";
    form: "if" | "elseif" | "else" | "endif";
    rawExpression?: string;
}
export interface ControlBoundaryStatement extends StatementBase {
    kind: "control_boundary";
    form: "start" | "end";
}
export interface ControlCommandStatement extends StatementBase {
    kind: "control_command";
    command: string;
    arguments: string[];
}
export interface DirectiveStatement extends StatementBase {
    kind: "directive";
    name: string;
    arguments: string[];
    category: "analysis" | "output" | "option" | "metadata";
}
export type CurrentInstanceFamily = "resistor" | "capacitor" | "inductor" | "voltage-source" | "current-source" | "vcvs" | "vccs" | "cccs" | "ccvs" | "diode" | "bjt" | "switch" | "current-switch" | "mosfet" | "jfet" | "mesfet" | "behavioral-source" | "mutual-inductor" | "lossless-transmission-line" | "lossy-transmission-line" | "coupled-multiconductor-line" | "uniform-rc-line" | "single-lossy-transmission-line" | "subcircuit";
export interface InstanceStatement extends StatementBase {
    kind: "instance";
    name: string;
    family: CurrentInstanceFamily;
    nodes: string[];
    parameters: RawSpiceParameter[];
    master?: string;
    controlSource?: string;
}
export interface OpaqueSyntaxStatement extends StatementBase {
    kind: "opaque";
    probableType?: "element" | "directive" | "control";
    reason: string;
}
export type SpiceStatement = IncludeStatement | SubcircuitStartStatement | SubcircuitEndStatement | ParameterStatement | ModelStatement | GlobalStatement | LibraryStatement | FunctionStatement | ConditionalStatement | ControlBoundaryStatement | ControlCommandStatement | DirectiveStatement | InstanceStatement | OpaqueSyntaxStatement;
export interface SpiceSyntaxFile {
    fileId: string;
    statements: SpiceStatement[];
    logicalLines: LogicalLine[];
    diagnostics: SpiceDiagnostic[];
}
export declare function splitSpiceFields(text: string): string[];
/** Physical UTF-16 ranges for a parsed .param; same assignment grammar, not textual name replacement. */
export declare function locateSpiceParameterValues(statement: ParameterStatement): {
    name: string;
    startOffset: number;
    endOffset: number;
}[];
export declare function parseSpiceSource(source: SpiceSourceFile, options?: {
    titleLine?: boolean;
}): SpiceSyntaxFile;
export {};
