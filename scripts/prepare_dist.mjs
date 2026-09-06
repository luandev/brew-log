import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function ensureIndexHtml(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_expo" || entry.name.startsWith(".")) continue;
      ensureIndexHtml(full);
      continue;
    }
    if (!entry.name.endsWith(".html") || entry.name === "index.html" || entry.name === "404.html") {
      continue;
    }
    const folder = path.join(dir, entry.name.slice(0, -5));
    const dest = path.join(folder, "index.html");
    fs.mkdirSync(folder, { recursive: true });
    if (!fs.existsSync(dest)) fs.renameSync(full, dest);
    else fs.unlinkSync(full);
  }
}

if (!fs.existsSync(dist)) {
  console.error("dist/ is missing. Run expo export first.");
  process.exit(1);
}

copyDir(path.join(root, "assets", "brews"), path.join(dist, "assets", "brews"));
copyDir(path.join(root, "assets", "brand"), path.join(dist, "assets", "brand"));
copyDir(path.join(root, "assets", "icons"), path.join(dist, "assets", "icons"));
ensureIndexHtml(dist);
fs.writeFileSync(path.join(dist, ".nojekyll"), "");
const index = path.join(dist, "index.html");
if (fs.existsSync(index)) {
  fs.copyFileSync(index, path.join(dist, "404.html"));
}

console.log("Prepared dist/ for GitHub Pages permalinks.");
