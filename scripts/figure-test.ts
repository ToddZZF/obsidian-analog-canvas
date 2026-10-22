/**
 * Renders a drawing outside Obsidian, to check the figure pipeline.
 *
 * Usage: node scripts/figure-test.mjs <drawing> [region]
 */

import { readFileSync } from 'node:fs'
import { renderFigure } from '../src/figure'

const [, , path, region] = process.argv

if (path === undefined) {
  console.error('Usage: figure-test <drawing> [region]')
  process.exit(1)
}

const text = readFileSync(path, 'utf8')
const started = Date.now()
const figure = renderFigure(text, region)

console.log(`figure: ${figure.width} x ${figure.height}, ${figure.svg.length} bytes, ${Date.now() - started} ms`)
console.log(figure.svg.slice(0, 300))
