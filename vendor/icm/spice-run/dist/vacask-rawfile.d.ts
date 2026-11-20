import type { RawfileParse } from "./rawfile.js";
/**
 * Native VACASK ASCII output (lib/outrawfile.cpp). Points are indexed and
 * contiguous, without ngspice's blank separator. Variables are `notype`:
 * quantity/unit and sweep semantics must come from the prepared acquisition,
 * never from the column's position or a guess at its name.
 *
 * Each file is collected separately by the runtime. Preserve every declared
 * column, including outer sweep axes, for the result adapter to interpret.
 */
export declare function parseVacaskRawfile(text: string): RawfileParse;
