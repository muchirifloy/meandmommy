#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

export NEXT_PRIVATE_BUILD_WORKER_COUNT="${NEXT_PRIVATE_BUILD_WORKER_COUNT:-1}"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=512}"

if command -v corepack >/dev/null 2>&1; then
  corepack enable || true
  corepack prepare pnpm@latest --activate || true
fi

if command -v pnpm >/dev/null 2>&1; then
  PNPM=(pnpm)
else
  PNPM=(npx pnpm@latest)
fi

"${PNPM[@]}" install --frozen-lockfile
"${PNPM[@]}" db:generate
"${PNPM[@]}" build:hostafrica

if [ "${RUN_DB_PUSH:-0}" = "1" ]; then
  "${PNPM[@]}" db:push
fi

mkdir -p tmp
touch tmp/restart.txt
