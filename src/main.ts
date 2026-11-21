/**
 * Analog Canvas for Obsidian.
 *
 * A circuit drawing is a project file of Analog Canvas: `inv.icproj` (or
 * `inv.icproj.json`). The plugin makes such a file a document of the vault:
 * it opens in a pane of its own, it is referenced with `[[inv.icproj]]`, and
 * it is shown inside a note with `![[inv.icproj]]`.
 *
 * The editor itself is the one of Analog Canvas: it runs in a frame of its
 * own, served by the plugin from the loopback interface, and it never touches
 * the disk. The plugin hands it a drawing and writes back what it changes.
 */

import {
  App,
  FileSystemAdapter,
  FuzzySuggestModal,
  Menu,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TAbstractFile,
  TFile,
  TFolder,
  WorkspaceLeaf
} from 'obsidian'
import path from 'node:path'
import { createEmptyProject } from '@icm/model'
import { serializeProject } from '@icm/project-protocol'
import { CircuitServer } from './server'
import {
  CUSTOM_SOURCE,
  DOWNLOAD_SOURCES,
  EDITOR_FOLDER,
  editorState,
  ensureEditor,
  type EditorState
} from './fetch-editor'
import { log, setLogDirectory } from './debug'
import { t } from './i18n'
import { renderEmbeds, registerCircuitEmbeds, isCircuitName, projectIdOf } from './embeds'
import type { FigureTarget } from './figure-target'
import { registerRegionSuggest } from './suggest'
import { CircuitView, VIEW_TYPE_CIRCUIT } from './views/circuit-view'
import type { CircuitAutoSaveMode } from './bridge'

export interface AnalogCanvasSettings {
  /** How eagerly a drawing is written to the vault. */
  autoSave: CircuitAutoSaveMode
  /** Whether the figures of drawings are shown in the editing view. */
  showInLivePreview: boolean
  /** Which place the editor bundle is fetched from. */
  downloadSource: string
  /** The prefix of the address, when the source is one of the user's own. */
  downloadPrefix: string
}

const DEFAULT_SETTINGS: AnalogCanvasSettings = {
  autoSave: 'immediately',
  showInLivePreview: true,
  downloadSource: 'github',
  downloadPrefix: ''
}

export default class AnalogCanvasPlugin extends Plugin {
  settings: AnalogCanvasSettings = DEFAULT_SETTINGS
  /** The server that serves the circuit editor. */
  server: CircuitServer | null = null
  /** How the editor bundle stands in the plugin folder. */
  editorState: EditorState = 'missing'
  /** Whether the editor bundle is being fetched at the moment. */
  downloading = false
  /** The renamed drawings by the Projects they hold, so one can still be found after its name changed. */
  private renamedDrawings = new Map<string, TFile>()

