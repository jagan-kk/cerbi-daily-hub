import { cpSync, existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const src = join(root, "node_modules", "tslib");
const dst = join(
  root,
  ".vercel",
  "output",
  "functions",
  "__server.func",
  "_libs",
  "node_modules",
  "tslib",
);

if (!existsSync(src)) {
  console.error("tslib not found at", src);
  process.exit(1);
}

cpSync(src, dst, { recursive: true });

const pkgPath = join(dst, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

if (pkg.exports?.["."]?.import?.node) {
  delete pkg.exports["."].import.node;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("tslib copied to _libs/node_modules/ and patched for direct ESM resolution");
} else {
  console.log("tslib copied to _libs/node_modules/ (no patching needed)");
}
