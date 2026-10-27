#!/usr/bin/env bash
# Build the site and rsync it to the VPS.
#
# Settings come from deploy/.deploy.env (git-ignored), e.g.:
#   DEPLOY_HOST=user@my-vps
#   DEPLOY_PATH=/var/www/portfolio
#
# Usage:
#   ./deploy/deploy.sh            # build + upload
#   ./deploy/deploy.sh --dry-run  # build + show what rsync would change
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f deploy/.deploy.env ]]; then
  # shellcheck disable=SC1091
  source deploy/.deploy.env
fi

: "${DEPLOY_HOST:?Set DEPLOY_HOST in deploy/.deploy.env}"
: "${DEPLOY_PATH:?Set DEPLOY_PATH in deploy/.deploy.env}"

# rsync --delete removes anything in DEPLOY_PATH that isn't in dist/.
# Refuse shared roots so this can never wipe Nextcloud or other sites.
case "${DEPLOY_PATH%/}" in
  "" | / | /var | /var/www | /var/www/html)
    echo "Refusing to deploy to '$DEPLOY_PATH': use a dedicated folder like /var/www/portfolio." >&2
    exit 1
    ;;
esac

RSYNC_FLAGS=(-avz --delete)
if [[ "${1:-}" == "--dry-run" ]]; then
  RSYNC_FLAGS+=(--dry-run)
fi

npm run build
rsync "${RSYNC_FLAGS[@]}" dist/ "$DEPLOY_HOST:${DEPLOY_PATH%/}/"
echo "Deployed to $DEPLOY_HOST:$DEPLOY_PATH"
