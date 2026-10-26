/**
 * Shows the drawings that notes embed.
 *
 * `![[inv.icproj]]` shows the drawing, `![[inv.icproj#PFD]]` shows one
 * region of it, and `![[inv.icproj#]]` lists the regions the drawing
 * answers to. The figure is sized the way an image is sized, after a
 * bar: `![[inv.icproj|200x100]]` draws it 200 by 100 pixels, and
 * `![[inv.icproj|200]]` draws it 200 pixels wide with the height
 * following the drawing's own proportions. A size may stand beside a
 * region, `![[inv.icproj#PFD|200]]`.
 *
 * The figure is drawn by the plugin itself — the drawing is read, turned into
 * SVG and put into the note — so an embedded drawing costs no more than an
 * embedded image. Obsidian draws an embed through its embed registry, in the
 * reading view and in the editing view alike, so the figure is offered there:
 * the drawing is shown wherever Obsidian would have shown the file.
 *
 * The figure goes into a shadow root of its own: the SVG the editor exports
 * carries its own `svg {...}` rules, and a plain inline SVG would paint every
 * icon of Obsidian along with the drawing.
 */

import { MarkdownPostProcessorContext, MarkdownRenderChild, MarkdownView, Modal, TFile, setIcon, type App, type Editor } from 'obsidian'
import { dropFiguresOf, hasRegion, listDrawingRegions, readDrawing, renderFigureCached } from './figure'
import { RegionPickerModal, regionReference } from './suggest'
import { log } from './debug'
import type AnalogCanvasPlugin from '../main'

/** The extensions a circuit drawing may have. */
export const CIRCUIT_EXTENSIONS = ['icproj', 'icproj.json']

/**
 * Is this the name of a drawing?
 *
 * @param   {string}   name  The name to check
 *
 * @return  {boolean}         Whether the name belongs to a drawing.
 */
export function isCircuitName (name: string): boolean {
  const lower = name.toLowerCase()
  return CIRCUIT_EXTENSIONS.some(extension => lower.endsWith(`.${extension}`))
}

/**
 * The id of the Project a drawing's text holds.
 *
 * The name of a drawing changes as it is renamed, and a freed name can be
 * given to another drawing. The id is how one drawing is told from another
 * through all of that: it is written into the drawing itself and never
 * changes.
 *
 * @param   {string}   text  The text of a drawing
 *
 * @return  {string?}        The id, if the text holds one.
 */
export function projectIdOf (text: string): string | null {
  try {
    const id = (JSON.parse(text) as { id?: unknown }).id
    return typeof id === 'string' && id.length > 0 ? id : null
  } catch {
    return null
  }
}

/**
 * What an embed points at: the whole sheet, one region of it, or the list of
 * regions — `![[inv.icproj]]`, `![[inv.icproj#PFD]]`, `![[inv.icproj#]]`.
 */
type RegionRequest =
  | { kind: 'sheet' }
  | { kind: 'region', name: string }
  | { kind: 'picker' }

/**
 * What stands between an embed's brackets: `inv.icproj#PFD|200` as it is
 * written.
 *
 * The bar starts an alias — the place a size stands, `200` or `200x100` —
 * and the alias is no region. `![[inv.icproj|#PFD]]` therefore names no
 * region at all, while `![[inv.icproj#PFD]]` does.
 */
interface EmbedRef {
  /** The file the embed points at. */
  target: string
  /** Whether the link carried a `#` — a region, or the list where it is bare. */
  marked: boolean
  /** What follows the `#`, where there is one. */
  region: string
  /** What follows the `|`, where there is one. */
  alias: string
}

function parseEmbedInner (inner: string): EmbedRef {
  const bar = inner.indexOf('|')
  const link = (bar >= 0 ? inner.slice(0, bar) : inner).trim()
  const alias = bar >= 0 ? inner.slice(bar + 1).trim() : ''
  const hash = link.indexOf('#')
  return hash >= 0
    ? {
        target: link.slice(0, hash).trim(),
        marked: true,
        region: decodeURIComponent(link.slice(hash + 1)).trim(),
        alias
      }
    : { target: link, marked: false, region: '', alias }
}

/**
 * How large the note asks for the figure, in pixels: `![[inv.icproj|200x100]]`
 * names both sides, `![[inv.icproj|200]]` the width alone.
 */
