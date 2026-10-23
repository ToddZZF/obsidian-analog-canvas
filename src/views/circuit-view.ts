/**
 * The pane that holds the circuit editor.
 *
 * The editor runs in a frame of its own, served by the plugin's local web
 * server. The frame never touches the disk: the plugin hands it a drawing
 * and writes back what it changes, exactly like the editor of a note
 * application that owns the file.
 */

import { ItemView, Notice, TFile, WorkspaceLeaf } from 'obsidian'
import {
  CIRCUIT_EDITOR_PAGE,
  onCircuitMessage,
  postToCircuit,
  type CircuitAutoSaveMode,
  type CircuitEditorMessage
} from '../bridge'
import type AnalogCanvasPlugin from '../main'
import { log } from '../debug'
import { isCircuitName, projectIdOf } from '../embeds'

export const VIEW_TYPE_CIRCUIT = 'analog-canvas-drawing'

/** How long the plugin waits before it writes a drawing that changed. */
const AUTO_SAVE_DELAY = 1200

export class CircuitView extends ItemView {
  /** The frame the editor runs in. */
  private editorFrame: HTMLIFrameElement | null = null
  /** The drawing the pane shows. */
  file: TFile | null = null
  /** Whether the editor has announced itself. */
  private editorReady = false
  /** Whether the drawing holds changes that are not on disk. */
  private drawingDirty = false
  /** The drawing as it was handed to the editor. */
  private loadedText: string | null = null
  /** The name the editor knows the drawing by: its own answer names it again. */
  private openedPath: string | null = null
  /** The region a link pointed at. */
  private region: string | undefined = undefined
  /** The timer of the pending automatic save. */
  private saveTimer: ReturnType<typeof setTimeout> | null = null
  /** Whether the plugin itself is writing the file at the moment. */
  private writing = false

  constructor (leaf: WorkspaceLeaf, private readonly plugin: AnalogCanvasPlugin) {
    super(leaf)
  }

  getViewType (): string {
    return VIEW_TYPE_CIRCUIT
  }

  getDisplayText (): string {
    return this.file?.name ?? 'Circuit'
  }

  getIcon (): string {
    return 'git-branch'
  }

  async onOpen (): Promise<void> {
    try {
      this.build()
    } catch (error: any) {
      log(`the view could not be built: ${error?.stack ?? String(error)}`)
      const container = this.containerEl.children[1] as HTMLElement
      container.empty()
      container.createDiv({ cls: 'analog-canvas-error', text: `The circuit editor could not be started: ${error?.message ?? String(error)}` })
      return
    }

    // Obsidian opens a file in this view by putting the file into the state
    // of the pane. A pane that was restored from the workspace carries the
    // file with it.
    const state = this.leaf.getViewState()
    await this.loadFromState(state)
  }

  /**
   * The state of the pane: which drawing it shows.
   */
  getState (): Record<string, unknown> {
    return { file: this.file?.path }
  }

  /**
   * Takes over the state of the pane, and shows the drawing it names.
   */
  async setState (state: unknown, result: unknown): Promise<void> {
    await super.setState(state, result)
    await this.loadFromState(state)
  }

  /**
   * Shows the drawing that the state of the pane names.
   */
  private async loadFromState (state: unknown): Promise<void> {
    const path = (state as { state?: { file?: string }, file?: string } | null)
      ?.state?.file ?? (state as { file?: string } | null)?.file
    if (typeof path !== 'string' || path.length === 0) {
      return
    }
    if (this.file?.path === path) {
      return
    }
    const file = this.plugin.app.vault.getAbstractFileByPath(path)
    if (!(file instanceof TFile) || !isCircuitName(file.path)) {
      return
    }
    await this.showDrawing(file)
  }

