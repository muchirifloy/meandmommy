const { cpSync, existsSync, mkdirSync, rmSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");

if (!existsSync(standaloneDir)) {
  console.warn("Standalone output was not found. Skipping standalone asset preparation.");
  process.exit(0);
}

const copies = [
  { from: join(root, ".next", "static"), to: join(standaloneDir, ".next", "static") },
  { from: join(root, "public"), to: join(standaloneDir, "public") },
];

for (const { from, to } of copies) {
  if (!existsSync(from)) {
    continue;
  }

  rmSync(to, { force: true, recursive: true });
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

console.log("Standalone assets prepared for cPanel/HostAfrica hosting.");
