# Analog Canvas

在 Obsidian 里绘制电路图的插件。电路存成 `.icproj` 文件，可以在笔记里用嵌入引用：

```md
![[inv.icproj]]          整张图
![[inv.icproj#PFD]]      只显示名为 PFD 的标注区块
![[inv.icproj|200]]      宽 200px，高按原图比例
![[inv.icproj|200x100]]  宽 200px、高 100px
![[inv.icproj#PFD|200]]  区块也能指定尺寸
```

尺寸写法与 Obsidian 图片一致：`|宽度` 只定宽、按比例定高；`|宽度x高度` 固定宽高（拉伸铺满）。

区块候选带有色标（空心方/圆 + 中心圆点），同名区块以 objectID 区分，引用写成 `![[inv.icproj#objectID]]`。

嵌入图右上角悬浮栏提供四个按钮：**放大**、**刷新**（从文件重新渲染）、**编辑区块**（就地编辑 `![[...]]` 文字）、**编辑电路**（在新标签页打开编辑器）。文件树右键菜单里还有"新建电路"。

## 仓库布局

- `src/`、`scripts/`、`esbuild.config.mjs` — 插件本体（TypeScript）。
- `circuit/` — 电路编辑器的运行时包（构建产物，随插件一起分发）。
- `vendor/icm/` — 构建编辑器包所需的渲染库。
- `analog-canvas-go/`、`analog-canvas/` — 上游编辑器源码的本地检出，**不入库**（见 `.gitignore`）。重新构建编辑器包时需要它们。

仓库自带构建好的 `main.js`，直接安装即可使用，不必先构建。

## 安装

**社区插件商店**：直接安装即可。商店的安装器只装 `main.js`、`manifest.json`、`styles.css` 三个文件，编辑器包会在首次加载时从 GitHub Releases 下载 `circuit.zip`（约 6 MB，仅此一处网络访问）解压到插件目录；插件升级后首次加载时也会自动换上配套的编辑器包。

**手动安装**：把这几项复制到库的 `.obsidian/plugins/analog-canvas/` 目录：

```
main.js  styles.css  manifest.json  circuit/
```

手动放好的 `circuit/` 会被原样使用，插件不会下载或覆盖它。

## 构建

改动编辑器包（`circuit/`）时：

```bash
cd analog-canvas-go
pnpm install
pnpm --filter @icm/editor exec vite build --config vite.obsidian.config.ts
cd ..
npm run vendor:circuit        # 把 dist-obsidian 拷进 circuit/
```

改动插件本体时：

```bash
npm install
npm run build                 # esbuild 编译 src/ → main.js
npm run typecheck             # 可选
```

## 发布

版本号写在 `manifest.json`、`package.json`、`versions.json` 三处（`versions.json` 里是 `"版本号": "最低 Obsidian 版本"`）。提交后打同名的纯版本号 tag（如 `0.1.1`，不带 `v`）并推送，GitHub Actions 会构建并创建 Release，附上 `main.js`、`manifest.json`、`styles.css`、`circuit.zip`。