interface EmbedSize {
  /** The width, in pixels. */
  width: number
  /** The height, in pixels, where the note names one. */
  height: number | null
}

/** A size, as a note writes one after the bar: `200x100` or `200`. */
const SIZE_WORDS = /^(\d+(?:\.\d+)?)(?:x(\d+(?:\.\d+)?))?$/iu

/** A bare number, the way Obsidian hands a size over as an attribute. */
const SIZE_ATTRIBUTE = /^\d+(?:\.\d+)?$/u

/** A number of pixels, the way a size stands in a style. */
const SIZE_STYLE = /^(\d+(?:\.\d+)?)(?:px)?$/iu

/**
 * The size an alias asks for, if it asks for one.
 *
 * An alias is a size when it is a width in pixels, alone or with a height
 * after an `x` — the way an image is sized. Any other words name the embed
 * and size nothing.
 *
 * @param   {string}     alias  What follows the `|`, as it is written
 *
 * @return  {EmbedSize?}        The size, if the alias is one.
 */
export function parseEmbedSize (alias: string): EmbedSize | null {
  const match = SIZE_WORDS.exec(alias.trim())
  if (match === null) {
    return null
  }
  const width = Number.parseFloat(match[1] ?? '')
  if (!Number.isFinite(width) || width <= 0) {
    return null
  }
  const height = match[2] === undefined ? null : Number.parseFloat(match[2])
  return {
    width,
    height: height !== null && Number.isFinite(height) && height > 0 ? height : null
  }
}

/**
 * A size, as a note writes one.
 *
 * @param   {EmbedSize}  size  The size
 *
 * @return  {string}           What goes after the `|`.
 */
function sizeAsWritten (size: EmbedSize): string {
  return size.height === null ? `${size.width}` : `${size.width}x${size.height}`
}

/**
 * The size an embed asks for, from wherever Obsidian keeps its words.
 *
 * The alias travels after a bar in the `src`, in the `alt`, or in the link
 * the embed was made from. Obsidian may also take the size out of the words
 * and hand it over as attributes of its own.
 *
 * @param   {HTMLElement}  element   The embed, as Obsidian made it
 * @param   {string}       linktext  What the note wrote, as in `![[inv.icproj|200]]`
 *
 * @return  {EmbedSize?}            The size, if the note names one.
 */
function embedSizeOf (element: HTMLElement, linktext: string): EmbedSize | undefined {
  const src = parseEmbedInner(element.getAttribute('src') ?? '')
  const size =
    parseEmbedSize(src.alias) ??
    parseEmbedSize(element.getAttribute('alt') ?? '') ??
    parseEmbedSize(parseEmbedInner(linktext).alias)
  if (size !== null) {
    return size
  }

  const width = element.getAttribute('width') ?? ''
  if (SIZE_ATTRIBUTE.test(width)) {
    const height = element.getAttribute('height') ?? ''
    return {
      width: Number.parseFloat(width),
      height: SIZE_ATTRIBUTE.test(height) ? Number.parseFloat(height) : null
    }
  }

  // Obsidian may also take the size out of the words and lay it on the embed
  // as a style, the way it sizes an image. A style this plugin wrote itself
  // says nothing about what the note asks for now.
  if (element.getAttribute('data-analog-canvas-size') !== null) {
    return undefined
  }
  const styled = SIZE_STYLE.exec(element.style.width ?? '')
  if (styled === null) {
    return undefined
  }
  const styledHeight = SIZE_STYLE.exec(element.style.height ?? '')
  return {
    width: Number.parseFloat(styled[1] ?? ''),
    height: styledHeight === null ? null : Number.parseFloat(styledHeight[1] ?? '')
  }
}

/**
 * What the embed asks for, from wherever Obsidian keeps it.
 *
 * A region is written after the name, `![[inv.icproj#PFD]]`; the hash marks
 * it, and a hash on its own asks for the names of the regions there are.
 */
function regionRequest (subpath: string, element: HTMLElement): RegionRequest {
  const fromMark = (name: string): RegionRequest =>
    name.length > 0 ? { kind: 'region', name } : { kind: 'picker' }

  const marked = subpath.trim()
  if (marked.startsWith('#')) {
    return fromMark(decodeURIComponent(marked.slice(1)).trim())
  }

  const src = parseEmbedInner(element.getAttribute('src') ?? '')
  if (src.marked) {
    return fromMark(src.region)
  }

  return { kind: 'sheet' }
}

