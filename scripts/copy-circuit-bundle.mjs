/**
 * Copies the circuit editor into the plugin.
 *
 * The editor is built by Analog Canvas: `pnpm --filter @icm/editor build`
 * with `vite.zettlr.config.ts` puts `zettlr.html` and its assets into
 * `apps/editor/dist-zettlr`. The plugin serves that folder, so it ships it.
 *
 * The folder is copied, never changed: the editor belongs to Analog Canvas.
 */

import { cp, mkdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/** Where the built editor lies: the Analog Canvas repository, next to the plugin. */
const SOURCE = process.env.ANALOG_CANVAS_BUNDLE ??
  join(root, "analog-canvas-go", "apps", "editor", "dist-zettlr");

/** Where the plugin expects it. */
const TARGET = join(root, "circuit");

if (!existsSync(SOURCE)) {
  console.error(
    `The circuit editor was not found at ${SOURCE}.\n` +
      `Build it in the Analog Canvas repository (analog-canvas-go):\n` +
      `  pnpm --filter @icm/editor exec vite build --config vite.zettlr.config.ts\n` +
      `or point ANALOG_CANVAS_BUNDLE at the built folder.`,
  );
  process.exit(1);
}

await rm(TARGET, { recursive: true, force: true });
await mkdir(TARGET, { recursive: true });

// The editor and the files it loads; the service worker and the icons of the
// web application are of no use here.
await cp(join(SOURCE, "zettlr.html"), join(TARGET, "zettlr.html"));
await cp(join(SOURCE, "assets"), join(TARGET, "assets"), { recursive: true });

const { size } = await stat(join(TARGET, "zettlr.html"));
console.log(`Copied the circuit editor into ${TARGET} (${size} bytes of entry page).`);
