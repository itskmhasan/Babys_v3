# 🚀 Deployment Checklist - Kachabazar Store

## Pre-Deployment Checklist

### ✅ Code & Repository
- [ ] Code is pushed to GitHub
- [ ] All files are committed (git status clean)
- [ ] No sensitive data in `.env` file
- [ ] `.env` is in `.gitignore`
- [ ] `render.yaml` is included
- [ ] `RENDER_DEPLOYMENT.md` is available

### ✅ Build Verification
- [ ] Run `npm run build` locally - passes without errors
- [ ] No build warnings about missing dependencies
- [ ] All environment variables in `.env` are documented
- [ ] `next.config.js` is optimized for production

### ✅ Environment Variables Ready
- [ ] `NEXT_PUBLIC_API_BASE_URL` - production backend URL
- [ ] `NEXT_PUBLIC_API_SOCKET_URL` - production socket URL
- [ ] `NEXT_PUBLIC_STRIPE_KEY` - production Stripe key
- [ ] `NEXT_PUBLIC_CLOUDINARY_URL` - Cloudinary API URL
- [ ] `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - upload preset
- [ ] `NEXT_PUBLIC_STORE_DOMAIN` - your Render domain
- [ ] `NEXTAUTH_URL` - matches deployment URL
- [ ] `NEXTAUTH_SECRET` - secure secret generated

### ✅ Backend Ready
- [ ] Backend API is deployed and accessible
- [ ] CORS is enabled for your Render domain
- [ ] API endpoints are responsive
- [ ] WebSocket (if used) is configured

### ✅ Third-Party Services
- [ ] Stripe account configured
- [ ] Cloudinary account set up
- [ ] NextAuth provider configured
- [ ] All API keys obtained

## Deployment Steps

### Step 1: Prepare Code
```bash
cd store
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Web Service
1. Visit https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in:
   - **Name**: `kachabazar-store`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose Free or Starter

### Step 3: Configure Environment Variables
Add all variables from `.env.production.example` to Render dashboard

### Step 4: Deploy
Click **"Create Web Service"** and monitor the deployment

### Step 5: Verify
- Check logs for errors
- Visit your deployed URL
- Test key features (login, checkout, products)

## Important URLs

**Your Render Dashboard**: https://dashboard.render.com

**Your Deployed App**: `https://[your-service-name].onrender.com`

## Post-Deployment

### Enable Auto-Deploy
1. Go to service settings
2. Check **"Auto-Deploy"** in GitHub integration
3. Changes pushed to main branch auto-deploy

### Monitor Performance
1. Check **Metrics** tab for CPU/Memory usage
2. Review **Logs** for errors
3. Monitor **Events** for deployment history

### Custom Domain Setup
1. Purchase domain from registrar
2. In Render settings: **Custom Domains** → Add domain
3. Follow DNS setup instructions
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_STORE_DOMAIN`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check logs, ensure all dependencies in package.json, verify npm run build works locally |
| App won't start | Verify START_COMMAND, check environment variables, review logs |
| 503 Service Unavailable | Free plan is sleeping - wait 30s for auto-wake |
| CORS errors | Check backend CORS settings include your Render domain |
| Auth not working | Verify NEXTAUTH_URL matches deployment domain |
| Images not loading | Check remote image hostname patterns in next.config.js |

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Deployment Guide**: See `RENDER_DEPLOYMENT.md`
- **Environment Template**: See `.env.production.example`

---

**Last Updated**: January 17, 2026
**Status**: Ready for Deployment ✅
