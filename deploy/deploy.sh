#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-main}"
APP_ROOT="${2:-/var/www/Babys_v3}"

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

run_systemctl() {
  local action="$1"
  local unit="$2"

  if ! command -v systemctl >/dev/null 2>&1; then
    return 1
  fi

  if [ "$(id -u)" -eq 0 ]; then
    systemctl "$action" "$unit"
    return 0
  fi

  if command -v sudo >/dev/null 2>&1; then
    sudo -n systemctl "$action" "$unit"
    return 0
  fi

  return 1
}

restart_service_if_exists() {
  local unit="$1"
  if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files --type=service --no-pager | awk '{print $1}' | grep -qx "$unit"; then
    if run_systemctl restart "$unit"; then
      log "restarted systemd service: $unit"
      return 0
    fi
    log "could not restart $unit (missing sudo permission?)"
  fi
  return 1
}

cd "$APP_ROOT"

log "syncing code from origin/$BRANCH"
git fetch --all --prune
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

log "installing backend deps"
cd "$APP_ROOT/backend"
npm ci --no-audit --no-fund

log "installing + building admin"
cd "$APP_ROOT/admin"
npm ci --no-audit --no-fund
npm run build

log "installing + building store"
cd "$APP_ROOT/store"
npm ci --no-audit --no-fund
npm run build

cd "$APP_ROOT"

if command -v pm2 >/dev/null 2>&1; then
  for proc in babys-backend backend kachabazar-backend babys-store store babys-admin admin; do
    if pm2 describe "$proc" >/dev/null 2>&1; then
      pm2 restart "$proc"
      log "restarted pm2 process: $proc"
    fi
  done
  pm2 save >/dev/null 2>&1 || true
fi

# Optional systemd units (if you use systemd instead of pm2)
for unit in babys-backend.service babys-store.service babys-admin.service; do
  restart_service_if_exists "$unit" || true
done

# Reload nginx if possible
if run_systemctl reload nginx; then
  log "reloaded nginx"
else
  log "nginx reload skipped (no permission or systemctl unavailable)"
fi

log "deploy completed successfully"