  async onload (): Promise<void> {
    await this.loadSettings()

    const dir = this.pluginDirectory()
    if (dir !== null) {
      setLogDirectory(dir)
      log('the plugin was loaded')
    }

    // The settings are registered before anything else: a plugin without the
    // editor bundle is of no use, and the settings are where the bundle can
    // be fetched by hand.
    this.addSettingTab(new AnalogCanvasSettingTab(this.app, this))

    const root = this.circuitRoot()
    if (root === null) {
      new Notice(t('editorMissingFolder'))
      log('the circuit editor was not found')
      return
    }

    this.editorState = editorState(root, this.manifest.version)
    if (this.editorState === 'missing' || this.editorState === 'outdated') {
      const fetched = await ensureEditor(root, this.manifest.version, this.editorPrefix())
      this.editorState = editorState(root, this.manifest.version)
      if (!fetched) {
        new Notice(t('editorMissing'))
        log('the circuit editor could not be fetched')
        return
      }
    }

    this.server = new CircuitServer(root)
    try {
      await this.server.start()
    } catch (error: any) {
      new Notice(`Analog Canvas: The local server did not start: ${error?.message ?? String(error)}`)
      this.server = null
      return
    }

    this.registerView(VIEW_TYPE_CIRCUIT, (leaf: WorkspaceLeaf) => new CircuitView(leaf, this))
    this.registerExtensions(['icproj', 'icproj.json'], VIEW_TYPE_CIRCUIT)

    this.registerMarkdownPostProcessor((el, ctx) => {
      try {
        renderEmbeds(el, ctx, this)
      } catch (error: any) {
        log(`the embeds could not be drawn: ${error?.stack ?? String(error)}`)
      }
    })

    registerCircuitEmbeds(this)
    registerRegionSuggest(this)

    this.registerEvent(this.app.workspace.on('file-menu', (menu, file, source) => {
      if (source !== 'file-explorer-context-menu') {
        return
      }
      this.addNewDrawingItem(menu, this.folderOf(file))
    }))

    this.registerEvent(this.app.workspace.on('files-menu', (menu, files, source) => {
      if (source !== 'file-explorer-context-menu') {
        return
      }
      this.addNewDrawingItem(menu, files.length === 0 ? null : this.folderOf(files[0]))
    }))

    // The editor remembers the name a drawing had when it was opened, and
    // that name can be given to another drawing. A renamed drawing is
    // therefore remembered by the Project it holds: whatever its name, that
    // id is the drawing it belongs to.
    this.registerEvent(this.app.vault.on('rename', (moved, oldPath) => {
      if (!(moved instanceof TFile)) {
        return
      }
      if (!isCircuitName(moved.path) && !isCircuitName(oldPath)) {
        return
      }
      void this.rememberRenamed(moved)
    }))

    this.addCommand({
      id: 'open-drawing',
      name: 'Open a circuit drawing',
      callback: () => {
        void this.promptForDrawing()
      }
    })

    this.addCommand({
      id: 'save-drawing',
      name: 'Save the circuit drawing',
      callback: () => {
        this.activeCircuitView()?.requestSave()
      }
    })

    this.addCommand({
      id: 'insert-embed',
      name: 'Insert a circuit drawing into the note',
      callback: () => {
        void this.promptForEmbedding()
      }
    })
  }

  onunload (): void {
    this.server?.stop()
    this.server = null
  }

  async loadSettings (): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings (): Promise<void> {
    await this.saveData(this.settings)
  }

  /**
   * The folder the plugin lives in.
   *
   * `manifest.dir` is the plugin's folder as the vault sees it — it already
   * carries the config folder, as in `.obsidian/plugins/analog-canvas`.
   */
  private pluginDirectory (): string | null {
    const adapter = this.app.vault.adapter
    if (!(adapter instanceof FileSystemAdapter)) {
      return null
    }

    const dir = this.manifest.dir
    if (dir !== undefined && dir.length > 0) {
      return path.join(adapter.getBasePath(), dir)
    }

    return path.join(adapter.getBasePath(), this.app.vault.configDir, 'plugins', this.manifest.id)
  }

  /**
   * The directory the circuit editor lives in.
   */
  private circuitRoot (): string | null {
    const directory = this.pluginDirectory()
    if (directory === null) {
      return null
    }

    return path.join(directory, EDITOR_FOLDER)
  }

  /**
   * What is put in front of the official address of the release.
   *
   * The official address needs no prefix; a mirror is one; and a source of
   * the user's own is whatever was written down.
   */
  editorPrefix (): string {
    const source = DOWNLOAD_SOURCES.find(candidate => candidate.id === this.settings.downloadSource)
    if (source !== undefined) {
      return source.prefix
    }
    return this.settings.downloadPrefix
  }

  /**
   * Whether the editor bundle may be fetched by hand.
   *
   * A bundle that was installed by hand is used as it is and is never
   * overwritten, so there is nothing to download in that case.
   */
  canDownloadEditor (): boolean {
    return this.editorState === 'missing' || this.editorState === 'outdated'
  }

  /**
   * Reads the state of the editor bundle from the folder again.
   *
   * The bundle may be put in place — or taken away — while the plugin
   * runs, so the settings ask the folder rather than what was true when
   * the plugin was loaded.
   */
  refreshEditorState (): void {
    const root = this.circuitRoot()
    if (root === null) {
      return
    }
    this.editorState = editorState(root, this.manifest.version)
  }

  /**
   * What the settings say about the editor bundle.
   */
  editorStatusText (): string {
    switch (this.editorState) {
      case 'ready':
        return t('editorBundleReady')
      case 'manual':
        return t('editorBundleManual')
      case 'outdated':
        return t('editorBundleOutdated')
      default:
        return t('editorBundleMissing')
    }
  }

