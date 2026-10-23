/**
 * Named circuit regions.
 *
 * A note may point at a part of a drawing instead of the whole sheet:
 * `[[inv.icproj#Annotation]]` asks the canvas to open the project and
 * zoom to whatever `#Annotation` names.
 *
 * A region is a Rectangle or Circle annotation — the frame a reader draws
 * around a part of the sheet. The frame carries its name through a label:
 *
 *   1. the drafting text anchored to the frame is its name (the label
 *      typed with the annotation),
 *   2. otherwise the free texts inside the frame name it, each going to
 *      the innermost frame that holds it (a label drawn into the frame
 *      after the fact).
 *
 * A frame already named through an anchored label answers to that name
 * alone. Texts outside every frame, and the references printed on parts,
 * are not annotations and name no region; they still answer when a note
 * writes them by hand.
 */
import {
  resolveDraftingObjectGeometry,
  resolveSchematicStyleProfile,
} from "@icm/derived";
import { flattenRichText, transformPoint } from "@icm/model";
import type {
  DerivedRect,
  DraftingObject,
  SchematicDocument,
} from "@icm/model";
import { resolveInstanceSymbol } from "@icm/symbols";
import type { SymbolResolver } from "@icm/symbols";

export type CircuitRegionKind =
  "rectangle" | "circle" | "shape-id" | "text" | "instance";

export interface CircuitRegionTarget {
  /** What the name resolved to. */
  readonly kind: CircuitRegionKind;
  /** The id of the object that carries the name. */
  readonly objectId: string;
  /** The framed area, in document grid units. */
  readonly bounds: DerivedRect;
}

/**
 * One region, as a note may point at it — with the colours its swatch shows.
 *
 * A frame's colours are the ones the sheet draws it in: the frame's own ink
 * shapes the swatch, and the label's ink dots its centre.
 */
export interface CircuitRegion {
  /** What the note writes after `#`, where the name stands alone. */
  readonly name: string;
  /** The id of the frame. Namesakes are told apart by this. */
  readonly objectId: string;
  /** The frame's own shape. */
  readonly shape: "rectangle" | "circle";
  /** The colour the frame is drawn in. */
  readonly shapeColor: string;
  /** The colour of the label that names the frame. */
  readonly textColor: string;
  /** Whether another frame answers to the same name. */
  readonly duplicated: boolean;
}

/** A Rectangle or Circle annotation: the frame drawn around a region. */
type Frame = DraftingObject & { kind: "rectangle" | "circle" };

/** The label texts of a sheet. */
type Label = Extract<DraftingObject, { kind: "text" }>;

/** Names are compared without case or surrounding whitespace. */
function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

/** The words a label carries, without their styling. */
function named(label: Label): string {
  return flattenRichText(label.content).trim();
}

function frames(document: SchematicDocument): Frame[] {
  return (document.drafting?.objects ?? []).filter(
    (object): object is Frame =>
      object.kind === "rectangle" || object.kind === "circle",
  );
}

function labels(document: SchematicDocument): Label[] {
  return (document.drafting?.objects ?? []).filter(
    (object): object is Label => object.kind === "text",
  );
}

/** Where a free label sits on the sheet. */
function seatOf(label: Label): { x: number; y: number } | null {
  return label.anchor.kind === "free" ? label.anchor.position : null;
}

/** Whether the frame holds the point. */
function frameHolds(frame: Frame, point: { x: number; y: number }): boolean {
  const slack = 0.5;
  if (frame.kind === "circle") {
    return (
      Math.hypot(point.x - frame.center.x, point.y - frame.center.y) <=
      frame.radius + slack
    );
  }
  // The point is moved into the frame's own turn before the box is asked.
  const turn = ((frame.rotation ?? 0) * -Math.PI) / 180;
  const dx = point.x - frame.center.x;
  const dy = point.y - frame.center.y;
  const x = dx * Math.cos(turn) - dy * Math.sin(turn);
  const y = dx * Math.sin(turn) + dy * Math.cos(turn);
  return (
    Math.abs(x) <= frame.width / 2 + slack &&
    Math.abs(y) <= frame.height / 2 + slack
  );
}

function frameArea(frame: Frame): number {
  return frame.kind === "circle"
    ? Math.PI * frame.radius * frame.radius
    : frame.width * frame.height;
}

/** The tightest frame that holds the point, if any. */
function innermostFrame(
  document: SchematicDocument,
  point: { x: number; y: number },
): Frame | null {
  let best: Frame | null = null;
  let bestArea = Number.POSITIVE_INFINITY;
  for (const frame of frames(document)) {
    if (!frameHolds(frame, point)) continue;
    const area = frameArea(frame);
    if (area < bestArea) {
      best = frame;
      bestArea = area;
    }
  }
  return best;
}

