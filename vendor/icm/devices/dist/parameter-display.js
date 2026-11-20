import { deviceDescriptor } from "./registry.js";
import { instanceParameterContract, } from "./instance-parameters.js";
/** Model selection owns the fields; artwork only selects established typography. */
export function parameterDisplayContract(instance, resolver) {
    const binding = instance.netlist?.binding;
    const bound = binding?.kind === "external-subcircuit" || binding?.kind === "subcircuit";
    const contract = resolver?.resolveParameters
        ? resolver.resolveParameters(instance)
        : bound
            ? undefined
            : instanceParameterContract({}, instance);
    const definitions = binding?.kind === "unresolved-subcircuit" && !contract?.model
        ? []
        : (contract?.definitions ?? []);
    const descriptor = deviceDescriptor(instance.symbolId);
    const magnetic = !bound &&
        ["xfmr", "tcoil", "center-tap-inductor"].includes(instance.symbolId);
    const geometry = definitions.some((p) => p.displayRole === "width") &&
        definitions.some((p) => p.displayRole === "length");
    const summary = geometry
        ? descriptor?.deviceClass === "mos"
            ? "mos"
            : "geometry"
        : definitions.some((p) => p.displayRole === "value")
            ? "value"
            : "none";
    const individual = magnetic
        ? [
            ...definitions.filter((p) => p.name === "k"),
            ...definitions.filter((p) => p.name !== "k"),
        ]
        : bound && (contract?.open || descriptor?.deviceClass !== "mos")
            ? definitions
            : definitions.filter((p) => p.displayRole === "multiplier");
    return { definitions, individual, summary, magnetic };
}
