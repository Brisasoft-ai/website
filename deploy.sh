#!/usr/bin/env bash
# Deploy brisasoft.net from this machine.
# Token must belong to the Cloudflare account that owns the active brisasoft.net zone.
# Put it in .env.local (git-ignored) as: CLOUDFLARE_API_TOKEN=...
set -euo pipefail
cd "$(dirname "$0")"
export PATH="$HOME/.local/node-v22/bin:$PATH"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] && [ -f .env.local ]; then
  set -a; . ./.env.local; set +a
fi
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "Missing CLOUDFLARE_API_TOKEN (see .env.local.example)" >&2
  exit 1
fi

node build.mjs
npx wrangler deploy "$@"
