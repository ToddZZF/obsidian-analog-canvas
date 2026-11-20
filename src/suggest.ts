/**
 * Offers the Cells and annotations of a drawing, in Obsidian's own popups.
 *
 * Writing `![[inv.icproj#` brings the annotations down from the cursor in
 * the editor's own suggestion popup — the one that completes headings after
 * `#`. `![[inv.icproj#@` offers the Cells instead, and `#@ota_5t#` the
 * annotations of that Cell. Where there is no editor to complete in, the
 * names are offered in the fuzzy finder instead: the same popup the command
 * palette opens.
 *
 * Every annotation candidate wears a swatch: the frame's own shape hollow in
 * its own colour, with the naming label's ink dotted at the centre. Where two
 * frames share a name, the frame's id stands beside the name and is what the
 * note writes, so the two are told apart.
 */

import { Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, FuzzyMatch, FuzzySuggestModal, TFile, type App } from 'obsidian'
import { cellReference, listDrawingCells, listDrawingRegions, type CircuitCell } from './figure'
import { CELL_MARK } from './figure-target'
import type { CircuitRegion } from './vendor/region-target'
import type AnalogCanvasPlugin from './main'

/**
 * What a region is written as in a note.
 *
 * A name of its own is the friendlier spelling; where namesakes exist, only
 * the frame's id pins the frame meant.
 *
 * @param   {CircuitRegion}  region  The region
 *
 * @return  {string}                 What goes after the `#`.
 */
export function regionReference (region: CircuitRegion): string {
  return region.duplicated ? region.objectId : region.name
}

/**
 * One candidate in a popup: a Cell, or a region of a sheet.
 *
 * A region of a Cell carries the Cell selector the note wrote, so choosing
 * the region writes that Cell back into the link.
 */
type EmbedCandidate =
  | { kind: 'cell', cell: CircuitCell }
  | { kind: 'region', region: CircuitRegion, cell?: string }

/**
 * The swatch that tells regions apart: the hollow shape of the frame in its
 * own colour, with the naming label's ink dotted at the centre. A white
 * shape a touch larger stands behind, so the black ink stays seen on a dark
 * theme.
 */
function regionSwatch (region: CircuitRegion): string {
  const circle = region.shape === 'circle'
  const backing = circle
    ? `<circle cx="10" cy="10" r="8.75" fill="#fff"/>`
    : `<rect x="1.25" y="1.25" width="17.5" height="17.5" rx="3" fill="#fff"/>`
  const shape = circle
    ? `<circle cx="10" cy="10" r="6.5" fill="none" stroke="${region.shapeColor}" stroke-width="2"/>`
    : `<rect x="3.5" y="3.5" width="13" height="13" rx="2" fill="none" stroke="${region.shapeColor}" stroke-width="2"/>`
  return `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">` +
    backing +
    shape +
    `<circle cx="10" cy="10" r="2.5" fill="${region.textColor}"/>` +
    `</svg>`
}

/** One region candidate, as it stands in a popup. */
function renderRegionRow (region: CircuitRegion, el: HTMLElement): void {
  const row = el.createDiv({ cls: 'analog-canvas-region-row' })
  const swatch = row.createSpan({ cls: 'analog-canvas-region-swatch' })
  // The swatch is one `<svg>` root, parsed as XML to keep its attributes as
  // they were written.
  const icon = new DOMParser().parseFromString(regionSwatch(region), 'image/svg+xml').querySelector('svg')
  if (icon !== null) {
    swatch.append(document.importNode(icon, true))
  }
  row.createSpan({ cls: 'analog-canvas-region-name', text: region.name })
  if (region.duplicated) {
    row.createSpan({ cls: 'analog-canvas-region-id', text: region.objectId })
  }
}

