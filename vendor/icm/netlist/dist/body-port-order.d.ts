import type { StableId } from "@icm/model";
import type { DesignNetlistIR } from "./ir.js";
/**
 * A subcircuit body the netlist writes itself — a generated behavioral model,
 * a magnetic network or a generated model Cell — with the Instances calling it.
 */
export interface GeneratedBody {
    name: string;
    /** Its ports in the order the netlist prints them by default. */
    ports: readonly string[];
    /**
     * The Instances that call it, in IR order, each with the Cell it sits in:
     * an Instance's id is unique within its Document only.
     */
    calls: readonly {
        cellId: StableId;
        instanceId: StableId;
    }[];
}
/** The order to print a body's ports in, a permutation of its own; null keeps it. */
export type BodyPortOrder = (body: GeneratedBody) => readonly string[] | null;
/**
 * The IR with bodies the netlist writes itself printed with their ports in
 * another order, and every call of them reordered alike, so a call's node i
 * still meets the body's port i and the file stays the same circuit. A
 * notation that binds symbols to terminal positions (RNL) reads such a file
 * in its own terminal order.
 *
 * Only generated bodies move: Cells the author drew and external masters keep
 * their interface, and so does the chopper, whose SPICE body is written by
 * hand. The IR passed in is not changed.
 */
export declare function withBodyPortOrder(ir: DesignNetlistIR, order: BodyPortOrder): DesignNetlistIR;
