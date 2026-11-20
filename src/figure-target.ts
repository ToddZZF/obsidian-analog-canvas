/**
 * What a note points at in a drawing.
 *
 * A note that names the drawing alone shows its top sheet. A `#` starts the
 * subpath Obsidian hands over: `#PFD` names a region of the top sheet, while
 * `#@ota_5t` names another Cell and `#@ota_5t#PFD` a region of that Cell.
 * The `@` tells a Cell from a region, and the second `#` keeps the spelling
 * notes already use for a region.
 *
 * The words are read here, away from the DOM and the drawing, so the same
 * grammar answers an embed, a link, and an editor suggestion.
 */

/** The Cell and region a note points at, where it names them. */
export interface FigureTarget {
  /** The Cell, by its netlist name or its document id. */
  cell?: string
  /** The region within that Cell, or within the top sheet. */
  region?: string
}

/** What an embed or a link asks for. */
export type FigureRequest =
  | { kind: 'sheet' }
  | { kind: 'figure', target: FigureTarget }
  | { kind: 'cell-picker' }
  | { kind: 'region-picker', cell?: string }

/** The mark that tells a Cell from a region: `#@ota_5t`. */
export const CELL_MARK = '@'

/**
 * Reads what a note wrote after the `#`.
 *
 * `@` alone lists the Cells, `@cell#` lists the regions of that Cell, and a
 * fragment without an `@` still names a region of the top sheet.
 *
 * @param   {string}          fragment  What follows the `#`
 *
 * @return  {FigureRequest}            What the note asks for.
 */
export function parseFigureRequest (fragment: string): FigureRequest {
  const words = fragment.trim()
  if (words.length === 0) {
    return { kind: 'region-picker' }
  }
  if (!words.startsWith(CELL_MARK)) {
    return { kind: 'figure', target: { region: words } }
  }

  const rest = words.slice(CELL_MARK.length)
  const hash = rest.indexOf('#')
  if (hash < 0) {
    const cell = rest.trim()
    return cell.length === 0
      ? { kind: 'cell-picker' }
      : { kind: 'figure', target: { cell } }
  }

  const cell = rest.slice(0, hash).trim()
  const region = rest.slice(hash + 1).trim()
  if (cell.length === 0) {
    return { kind: 'cell-picker' }
  }
  return region.length === 0
    ? { kind: 'region-picker', cell }
    : { kind: 'figure', target: { cell, region } }
}

/**
 * The target a request draws, where it draws one.
 *
 * @param   {FigureRequest}  request  What the note asks for
 *
 * @return  {FigureTarget?}          The Cell and region, if any.
 */
export function targetOf (request: FigureRequest): FigureTarget | undefined {
  return request.kind === 'figure' ? request.target : undefined
}

/**
 * What tells one target from another, for the figure cache.
 *
 * @param   {FigureTarget?}  target  The Cell and region, if any
 *
 * @return  {string}                 The key.
 */
export function figureTargetKey (target?: FigureTarget): string {
  return target === undefined
    ? 'top'
    : JSON.stringify([target.cell ?? '', target.region ?? ''])
}

/**
 * What tells one request from another, so an embed is drawn once.
 *
 * @param   {FigureRequest}  request  What the note asks for
 *
 * @return  {string}                 The key.
 */
export function figureRequestKey (request: FigureRequest): string {
  switch (request.kind) {
    case 'sheet':
      return 'sheet'
    case 'figure':
      return `figure:${figureTargetKey(request.target)}`
    case 'cell-picker':
      return 'cell-picker'
    case 'region-picker':
      return `region-picker:${request.cell ?? ''}`
  }
}