  /**
   * Fetches the editor bundle by hand.
   *
   * The plugin is of no use without the bundle, and a failed download at
   * the start of the session cannot be retried by the plugin itself: the
   * settings are where it is fetched, by the hand of whoever is there.
   */
  async downloadEditor (): Promise<void> {
    if (this.downloading) {
      return
    }

    const root = this.circuitRoot()
    if (root === null) {
      new Notice(t('editorMissingFolder'))
      return
    }

    this.downloading = true
    try {
      const fetched = await ensureEditor(root, this.manifest.version, this.editorPrefix())
      this.editorState = editorState(root, this.manifest.version)
      new Notice(fetched ? t('editorDownloaded') : t('editorDownloadFailed'))
    } finally {
      this.downloading = false
    }
  }

  /**
   * The drawing a name points at.
   *
   * A note refers to a drawing the way it refers to any other file, by its
   * name: `inv.icproj` names the drawing `inv.icproj`, and `inv` names it
   * too.
   *
   * @param   {string}   target  The name of the drawing
   *
   * @return  {TFile?}            The drawing, if there is one.
   */
  resolveDrawing (target: string): TFile | null {
    const name = decodeURIComponent(target).trim()
    if (name.length === 0) {
      return null
    }

    const drawings = this.app.vault.getFiles().filter(file => isCircuitName(file.path))
    if (drawings.length === 0) {
      return null
    }

    const exact = drawings.find(file =>
      file.path === name || file.name === name || file.path.endsWith(`/${name}`)
    )
    if (exact !== undefined) {
      return exact
    }

    // A drawing may also be named without its extension: `inv` names
    // `inv.icproj` as well as `inv.icproj.json`.
    const stem = name.replace(/\.icproj(\.json)?$/iu, '')
    if (stem.length === 0) {
      return null
    }

    return drawings.find(file => {
      const fileStem = file.name.replace(/\.icproj(\.json)?$/iu, '')
      return fileStem === stem
    }) ?? null
  }

  /**
   * Remembers a renamed drawing by the Project it holds.
   *
   * The Project lives inside the drawing, so the drawing is read to find it.
   */
  private async rememberRenamed (file: TFile): Promise<void> {
    try {
      const id = projectIdOf(await this.app.vault.read(file))
      if (id === null) {
        return
      }
      this.renamedDrawings.set(id, file)
      if (this.renamedDrawings.size > 64) {
        const oldest = this.renamedDrawings.keys().next().value
        if (oldest !== undefined) {
          this.renamedDrawings.delete(oldest)
        }
      }
    } catch (error: any) {
      log(`the renamed drawing could not be read: ${error?.message ?? String(error)}`)
    }
  }

  /**
   * The drawing a Project stands for, after the drawing was renamed.
   *
   * @param   {string}   projectId  The Project the drawing holds
   *
   * @return  {TFile?}             The drawing, if it was renamed since.
   */
  renamedDrawing (projectId: string): TFile | null {
    return this.renamedDrawings.get(projectId) ?? null
  }

  /**
   * The folder a menu entry goes into.
   *
   * A folder is taken as it is, a file gives the folder it lives in.
   *
   * @param   {TAbstractFile}  file  The entry the menu was opened on
   *
   * @return  {TFolder?}             The folder, if there is one.
   */
  private folderOf (file: TAbstractFile): TFolder | null {
    return file instanceof TFolder ? file : file.parent
  }

  /**
   * Adds "New circuit drawing" to a menu of the file tree.
   *
   * @param   {Menu}      menu    The menu to add to
   * @param   {TFolder?}  folder  The folder the drawing would go into
   */
  private addNewDrawingItem (menu: Menu, folder: TFolder | null): void {
    if (folder === null) {
      return
    }

    menu.addItem(item => {
      item
        .setTitle(t('newDrawing'))
        .setIcon('circuit-board')
        .setSection('action-primary')
        .onClick(() => {
          void this.newDrawing(folder)
        })
    })
  }