/** The label typed with the frame: the text anchored to it. */
function anchoredLabelOf(
  document: SchematicDocument,
  frameId: string,
): Label | null {
  for (const label of labels(document)) {
    if (label.anchor.kind !== "object" || label.anchor.objectId !== frameId) {
      continue;
    }
    if (named(label).length > 0) return label;
  }
  return null;
}

/** Every name a frame answers to, with the frame and label that carry it. */
function frameNames(
  document: SchematicDocument,
): Array<{ name: string; frame: Frame; label: Label }> {
  const found: Array<{ name: string; frame: Frame; label: Label }> = [];
  for (const frame of frames(document)) {
    const anchored = anchoredLabelOf(document, frame.id);
    if (anchored !== null) {
      // The label typed with the frame names it, and nothing else does.
      found.push({ name: named(anchored), frame, label: anchored });
      continue;
    }
    for (const label of labels(document)) {
      const seat = seatOf(label);
      if (seat === null) continue;
      const name = named(label);
      if (name.length === 0) continue;
      if (innermostFrame(document, seat)?.id !== frame.id) continue;
      found.push({ name, frame, label });
    }
  }
  return found;
}

/**
 * Resolves a region name against one Document.
 *
 * Returns `null` when nothing carries that name; the caller decides how to
 * report it (the canvas falls back to framing the whole drawing).
 */
export function resolveCircuitRegion(
  document: SchematicDocument,
  resolver: SymbolResolver,
  name: string,
): CircuitRegionTarget | null {
  const wanted = normalize(name);
  if (wanted.length === 0) return null;

  // 1. A Rectangle or Circle annotation named through its label: the frame.
  for (const entry of frameNames(document)) {
    if (normalize(entry.name) !== wanted) continue;
    const geometry = resolveDraftingObjectGeometry(
      document,
      resolver,
      entry.frame,
    );
    return {
      kind: entry.frame.kind,
      objectId: entry.frame.id,
      bounds: geometry.bounds,
    };
  }

  // 2. A frame named by its stable id, written by hand.
  for (const frame of frames(document)) {
    if (normalize(frame.id) !== wanted) continue;
    const geometry = resolveDraftingObjectGeometry(document, resolver, frame);
    return { kind: "shape-id", objectId: frame.id, bounds: geometry.bounds };
  }

  // 3. A free label that carries the name, written by hand.
  for (const label of labels(document)) {
    if (normalize(named(label)) !== wanted) continue;
    const geometry = resolveDraftingObjectGeometry(document, resolver, label);
    return { kind: "text", objectId: label.id, bounds: geometry.bounds };
  }

  // 4. A placed part, named by the reference printed on it, written by hand.
  for (const instance of document.instances) {
    const reference = instance.reference;
    if (!reference || normalize(reference) !== wanted) continue;
    if (!instance.placement) continue;
    const resolved = resolveInstanceSymbol(resolver, instance);
    if (!resolved) continue;
    const box = resolved.definition.viewBox;
    const corners = [
      { x: box.x, y: box.y },
      { x: box.x + box.width, y: box.y },
      { x: box.x + box.width, y: box.y + box.height },
      { x: box.x, y: box.y + box.height },
    ].map((point) =>
      transformPoint(point, instance.placement!.position, instance.placement!),
    );
    const xs = corners.map((point) => point.x);
    const ys = corners.map((point) => point.y);
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    return {
      kind: "instance",
      objectId: instance.id,
      bounds: {
        x: left,
        y: top,
        width: Math.max(1, Math.max(...xs) - left),
        height: Math.max(1, Math.max(...ys) - top),
      },
    };
  }

  return null;
}

/**
 * Every region a Document offers: the labels of its Rectangle and Circle
 * annotations, one entry per frame and name. The note app uses this to
 * suggest completions after `#`.
 */
export function circuitRegions(document: SchematicDocument): CircuitRegion[] {
  const foreground = foregroundOf(document);
  const entries = frameNames(document);
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = normalize(entry.name);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return entries
    .map((entry) => ({
      name: entry.name,
      objectId: entry.frame.id,
      shape: entry.frame.kind,
      shapeColor: colorOf(entry.frame, foreground),
      textColor: colorOf(entry.label, foreground),
      duplicated: (counts.get(normalize(entry.name)) ?? 0) > 1,
    }))
    .sort(
      (a, b) =>
        a.name.localeCompare(b.name) || a.objectId.localeCompare(b.objectId),
    );
}

/** The ink the document draws its annotations with. */
function foregroundOf(document: SchematicDocument): string {
  const presentation = (
    document as { presentation?: { styleProfileId?: string } }
  ).presentation;
  try {
    return resolveSchematicStyleProfile(
      presentation?.styleProfileId ?? "razavi-textbook-v1",
    ).foreground;
  } catch {
    return "#000";
  }
}

/** The colour a drafting object is drawn in. */
function colorOf(object: DraftingObject, foreground: string): string {
  return (
    object.styleOverride?.color ?? object.styleOverride?.fillColor ?? foreground
  );
}
