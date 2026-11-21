/**
 * Exercises the fetching of the circuit editor outside Obsidian.
 *
 * The module talks to the `obsidian` module, which only exists inside the
 * app. The script bundles it with a stub in the module's place and then
 * drives the whole fetch: missing bundles, outdated ones, bundles installed
 * by hand, broken downloads and archives that try to escape the folder.
 *
 * Usage: node scripts/fetch-editor-test.mjs
 */

import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { strToU8, zipSync } from 'fflate'

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const work = mkdtempSync(path.join(tmpdir(), 'fetch-editor-test-'))

// The stub of the pieces of 'obsidian' the module imports. The download is
// a hook, so each test can serve an archive of its choosing.
const stub = path.join(work, 'obsidian-stub.mjs')
writeFileSync(stub, `
export class Notice {
  hide () {}
}

export async function requestUrl (request) {
  return globalThis.__fetchTestDownload(request.url)
}
`)

const bundle = path.join(work, 'fetch-editor.bundle.mjs')
await build({
  entryPoints: [path.join(project, 'src', 'fetch-editor.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  alias: { obsidian: stub },
  outfile: bundle,
  logLevel: 'silent'
})

const { editorArchiveUrl, editorState, ensureEditor } = await import(pathToFileURL(bundle).href)

/** How often the download was asked for, and what it serves. */
const downloads = { count: 0, lastUrl: null, archive: null }
globalThis.__fetchTestDownload = async (url) => {
  downloads.count += 1
  downloads.lastUrl = url
  if (downloads.archive === null) {
    throw new Error('Request failed, status 404')
  }
  const bytes = downloads.archive
  return { arrayBuffer: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) }
}

/** A release-like archive: the directory entries are written as well. */
const good = zipSync({
  'circuit/': strToU8(''),
  'circuit/obsidian.html': strToU8('<html></html>'),
  'circuit/assets/': strToU8(''),
  'circuit/assets/app.js': strToU8('export {}')
})

/** An archive that tries to write a file beside the plugin folder. */
const escaping = zipSync({
  'circuit/obsidian.html': strToU8('<html></html>'),
  'circuit/../../evil.txt': strToU8('evil')
})

const version = '0.1.0'
const MARKER = '.fetched-version'

/** A plugin folder of its own for every test. */
function freshPlugin () {
  return mkdtempSync(path.join(work, 'plugin-'))
}

async function test (name, body) {
  await body()
  console.log(`ok - ${name}`)
}

await test('the archive URL names the release of the version', () => {
  assert.equal(
    editorArchiveUrl(version),
    'https://github.com/ToddZZF/obsidian-analog-canvas/releases/download/0.1.0/circuit.zip')
})

await test('a missing bundle is downloaded and unpacked', async () => {
  const plugin = freshPlugin()
  const root = path.join(plugin, 'circuit')
  downloads.archive = good
  assert.equal(await ensureEditor(root, version), true)
  assert.equal(downloads.count, 1)
  assert.ok(existsSync(path.join(root, 'obsidian.html')))
  assert.ok(existsSync(path.join(root, 'assets', 'app.js')))
  assert.equal(readFileSync(path.join(root, MARKER), 'utf8').trim(), version)
  assert.ok(!existsSync(path.join(plugin, '.circuit.unpacked')))
})

await test('a fetched bundle of the current version is kept', async () => {
  const plugin = freshPlugin()
  const root = path.join(plugin, 'circuit')
  downloads.archive = good
  await ensureEditor(root, version)
  const count = downloads.count
  assert.equal(await ensureEditor(root, version), true)
  assert.equal(downloads.count, count)
})

await test('an outdated fetched bundle is replaced', async () => {
  const plugin = freshPlugin()
  const root = path.join(plugin, 'circuit')
  downloads.archive = good
  await ensureEditor(root, version)
  writeFileSync(path.join(root, MARKER), '0.0.9\n')
  const count = downloads.count
  assert.equal(await ensureEditor(root, version), true)
  assert.equal(downloads.count, count + 1)
  assert.equal(readFileSync(path.join(root, MARKER), 'utf8').trim(), version)
})

await test('a bundle without the marker is trusted as it is', async () => {
  const plugin = freshPlugin()
  const root = path.join(plugin, 'circuit')
  downloads.archive = good
  await ensureEditor(root, version)
  rmSync(path.join(root, MARKER))
  writeFileSync(path.join(root, 'keep.txt'), 'by hand')
  const count = downloads.count
  assert.equal(await ensureEditor(root, version), true)
  assert.equal(downloads.count, count)
  assert.equal(readFileSync(path.join(root, 'keep.txt'), 'utf8'), 'by hand')
})

await test('a folder without the entry point is replaced', async () => {
  const plugin = freshPlugin()
  const root = path.join(plugin, 'circuit')
  mkdirSync(root, { recursive: true })
  writeFileSync(path.join(root, MARKER), `${version}\n`)
  downloads.archive = good
  const count = downloads.count
  assert.equal(await ensureEditor(root, version), true)
  assert.equal(downloads.count, count + 1)
  assert.ok(existsSync(path.join(root, 'obsidian.html')))
})

await test('a download that fails leaves the bundle alone', async () => {
  const plugin = freshPlugin()
  const root = path.join(plugin, 'circuit')
  downloads.archive = good
  await ensureEditor(root, version)
  writeFileSync(path.join(root, 'keep.txt'), 'by hand')
  writeFileSync(path.join(root, MARKER), '0.0.9\n')
  downloads.archive = null
  const count = downloads.count
  assert.equal(await ensureEditor(root, version), false)
  assert.equal(downloads.count, count + 1)
  assert.equal(readFileSync(path.join(root, 'keep.txt'), 'utf8'), 'by hand')
})

await test('an archive that escapes the folder is rejected', async () => {
  const plugin = freshPlugin()
  const root = path.join(plugin, 'circuit')
  downloads.archive = good
  await ensureEditor(root, version)
  writeFileSync(path.join(root, 'keep.txt'), 'by hand')
  writeFileSync(path.join(root, MARKER), '0.0.9\n')
  downloads.archive = escaping
  assert.equal(await ensureEditor(root, version), false)
  assert.ok(!existsSync(path.join(plugin, 'evil.txt')))
  assert.equal(readFileSync(path.join(root, 'keep.txt'), 'utf8'), 'by hand')
})

await test('a mirror stands in front of the official address', () => {
  const official = editorArchiveUrl(version)
  assert.equal(editorArchiveUrl(version, 'https://gh-proxy.com/'), `https://gh-proxy.com/${official}`)
  // A prefix without a slash of its own still makes an address.
  assert.equal(editorArchiveUrl(version, 'https://ghfast.top'), `https://ghfast.top/${official}`)
  // Blank spaces around a prefix are of no account.
  assert.equal(editorArchiveUrl(version, '  https://gh-proxy.com/  '), `https://gh-proxy.com/${official}`)
  // An empty prefix is the official address.
  assert.equal(editorArchiveUrl(version, ''), official)
})

await test('the bundle is fetched from the mirror that was asked for', async () => {
  const plugin = freshPlugin()
  const root = path.join(plugin, 'circuit')
  downloads.archive = good
  assert.equal(await ensureEditor(root, version, 'https://gh-proxy.com/'), true)
  assert.equal(downloads.lastUrl, `https://gh-proxy.com/${editorArchiveUrl(version)}`)
})

await test('the state of the bundle is told apart', async () => {
  const plugin = freshPlugin()
  const root = path.join(plugin, 'circuit')
  downloads.archive = good

  // No bundle at all.
  assert.equal(editorState(root, version), 'missing')

  // A bundle that was fetched for this version.
  await ensureEditor(root, version)
  assert.equal(editorState(root, version), 'ready')

  // A bundle that was fetched for an older version.
  writeFileSync(path.join(root, MARKER), '0.0.9\n')
  assert.equal(editorState(root, version), 'outdated')

  // A bundle that was installed by hand.
  rmSync(path.join(root, MARKER))
  assert.equal(editorState(root, version), 'manual')
})

rmSync(work, { recursive: true, force: true })
console.log('all tests passed')
