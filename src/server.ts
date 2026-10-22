/**
 * The local web server that serves the circuit editor.
 *
 * The editor is a small web application of its own: it loads its own modules
 * and stylesheets, which a `file://` page may not do. So the plugin serves
 * the bundle from a local web server, which gives the editor a proper origin
 * without opening it to the network: the server binds to the loopback
 * interface only and hands out nothing but the files of the bundle.
 */

import http from 'node:http'
import { createReadStream, promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * The content types the editor bundle needs. A module script is only loaded
 * when the server says it is a script, so these are not optional.
 */
const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.wasm': 'application/wasm'
}

export class CircuitServer {
  /** The directory the editor bundle lives in. */
  private readonly root: string
  /** The server itself, once it listens. */
  private server: http.Server | null = null
  /** The port the server listens on. */
  private boundPort = 0

  constructor (root: string) {
    this.root = root
  }

  /** The address the editor is served from. */
  get baseUrl (): string {
    return `http://127.0.0.1:${this.boundPort}`
  }

  /**
   * Starts the server.
   *
   * The port is chosen by the system, so two Obsidian windows (or two
   * vaults) never fight over the same one.
   */
  async start (): Promise<void> {
    if (this.server !== null) {
      return
    }

    const server = http.createServer((request, response) => {
      void this.handle(request, response)
    })

    await new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      server.listen(0, '127.0.0.1', () => {
        server.removeListener('error', reject)
        resolve()
      })
    })

    const address = server.address()
    if (address === null || typeof address === 'string') {
      server.close()
      throw new Error('[Analog Canvas] The local server did not get an address')
    }

    this.boundPort = address.port
    this.server = server
  }

  /** Stops the server. */
  stop (): void {
    this.server?.close()
    this.server = null
    this.boundPort = 0
  }

  /**
   * Answers one request.
   */
  private async handle (request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { 'Content-type': 'text/plain' })
      response.end('Method not allowed')
      return
    }

    const url = new URL(request.url ?? '/', this.baseUrl)
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '')
    const target = path.resolve(this.root, relative === '' ? 'zettlr.html' : relative)

    // The bundle may not reach outside of its own directory.
    if (target !== this.root && !target.startsWith(this.root + path.sep)) {
      response.writeHead(403, { 'Content-type': 'text/plain' })
      response.end('Forbidden')
      return
    }

    try {
      const stats = await fs.stat(target)
      if (!stats.isFile()) {
        throw new Error('Not a file')
      }
      response.writeHead(200, {
        'Content-type': CONTENT_TYPES[path.extname(target).toLowerCase()] ?? 'application/octet-stream',
        'Content-length': String(stats.size),
        // The bundle is part of the plugin: it changes with the plugin, never
        // within a session.
        'Cache-control': 'no-cache'
      })
      if (request.method === 'HEAD') {
        response.end()
        return
      }
      createReadStream(target).pipe(response)
    } catch {
      response.writeHead(404, { 'Content-type': 'text/plain' })
      response.end('Not found')
    }
  }
}