/**
 * Where an embed stands in a line of a note, as its characters do.
 */
interface EmbedPlace {
  /** The line it stands on, counted from zero. */
  line: number
  /** Where its words begin — the `!`, when there is one. */
  from: number
  /** Where they end, after the closing brackets. */
  to: number
  /** What was written, as in `![[inv.icproj#PFD]]`. */
  token: string
}

/**
 * The embeds of one line of a note, in the order they stand.
 */
function embedsOfLine (lineText: string): Array<Omit<EmbedPlace, 'line'>> {
  const places: Array<Omit<EmbedPlace, 'line'>> = []
  for (const match of lineText.matchAll(/!?\[\[[^[\]]*\]\]/gu)) {
    const token = match[0]
    const from = match.index ?? 0
    places.push({ from, to: from + token.length, token })
  }
  return places
}

/**
 * The editor's own CodeMirror: where the figure's place in the note is known,
 * and where an embed is unfolded by selecting it.
 */
interface CMView {
  posAtDOM: (element: HTMLElement) => number
  focus: () => void
  dispatch: (spec: {
    selection: { anchor: number, head: number }
    scrollIntoView: boolean
  }) => void
  state: { doc: { lineAt: (position: number) => { from: number, number: number } } }
}

function cmOf (editor: Editor): CMView | undefined {
  return (editor as unknown as { cm?: CMView }).cm
}

/**
 * Offers the drawing's own fonts to the page, once.
 *
 * The figure carries its fonts inline as `@font-face` rules. They live in the
 * figure's shadow root like the rest of its styles, but a face is registered
 * with the page as a whole, so it is put into the page's own style sheet —
 * that much of the figure is harmless outside it: it only names a font.
 */
let fontsOffered = false

function offerFonts (figure: string): void {
  if (fontsOffered) {
    return
  }
  const faces = figure.match(/@font-face\{[^}]*\}/gu)
  if (faces === null || faces.length === 0) {
    return
  }
  fontsOffered = true
  const style = document.createElement('style')
  style.setAttribute('data-analog-canvas-fonts', '')
  style.textContent = faces.join('\n')
  document.head.appendChild(style)
}

/**
 * Paints a figure into an element.
 *
 * The SVG goes into a shadow root: the drawing has styles of its own (`svg {
 * fill: #000 }` and the like), and put into the page as plain markup they
 * would paint every icon of Obsidian along with the drawing.
 *
 * @param   {HTMLElement}  element  Where the figure goes
 * @param   {string}       figure   The figure, as SVG markup
 * @param   {EmbedSize?}   size     How large the note asks for it
 */
function paintFigure (element: HTMLElement, figure: string, size?: EmbedSize): void {
  offerFonts(figure)
  const holder = element.createDiv({ cls: 'analog-canvas-embed-figure' })
  const shadow = holder.attachShadow({ mode: 'open' })
  shadow.innerHTML = figure

  const svg = shadow.querySelector('svg')
  if (svg === null) {
    return
  }
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.style.display = 'block'
  svg.style.width = '100%'

  if (size === undefined) {
    svg.style.height = 'auto'
    return
  }

  // The note's own size: the width alone keeps the drawing's proportions,
  // while where both sides are named they are obeyed to the pixel, the way
  // an image is stretched to the size it is given.
  holder.style.width = `${size.width}px`
  holder.style.maxWidth = '100%'
  if (size.height === null) {
    svg.style.height = 'auto'
  } else {
    holder.style.height = `${size.height}px`
    svg.style.height = '100%'
    svg.setAttribute('preserveAspectRatio', 'none')
  }
}

/**
 * Draws the drawing into the given element.
 *
 * @param   {HTMLElement}         element   Where the figure goes
 * @param   {TFile}               file      The drawing
 * @param   {string?}             region    The region to show, if any
 * @param   {EmbedSize?}          size      How large the note asks for it
 * @param   {AnalogCanvasPlugin}  plugin    The plugin
 * @param   {boolean}             fresh     Whether to draw from the file
 *                                          itself, never from a kept copy
 */
