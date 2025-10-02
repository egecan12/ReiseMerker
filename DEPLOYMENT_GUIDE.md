# 🚀 Production Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup
Create production environment variables:

```env
# Production Environment Variables
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/location-notebook

# Cloudinary (Required)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Google OAuth (Required)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback

# JWT & Session Secrets (Required)
JWT_SECRET=your_super_strong_jwt_secret_here
SESSION_SECRET=your_super_strong_session_secret_here

# Frontend URL (Update after deployment)
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com
```

### 2. Google OAuth Configuration
Update Google OAuth settings:
1. Go to https://console.developers.google.com
2. Select your project
3. Go to "Credentials" → OAuth 2.0 Client IDs
4. Add authorized redirect URIs:
   - `https://your-backend-domain.com/api/auth/google/callback`

### 3. MongoDB Atlas Setup
1. Create MongoDB Atlas account: https://www.mongodb.com/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP addresses (or 0.0.0.0/0 for all)
5. Get connection string

### 4. Cloudinary Setup
1. Create Cloudinary account: https://cloudinary.com
2. Get API credentials from dashboard
3. Add to environment variables

## 🚀 Railway Deployment (Recommended)

### Step 1: Prepare Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Railway Setup
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository

### Step 3: Configure Services
Railway will detect your docker-compose.yml and create services for:
- Backend (Node.js)
- Frontend (Nginx)

### Step 4: Environment Variables
In Railway dashboard:
1. Go to your backend service
2. Click "Variables" tab
3. Add all environment variables from above

### Step 5: Custom Domains (Optional)
1. Go to service settings
2. Add custom domain
3. Update environment variables with new URLs

## 🌐 Vercel + Railway Deployment

### Frontend on Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Update environment variables in Vercel dashboard
# Set API_URL to your Railway backend URL
```

### Backend on Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🔧 Post-Deployment

### 1. Update URLs
After deployment, update:
- Google OAuth callback URLs
- Frontend API endpoints
- CORS settings

### 2. Test Everything
- [ ] Frontend loads correctly
- [ ] Google OAuth login works
- [ ] Location tracking works
- [ ] Photo upload works
- [ ] Database connection works

### 3. Monitor
- Check Railway/Render logs
- Monitor MongoDB Atlas usage
- Check Cloudinary usage

## 💰 Cost Breakdown

### Railway (Free Tier)
- $5/month credit
- Enough for small-medium apps
- Automatic scaling

### Vercel (Free Tier)
- Unlimited static sites
- 100GB bandwidth/month
- Perfect for Angular frontend

### MongoDB Atlas (Free Tier)
- 512MB storage
- Shared clusters
- Sufficient for development/small apps

### Cloudinary (Free Tier)
- 25GB storage
- 25GB bandwidth/month
- 25,000 transformations/month

## 🆘 Troubleshooting

### Common Issues
1. **CORS errors**: Update FRONTEND_URL in backend
2. **OAuth redirect errors**: Update callback URLs
3. **Database connection**: Check MongoDB Atlas IP whitelist
4. **Photo upload fails**: Verify Cloudinary credentials

### Support
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Cloudinary: https://cloudinary.com/documentation
