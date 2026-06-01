#!/bin/sh
set -eu

mkdir -p /app/public/uploads
mkdir -p /tmp/number-manager-cache

chown -R nextjs:nodejs /app/public/uploads /tmp/number-manager-cache || true

exec gosu nextjs "$@"