  /**
   * Builds the pane: a toolbar and the frame the editor runs in.
   */
  private build (): void {
    const container = this.containerEl.children[1] as HTMLElement
    container.empty()
    container.classList.add('analog-canvas-view')

    const toolbar = container.createDiv({ cls: 'analog-canvas-toolbar' })
    this.drawingTitleEl = toolbar.createDiv({ cls: 'analog-canvas-title' })
    this.dirtyDotEl = toolbar.createSpan({ cls: 'analog-canvas-dirty', text: '●' })
    this.dirtyDotEl.hide()
    this.statusMessageEl = toolbar.createSpan({ cls: 'analog-canvas-status' })

    const saveButton = toolbar.createEl('button', {
      cls: 'analog-canvas-save',
      text: 'Save',
      attr: { 'aria-label': 'Save the drawing' }
    })
    saveButton.addEventListener('click', () => {
      this.requestSave()
    })

    const frame = container.createEl('iframe', {
      cls: 'analog-canvas-frame',
      attr: { title: 'Circuit editor' }
    })
    frame.src = `${this.plugin.server?.baseUrl ?? ''}/${CIRCUIT_EDITOR_PAGE}`
    this.editorFrame = frame

    this.stopListening = onCircuitMessage((message) => {
      this.onEditorMessage(message)
    }, () => this.editorFrame)

    // A drawing that changes on disk is shown again, unless the change is
    // the one the plugin made itself.
    this.registerVaultListener = this.plugin.app.vault.on('modify', (file) => {
      if (this.file === null || file.path !== this.file.path) {
        return
      }
      if (this.writing) {
        return
      }
      void this.reload()
    })

    // A drawing that is renamed or moved stays the drawing of this pane: the
    // pane follows it to its new name, so saving keeps writing to it. The
    // editor is left alone — it learns the new name with the next write, and
    // handing the drawing over again would only throw away its undo history.
    this.registerRenameListener = this.plugin.app.vault.on('rename', (moved, oldPath) => {
      if (this.file === null || !(moved instanceof TFile)) {
        return
      }
      if (moved !== this.file && oldPath !== this.file.path) {
        return
      }
      this.file = moved
      this.drawingTitleEl?.setText(moved.name)
      this.updateHeader()
    })
  }