  /**
   * Makes a new drawing in a folder, and opens it.
   *
   * @param   {TFolder}  folder  The folder the drawing goes into
   */
  private async newDrawing (folder: TFolder): Promise<void> {
    try {
      const name = this.nextDrawingName(folder)
      const stem = name.replace(/\.icproj$/u, '')
      const project = createEmptyProject(newProjectId(), stem)
      const base = folder.path === '/' ? '' : `${folder.path}/`
      const file = await this.app.vault.create(`${base}${name}`, serializeProject(project))
      await this.openDrawing(file)
    } catch (error: any) {
      new Notice(`Analog Canvas: The drawing could not be created: ${error?.message ?? String(error)}`)
      log(`the drawing could not be created: ${error?.stack ?? String(error)}`)
    }
  }

  /**
   * A name of a drawing that no file of the folder has yet.
   *
   * @param   {TFolder}  folder  The folder the drawing goes into
   *
   * @return  {string}           The name, as `Untitled circuit.icproj` and up
   */
  private nextDrawingName (folder: TFolder): string {
    const taken = new Set(folder.children.map(child => child.name.toLowerCase()))
    const base = t('untitled')
    if (!taken.has(`${base}.icproj`.toLowerCase())) {
      return `${base}.icproj`
    }

    for (let i = 1; ; i++) {
      const name = `${base} ${i}.icproj`
      if (!taken.has(name.toLowerCase())) {
        return name
      }
    }
  }

  /**
   * Shows a drawing in a pane of its own.
   *
   * @param   {TFile}         file    The drawing to show
   * @param   {FigureTarget?} target  The Cell and region a link pointed at, if any
   */
  async openDrawing (file: TFile, target?: FigureTarget): Promise<void> {
    const leaf = await this.circuitLeaf()
    const view = leaf.view
    if (!(view instanceof CircuitView)) {
      return
    }
    await view.showDrawing(file, target)
    this.app.workspace.revealLeaf(leaf)
  }

  /**
   * Shows a drawing in a tab of its own, never the one that is already open.
   *
   * @param   {TFile}         file    The drawing to show
   * @param   {FigureTarget?} target  The Cell and region a figure showed, if any
   */
  async openDrawingInTab (file: TFile, target?: FigureTarget): Promise<void> {
    const leaf = this.app.workspace.getLeaf('tab')
    await leaf.setViewState({ type: VIEW_TYPE_CIRCUIT, active: true })
    const view = leaf.view
    if (!(view instanceof CircuitView)) {
      return
    }
    await view.showDrawing(file, target)
    this.app.workspace.revealLeaf(leaf)
  }

  /**
   * The pane that holds a drawing, opened on demand.
   */
  private async circuitLeaf (): Promise<WorkspaceLeaf> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_CIRCUIT)
    if (existing.length > 0) {
      const leaf = existing[0] as WorkspaceLeaf
      await leaf.setViewState({ type: VIEW_TYPE_CIRCUIT, active: true })
      return leaf
    }

    const leaf = this.app.workspace.getLeaf('tab')
    await leaf.setViewState({ type: VIEW_TYPE_CIRCUIT, active: true })
    return leaf
  }

  /**
   * The pane that shows a drawing, if one is showing.
   */
  private activeCircuitView (): CircuitView | null {
    const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_CIRCUIT)[0]
    const view = leaf?.view
    return view instanceof CircuitView ? view : null
  }

  /**
   * Asks which drawing to open.
   */
  private async promptForDrawing (): Promise<void> {
    const drawings = this.app.vault.getFiles().filter(file => isCircuitName(file.path))
    if (drawings.length === 0) {
      new Notice('Analog Canvas: This vault holds no circuit drawings.')
      return
    }

    const picker = new DrawingSuggest(this.app, drawings, (file) => {
      void this.openDrawing(file)
    })
    picker.setPlaceholder(t('pickDrawing'))
    picker.open()
  }

  /**
   * Asks which drawing to put into the note.
   */
  private async promptForEmbedding (): Promise<void> {
    const editor = this.app.workspace.activeEditor?.editor
    if (editor === undefined) {
      new Notice('Analog Canvas: Open a note first.')
      return
    }

    const drawings = this.app.vault.getFiles().filter(file => isCircuitName(file.path))
    if (drawings.length === 0) {
      new Notice('Analog Canvas: This vault holds no circuit drawings.')
      return
    }

    const picker = new DrawingSuggest(this.app, drawings, (file) => {
      editor.replaceSelection(`![[${file.name}]]`)
    })
    picker.setPlaceholder(t('pickDrawing'))
    picker.open()
  }
}

