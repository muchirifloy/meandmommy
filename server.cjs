const { existsSync } = require("node:fs");
const { join } = require("node:path");

process.env.NODE_ENV = "production";
process.env.PORT = process.env.PORT || "3000";
process.env.HOSTNAME = process.env.HOSTNAME || "127.0.0.1";

const standaloneServer = join(__dirname, ".next", "standalone", "server.js");

if (!existsSync(standaloneServer)) {
  console.error("Build output not found. Run `pnpm build` before starting the app.");
  process.exit(1);
}

require(standaloneServer);
