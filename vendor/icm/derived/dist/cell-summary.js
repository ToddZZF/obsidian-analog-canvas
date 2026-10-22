import { projectCellInterface } from "@icm/model";
/** Read-only hierarchy inventory shared by management and future Agent views. */
export function summarizeProjectCells(project) {
    return project.documents.map((cell) => ({
        id: cell.id,
        name: cell.name,
        isTop: cell.id === project.topDocumentId,
        portCount: projectCellInterface(cell.netlist).ports.length,
        callers: project.documents.flatMap((parent) => parent.instances.flatMap((instance) => {
            const binding = instance.netlist?.binding;
            return binding?.kind === "subcircuit" &&
                binding.childDocumentId === cell.id
                ? [
                    {
                        documentId: parent.id,
                        documentName: parent.name,
                        instanceId: instance.id,
                    },
                ]
                : [];
        })),
    }));
}
