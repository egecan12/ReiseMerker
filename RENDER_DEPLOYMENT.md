# Render Deployment Configuration

## Backend Service (Web Service)

### Service Settings:
- **Name**: `location-notebook-backend`
- **Environment**: `Docker`
- **Region**: `Oregon (US West)`
- **Branch**: `main`
- **Dockerfile Path**: `backend/Dockerfile`
- **Docker Context Directory**: `backend/`

### Environment Variables:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/location-notebook
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-app.onrender.com/api/auth/google/callback
JWT_SECRET=your_super_strong_jwt_secret_here
SESSION_SECRET=your_super_strong_session_secret_here
FRONTEND_URL=https://your-frontend-app.onrender.com
```

## Frontend Service (Static Site)

### Service Settings:
- **Name**: `location-notebook-frontend`
- **Environment**: `Static Site`
- **Region**: `Oregon (US West)`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist/frontend/browser`

### Environment Variables:
```env
API_URL=https://your-backend-app.onrender.com/api
```

## Deployment Steps:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Create Backend Service**:
   - Go to https://render.com/dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Configure as above

3. **Create Frontend Service**:
   - Click "New +" → "Static Site"
   - Connect same GitHub repo
   - Configure as above

4. **Update URLs**:
   - After deployment, update Google OAuth callback URLs
   - Update frontend API URL

## Important Notes:

- Render free tier has limitations (sleeps after 15 min inactivity)
- Backend will wake up when first request comes
- Consider upgrading to paid plan for production use
- Both services will get HTTPS automatically
- Custom domains available on paid plans