export async function drawInto (
  element: HTMLElement,
  file: TFile,
  region: string | undefined,
  size: EmbedSize | undefined,
  plugin: AnalogCanvasPlugin,
  fresh = false
): Promise<void> {
  element.addClass('analog-canvas-embed')

  const text = await readDrawing(plugin, file, fresh)
  if (text === null) {
    element.setText(`The drawing could not be read: ${file.path}`)
    element.addClass('analog-canvas-embed-missing')
    return
  }

  let figure: string
  try {
    const key = `${file.path}@${file.stat.mtime}#${region ?? ''}`
    figure = renderFigureCached(key, text, region).svg
  } catch (error: any) {
    log(`the drawing could not be drawn: ${error?.stack ?? String(error)}`)
    element.setText(`The drawing could not be drawn: ${error?.message ?? String(error)}`)
    element.addClass('analog-canvas-embed-missing')
    return
  }

  // The old contents go only now that the new ones are ready: two drawings
  // that cross on their way in leave the later one standing alone.
  element.empty()
  if (size === undefined) {
    element.style.removeProperty('width')
    element.style.removeProperty('max-width')
    element.removeAttribute('data-analog-canvas-size')
  } else {
    // The embed is as wide as its figure, so the corner tools sit on it.
    element.style.width = `${size.width}px`
    element.style.maxWidth = '100%'
    element.setAttribute('data-analog-canvas-size', sizeAsWritten(size))
  }
  paintFigure(element, figure, size)

  element.setAttribute('data-analog-canvas-path', file.path)
  if (region !== undefined) {
    element.setAttribute('data-analog-canvas-region', region)
  }
  log(`the drawing was drawn into a note: ${file.path}${region !== undefined ? ` (${region})` : ''}`)
}

/**
 * What Obsidian hands to an embed creator: where the embed goes, and which
 * file it points at.
 */
interface EmbedContext {
  /** The element the embed is drawn into, as Obsidian made it. */
  containerEl: HTMLElement
  /** What the note wrote, as in `![[inv.icproj#PFD]]`. */
  linktext: string
  /** Where the embed sits in the vault. */
  sourcePath: string
}

/**
 * The figures that are on show. One drawing may be embedded in several places
 * at once, and a drawing that is drawn again is drawn again in all of them.
 */
const shownFigures = new Set<CircuitFigure>()

/**
 * One drawing, shown where a note embeds it.
 *
 * Obsidian draws an embed by loading a component into the embed's own element
 * and calling its `loadFile()`; the figure takes that place. The class stands
 * where Obsidian's own embeds stand — the markdown embed, the file chip — so it
 * carries the same fields (`file`, `subpath`) and the same `loadFile()` entry.
 */
class CircuitFigure extends MarkdownRenderChild {
  /** The drawing, once its file is known. */
  file: TFile | null = null
  /** The region the embed points at, as Obsidian parsed it. */
  subpath = ''

  constructor (
    ctx: EmbedContext,
    file: TFile,
    subpath: string,
    private readonly plugin: AnalogCanvasPlugin
  ) {
    super(ctx.containerEl)
    this.file = file
    this.subpath = subpath
    this.linktext = ctx.linktext
    this.sourcePath = ctx.sourcePath
    // The figure answers its own clicks; Obsidian must not treat a click as
    // one on the embed widget itself.
    this.containerEl.addClass('interactive-child')
  }

  /** Where the embed sits in the vault. */
  private readonly sourcePath: string
  /** What the note wrote, as in `![[inv.icproj|200]]`. */
  private readonly linktext: string
  /** What was drawn last, so an edited embed redraws. */
  private drawnKey: string | null = null
  /** The drawing that is under way, if any. */
  private drawing: Promise<void> | null = null
  /** Watches the embed's attributes, which the editing view changes in place. */
  private observer: MutationObserver | null = null

