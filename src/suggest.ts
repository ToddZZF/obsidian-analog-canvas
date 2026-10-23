/**
 * Offers the annotations of a drawing, in Obsidian's own popups.
 *
 * Writing `![[inv.icproj#` brings the annotations down from the cursor in
 * the editor's own suggestion popup — the one that completes headings after
 * `#`. Where there is no editor to complete in, the names are offered in the
 * fuzzy finder instead: the same popup the command palette opens.
 *
 * Every candidate wears a swatch: the frame's own shape hollow in its own
 * colour, with the naming label's ink dotted at the centre. Where two frames
 * share a name, the frame's id stands beside the name and is what the note
 * writes, so the two are told apart.
 */

import { Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, FuzzyMatch, FuzzySuggestModal, TFile, type App } from 'obsidian'
import { listDrawingRegions, type CircuitRegion } from './figure'
import type AnalogCanvasPlugin from '../main'

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
 * The swatch that tells regions apart: the hollow shape of the frame in its
 * own colour, with the naming label's ink dotted at the centre.
 */
function regionSwatch (region: CircuitRegion): string {
  const shape = region.shape === 'circle'
    ? `<circle cx="10" cy="10" r="6.5" fill="none" stroke="${region.shapeColor}" stroke-width="2"/>`
    : `<rect x="3.5" y="3.5" width="13" height="13" rx="2" fill="none" stroke="${region.shapeColor}" stroke-width="2"/>`
  return `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">` +
    shape +
    `<circle cx="10" cy="10" r="2.5" fill="${region.textColor}"/>` +
    `</svg>`
}

/** One candidate, as it stands in a popup. */
function renderRegionRow (region: CircuitRegion, el: HTMLElement): void {
  const row = el.createDiv({ cls: 'analog-canvas-region-row' })
  const swatch = row.createSpan({ cls: 'analog-canvas-region-swatch' })
  swatch.innerHTML = regionSwatch(region)
  row.createSpan({ cls: 'analog-canvas-region-name', text: region.name })
  if (region.duplicated) {
    row.createSpan({ cls: 'analog-canvas-region-id', text: region.objectId })
  }
}

/**
 * Completes the region of an embedded drawing while it is being typed.
 *
 * The trigger is the `#` inside the brackets: `![[inv.icproj#` asks for the
 * annotations of `inv.icproj`. The barred spelling `![[inv.icproj|#…]]` is
 * an alias, not a region, and completes nothing. Picking one rewrites just
 * the `#…` part, so the rest of the note is left as it stands.
 */
export class RegionEditorSuggest extends EditorSuggest<CircuitRegion> {
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

    // The region runs after the name: `![[inv.icproj#…]]`. A bar before the
    // hash is an alias (`![[inv.icproj|#…]]`), which names no region.
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
    return {
      start: { line: cursor.line, ch: cursor.ch - query.length - 1 },
      end: cursor,
      query
    }
  }

  async getSuggestions (context: EditorSuggestContext): Promise<CircuitRegion[]> {
    const drawing = this.drawing
    if (drawing === null) {
      return []
    }
    const regions = await listDrawingRegions(this.plugin, drawing)
    const query = context.query.trim().toLocaleLowerCase()
    return query.length === 0
      ? regions
      : regions.filter(region =>
        region.name.toLocaleLowerCase().includes(query) ||
        region.objectId.toLocaleLowerCase().includes(query))
  }

  renderSuggestion (value: CircuitRegion, el: HTMLElement): void {
    renderRegionRow(value, el)
  }

  selectSuggestion (value: CircuitRegion, _evt: MouseEvent | KeyboardEvent): void {
    const context = this.context
    if (context !== null) {
      context.editor.replaceRange(`#${regionReference(value)}`, context.start, context.end)
    }
    this.close()
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
    private readonly chosen: (region: CircuitRegion) => void
  ) {
    super(app)
    this.emptyStateText = 'This drawing has no Rectangle or Circle annotations.'
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
 * Offers the regions of a drawing to the editor, at the front of the line.
 *
 * The editor asks its suggests in turn and the first to answer keeps the
 * popup. Its own link suggestions answer inside `[[…]]` as well — they offer
 * the file itself where a region is being typed — and they are asked first.
 * At the front of the line the annotations of a drawing are asked where they
 * apply, and step aside everywhere else.
 *
 * @param   {AnalogCanvasPlugin}  plugin  The plugin
 */
export function registerRegionSuggest (plugin: AnalogCanvasPlugin): void {
  const suggest = new RegionEditorSuggest(plugin)
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
