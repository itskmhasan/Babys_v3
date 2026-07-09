# Deployment Workflow

This repo already has:

- `.github/workflows/deploy.yml`
- `deploy/deploy.sh`

For a concrete staging setup you can follow, see [deploy/STAGING_SETUP.md](deploy/STAGING_SETUP.md).

Use them with a simple branch-based flow instead of editing the live server directly.

## Recommended flow

1. Create a feature branch from `main`.
2. Develop and test locally.
3. Open a pull request and review it.
4. Merge to `staging` first if you have a staging server.
5. Promote the same commit to `main` only after staging looks good.

If you do not have a staging server yet, keep using feature branches locally and treat `main` as production only.

If you only have one Hostinger VPS, you can still use this setup by keeping production in `/var/www/Babys_v3` and staging in `/var/www/Babys_v3-staging` with different process names.

## GitHub secrets used by the current workflow

Go to **GitHub Repo → Settings → Secrets and variables → Actions → New repository secret** and add:

- `VPS_HOST` = server IP or domain
- `VPS_PORT` = SSH port, usually `22`
- `VPS_USER` = Linux user used for deploy
- `VPS_SSH_KEY` = private key for that user

## How the live deploy works

The workflow SSHes into the server, enters `/var/www/Babys_v3`, and runs `deploy/deploy.sh`.

That script:

- fetches the target branch
- installs dependencies for `backend`, `admin`, and `store`
- builds the admin and store apps
- restarts available `pm2` processes or `systemd` services
- reloads nginx if permitted

## What to change to make this safer

- Keep production deploys on `main` only.
- Add a separate staging branch and staging server before testing risky changes.
- Protect `main` in GitHub so changes only land through pull requests.
- Keep a rollback commit ready before each production deploy.

## Permissions for restart and reload

If the deploy user is not root, allow passwordless restart/reload for the exact services you use.

Example:

```bash
sudo visudo
```

Add the services you actually run:

```text
your_user ALL=(ALL) NOPASSWD:/bin/systemctl restart babys-backend.service,/bin/systemctl restart babys-store.service,/bin/systemctl restart babys-admin.service,/bin/systemctl reload nginx
```

## Rollback

On the server:

```bash
cd /var/www/Babys_v3
git log --oneline -n 5
git reset --hard <commit_sha>
./deploy/deploy.sh main /var/www/Babys_v3
```