  onload (): void {
    shownFigures.add(this)
    this.registerDomEvent(this.containerEl, 'click', (event) => {
      const clicked = event.target instanceof HTMLElement ? event.target.closest('button') : null
      if (clicked !== null) {
        // The buttons — the corner tools, the picker — speak for themselves.
        return
      }
      event.preventDefault()
      event.stopPropagation()
      if (this.containerEl.querySelector('.analog-canvas-picker') !== null) {
        return
      }
      this.openQuickLook()
    })

    // The editing view rewrites the embed's attributes when its text is
    // edited — `![[inv.icproj#PFD]]` becomes `![[inv.icproj#Test]]` under the
    // figure that is already drawn. The figure follows the new words.
    this.observer = new MutationObserver(() => {
      void this.ensureDrawn()
    })
    this.observer.observe(this.containerEl, { attributes: true, attributeFilter: ['alt', 'src', 'width', 'height'] })
    this.register(() => {
      this.observer?.disconnect()
      this.observer = null
    })

    void this.ensureDrawn()
  }

  /** Called by Obsidian whenever the embed is (re)loaded into the note. */
  async loadFile (): Promise<void> {
    await this.ensureDrawn()
  }

  onunload (): void {
    shownFigures.delete(this)
  }

  /**
   * Draws the drawing again, from the file itself.
   */
  redrawFromDisk (): void {
    this.drawnKey = null
    void this.ensureDrawn(true)
  }

  /**
   * Draws the drawing again everywhere it is embedded, the way the refresh
   * button asks for: what the file says now is what the notes show.
   */
  private refresh (): void {
    const file = this.file
    if (file === null) {
      return
    }
    dropFiguresOf(file.path)
    for (const shown of shownFigures) {
      if (shown.file?.path === file.path) {
        shown.redrawFromDisk()
      }
    }
  }

  /** The region the embed shows right now, if it shows one. */
  private region (): string | undefined {
    const request = regionRequest(this.subpath, this.containerEl)
    return request.kind === 'region' ? request.name : undefined
  }

  /** How large the note asks for the figure, where it says. */
  private size (): EmbedSize | undefined {
    return embedSizeOf(this.containerEl, this.linktext)
  }

  /**
   * Draws the figure, unless what is asked for is drawn already.
   */
  private async ensureDrawn (fresh = false): Promise<void> {
    // The link may have been edited to point at another drawing.
    const src = (this.containerEl.getAttribute('src') ?? '').split('#')[0].trim()
    if (src.length > 0) {
      const file = this.plugin.resolveDrawing(src)
      if (file !== null) {
        this.file = file
      }
    }

    const request = regionRequest(this.subpath, this.containerEl)
    const size = this.size()
    const asked = request.kind === 'region' ? request.name : ''
    const key = `${this.file?.path ?? ''}|${request.kind}|${asked}|${size === undefined ? '' : sizeAsWritten(size)}`
    if (key === this.drawnKey && this.drawing !== null) {
      await this.drawing
      return
    }
    this.drawnKey = key
    // Draws wait their turn: what is asked last is drawn last, so a redraw
    // that lands while another is under way leaves no half-drawn pair behind.
    this.drawing = (this.drawing ?? Promise.resolve()).then(() => this.draw(request, size, fresh))
    await this.drawing
  }

  /** Draws what the embed asks for. */
  private async draw (request: RegionRequest, size: EmbedSize | undefined, fresh = false): Promise<void> {
    // Obsidian sets the embed's title — where a size may ride,
    // `![[inv.icproj|200]]` — only after the embed has been loaded. Waiting
    // for the stack to unwind lets it land before the figure is drawn.
    await Promise.resolve()
    const file = this.file
    if (file === null) {
      return
    }

    if (request.kind === 'picker') {
      await this.drawPicker(file)
      return
    }

    if (request.kind === 'region') {
      const text = await readDrawing(this.plugin, file)
      if (text !== null && !hasRegion(text, request.name)) {
        await drawInto(this.containerEl, file, undefined, size, this.plugin, fresh)
        this.containerEl.prepend(createDiv({
          cls: 'analog-canvas-embed-warning',
          text: `No annotation named “${request.name}” in ${file.name}`
        }))
        this.addHoverBar()
        return
      }
    }

    await drawInto(this.containerEl, file, request.kind === 'region' ? request.name : undefined, size, this.plugin, fresh)
    this.addHoverBar()
  }

