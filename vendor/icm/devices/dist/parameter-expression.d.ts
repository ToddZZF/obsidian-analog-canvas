/** Native scalar expressions cannot replace point lists or derived digital-clock controls. */
export declare function supportsScalarParameterExpression(symbolId: string, parameter: string): boolean;
/**
 * Recognize one delimited native parameter expression, without evaluating it.
 * Unknown parameters/functions belong to ngspice. Card delimiters and unfinished
 * grouping do not belong inside a reversible Circuit parameter slot.
 */
export declare function parameterExpressionBody(value: string): string | undefined;
/** Conservative lexical references, including repairable incomplete slots. */
export declare function parameterReferences(value: string): readonly {
    name: string;
    from: number;
    to: number;
}[];
/** Retain expression spelling, delimiters and whitespace outside renamed tokens. */
export declare function renameParameterReference(value: string, from: string, to: string): string;
