# Kachabazar Store - Deployment Guide (Render)

## Prerequisites
- Render account (https://render.com)
- GitHub repository with your code pushed
- Environment variables ready

## Step-by-Step Deployment Guide

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Connect GitHub to Render
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Connect a repository"**
4. Search for and select your repository
5. Click **"Connect"**

### 3. Configure the Web Service

#### Basic Settings:
- **Name**: `kachabazar-store` (or your preferred name)
- **Environment**: `Node`
- **Plan**: `Free` (or upgrade to Pro/Plus)
- **Region**: Select closest to your users

#### Build & Deploy:
- **Root Directory**: Leave empty (or set to `store` if using monorepo)
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Start Command**: 
  ```
  npm start
  ```

#### Environment Variables:
Add these in the **Environment** section:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/v1
NEXT_PUBLIC_API_SOCKET_URL=https://your-backend-api.com
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/your_cloud/image/upload
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
NEXT_PUBLIC_STORE_DOMAIN=https://your-store-domain.onrender.com/
NEXTAUTH_URL=https://your-store-domain.onrender.com
NEXTAUTH_SECRET=your_secret_key_here
NODE_ENV=production
```

**Important**: Replace the placeholder values with your actual credentials!

### 4. Important Notes for Environment Variables

- **NEXT_PUBLIC_API_BASE_URL**: Update to your production backend URL
- **NEXT_PUBLIC_STORE_DOMAIN**: This will be your Render domain (e.g., `https://kachabazar-store.onrender.com/`)
- **NEXTAUTH_URL**: Must match your deployment domain
- **NEXTAUTH_SECRET**: Keep this secure and consistent
- **Stripe Key**: Use your production key for live transactions
- **Cloudinary**: Configure with your cloud name and upload preset

### 5. Deploy
1. After configuring, click **"Create Web Service"**
2. Render will automatically start deploying
3. Monitor the deployment in the **Logs** tab
4. Once successful, your app will be live at: `https://kachabazar-store.onrender.com`

### 6. Custom Domain (Optional)
1. Go to your service settings
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain and follow DNS setup instructions
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_STORE_DOMAIN` with your custom domain

## Troubleshooting

### Build Fails
- Check logs in Render dashboard
- Verify all dependencies are in `package.json`
- Ensure `npm run build` works locally first

### Application Won't Start
- Check `Start Command` is correct
- Verify Node version compatibility
- Check environment variables are properly set

### Port Issues
- Next.js runs on port 3000 by default
- Render automatically detects and uses it
- No need to configure PORT variable

### Free Plan Limitations
- App goes to sleep after 15 minutes of inactivity
- Auto-wake takes 30 seconds on first request
- For production, upgrade to **Starter** plan or higher

## Monitoring & Logs
1. Go to your service dashboard
2. Click **"Logs"** to view real-time logs
3. Use **"Events"** tab to track deployments
4. Check **"Metrics"** for performance data

## Redeploy
To manually redeploy:
1. Go to service settings
2. Click **"Redeploy latest commit"**
Or automatically redeploy on every GitHub push by enabling **"Auto-deploy"**

## Backend Configuration
Make sure your backend API is also deployed and accessible:
- Update `NEXT_PUBLIC_API_BASE_URL` to point to your production backend
- Ensure CORS is properly configured on backend
- Test API connectivity from Render deployment

## Need Help?
- Render Docs: https://render.com/docs
- Next.js Deployment: https://nextjs.org/learn/basics/deploying-nextjs-app
- Check Render's support: https://render.com/support
