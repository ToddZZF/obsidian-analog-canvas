/**
 * Fetching the circuit editor.
 *
 * The community plugin installer only installs `main.js`, `manifest.json`
 * and `styles.css`, and the editor bundle is far too large to add to that
 * list. It ships as `circuit.zip` of the matching release instead: when the
 * plugin finds no bundle in its folder — the normal case for a community
 * installation — it downloads the archive of its own version and unpacks
 * it. A bundle without the version marker was installed by hand and is
 * never touched.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { Notice, requestUrl } from 'obsidian'
import { unzipSync } from 'fflate'
import { log } from './debug'

/** The repository the releases of the plugin live in. */
const REPOSITORY = 'ToddZZF/obsidian-analog-canvas'

/** The folder of the bundle, as the plugin folder holds it. */
export const EDITOR_FOLDER = 'circuit'

/** The entry point of the bundle; without it the folder holds no editor. */
const ENTRY_POINT = 'obsidian.html'

/** The file that remembers which version of the bundle was fetched. */
const FETCHED_VERSION = '.fetched-version'

/**
 * Where the editor bundle of a version of the plugin can be downloaded.
 *
 * @param   {string}  version  The version of the plugin
 * @returns {string}  The URL of the archive
 */
export function editorArchiveUrl (version: string): string {
  return `https://github.com/${REPOSITORY}/releases/download/${version}/${EDITOR_FOLDER}.zip`
}

/**
 * Makes sure the folder holds the editor bundle of the given version.
 *
 * The bundle is downloaded when the folder holds none, or one that was
 * fetched for an older version of the plugin.
 *
 * @param   {string}  root     The folder the bundle lives in
 * @param   {string}  version  The version of the plugin
 * @returns {Promise<boolean>} Whether the bundle is ready to serve
 */
export async function ensureEditor (root: string, version: string): Promise<boolean> {
  if (!needsFetch(root, version)) {
    return true
  }

  const url = editorArchiveUrl(version)
  log(`fetching the circuit editor from ${url}`)
  const notice = new Notice('Analog Canvas: Downloading the circuit editor…', 0)
  try {
    const response = await requestUrl({ url })
    const archive = new Uint8Array(response.arrayBuffer)
    unpackEditorArchive(archive, root, version)
    log(`the circuit editor was fetched (${archive.byteLength} bytes)`)
    return true
  } catch (error: any) {
    log(`the circuit editor could not be fetched: ${error?.message ?? String(error)}`)
    return false
  } finally {
    notice.hide()
  }
}

/**
 * Whether the bundle must be fetched before the editor can run.
 *
 * A folder without the entry point holds no editor. A folder without the
 * version marker was installed by hand and is trusted as it is; a marker
 * of another version marks a bundle that was fetched and is now outdated.
 *
 * @param   {string}  root     The folder the bundle lives in
 * @param   {string}  version  The version of the plugin
 * @returns {boolean}  Whether the bundle must be downloaded
 */
function needsFetch (root: string, version: string): boolean {
  if (!existsSync(path.join(root, ENTRY_POINT))) {
    return true
  }

  try {
    return readFileSync(path.join(root, FETCHED_VERSION), 'utf8').trim() !== version
  } catch {
    // A marker that cannot be read is as good as no marker: the bundle was
    // installed by hand and stays.
    return false
  }
}

/**
 * Unpacks an editor bundle into place.
 *
 * The archive is unpacked beside the target and only then swapped in, so a
 * broken archive cannot leave a half-written bundle behind.
 *
 * @param   {Uint8Array}  archive  The zip archive of the bundle
 * @param   {string}      root     The folder the bundle lives in
 * @param   {string}      version  The version of the bundle
 * @returns {void}  Throws when the archive holds no editor bundle
 */
export function unpackEditorArchive (archive: Uint8Array, root: string, version: string): void {
  const files = unzipSync(archive)
  const entries = Object.keys(files).filter((name) => !name.endsWith('/'))
  const prefix = `${EDITOR_FOLDER}/`
  if (!entries.includes(`${prefix}${ENTRY_POINT}`)) {
    throw new Error(`the archive holds no ${prefix}${ENTRY_POINT}`)
  }

  const unpacked = path.join(path.dirname(root), `.${EDITOR_FOLDER}.unpacked`)
  rmSync(unpacked, { recursive: true, force: true })

  try {
    for (const name of entries) {
      const target = path.join(unpacked, EDITOR_FOLDER, ...bundlePath(name, prefix))
      mkdirSync(path.dirname(target), { recursive: true })
      writeFileSync(target, files[name])
    }
    writeFileSync(path.join(unpacked, EDITOR_FOLDER, FETCHED_VERSION), `${version}\n`)
    rmSync(root, { recursive: true, force: true })
    renameSync(path.join(unpacked, EDITOR_FOLDER), root)
  } finally {
    rmSync(unpacked, { recursive: true, force: true })
  }
}

/**
 * The path of an entry of the archive, below the bundle folder.
 *
 * @param   {string}  name    The name of the entry
 * @param   {string}  prefix  The folder the entries live in
 * @returns {string[]}  The path segments below the bundle folder
 */
function bundlePath (name: string, prefix: string): string[] {
  const segments = name.slice(prefix.length).split('/')
  const unsafe = !name.startsWith(prefix) || name.includes('\\') ||
    segments.length === 0 ||
    segments.some((segment) => segment === '' || segment === '.' || segment === '..')
  if (unsafe) {
    throw new Error(`the archive holds the unsafe entry ${name}`)
  }
  return segments
}
