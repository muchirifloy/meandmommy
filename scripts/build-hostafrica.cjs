const { spawnSync } = require("node:child_process");

const env = {
  ...process.env,
  NEXT_PRIVATE_BUILD_WORKER_COUNT: "1",
  NODE_OPTIONS: process.env.NODE_OPTIONS || "--max-old-space-size=512",
  RAYON_NUM_THREADS: "1",
  SWC_THREADS: "1",
  UV_THREADPOOL_SIZE: "1",
};

function run(command, args) {
  const result = spawnSync(command, args, {
    env,
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run("next", ["build", "--webpack"]);
run("node", ["scripts/prepare-standalone.cjs"]);
