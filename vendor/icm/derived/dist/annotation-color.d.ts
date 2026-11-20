import type { Annotation, Instance } from "@icm/model";
/**
 * Resolve the component that owns reference/value presentation. Binding is
 * semantic authority and therefore wins over a conflicting visual anchor.
 */
export declare function annotationOwningInstanceId(annotation: Annotation): string | undefined;
/**
 * Text paint is owned by the Annotation. Auto (no textColor) inherits the
 * owning Instance's effective foreground only for reference/value text; every
 * other annotation uses the Document profile foreground.
 */
export declare function resolveAnnotationTextColor(annotation: Annotation, owningInstance: Instance | undefined, profileForeground: string): string;
