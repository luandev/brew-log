import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rubyScript = path.join(root, "scripts", "generate_site_data.rb");
const rubyCheck = spawnSync("ruby", ["-v"], { encoding: "utf8" });

if (!rubyCheck.error && rubyCheck.status === 0) {
  const ruby = spawnSync("ruby", [rubyScript], { stdio: "inherit", cwd: root });
  if (ruby.status === 0) {
    process.exit(0);
  }
}

console.warn("Ruby generator unavailable or failed; using Node generator.");
await import(pathToFileURL(path.join(root, "scripts", "generate_site_data.mjs")).href);
