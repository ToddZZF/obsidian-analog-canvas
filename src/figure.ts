/**
 * Draws the figures that notes show.
 *
 * A note that embeds a drawing shows the drawing: the top sheet, rendered as
 * the same formal SVG the editor exports. A link that names a region shows
 * that region instead of the whole sheet.
 *
 * The rendering happens in the plugin itself, without a frame of its own:
 * the drawing is read, turned into SVG markup and put into the note. That
 * keeps an embedded drawing as cheap as an embedded image.
 */

import type { TFile } from 'obsidian'
import { parseProject } from '@icm/project-protocol'
import { builtInSymbols, createProjectSymbolResolver } from '@icm/symbols'
import { renderDocumentSvg } from '@icm/render-svg'
import { circuitRegions, resolveCircuitRegion, type CircuitRegion } from './vendor/region-target'
import { log } from './debug'
import type AnalogCanvasPlugin from '../main'

export interface Figure {
  /** The figure, as SVG markup. */
  svg: string
  /** The width of the figure, in its own units. */
  width: number
  /** The height of the figure, in its own units. */
  height: number
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
 * Draws a drawing, or hands back the figure that was drawn before.
 *
 * @param   {string}   key     What tells one drawing from another
 * @param   {string}   text    The contents of the drawing
 * @param   {string?}  region  The region to show, if any
 *
 * @return  {Figure}            The figure.
 */
export function renderFigureCached (key: string, text: string, region?: string): Figure {
  const cached = figures.get(key)
  if (cached !== undefined) {
    return cached
  }

  const figure = renderFigure(text, region)
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
 * @param   {string}   text     The contents of the drawing
 * @param   {string?}  region   The region to show, if any
 *
 * @return  {Figure}             The figure.
 */
export function renderFigure (text: string, region?: string): Figure {
  const project = parseProject(text)
  const document =
    project.documents.find(item => item.id === project.topDocumentId) ??
    project.documents[0]

  if (document === undefined) {
    throw new Error('The drawing has no sheet')
  }

  const resolver = createProjectSymbolResolver(project, builtInSymbols)

  let bounds: { x: number, y: number, width: number, height: number } | undefined
  if (region !== undefined && region.length > 0) {
    const target = resolveCircuitRegion(document, resolver, region)
    if (target !== null) {
      // The crop is a grid rectangle: the figure is cut on whole grid lines,
      // so nothing of the region is clipped away.
      const left = Math.floor(target.bounds.x)
      const top = Math.floor(target.bounds.y)
      bounds = {
        x: left,
        y: top,
        width: Math.max(1, Math.ceil(target.bounds.width)),
        height: Math.max(1, Math.ceil(target.bounds.height))
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
 * Every region a drawing offers a note, read from disk.
 *
 * @param   {AnalogCanvasPlugin}  plugin  The plugin
 * @param   {TFile}               file    The drawing
 *
 * @return  {Promise<CircuitRegion[]>}    The regions, in a stable order.
 */
export async function listDrawingRegions (plugin: AnalogCanvasPlugin, file: TFile): Promise<CircuitRegion[]> {
  const text = await readDrawing(plugin, file)
  return text === null ? [] : listRegions(text)
}

/**
 * Every region a drawing answers to: the annotations a note may point at.
 *
 * @param   {string}    text  The contents of the drawing
 *
 * @return  {CircuitRegion[]}  The regions, in a stable order.
 */
export function listRegions (text: string): CircuitRegion[] {
  const project = parseProject(text)
  const document =
    project.documents.find(item => item.id === project.topDocumentId) ??
    project.documents[0]
  if (document === undefined) {
    return []
  }
  return circuitRegions(document)
}

/**
 * Does the drawing carry a region of that name?
 *
 * @param   {string}   text  The contents of the drawing
 * @param   {string}   name  The region the note points at
 *
 * @return  {boolean}        Whether the name resolves.
 */
export function hasRegion (text: string, name: string): boolean {
  const project = parseProject(text)
  const document =
    project.documents.find(item => item.id === project.topDocumentId) ??
    project.documents[0]
  if (document === undefined) {
    return false
  }
  const resolver = createProjectSymbolResolver(project, builtInSymbols)
  return resolveCircuitRegion(document, resolver, name) !== null
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
