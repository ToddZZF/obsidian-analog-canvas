export class ProjectFormatError extends Error {
    diagnostics;
    constructor(diagnostics) {
        super(diagnostics.map((diagnostic) => diagnostic.message).join("; "));
        this.name = "ProjectFormatError";
        this.diagnostics = diagnostics;
    }
}
