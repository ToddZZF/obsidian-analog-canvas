/**
 * The bridge between Obsidian and the circuit editor.
 *
 * The editor runs in its own frame, served from a local web server, and it
 * never touches the disk: the plugin hands it a drawing and writes back what
 * it changes. The two talk through `postMessage` on one channel, so a frame
 * that hosts something else entirely cannot be mistaken for this one.
 *
 * The protocol is the one Analog Canvas speaks to a note application; the
 * editor side of it lives in the Analog Canvas repository
 * (`apps/editor/src/hosts/obsidian-bridge.ts`).
 */

/** The channel every message between the two travels on. */
export const CIRCUIT_CHANNEL = 'analog-canvas'

/** The editor itself. */
export const CIRCUIT_EDITOR_PAGE = 'obsidian.html'

/** How eagerly the plugin writes a drawing. */
export type CircuitAutoSaveMode = 'off' | 'immediately' | 'delayed'

/** What the plugin tells the editor. */
export interface CircuitHostMessage {
  channel: typeof CIRCUIT_CHANNEL
  type: 'open' | 'render' | 'focus' | 'preferences' | 'save-request' | 'saved' | 'save-failed'
  path?: string
  text?: string
  focus?: string
  region?: string
  requestId?: string
  message?: string
  /** The plugin's own save preference, for the 'preferences' message. */
  autoSave?: CircuitAutoSaveMode
}

/** What the editor tells the plugin. */
export interface CircuitEditorMessage {
  channel: typeof CIRCUIT_CHANNEL
  type: 'ready' | 'save' | 'rendered' | 'error' | 'dirty'
  requestId?: string
  path?: string
  text?: string
  svg?: string
  width?: number
  height?: number
  message?: string
  /** Whether the drawing holds changes that are not on disk. */
  dirty?: boolean
}

function isCircuitMessage (value: unknown): value is CircuitEditorMessage {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const candidate = value as Partial<CircuitEditorMessage>
  return candidate.channel === CIRCUIT_CHANNEL && typeof candidate.type === 'string'
}

/**
 * Sends a message to the circuit editor in the given frame.
 *
 * @param   {HTMLIFrameElement}   frame    The frame to talk to
 * @param   {CircuitHostMessage}   message  What to say
 */
export function postToCircuit (frame: HTMLIFrameElement, message: CircuitHostMessage): void {
  frame.contentWindow?.postMessage(message, '*')
}

/**
 * Watches for the circuit editor's messages.
 *
 * The plugin talks to more than one frame — the editor of an open drawing,
 * and the frame that draws the figures of a note — so a listener says which
 * frame it listens to. Without that, the editor would answer the figure
 * frame's announcements and vice versa.
 *
 * @param   {Function}            handler  What to do with the message
 * @param   {Function}            source   The frame to listen to, if any
 *
 * @return  {Function}                       Stops watching.
 */
export function onCircuitMessage (
  handler: (message: CircuitEditorMessage) => void,
  source?: () => HTMLIFrameElement | null
): () => void {
  const listener = (event: MessageEvent): void => {
    if (source !== undefined) {
      const frame = source()
      if (frame === null || event.source !== frame.contentWindow) {
        return
      }
    }
    if (!isCircuitMessage(event.data)) {
      return
    }
    handler(event.data)
  }
  window.addEventListener('message', listener)
  return () => window.removeEventListener('message', listener)
}