  /**
   * The corner tools a figure offers on hover, the way an image does.
   */
  private addHoverBar (): void {
    if (this.containerEl.querySelector('.analog-canvas-embed-figure') === null) {
      return
    }
    const bar = this.containerEl.createDiv({ cls: 'analog-canvas-hover' })

    const make = (icon: string, label: string, action: () => void): void => {
      const button = bar.createEl('button', {
        cls: 'clickable-icon analog-canvas-hover-button',
        attr: {
          'aria-label': label,
          'data-tooltip-position': 'top'
        }
      })
      setIcon(button, icon)
      button.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        action()
      })
    }

    make('zoom-in', '放大', () => { this.openQuickLook() })
    make('refresh-cw', '刷新', () => { this.refresh() })
    make('code-2', '编辑区块', () => { void this.editEmbedText() })
    make('circuit-board', '编辑电路', () => { this.editCircuitInTab() })
  }

  /** Shows the figure large, the way clicking an image does. */
  private openQuickLook (): void {
    const file = this.file
    if (file === null) {
      return
    }
    new QuickLookModal(this.plugin.app, file, this.region(), this.plugin).open()
  }

  /** Opens the drawing itself, in a pane of its own. */
  private editCircuitInTab (): void {
    const file = this.file
    if (file === null) {
      return
    }
    void this.plugin.openDrawingInTab(file, this.region())
  }

  /**
   * Puts the cursor into the embed's own words, so the note may be pointed
   * elsewhere — `![[inv.icproj#PFD]]` becomes editable text under the hand.
   */
  private async editEmbedText (): Promise<void> {
    const leaves = this.plugin.app.workspace.getLeavesOfType('markdown')
    const found = leaves
      .map(leaf => leaf.view)
      .find(candidate => candidate instanceof MarkdownView && candidate.file?.path === this.sourcePath)
    if (!(found instanceof MarkdownView)) {
      return
    }

    if (found.getMode() !== 'source') {
      // The reading view holds no editor; the note is shown as text first.
      await found.leaf.setViewState({ type: 'markdown', state: { file: this.sourcePath, mode: 'source' }, active: true })
      await new Promise(resolve => setTimeout(resolve, 400))
    }

    const view = found.leaf.view
    if (!(view instanceof MarkdownView)) {
      return
    }
    const place = this.locateInEditor(view) ?? this.locateByText(view)
    if (place === null) {
      return
    }

    // The embed unfolds into editable source only when its words are selected
    // in the editor's own CodeMirror, with focus and scroll — the way an
    // image's own edit button does it. What is selected are the words between
    // the brackets, `inv.icproj#PFD`, the part the note's pointer is made of.
    const editor = view.editor
    const innerFrom = { line: place.line, ch: place.from + (place.token.startsWith('!') ? 3 : 2) }
    const innerTo = { line: place.line, ch: place.to - 2 }
    const cm = cmOf(editor)
    if (cm === undefined) {
      editor.focus()
      editor.setSelection(innerFrom, innerTo)
      return
    }
    cm.focus()
    cm.dispatch({
      selection: { anchor: editor.posToOffset(innerFrom), head: editor.posToOffset(innerTo) },
      scrollIntoView: true
    })
  }

  /**
   * Where the embed sits in the note's editor, by the place of its own
   * element in the editing view.
   */
  private locateInEditor (view: MarkdownView): EmbedPlace | null {
    const editor = view.editor
    const cm = cmOf(editor)
    if (cm === undefined || !this.containerEl.isConnected) {
      return null
    }

    let position: number
    try {
      position = cm.posAtDOM(this.containerEl)
    } catch {
      return null
    }

    const lineInfo = cm.state.doc.lineAt(position)
    const lineNumber = lineInfo.number - 1
    const lineText = editor.getLine(lineNumber) ?? ''
    const at = position - lineInfo.from

    // The embed on this line that sits closest to the figure.
    let best: EmbedPlace | null = null
    let bestDistance = Number.POSITIVE_INFINITY
    for (const place of embedsOfLine(lineText)) {
      const distance = at < place.from ? place.from - at : (at > place.to ? at - place.to : 0)
      if (distance < bestDistance) {
        bestDistance = distance
        best = { ...place, line: lineNumber }
      }
    }
    return best
  }

  /**
   * Where the embed sits in the note, found by the words it is written with.
   * The reading view's embeds are not part of the editor's own DOM.
   */
  private locateByText (view: MarkdownView): EmbedPlace | null {
    const editor = view.editor
    const wanted = regionRequest(this.subpath, this.containerEl)
    const lineCount = editor.lineCount()

    for (let line = 0; line < lineCount; line += 1) {
      const lineText = editor.getLine(line) ?? ''
      for (const place of embedsOfLine(lineText)) {
        const inside = lineText.slice(place.from + (place.token.startsWith('!') ? 3 : 2), place.to - 2)
        const ref = parseEmbedInner(inside)
        const drawing = ref.target.length === 0 ? null : this.plugin.resolveDrawing(ref.target)
        if (drawing === null || drawing.path !== this.file?.path) {
          continue
        }
        const name = ref.marked ? ref.region : ''
        if (wanted.kind === 'region' && name.toLocaleLowerCase() !== wanted.name.toLocaleLowerCase()) {
          continue
        }
        if (wanted.kind !== 'region' && name.length > 0) {
          continue
        }
        return { ...place, line }
      }
    }
    return null
  }

  /**
   * Asks for one annotation of the drawing, in Obsidian's own popup: the
   * fuzzy finder the command palette opens.
   */
  private async drawPicker (file: TFile): Promise<void> {
    this.containerEl.empty()
    this.containerEl.addClass('analog-canvas-embed')

    const regions = await listDrawingRegions(this.plugin, file)
    const button = this.containerEl.createEl('button', {
      cls: 'analog-canvas-picker',
      text: regions.length === 0
        ? `${file.name} has no annotations to point at.`
        : `Pick an annotation of ${file.name}…`
    })
    button.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      const modal = new RegionPickerModal(this.plugin.app, regions, (region) => {
        this.chooseRegion(regionReference(region))
      })
      modal.setPlaceholder(`Annotations in ${file.name}`)
      modal.open()
    })

    log(`the annotations were listed for a note: ${file.path} (${regions.length})`)
  }

  /**
   * Points the note at a region: into the note itself when the embed sits in
   * an editor, and into the figure when it does not.
   */
  private chooseRegion (name: string): void {
    const file = this.file
    if (file === null) {
      return
    }
    if (this.insertIntoNote(name)) {
      return
    }

    // The reading view has no editor to write to, so the region is shown
    // here, with a way back to the list.
    this.containerEl.empty()
    const back = this.containerEl.createEl('button', {
      cls: 'analog-canvas-picker analog-canvas-picker-back',
      text: '← All annotations'
    })
    back.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.drawnKey = null
      void this.ensureDrawn()
    })
    const holder = this.containerEl.createDiv()
    void drawInto(holder, file, name, this.size(), this.plugin)
  }

  /**
   * Writes the region into the note the embed belongs to.
   *
   * The note is edited through its own editor, the way the person typing
   * would — never through the document's markup. Whether the embed is picked
   * out of the line by its place in the text.
   *
   * @return  {boolean}  Whether the note was written to.
   */
  private insertIntoNote (name: string): boolean {
    const view = this.plugin.app.workspace.getLeavesOfType('markdown')
      .map(leaf => leaf.view)
      .find(candidate => candidate instanceof MarkdownView && candidate.file?.path === this.sourcePath)
    if (!(view instanceof MarkdownView)) {
      return false
    }

    const editor = view.editor
    const cm = (editor as unknown as {
      cm?: {
        posAtDOM: (element: HTMLElement) => number
        state: { doc: { lineAt: (position: number) => { from: number, number: number } } }
      }
    }).cm
    if (cm === undefined) {
      return false
    }

    let position: number
    try {
      position = cm.posAtDOM(this.containerEl)
    } catch {
      return false
    }

    const lineInfo = cm.state.doc.lineAt(position)
    const lineNumber = lineInfo.number - 1
    const lineText = editor.getLine(lineNumber) ?? ''
    const at = position - lineInfo.from

    // The embed on this line that sits closest to the figure.
    let best: { from: number, to: number } | null = null
    let bestDistance = Number.POSITIVE_INFINITY
    for (const match of lineText.matchAll(/!\[\[[^[\]]*\]\]/gu)) {
      const from = match.index ?? 0
      const to = from + match[0].length
      const distance = at < from ? from - at : (at > to ? at - to : 0)
      if (distance < bestDistance) {
        bestDistance = distance
        best = { from, to }
      }
    }
    if (best === null) {
      return false
    }

    // The region is written the one way regions are written: `![[inv.icproj#]]`
    // grows its region into `![[inv.icproj#PFD]]`. A size the note wrote after
    // the bar is kept, `![[inv.icproj#|200]]` becoming `![[inv.icproj#PFD|200]]`.
    const inside = lineText.slice(best.from + 3, best.to - 2)
    const ref = parseEmbedInner(inside)
    const size = parseEmbedSize(ref.alias)
    const written = `![[${ref.target}#${name}${size === null ? '' : `|${sizeAsWritten(size)}`}]]`

    editor.replaceRange(
      written,
      { line: lineNumber, ch: best.from },
      { line: lineNumber, ch: best.to }
    )
    log(`the note was pointed at a region: ${this.sourcePath} (${name})`)
    return true
  }
}

