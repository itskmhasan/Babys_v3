# GitHub Auto Deploy Setup

This repo now includes:

- `.github/workflows/deploy.yml`
- `deploy/deploy.sh`

## 1) Add GitHub repository secrets

Go to **GitHub Repo → Settings → Secrets and variables → Actions → New repository secret** and add:

- `DEPLOY_HOST` = your server IP or domain (example: `187.77.134.3`)
- `DEPLOY_PORT` = SSH port (usually `22`)
- `DEPLOY_USER` = Linux user used for deploy
- `DEPLOY_SSH_KEY` = private key for that user (full key text)

## 2) Ensure server can pull from GitHub

On server (`/var/www/Babys_v3`), make sure `git pull` works without password prompts.

- If using HTTPS remote, configure token auth.
- Recommended: switch remote to SSH and add deploy key.

## 3) Permissions for restart/reload

`deploy/deploy.sh` tries `pm2` first, then optional `systemd` services, then nginx reload.

If your deploy user is not root, allow passwordless restart/reload (example):

```bash
sudo visudo
```

Add (adjust username/services as needed):

```text
your_user ALL=(ALL) NOPASSWD:/bin/systemctl restart babys-backend.service,/bin/systemctl restart babys-store.service,/bin/systemctl restart babys-admin.service,/bin/systemctl reload nginx
```

## 4) Trigger deploy

- Push to `main`, or
- Manually run **Actions → Auto Deploy → Run workflow**

## 5) Rollback (manual)

On server:

```bash
cd /var/www/Babys_v3
git log --oneline -n 5
git reset --hard <commit_sha>
./deploy/deploy.sh main /var/www/Babys_v3
```
