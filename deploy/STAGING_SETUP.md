# Staging Setup Plan

Use staging to test every non-trivial change before it reaches the live server.

## Goal

Keep these environments separate:

- local development
- staging
- production

The staging server should mirror production closely enough to catch build, route, and service issues before release.

## Recommended branch flow

1. Create feature branches from `main`.
2. Merge feature branches into `staging` first.
3. Deploy `staging` to the staging server.
4. After validation, merge the same commit into `main`.
5. Deploy `main` to production.

## Server layout

Use a separate server or VM for staging if you have one. If you only have a single Hostinger VPS, keep production and staging in separate folders and process names on that same machine.

Suggested paths:

- production: `/var/www/Babys_v3`
- staging: `/var/www/Babys_v3-staging`

You do not need a separate subdomain to make this work. For a single VPS, you can keep staging private and validate it by SSH, logs, or a temporary local port setup later if needed.

## App processes

Keep process names different so staging cannot overwrite production.

Suggested PM2 names:

- production backend: `babys-backend`
- production store: `babys-store`
- production admin: `babys-admin`
- staging backend: `babys-backend-staging`
- staging store: `babys-store-staging`
- staging admin: `babys-admin-staging`

If you use systemd instead of PM2, create separate units with the same naming pattern.

## GitHub Actions

Create a second workflow for staging at `.github/workflows/staging-deploy.yml`.

Trigger it on push to `staging` and use staging-specific secrets:

- `VPS_HOST_STAGING`
- `VPS_PORT_STAGING`
- `VPS_USER_STAGING`
- `VPS_SSH_KEY_STAGING`

The staging workflow should SSH into the staging server and run:

```bash
./deploy/deploy.sh staging /var/www/Babys_v3-staging
```

The production workflow should remain tied to `main` only.

## Environment separation

Staging needs its own values for:

- database connection string
- auth secrets
- payment keys
- email delivery settings
- file upload or storage credentials

Do not reuse production credentials on staging.

## What to verify on staging

Check these before promoting a change:

- app builds successfully
- backend starts cleanly
- admin loads and can talk to the API
- store routes work in the browser
- static assets load correctly
- login, checkout, and critical forms behave as expected
- logs stay clean after restart

## Rollback on staging

If staging breaks, reset to the last known good commit and redeploy:

```bash
cd /var/www/Babys_v3-staging
git log --oneline -n 5
git reset --hard <commit_sha>
./deploy/deploy.sh staging /var/www/Babys_v3-staging
```

## Minimum safe version

If you are not ready for a full staging server yet, at minimum do this:

- keep feature branches local until reviewed
- protect `main`
- use a manual deploy only after a successful local build
- keep a rollback commit ready before touching production
- this smoke-test note is doc-only and should not affect runtime behavior

## GitHub setup checklist

Use this as a copy-paste checklist while you configure the repo:

- [ ] Create or confirm the `staging` branch exists in GitHub
- [ ] Push the local `staging` branch to `origin`
- [ ] Add repository secret `VPS_HOST_STAGING`
- [ ] Add repository secret `VPS_PORT_STAGING`
- [ ] Add repository secret `VPS_USER_STAGING`
- [ ] Add repository secret `VPS_SSH_KEY_STAGING`
- [ ] Confirm the staging server has a clone at `/var/www/Babys_v3-staging`
- [ ] Confirm staging does not share process names or folders with production
- [ ] Confirm staging uses separate API, database, email, and payment credentials
- [ ] Merge the staging workflow file before testing the first deploy
- [ ] Push a small commit to `staging` and verify the staging deploy runs