/**
 * Offers the annotations of a drawing, in Obsidian's own popups.
 *
 * Writing `![[inv.icproj|#` brings the annotations down from the cursor in
 * the editor's own suggestion popup — the one that completes headings after
 * `#`. Where there is no editor to complete in, the names are offered in the
 * fuzzy finder instead: the same popup the command palette opens.
 */

import { Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, FuzzySuggestModal, TFile, type App } from 'obsidian'
import { listDrawingRegions } from './figure'
import type AnalogCanvasPlugin from '../main'

/**
 * Completes the region of an embedded drawing while it is being typed.
 *
 * The trigger is the `#` inside the brackets: `![[inv.icproj#` and
 * `![[inv.icproj|#` both ask for the annotations of `inv.icproj`, in the two
 * spellings a note may use. Picking one rewrites just the `#…` part, so the
 * note keeps whatever form it was written in.
 */
export class RegionEditorSuggest extends EditorSuggest<string> {
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

    // `![[inv.icproj|#…]]` writes the region as a title — the name runs up
    // to the bar — and `![[inv.icproj#…]]` writes it after the name.
    const target = inner.slice(0, hash).replace(/\|$/u, '').trim()
    if (target.length === 0) {
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

  async getSuggestions (context: EditorSuggestContext): Promise<string[]> {
    const drawing = this.drawing
    if (drawing === null) {
      return []
    }
    const names = await listDrawingRegions(this.plugin, drawing)
    const query = context.query.trim().toLocaleLowerCase()
    return query.length === 0
      ? names
      : names.filter(name => name.toLocaleLowerCase().includes(query))
  }

  renderSuggestion (value: string, el: HTMLElement): void {
    el.setText(value)
  }

  selectSuggestion (value: string, _evt: MouseEvent | KeyboardEvent): void {
    const context = this.context
    if (context !== null) {
      context.editor.replaceRange(`#${value}`, context.start, context.end)
    }
    this.close()
  }
}

/**
 * The annotations of one drawing, in the fuzzy finder.
 *
 * Choosing one hands the name back to whoever opened the popup; the embed
 * then points the note at it.
 */
export class RegionPickerModal extends FuzzySuggestModal<string> {
  constructor (
    app: App,
    private readonly names: string[],
    private readonly chosen: (name: string) => void
  ) {
    super(app)
    this.emptyStateText = 'This drawing has no Rectangle or Circle annotations.'
  }

  getItems (): string[] {
    return this.names
  }

  getItemText (item: string): string {
    return item
  }

  onChooseItem (item: string, _evt: MouseEvent | KeyboardEvent): void {
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
