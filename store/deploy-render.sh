#!/bin/bash

# Kachabazar Store - Render Deployment Quick Setup
# This script helps prepare your store for Render deployment

echo "================================"
echo "Kachabazar Store - Render Setup"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found!"
    echo "Please initialize git first:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

echo "✅ package.json found"
echo ""

# Run build locally to verify
echo "📦 Testing build locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying to Render"
    exit 1
fi

echo "✅ Build successful!"
echo ""

echo "📋 Next steps to deploy on Render:"
echo "1. Push code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://dashboard.render.com"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your GitHub repository"
echo "5. Configure the service with:"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm start"
echo "6. Add environment variables from .env.production.example"
echo ""
echo "📚 For detailed instructions, see RENDER_DEPLOYMENT.md"
echo ""
echo "✅ Setup complete!"
