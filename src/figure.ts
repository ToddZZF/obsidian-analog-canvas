/**
 * Draws the figures that notes show.
 *
 * A note that embeds a drawing shows the drawing: the top sheet, rendered as
 * the same formal SVG the editor exports. A link that names a region shows
 * that region instead of the whole sheet, and a link that names a Cell shows
 * that Cell, with a region of it where the note names one.
 *
 * The rendering happens in the plugin itself, without a frame of its own:
 * the drawing is read, turned into SVG markup and put into the note. That
 * keeps an embedded drawing as cheap as an embedded image.
 */

import type { TFile } from 'obsidian'
import type { CircuitProject, SchematicDocument } from '@icm/model'
import { parseProject } from '@icm/project-protocol'
import { builtInSymbols, createProjectSymbolResolver } from '@icm/symbols'
import { renderDocumentSvg } from '@icm/render-svg'
import { circuitRegions, resolveCircuitRegion, type CircuitRegion } from './vendor/region-target'
import type { FigureTarget } from './figure-target'
import { log } from './debug'
import type AnalogCanvasPlugin from './main'

export interface Figure {
  /** The figure, as SVG markup. */
  svg: string
  /** The width of the figure, in its own units. */
  width: number
  /** The height of the figure, in its own units. */
  height: number
}

/** One Cell of a drawing, as a note may point at it. */
export interface CircuitCell {
  /** The name the editor shows: the Cell netlist's name. */
  readonly name: string
  /** The document id Analog Canvas links cells by. */
  readonly id: string
  /** Whether this is the drawing's top sheet. */
  readonly top: boolean
}

/**
 * The figures that were drawn last, by the identity of the drawing they
 * belong to. A note that shows the same drawing in several places — or that
 * is opened again while it is being edited — does not draw it twice.
 */
const figures = new Map<string, Figure>()

/** How many figures are kept. */
const FIGURE_CACHE_SIZE = 64

/**
 * The document a note points at, or the top sheet where it names none.
 *
 * A Cell answers to the name the editor shows it by, then to the document id
 * Analog Canvas links cells by, and at last to the document's own name.
 *
 * @param   {CircuitProject}      project  The drawing
 * @param   {string?}             cell     The Cell the note names, if any
 *
 * @return  {SchematicDocument?}           The document, if there is one.
 */
function documentOf (project: CircuitProject, cell?: string): SchematicDocument | undefined {
  const top = project.documents.find(item => item.id === project.topDocumentId) ??
    project.documents[0]
  const wanted = cell?.trim() ?? ''
  if (wanted.length === 0) {
    return top
  }

  const lower = wanted.toLocaleLowerCase()
  return project.documents.find(item =>
    cellNameOf(item).toLocaleLowerCase() === lower) ??
    project.documents.find(item => item.id === wanted) ??
    project.documents.find(item => item.name.trim().toLocaleLowerCase() === lower)
}

/** The name a Cell is shown by. */
function cellNameOf (document: SchematicDocument): string {
  return (document.netlist?.name ?? document.name).trim() || document.name
}

/**
 * Draws a drawing, or hands back the figure that was drawn before.
 *
 * @param   {string}         key     What tells one drawing from another
 * @param   {string}         text    The contents of the drawing
 * @param   {FigureTarget?}  target  The Cell and region to show, if any
 *
 * @return  {Figure}                   The figure.
 */
export function renderFigureCached (key: string, text: string, target?: FigureTarget): Figure {
  const cached = figures.get(key)
  if (cached !== undefined) {
    return cached
  }

  const figure = renderFigure(text, target)
  if (figures.size >= FIGURE_CACHE_SIZE) {
    const oldest = figures.keys().next()
    if (!oldest.done) {
      figures.delete(oldest.value)
    }
  }
  figures.set(key, figure)
  return figure
}

/**
 * Draws a drawing.
 *
 * @param   {string}         text    The contents of the drawing
 * @param   {FigureTarget?}  target  The Cell and region to show, if any
 *
 * @return  {Figure}                  The figure.
 */
export function renderFigure (text: string, target?: FigureTarget): Figure {
  const project = parseProject(text)
  const document = documentOf(project, target?.cell)

  if (document === undefined) {
    throw new Error(target?.cell !== undefined && target.cell.trim().length > 0
      ? `The drawing has no Cell named “${target.cell}”`
      : 'The drawing has no sheet')
  }

  const resolver = createProjectSymbolResolver(project, builtInSymbols)

  let bounds: { x: number, y: number, width: number, height: number } | undefined
  const region = target?.region
  if (region !== undefined && region.length > 0) {
    const found = resolveCircuitRegion(document, resolver, region)
    if (found !== null) {
      // The crop is a grid rectangle: the figure is cut on whole grid lines,
      // so nothing of the region is clipped away.
      const left = Math.floor(found.bounds.x)
      const top = Math.floor(found.bounds.y)
      bounds = {
        x: left,
        y: top,
        width: Math.max(1, Math.ceil(found.bounds.width)),
        height: Math.max(1, Math.ceil(found.bounds.height))
      }
    }
  }

  const svg = renderDocumentSvg(document, resolver, {
    title: document.name,
    ...(bounds !== undefined ? { bounds } : {})
  })

  const size = figureSize(svg)
  return { svg, width: size.width, height: size.height }
}

/**
 * Forgets the figures of one drawing, so it is drawn again from what its
 * file says now.
 *
 * @param   {string}   path  The name of the drawing
 */
