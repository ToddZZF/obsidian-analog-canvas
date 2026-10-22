export { HierarchyFrameSchema, ObjectLocatorSchema } from "@icm/model";
/** Construct an unambiguous locator for an object directly in a Document. */
export function directObjectLocator(documentId, kind, objectId) {
    return { documentId, hierarchyPath: [], kind, objectId };
}
