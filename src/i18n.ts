/**
 * The words of the plugin, in the language of the interface.
 *
 * Obsidian keeps its language in `localStorage` as `language`: `zh`, `zh-TW`
 * and the like. A language the plugin does not know reads as English, which
 * is the language the rest of the plugin speaks.
 */

const EN = {
  newDrawing: 'New circuit drawing',
  untitled: 'Untitled circuit',
  enlarge: 'Enlarge',
  refresh: 'Refresh',
  editEmbed: 'Edit embed text',
  editCircuit: 'Edit circuit',
  pickDrawing: 'Pick a circuit drawing',
  editorBundle: 'Circuit editor bundle',
  editorBundleReady: 'The editor bundle is in place and belongs to this version of the plugin.',
  editorBundleMissing: 'The editor bundle has not been downloaded yet. The plugin needs it to open drawings.',
  editorBundleOutdated: 'The editor bundle belongs to an older version. Download it again to match this one.',
  editorBundleManual: 'The editor bundle was installed by hand and is used as it is; it is never overwritten.',
  downloadEditor: 'Download',
  downloading: 'Downloading…',
  downloadSource: 'Download source',
  downloadSourceDesc: 'Where the circuit editor bundle is fetched from.',
  customSource: 'Custom…',
  customPrefix: 'Proxy prefix',
  customPrefixDesc: 'Put in front of the official address, e.g. https://gh-proxy.com/',
  editorDownloaded: 'The editor bundle was downloaded. Enable the plugin again, or restart Obsidian, to use it.',
  editorDownloadFailed: 'The editor bundle could not be downloaded. Check the connection and try again.',
  editorMissing: 'Analog Canvas: The circuit editor could not be downloaded. Download it by hand in the plugin settings.',
  editorMissingFolder: 'Analog Canvas: The plugin folder was not found, so the editor cannot be downloaded.',
  saveAutomatically: 'Save automatically',
  saveAutomaticallyDesc: 'How eagerly a drawing is written to the vault.',
  autoSaveNever: 'Never',
  autoSaveRightAway: 'Right away',
  autoSaveAfterAMoment: 'After a moment',
  showWhileEditing: 'Show drawings while editing',
  showWhileEditingDesc: 'Draw the embedded drawings in the editing view, not only in the reading view.'
} as const

const ZH: Record<keyof typeof EN, string> = {
  newDrawing: '新建电路',
  untitled: '未命名电路',
  enlarge: '放大',
  refresh: '刷新',
  editEmbed: '编辑嵌入',
  editCircuit: '编辑电路',
  pickDrawing: '选择电路图',
  editorBundle: '电路编辑器包',
  editorBundleReady: '编辑器包已就绪，版本与当前插件一致。',
  editorBundleMissing: '编辑器包还没有下载，插件需要它才能打开电路图。',
  editorBundleOutdated: '编辑器包属于旧版本，需要重新下载以匹配当前插件。',
  editorBundleManual: '编辑器包是手动安装的，会原样使用，不会被覆盖。',
  downloadEditor: '下载',
  downloading: '下载中…',
  downloadSource: '下载源',
  downloadSourceDesc: '电路编辑器包从哪里下载。',
  customSource: '自定义…',
  customPrefix: '代理前缀',
  customPrefixDesc: '拼在官方地址前面，例如 https://gh-proxy.com/',
  editorDownloaded: '编辑器包下载成功。重新启用插件或重启 Obsidian 后生效。',
  editorDownloadFailed: '编辑器包下载失败，请检查网络连接后重试。',
  editorMissing: 'Analog Canvas: 电路编辑器下载失败，可在插件设置里手动下载。',
  editorMissingFolder: 'Analog Canvas: 找不到插件目录，无法下载编辑器。',
  saveAutomatically: '自动保存',
  saveAutomaticallyDesc: '电路图写回库文件的时机。',
  autoSaveNever: '从不',
  autoSaveRightAway: '立即',
  autoSaveAfterAMoment: '稍后',
  showWhileEditing: '编辑时显示电路图',
  showWhileEditingDesc: '在编辑视图中也画出嵌入的电路图，而不仅仅在阅读视图中。'
}

export type StringKey = keyof typeof EN

/**
 * The language the interface is in: `zh` and its variants, or `en`.
 *
 * The words are also read outside Obsidian — the fetch editor is exercised
 * by a script of its own — so the browser's storage may be missing.
 */
function language (): 'zh' | 'en' {
  const stored = typeof localStorage === 'undefined' ? null : localStorage.getItem('language')
  const spoken = typeof navigator === 'undefined' ? '' : navigator.language
  const tag = stored ?? spoken ?? ''
  return tag.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

/**
 * A word of the plugin, in the language of the interface.
 *
 * @param   {StringKey}  key  The word to say
 *
 * @return  {string}          The word.
 */
export function t (key: StringKey): string {
  return language() === 'zh' ? ZH[key] : EN[key]
}
