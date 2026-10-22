/**
 * A log for the plugin.
 *
 * The plugin runs inside somebody else's application, where the developer
 * console of the host is not always at hand. The log therefore writes into
 * the plugin's own folder, which can be read from a terminal.
 */

import { appendFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

/** The file the log is written to. */
const LOG_FILE = 'debug.log'

/** Where the log lives. */
let logDirectory: string | null = null

/**
 * Points the log at the plugin's folder.
 *
 * @param   {string}  directory  The folder of the plugin
 */
export function setLogDirectory (directory: string): void {
  logDirectory = directory
  try {
    mkdirSync(directory, { recursive: true })
  } catch {
    logDirectory = null
  }
}

/**
 * Writes a line into the log.
 *
 * @param   {string}  message  What happened
 */
export function log (message: string): void {
  if (logDirectory === null) {
    return
  }
  const line = `${new Date().toISOString()} ${message}\n`
  try {
    appendFileSync(path.join(logDirectory, LOG_FILE), line)
  } catch {
    // A log that cannot be written is not worth a crash.
  }
}