/** One Cell candidate, as it stands in a popup. */
function renderCellRow (cell: CircuitCell, el: HTMLElement): void {
  const row = el.createDiv({ cls: 'analog-canvas-cell-row' })
  row.createSpan({
    cls: 'analog-canvas-cell-badge',
    text: cell.top ? 'Top' : 'Cell'
  })
  row.createSpan({ cls: 'analog-canvas-cell-name', text: cell.name })
  const reference = cellReference(cell)
  if (reference !== cell.name) {
    row.createSpan({ cls: 'analog-canvas-cell-id', text: reference })
  }
}

/**
 * Completes the target of an embedded drawing while it is being typed.
 *
 * The trigger is the `#` inside the brackets: `![[inv.icproj#` asks for the
 * annotations of `inv.icproj`, `![[inv.icproj#@` for its Cells, and
 * `![[inv.icproj#@ota_5t#` for the annotations of that Cell. What follows a
 * bar is an alias, never a target, so `![[inv.icproj|#…]]` completes
 * nothing. Picking one rewrites just the `#…` part, so the rest of the note
 * is left as it stands.
 */
export class EmbedEditorSuggest extends EditorSuggest<EmbedCandidate> {
  /** The drawing the trigger pointed at, for the suggestions to read. */
  private drawing: TFile | null = null

  constructor (private readonly plugin: AnalogCanvasPlugin) {
    super(plugin.app)
  }

  onTrigger (cursor: EditorPosition, editor: Editor, _file: TFile | null): EditorSuggestTriggerInfo | null {
    const before = editor.getLine(cursor.line).slice(0, cursor.ch)
    const open = before.lastIndexOf('[[')
    if (open < 0) {
      return null
    }
    const inner = before.slice(open + 2)
    if (inner.includes(']')) {
      return null
    }
    const hash = inner.indexOf('#')
    if (hash < 0) {
      return null
    }

    // The target runs after the name: `![[inv.icproj#…]]`. A bar before the
    // hash is an alias (`![[inv.icproj|#…]]`), which names no target.
    const target = inner.slice(0, hash).trim()
    if (target.length === 0 || target.includes('|')) {
      return null
    }
    const drawing = this.plugin.resolveDrawing(target)
    if (drawing === null) {
      return null
    }
    this.drawing = drawing

    const query = inner.slice(hash + 1)
    if (query.includes('|')) {
      // The cursor is past the size alias, where no target is being typed.
      return null
    }
    return {
      start: { line: cursor.line, ch: cursor.ch - query.length - 1 },
      end: cursor,
      query
    }
  }

  async getSuggestions (context: EditorSuggestContext): Promise<EmbedCandidate[]> {
    const drawing = this.drawing
    if (drawing === null) {
      return []
    }

    const words = context.query.trim()
    if (words.startsWith(CELL_MARK)) {
      const rest = words.slice(CELL_MARK.length)
      const hash = rest.indexOf('#')

      if (hash < 0) {
        const wanted = rest.trim().toLocaleLowerCase()
        const cells = await listDrawingCells(this.plugin, drawing)
        return cells
          .filter(cell => wanted.length === 0 ||
            cell.name.toLocaleLowerCase().includes(wanted) ||
            cell.id.toLocaleLowerCase().includes(wanted))
          .map(cell => ({ kind: 'cell', cell }))
      }

      const cell = rest.slice(0, hash).trim()
      if (cell.length === 0) {
        return []
      }
      const wanted = rest.slice(hash + 1).trim().toLocaleLowerCase()
      const regions = await listDrawingRegions(this.plugin, drawing, cell)
      return regions
        .filter(region => wanted.length === 0 ||
          region.name.toLocaleLowerCase().includes(wanted) ||
          region.objectId.toLocaleLowerCase().includes(wanted))
        .map(region => ({ kind: 'region', region, cell }))
    }

    const wanted = words.toLocaleLowerCase()
    const regions = await listDrawingRegions(this.plugin, drawing)
    return regions
      .filter(region => wanted.length === 0 ||
        region.name.toLocaleLowerCase().includes(wanted) ||
        region.objectId.toLocaleLowerCase().includes(wanted))
      .map(region => ({ kind: 'region', region }))
  }

