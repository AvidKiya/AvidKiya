#!/bin/bash
# AvidKiya OS - Setup Script
# This script installs dependencies and sets up the project

echo "🚀 AvidKiya OS Setup"
echo "===================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found."
    exit 1
fi

echo "✅ npm $(npm -v) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed"
echo ""

# Create .env.local template
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << EOF
# Cloudflare Pages - Set these in Cloudflare Dashboard > Pages > Settings > Environment Variables
# ADMIN_TOKEN=your_secure_admin_token_here

# Optional: Analytics
# NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
EOF
    echo "✅ .env.local created"
    echo "⚠️  Don't forget to set ADMIN_TOKEN in Cloudflare Pages dashboard"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. npm run dev          # Start development server"
echo "  2. npm run build        # Build for production"
echo "  3. npm run deploy       # Deploy to Cloudflare Pages"
echo ""
echo "Admin panel:"
echo "  Visit: http://localhost:3000/admin/login"
echo "  Or add #kiya/panel to any page URL"
echo "  Default password: admin"
echo ""
