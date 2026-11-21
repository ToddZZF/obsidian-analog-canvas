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
 */
function language (): 'zh' | 'en' {
  const tag = localStorage.getItem('language') ?? navigator.language ?? ''
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