  async onClose (): Promise<void> {
    this.stopListening?.()
    this.registerVaultListener?.()
    this.registerRenameListener?.()
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer)
      this.saveTimer = null
    }
    this.editorFrame = null
  }

  /** The listeners this view installed, so they can be taken down again. */
  private stopListening: (() => void) | null = null
  private registerVaultListener: (() => void) | null = null
  private registerRenameListener: (() => void) | null = null
  /** The element that carries the drawing's name. */
  private drawingTitleEl: HTMLElement | null = null
  /** The element that shows that the drawing holds changes. */
  private dirtyDotEl: HTMLElement | null = null
  /** The element that carries the last message. */
  private statusMessageEl: HTMLElement | null = null

  /**
   * Shows a drawing in this pane.
   *
   * @param   {TFile}    file     The drawing to show
   * @param   {string?}  region   The region a link pointed at, if any
   */
  async showDrawing (file: TFile, region?: string): Promise<void> {
    this.file = file
    this.region = region
    this.drawingDirty = false
    this.dirtyDotEl?.hide()

    const text = await this.plugin.app.vault.read(file)
    this.loadedText = text

    if (this.drawingTitleEl !== null) {
      this.drawingTitleEl.setText(file.name)
    }
    // The tab is named after the drawing it shows; it was drawn before the
    // drawing was known.
    this.updateHeader()

    this.sendOpen(text)
  }

  /**
   * Reads the drawing again, for instance because it changed on disk.
   */
  private async reload (): Promise<void> {
    if (this.file === null) {
      return
    }
    const text = await this.plugin.app.vault.read(this.file)
    if (text === this.loadedText) {
      return
    }
    this.loadedText = text
    this.sendOpen(text)
  }

  /**
   * Hands the drawing to the editor.
   */
  private sendOpen (text: string): void {
    const frame = this.editorFrame
    if (frame === null || this.file === null) {
      return
    }
    if (!this.editorReady) {
      // The editor announces itself as soon as it is up; the drawing goes
      // to it then.
      return
    }
    this.openedPath = this.file.path
    postToCircuit(frame, {
      channel: 'analog-canvas',
      type: 'open',
      path: this.file.path,
      text,
      ...(this.region !== undefined ? { focus: this.region } : {})
    })
    log(`the drawing was handed to the editor: ${this.file.path} (${text.length} bytes)`)
  }

  /**
   * Asks the editor to write the drawing.
   */
  requestSave (): void {
    const frame = this.editorFrame
    if (frame === null || this.file === null) {
      return
    }
    postToCircuit(frame, { channel: 'analog-canvas', type: 'save-request' })
  }

  /**
   * Handles a message from the editor.
   */
  private onEditorMessage (message: CircuitEditorMessage): void {
    log(`the editor says: ${message.type} ${JSON.stringify({
      path: message.path,
      message: message.message,
      dirty: message.dirty
    })}`)

    switch (message.type) {
      case 'ready': {
        this.editorReady = true
        if (this.file !== null) {
          void this.plugin.app.vault.read(this.file).then(text => {
            this.loadedText = text
            this.sendOpen(text)
          })
        }
        this.sendPreferences()
        break
      }
      case 'dirty': {
        this.drawingDirty = message.dirty === true
        if (this.drawingDirty) {
          this.dirtyDotEl?.show()
        } else {
          this.dirtyDotEl?.hide()
        }
        this.scheduleAutoSave()
        break
      }
      case 'save': {
        void this.write(message.requestId, message.path, message.text)
        break
      }
      case 'error': {
        this.setStatus(message.message ?? 'The drawing could not be opened')
        break
      }
    }
  }

  /**
   * Tells the editor how eagerly the drawing should be written.
   */
  private sendPreferences (): void {
    const frame = this.editorFrame
    if (frame === null) {
      return
    }
    const autoSave = this.plugin.settings.autoSave as CircuitAutoSaveMode
    postToCircuit(frame, { channel: 'analog-canvas', type: 'preferences', autoSave })
  }

  /**
   * Writes the drawing, when the plugin is set to write it on its own.
   */
  private scheduleAutoSave (): void {
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer)
      this.saveTimer = null
    }

    const mode = this.plugin.settings.autoSave as CircuitAutoSaveMode
    if (mode === 'off' || !this.drawingDirty) {
      return
    }

    this.saveTimer = setTimeout(() => {
      this.saveTimer = null
      this.requestSave()
    }, mode === 'immediately' ? 400 : AUTO_SAVE_DELAY)
  }

  /**
   * Writes what the editor handed back to the file it belongs to.
   */
  private async write (
    requestId: string | undefined,
    path: string | undefined,
    text: string | undefined
  ): Promise<void> {
    if (text === undefined) {
      return
    }

    // The editor names a drawing as it knew it when it was opened, and a name
    // goes stale: a rename frees it, and the name may then point at another
    // drawing entirely. The Project a text holds is the drawing's own
    // identity, so that decides where the text goes; the name only stands in
    // for texts that hold no id the plugin can read.
    const id = projectIdOf(text)
    const remembered = id !== null ? this.plugin.renamedDrawing(id) : null
    const named = path !== undefined ? this.plugin.app.vault.getAbstractFileByPath(path) : null
    const sameDrawing = id !== null && this.loadedText !== null && id === projectIdOf(this.loadedText)
      ? this.file
      : null
    const file = remembered
      ?? (named instanceof TFile ? named : null)
      ?? sameDrawing
      ?? (path === undefined || path === this.openedPath ? this.file : null)
    if (!(file instanceof TFile) || !isCircuitName(file.path)) {
      // A drawing is written, never a note or anything else that the editor
      // may have been handed by mistake.
      this.setStatus('The drawing could not be found')
      return
    }

    this.writing = true
    try {
      await this.plugin.app.vault.modify(file, text)
      this.setStatus('Saved')
      // The answer names the file as it is now, so the editor stays bound to
      // the drawing through the rename that just happened.
      this.post('saved', { requestId, path: file.path })
      if (file === this.file) {
        this.loadedText = text
        this.openedPath = file.path
        this.drawingDirty = false
        this.dirtyDotEl?.hide()
      }
    } catch (error: any) {
      this.setStatus(`Could not save: ${error?.message ?? String(error)}`)
      this.post('save-failed', {
        requestId,
        path: file.path,
        message: error?.message ?? String(error)
      })
    } finally {
      this.writing = false
    }
  }

  /**
   * Answers the editor.
   */
  private post (
    type: 'saved' | 'save-failed',
    payload: { requestId?: string, path: string, message?: string }
  ): void {
    const frame = this.editorFrame
    if (frame === null) {
      return
    }
    postToCircuit(frame, {
      channel: 'analog-canvas',
      type,
      path: payload.path,
      ...(payload.requestId !== undefined ? { requestId: payload.requestId } : {}),
      ...(payload.message !== undefined ? { message: payload.message } : {})
    })
  }

  /**
   * Shows a message next to the drawing.
   */
  private setStatus (message: string): void {
    if (this.statusMessageEl === null) {
      return
    }
    this.statusMessageEl.setText(message)
    if (message.length > 0) {
      window.setTimeout(() => {
        if (this.statusMessageEl?.getText() === message) {
          this.statusMessageEl?.setText('')
        }
      }, 4000)
    }
  }

  /**
   * Asks the pane to draw its title again, after the drawing was renamed.
   */
  private updateHeader (): void {
    (this.leaf as unknown as { updateHeader?: () => void }).updateHeader?.()
  }

  /**
   * Shows a message to the person.
   */
  notify (message: string): void {
    new Notice(message)
  }
}
