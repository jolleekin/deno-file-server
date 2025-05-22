/**
 * A simple file server for SSG websites that supports clean URLs by default.
 *
 * @env ROOT - The root directory. Default is ".".
 *
 * @example
 *
 * ```sh
 * # CMD
 * set "ROOT=_site" && deno run -ENR ssg.ts
 *
 * # Bash
 * ROOT=_site deno run -ENR ssg.ts
 * ```
 *
 * @module
 */

import { walk } from "@std/fs/walk";
import { resolve } from "@std/path/resolve";
import { serveFile } from "@std/http/file-server";

/**
 * Mappings from URL pathname to filesystem path.
 */
const files = new Map<string, string>();

/**
 * The root directory.
 */
const root = resolve(Deno.env.get("ROOT") ?? ".");

function normalize(path: string): string {
  return path.replace(/\\/g, "/").normalize();
}

for await (const { isFile, path } of walk(root)) {
  if (!isFile) continue;

  const pathname = normalize(path.slice(root.length));
  files.set(pathname, path);

  if (pathname.endsWith(".html")) {
    // "/a/b/c" maps to "/a/b/c.html".
    files.set(pathname.slice(0, -5), path);

    if (pathname.slice(-11, -5) === "/index") {
      files.set(pathname.slice(0, -11), path); // Without trailing '/'.
      files.set(pathname.slice(0, -10), path); // With trailing '/'.
    }
  }
}

Deno.serve((req) => {
  const { pathname } = new URL(req.url);
  const fsPath = files.get(pathname);

  return fsPath
    ? serveFile(req, fsPath)
    : new Response("Not Found", { status: 404 });
});
