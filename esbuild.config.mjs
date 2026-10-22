import esbuild from "esbuild"
import process from "process"
import { builtinModules } from "node:module"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const prod = process.argv[2] === "production"

const banner = `/*
This is a generated file. Do not edit it directly.
*/
`

/**
 * The Analog Canvas packages live in the plugin's vendor folder, but they
 * import each other by their package names. The alias plugin points those
 * names at the vendored files.
 */
const icmAlias = {
  "@icm/model": resolve(__dirname, "vendor/icm/model/dist/index.js"),
  "@icm/derived": resolve(__dirname, "vendor/icm/derived/dist/index.js"),
  "@icm/symbols": resolve(__dirname, "vendor/icm/symbols/dist/index.js"),
  "@icm/devices": resolve(__dirname, "vendor/icm/devices/dist/index.js"),
  "@icm/netlist": resolve(__dirname, "vendor/icm/netlist/dist/index.js"),
  "@icm/spice": resolve(__dirname, "vendor/icm/spice/dist/index.js"),
  "@icm/spice-run": resolve(__dirname, "vendor/icm/spice-run/dist/index.js"),
  "@icm/project-protocol": resolve(__dirname, "vendor/icm/project-protocol/dist/index.js"),
  "@icm/render-svg": resolve(__dirname, "vendor/icm/render-svg/dist/index.js"),
  "@icm/math-typesetting/cache": resolve(__dirname, "vendor/icm/math-typesetting/dist/cache.js"),
  "@icm/math-typesetting/profile": resolve(__dirname, "vendor/icm/math-typesetting/dist/profile.js")
}

const aliasPlugin = {
  name: "icm-alias",
  setup (build) {
    build.onResolve({ filter: /^@icm\// }, (args) => {
      const target = icmAlias[args.path]
      if (target === undefined) {
        return { errors: [{ text: `Unknown Analog Canvas package: ${args.path}` }] }
      }
      return { path: target }
    })
  }
}

const context = await esbuild.context({
  banner: { js: banner },
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "node:*",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtinModules
  ],
  format: "cjs",
  target: "es2020",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
  minify: prod,
  plugins: [aliasPlugin]
})

if (prod) {
  await context.rebuild()
  process.exit(0)
} else {
  await context.watch()
}