  renderSuggestion (value: EmbedCandidate, el: HTMLElement): void {
    if (value.kind === 'cell') {
      renderCellRow(value.cell, el)
      return
    }
    renderRegionRow(value.region, el)
  }

  selectSuggestion (value: EmbedCandidate, _evt: MouseEvent | KeyboardEvent): void {
    const context = this.context
    if (context !== null) {
      const written = value.kind === 'cell'
        ? `#${CELL_MARK}${cellReference(value.cell)}`
        : value.cell === undefined
          ? `#${regionReference(value.region)}`
          : `#${CELL_MARK}${value.cell}#${regionReference(value.region)}`
      context.editor.replaceRange(written, context.start, context.end)
    }
    this.close()
  }
}

/**
 * The Cells of one drawing, in the fuzzy finder.
 *
 * Choosing one hands the Cell back to whoever opened the popup; the embed
 * then points the note at it.
 */
export class CellPickerModal extends FuzzySuggestModal<CircuitCell> {
  constructor (
    app: App,
    private readonly cells: CircuitCell[],
    private readonly chosen: (cell: CircuitCell) => void
  ) {
    super(app)
    this.emptyStateText = 'This drawing has no Cells.'
  }

  getItems (): CircuitCell[] {
    return this.cells
  }

  getItemText (item: CircuitCell): string {
    // The id is searchable too, so a Cell may be found by either name.
    return `${item.name} ${item.id}`
  }

  renderSuggestion (item: FuzzyMatch<CircuitCell>, el: HTMLElement): void {
    renderCellRow(item.item, el)
  }

  onChooseItem (item: CircuitCell, _evt: MouseEvent | KeyboardEvent): void {
    this.chosen(item)
  }
}

/**
 * The annotations of one drawing, in the fuzzy finder.
 *
 * Choosing one hands the region back to whoever opened the popup; the embed
 * then points the note at it.
 */
export class RegionPickerModal extends FuzzySuggestModal<CircuitRegion> {
  constructor (
    app: App,
    private readonly regions: CircuitRegion[],
    private readonly chosen: (region: CircuitRegion) => void,
    emptyStateText = 'This drawing has no Rectangle or Circle annotations.'
  ) {
    super(app)
    this.emptyStateText = emptyStateText
  }

  getItems (): CircuitRegion[] {
    return this.regions
  }

  getItemText (item: CircuitRegion): string {
    // The id is searchable too, so a namesake can be found by either name.
    return item.duplicated ? `${item.name} ${item.objectId}` : item.name
  }

  renderSuggestion (item: FuzzyMatch<CircuitRegion>, el: HTMLElement): void {
    renderRegionRow(item.item, el)
  }

  onChooseItem (item: CircuitRegion, _evt: MouseEvent | KeyboardEvent): void {
    this.chosen(item)
  }
}

/**
 * Offers the Cells and regions of a drawing to the editor, at the front of
 * the line.
 *
 * The editor asks its suggests in turn and the first to answer keeps the
 * popup. Its own link suggestions answer inside `[[…]]` as well — they offer
 * the file itself where a region is being typed — and they are asked first.
 * At the front of the line the Cells and annotations of a drawing are asked
 * where they apply, and step aside everywhere else.
 *
 * @param   {AnalogCanvasPlugin}  plugin  The plugin
 */
export function registerRegionSuggest (plugin: AnalogCanvasPlugin): void {
  const suggest = new EmbedEditorSuggest(plugin)
  plugin.registerEditorSuggest(suggest)

  const manager = (plugin.app.workspace as unknown as {
    editorSuggest?: { suggests?: unknown[] }
  }).editorSuggest
  const list = manager?.suggests
  if (list === undefined) {
    return
  }
  const at = list.indexOf(suggest)
  if (at > 0) {
    list.splice(at, 1)
    list.unshift(suggest)
  }
}