/**
 * The figure, shown large.
 *
 * Clicking a figure opens it the way clicking an image opens the image: the
 * drawing fills a dialog, without the note leaving where it is.
 */
class QuickLookModal extends Modal {
  constructor (
    app: App,
    private readonly file: TFile,
    private readonly region: string | undefined,
    private readonly plugin: AnalogCanvasPlugin
  ) {
    super(app)
  }

  onOpen (): void {
    this.titleEl.setText(this.region === undefined
      ? this.file.name
      : `${this.file.name} — ${this.region}`)
    this.modalEl.addClass('analog-canvas-quicklook')
    void drawInto(this.contentEl, this.file, this.region, undefined, this.plugin)
  }
}

/**
 * Offers the figures of drawings wherever Obsidian draws an embed.
 *
 * The registry knows the extensions by the end of a file's name: a drawing
 * named `inv.icproj.json` is a `.json` file to Obsidian, so that extension is
 * taken over as well, and every other file of that kind is left alone.
 *
 * @param   {AnalogCanvasPlugin}  plugin  The plugin
 */
export function registerCircuitEmbeds (plugin: AnalogCanvasPlugin): void {
  const registry = (plugin.app as unknown as {
    embedRegistry: {
      registerExtension: (extension: string, create: unknown) => void
      unregisterExtension: (extension: string) => void
    }
  }).embedRegistry

  const create = (ctx: EmbedContext, file: TFile, subpath: string): CircuitFigure | null => {
    if (!(file instanceof TFile) || !isCircuitName(file.path)) {
      return null
    }
    if (!plugin.settings.showInLivePreview && ctx.containerEl.closest('.cm-editor') !== null) {
      // The editing view shows the file itself, not the figure. Returning
      // nothing leaves Obsidian's own file embed in place.
      return null
    }
    return new CircuitFigure(ctx, file, subpath, plugin)
  }

  for (const extension of ['icproj', 'icproj.json', 'json']) {
    try {
      registry.registerExtension(extension, create)
      plugin.register(() => registry.unregisterExtension(extension))
    } catch (error: any) {
      // Another plugin may have taken the extension already; the drawings of
      // the other extensions still show.
      log(`the embeds of .${extension} could not be registered: ${error?.message ?? String(error)}`)
    }
  }
}

/**
 * Handles the links of a note that point at a drawing.
 *
 * A link may point at a region of a drawing. Obsidian would open the file and
 * look for a heading of that name, which a drawing does not have, so the link
 * is handled here instead.
 *
 * @param   {HTMLElement}                el     The rendered note
 * @param   {MarkdownPostProcessorContext} _ctx What the note is (unused)
 * @param   {AnalogCanvasPlugin}         plugin The plugin
 */
export function renderEmbeds (
  el: HTMLElement,
  _ctx: MarkdownPostProcessorContext,
  plugin: AnalogCanvasPlugin
): void {
  const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('a.internal-link[href]'))
  for (const link of links) {
    const href = link.getAttribute('href') ?? ''
    const hash = href.indexOf('#')
    const target = hash >= 0 ? href.slice(0, hash) : href
    const region = hash >= 0 ? decodeURIComponent(href.slice(hash + 1)).trim() : undefined
    if (!isCircuitName(target)) {
      continue
    }
    const file = plugin.resolveDrawing(target)
    if (file === null) {
      continue
    }
    link.addEventListener('click', (event) => {
      event.preventDefault()
      void plugin.openDrawing(file, region !== undefined && region.length > 0 ? region : undefined)
    })
  }
}
