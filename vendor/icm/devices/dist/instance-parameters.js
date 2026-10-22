import { deviceDescriptor, subcircuitDescriptor } from "./registry.js";
import { builtInModelContract, } from "./built-in-model-contracts.js";
import { resolveReviewedExternalBinding } from "./reviewed-external.js";
/** Explicit authored bindings win over the Symbol's default black-box master. */
export function instanceBuiltInSubcircuit(project, instance) {
    const binding = instance.netlist?.binding;
    if (binding && binding.kind !== "unresolved-subcircuit")
        return undefined;
    return subcircuitDescriptor(instance.symbolId, project.componentDefinitions
        ? { componentDefinitions: project.componentDefinitions }
        : undefined);
}
/**
 * Which parameters an Instance may carry, decided the way export decides it.
 *
 * - A reviewed PDK binding owns its parameters: a SKY130 resistor takes `w`,
 *   `l` and `mult`, not the built-in resistor's `value`.
 * - An external subcircuit or Cell offers its declared formal parameters and
 *   remains open to additional authored names.
 * - An unresolved registered master offers the shared built-in model facts;
 *   an unknown target does not inherit model facts from its artwork.
 * - Any other Instance has its built-in descriptor.
 *
 * Undefined when nothing describes the Instance's parameters: a custom,
 * imported or PDK symbol outside the registry.
 */
export function instanceParameterContract(project, instance) {
    const descriptor = deviceDescriptor(instance.symbolId, project.componentDefinitions
        ? { componentDefinitions: project.componentDefinitions }
        : undefined);
    const binding = instance.netlist?.binding;
    const formalDefinitions = (parameters) => parameters.map((p) => ({
        name: p.name,
        label: p.name,
        required: p.defaultValue === undefined,
        editor: "text",
        placeholder: p.defaultValue ?? "Required",
        displayRole: "none",
        help: p.defaultValue === undefined
            ? "This definition requires an instance value."
            : `Inherited: ${p.defaultValue}. Empty uses the definition default.`,
        ...(p.defaultValue !== undefined ? { defaultValue: p.defaultValue } : {}),
    }));
    if (binding?.kind === "external-subcircuit") {
        const definitionId = binding.definitionId;
        const definition = project.externalSubcircuitDefinitions?.find((candidate) => candidate.id === definitionId);
        const reviewed = definition
            ? resolveReviewedExternalBinding(definition.name, definition.terminals.map((terminal) => terminal.name), instance.symbolId)
            : undefined;
        return reviewed
            ? { definitions: reviewed.parameters, open: false }
            : {
                definitions: definition
                    ? formalDefinitions(definition.formalParameters)
                    : (descriptor?.parameters ?? []),
                open: true,
            };
    }
    if (binding?.kind === "subcircuit") {
        const child = project.documents?.find((d) => d.id === binding.childDocumentId);
        return {
            definitions: child?.netlist
                ? formalDefinitions(child.netlist.formalParameters)
                : (descriptor?.parameters ?? []),
            open: true,
        };
    }
    const subcircuit = instanceBuiltInSubcircuit(project, instance);
    const target = binding?.kind === "unresolved-subcircuit"
        ? binding.name
        : !binding
            ? subcircuit?.target
            : undefined;
    const model = typeof target === "string" && subcircuit
        ? builtInModelContract(target)
        : undefined;
    if (model)
        return {
            definitions: model.parameters,
            open: model.family !== "comparator" && model.implementation !== "delay",
            model,
        };
    if (binding?.kind === "unresolved-subcircuit")
        return { definitions: descriptor?.parameters ?? [], open: true };
    return descriptor
        ? { definitions: descriptor.parameters, open: false }
        : undefined;
}
