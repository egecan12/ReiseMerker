# 🚀 Docker Deployment Guide

This guide shows how to deploy the Location Notebook application using Docker.

## 📋 Requirements

- Docker 20.10+
- Docker Compose 2.0+
- Git

## 🔧 Installation

### 1. Clone the Project

```bash
git clone <your-repo-url>
cd location-notebook
```

### 2. Environment Variables Setup

```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your credentials
nano .env
```

### 3. Required Environment Variables

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/location-notebook

# Cloudinary Configuration (Required for photo uploads)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Google OAuth Configuration (Required for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# JWT Secret (Required for authentication)
JWT_SECRET=your_super_secret_jwt_key_here

# Session Secret (Required for authentication)
SESSION_SECRET=your_super_secret_session_key_here

# Frontend Configuration
FRONTEND_URL=http://localhost
BACKEND_URL=http://localhost:3000

# Port Configuration
BACKEND_PORT=3000
FRONTEND_PORT=80
```

## 🐳 Running with Docker

### Development Mode

```bash
# Start all services
docker-compose up -d

# Follow logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Mode

```bash
# Production build
docker-compose up -d --build

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🌐 Access

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 🔍 Troubleshooting

### Container Logs

```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# All logs
docker-compose logs
```

### Container Status

```bash
# Check container status
docker-compose ps

# Restart containers
docker-compose restart
```

### Environment Variables Check

```bash
# Check environment variables
docker-compose exec backend env
docker-compose exec frontend env
```

## 🚀 Production Deployment

### 1. Domain Settings

```env
# Production environment variables
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback
```

### 2. SSL Certificate

```bash
# Use Nginx reverse proxy with SSL
# Use Let's Encrypt certificate
```

### 3. Database

```bash
# Use MongoDB Atlas or set up your own MongoDB instance
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/location-notebook
```

## 📊 Monitoring

### Health Checks

```bash
# Backend health check
curl http://localhost:3000/api/health

# Frontend health check
curl http://localhost/health
```

### Container Metrics

```bash
# Container resource usage
docker stats

# Specific container
docker stats location-notebook-backend
docker stats location-notebook-frontend
```

## 🔄 Updates

### Updating the Application

```bash
# Pull latest code
git pull origin main

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

### Database Backup

```bash
# MongoDB backup
docker-compose exec backend mongodump --uri="$MONGODB_URI" --out=/backup
```

## 🛡️ Security

### Environment Variables

- Never commit `.env` file
- Use strong JWT secret in production
- Keep Google OAuth credentials secure

### Container Security

```bash
# Run containers with non-root user
# Apply security updates regularly
# Use network isolation
```

## 📝 Notes

- Frontend is served with Nginx
- Backend runs with Node.js
- Uses in-memory storage if MongoDB connection fails
- Cloudinary is required for photo uploads
- Google OAuth is required for authentication

## 🆘 Support

If you encounter issues:

1. Check container logs
2. Verify environment variables
3. Test network connectivity
4. Report issues on GitHub Issues