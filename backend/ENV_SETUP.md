# 🔧 Environment Setup Guide

## 📋 Required Steps

### 1. Create .env File
Create a `.env` file in the backend directory and add the following content:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
# Uncomment one of the following lines and paste your URI:

# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/location-tracker

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/location-tracker

# Database Name (optional)
DB_NAME=location-tracker

# Cloudinary Configuration (for photo uploads)
# Get these from https://cloudinary.com dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth Configuration (for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# JWT Secret (for authentication)
JWT_SECRET=your_super_secret_jwt_key_here

# Session Secret (for authentication)
SESSION_SECRET=your_super_secret_session_key_here

# CORS Configuration (optional)
FRONTEND_URL=http://localhost
```

### 2. MongoDB Options

#### Option A: Local MongoDB
1. Install MongoDB on your computer: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. In .env file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/location-tracker
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create new cluster
4. Create user from Database Access
5. Add your IP address from Network Access (or 0.0.0.0/0 for public access)
6. Click Connect and select "Connect your application"
7. Copy connection string
8. In .env file:
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/location-tracker
   ```

### 3. Cloudinary Setup (Photo Upload)
1. Go to https://cloudinary.com
2. Create free account (25,000 free transformations per month)
3. Get the following information from dashboard:
   - **Cloud Name**: Visible on dashboard
   - **API Key**: From API Keys section
   - **API Secret**: From API Keys section (use Show/Hide)
4. In .env file:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here  
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

### 4. Google OAuth Setup (Authentication)
1. Go to https://console.developers.google.com
2. Create new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. In .env file:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### 5. Start Server
```bash
cd backend
npm run dev
```

### 6. Test
Go to http://localhost:3000/api/health in your browser.
You will see MongoDB connection status.

## 🔍 Troubleshooting

### MongoDB Connection Failed
- Make sure .env file is in correct location
- Verify MONGODB_URI is correct
- If using MongoDB Atlas, check IP whitelist
- Make sure MongoDB service is running

### .env File Not Read
- Make sure file name is exactly `.env`
- Make sure file is in backend directory
- Restart server

## ✅ Successful Connection
You should see this in console output:
```
✅ MongoDB connection successful
📍 Database: mongodb://localhost:27017/location-tracker
```

## ⚠️ Fallback Mode
If MongoDB connection fails, system automatically uses in-memory storage:
```
⚠️ MONGODB_URI not found, using in-memory storage
```

In this case, data is temporary and will be lost on server restart.

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- Keep Google OAuth credentials secure
- Use different credentials for production environment