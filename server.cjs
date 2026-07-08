const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(join(__dirname, ".env.production"));
loadEnvFile(join(__dirname, ".env"));

process.env.NODE_ENV = "production";
process.env.PORT = process.env.PORT || "3000";
process.env.HOSTNAME = process.env.HOSTNAME || "127.0.0.1";

const standaloneServer = join(__dirname, ".next", "standalone", "server.js");

if (!existsSync(standaloneServer)) {
  console.error("Build output not found. Run `pnpm build` before starting the app.");
  process.exit(1);
}

require(standaloneServer);