export function dropFiguresOf (path: string): void {
  const prefix = `${path}@`
  for (const key of [...figures.keys()]) {
    if (key.startsWith(prefix)) {
      figures.delete(key)
    }
  }
}

/**
 * The drawing, as it is on disk.
 *
 * @param   {AnalogCanvasPlugin}  plugin  The plugin
 * @param   {TFile}               file    The drawing
 * @param   {boolean}             fresh   Whether to read the file itself,
 *                                        never the copy kept in memory
 *
 * @return  {string?}                     Its contents, if it could be read.
 */
export async function readDrawing (plugin: AnalogCanvasPlugin, file: TFile, fresh = false): Promise<string | null> {
  try {
    return await (fresh ? plugin.app.vault.read(file) : plugin.app.vault.cachedRead(file))
  } catch (error: any) {
    log(`the drawing could not be read: ${error?.stack ?? String(error)}`)
    return null
  }
}

/**
 * Every Cell a drawing offers a note, read from disk.
 *
 * @param   {AnalogCanvasPlugin}  plugin  The plugin
 * @param   {TFile}               file    The drawing
 *
 * @return  {Promise<CircuitCell[]>}      The Cells, top first.
 */
export async function listDrawingCells (plugin: AnalogCanvasPlugin, file: TFile): Promise<CircuitCell[]> {
  const text = await readDrawing(plugin, file)
  return text === null ? [] : listCells(text)
}

/**
 * Every Cell a drawing answers to, the top sheet first.
 *
 * @param   {string}         text  The contents of the drawing
 *
 * @return  {CircuitCell[]}       The Cells, in a stable order.
 */
export function listCells (text: string): CircuitCell[] {
  const project = parseProject(text)
  return project.documents
    .map(document => ({
      name: cellNameOf(document),
      id: document.id,
      top: document.id === project.topDocumentId
    }))
    .sort((a, b) =>
      Number(b.top) - Number(a.top) ||
      a.name.localeCompare(b.name) ||
      a.id.localeCompare(b.id))
}

/**
 * How a note writes a Cell after `#@`.
 *
 * The name is the friendlier spelling; a name the link grammar cannot carry
 * (`#`, `|`, `[`, `]`, `%`) gives way to the document id.
 *
 * @param   {CircuitCell}  cell  The Cell
 *
 * @return  {string}            What goes after the `@`.
 */
export function cellReference (cell: CircuitCell): string {
  const name = cell.name.trim()
  const unwritable = name.length === 0 ||
    name.includes('#') ||
    name.includes('|') ||
    name.includes('[') ||
    name.includes(']') ||
    name.includes('%')
  return unwritable ? cell.id : name
}

/**
 * The document id of the Cell a note names, for the editor.
 *
 * @param   {string}  text      The contents of the drawing
 * @param   {string}  selector  The Cell name or document id
 *
 * @return  {string?}           The document id, if the Cell resolves.
 */
export function cellDocumentId (text: string, selector: string): string | null {
  try {
    return documentOf(parseProject(text), selector)?.id ?? null
  } catch {
    return null
  }
}

/**
 * Does the drawing carry a Cell of that name?
 *
 * @param   {string}   text      The contents of the drawing
 * @param   {string}   selector  The Cell name or document id
 *
 * @return  {boolean}            Whether the Cell resolves.
 */
export function hasCell (text: string, selector: string): boolean {
  if (selector.trim().length === 0) {
    return false
  }
  return documentOf(parseProject(text), selector) !== undefined
}

/**
 * Every region a drawing offers a note, read from disk.
 *
 * @param   {AnalogCanvasPlugin}  plugin  The plugin
 * @param   {TFile}               file    The drawing
 * @param   {string?}             cell    The Cell to read, the top sheet if none
 *
 * @return  {Promise<CircuitRegion[]>}    The regions, in a stable order.
 */
export async function listDrawingRegions (
  plugin: AnalogCanvasPlugin,
  file: TFile,
  cell?: string
): Promise<CircuitRegion[]> {
  const text = await readDrawing(plugin, file)
  return text === null ? [] : listRegions(text, cell)
}

/**
 * Every region a drawing answers to: the annotations a note may point at.
 *
 * @param   {string}    text  The contents of the drawing
 * @param   {string?}   cell  The Cell to read, the top sheet if none
 *
 * @return  {CircuitRegion[]}  The regions, in a stable order.
 */
export function listRegions (text: string, cell?: string): CircuitRegion[] {
  const project = parseProject(text)
  const document = documentOf(project, cell)
  if (document === undefined) {
    return []
  }
  return circuitRegions(document)
}

/**
 * Does the drawing carry the region the note points at?
 *
 * @param   {string}         text    The contents of the drawing
 * @param   {FigureTarget}   target  The Cell and region the note points at
 *
 * @return  {boolean}                 Whether the name resolves.
 */
export function hasRegion (text: string, target: FigureTarget): boolean {
  const project = parseProject(text)
  const document = documentOf(project, target.cell)
  if (document === undefined) {
    return false
  }
  const region = target.region
  if (region === undefined || region.length === 0) {
    return true
  }
  const resolver = createProjectSymbolResolver(project, builtInSymbols)
  return resolveCircuitRegion(document, resolver, region) !== null
}

/** Reads the figure's own viewBox, so the note can size the image. */
function figureSize (svg: string): { width: number, height: number } {
  const match = /viewBox="([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)"/u.exec(svg)
  if (match === null) {
    return { width: 960, height: 640 }
  }
  return {
    width: Number.parseFloat(match[3] ?? '960') || 960,
    height: Number.parseFloat(match[4] ?? '640') || 640
  }
}