/**
 * An id for a project that is just being made.
 */
function newProjectId (): string {
  const unique = crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return `project-${unique}`
}

/**
 * Asks for a drawing.
 *
 * Obsidian's own file suggester only knows the files it can open, so the
 * drawings are offered here. The suggester matches what is typed against the
 * path of the drawing, the way Obsidian's own quick switcher does.
 */
class DrawingSuggest extends FuzzySuggestModal<string> {
  constructor (
    app: App,
    private readonly drawings: TFile[],
    private readonly onPick: (file: TFile) => void
  ) {
    super(app)
  }

  /**
   * The paths of the drawings: what is typed is matched against them.
   */
  getItems (): string[] {
    return this.drawings.map(drawing => drawing.path)
  }

  /**
   * The text of a drawing: its path, which is both matched and shown.
   */
  getItemText (item: string): string {
    return item
  }

  onChooseItem (item: string, _evt: MouseEvent | KeyboardEvent): void {
    const file = this.drawings.find(drawing => drawing.path === item)
    if (file !== undefined) {
      this.onPick(file)
    }
  }
}

class AnalogCanvasSettingTab extends PluginSettingTab {
  constructor (app: App, private readonly plugin: AnalogCanvasPlugin) {
    super(app, plugin)
  }

  display (): void {
    const { containerEl } = this
    containerEl.empty()

    // The bundle may have been put in place, or taken away, since the
    // plugin was loaded; the settings ask the folder itself.
    this.plugin.refreshEditorState()

    // The bundle comes first: when it is missing the plugin is of no use,
    // and this is where it is fetched.
    const bundle = new Setting(containerEl)
      .setName(t('editorBundle'))
      .setDesc(this.plugin.editorStatusText())
    if (this.plugin.canDownloadEditor()) {
      bundle.addButton(button => {
        button
          .setButtonText(this.plugin.downloading ? t('downloading') : t('downloadEditor'))
          .setCta()
          .setDisabled(this.plugin.downloading)
          .onClick(async () => {
            await this.plugin.downloadEditor()
            this.display()
          })
      })
    }

    new Setting(containerEl)
      .setName(t('downloadSource'))
      .setDesc(t('downloadSourceDesc'))
      .addDropdown(dropdown => {
        for (const source of DOWNLOAD_SOURCES) {
          dropdown.addOption(source.id, source.name)
        }
        dropdown.addOption(CUSTOM_SOURCE, t('customSource'))
        dropdown
          .setValue(this.plugin.settings.downloadSource)
          .onChange(async (value: string) => {
            this.plugin.settings.downloadSource = value
            await this.plugin.saveSettings()
            // The prefix is only asked for when the source is one's own.
            this.display()
          })
      })

    if (this.plugin.settings.downloadSource === CUSTOM_SOURCE) {
      new Setting(containerEl)
        .setName(t('customPrefix'))
        .setDesc(t('customPrefixDesc'))
        .addText(text => {
          text
            .setPlaceholder('https://gh-proxy.com/')
            .setValue(this.plugin.settings.downloadPrefix)
            .onChange(async (value: string) => {
              this.plugin.settings.downloadPrefix = value
              await this.plugin.saveSettings()
            })
        })
    }

    new Setting(containerEl)
      .setName(t('saveAutomatically'))
      .setDesc(t('saveAutomaticallyDesc'))
      .addDropdown(dropdown => {
        dropdown
          .addOption('off', t('autoSaveNever'))
          .addOption('immediately', t('autoSaveRightAway'))
          .addOption('delayed', t('autoSaveAfterAMoment'))
          .setValue(this.plugin.settings.autoSave)
          .onChange(async (value: string) => {
            // The dropdown offers the three modes and nothing else.
            this.plugin.settings.autoSave = value as CircuitAutoSaveMode
            await this.plugin.saveSettings()
          })
      })

    new Setting(containerEl)
      .setName(t('showWhileEditing'))
      .setDesc(t('showWhileEditingDesc'))
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.showInLivePreview)
          .onChange(async (value: boolean) => {
            this.plugin.settings.showInLivePreview = value
            await this.plugin.saveSettings()
          })
      })
  }
}
