export const NGSPICE_MAX_RAWFILE_BYTES = 64 * 1024 * 1024;
export const NGSPICE_MAX_LOG_BYTES = 1024 * 1024;
/** Bounded executor envelope (raw artifacts plus parsed results), not a GUI
 * receipt or an output-file budget. Shared by native HTTP, Worker and local
 * forwarding so a valid multi-analysis reply is not cut at an older 4 MiB hop. */
export const SIMULATION_EXECUTOR_RESPONSE_MAX_BYTES = 8 * 1024 * 1024;
/** Opt-in, receipt-bound streaming transport. Legacy buffered readers keep 8 MiB. */
export const SIMULATION_EXECUTOR_STREAM_MAX_BYTES = 256 * 1024 * 1024;
export const SIMULATION_EXECUTOR_TRANSFER_HEADER = "x-analog-execution-transfer";
export function isSimulationInputRevision(value) {
    return (value === undefined ||
        (typeof value === "string" && value.length > 0 && value.length <= 256));
}
