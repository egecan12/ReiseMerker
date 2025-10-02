# 🚀 Docker Deployment Guide

Bu rehber Location Notebook uygulamasını Docker kullanarak nasıl deploy edeceğinizi gösterir.

## 📋 Gereksinimler

- Docker 20.10+
- Docker Compose 2.0+
- Git

## 🔧 Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/egecan12/ReiseMerker.git
cd ReiseMerker
```

### 2. Environment Variables Ayarlayın

```bash
# env.example dosyasını kopyalayın
cp env.example .env

# .env dosyasını düzenleyin
nano .env
```

### 3. Gerekli Environment Variables

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/location-notebook

# Cloudinary Configuration (Required for photo uploads)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Google OAuth Configuration (Required for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# JWT Secret (Required for authentication)
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend Configuration
FRONTEND_URL=http://localhost:4200
BACKEND_URL=http://localhost:3000

# Port Configuration
BACKEND_PORT=3000
FRONTEND_PORT=80
```

## 🐳 Docker ile Çalıştırma

### Development Mode

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları takip et
docker-compose logs -f

# Servisleri durdur
docker-compose down
```

### Production Mode

```bash
# Production build
docker-compose -f docker-compose.yml up -d --build

# Logları kontrol et
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🌐 Erişim

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 🔍 Troubleshooting

### Container Logları

```bash
# Backend logları
docker-compose logs backend

# Frontend logları
docker-compose logs frontend

# Tüm loglar
docker-compose logs
```

### Container Durumu

```bash
# Container durumlarını kontrol et
docker-compose ps

# Container'ları yeniden başlat
docker-compose restart
```

### Environment Variables Kontrol

```bash
# Environment variables'ları kontrol et
docker-compose exec backend env
docker-compose exec frontend env
```

## 🚀 Production Deployment

### 1. Domain Ayarları

```env
# Production environment variables
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback
```

### 2. SSL Sertifikası

```bash
# Nginx reverse proxy ile SSL
# Let's Encrypt sertifikası kullanın
```

### 3. Database

```bash
# MongoDB Atlas kullanın veya kendi MongoDB instance'ınızı kurun
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/location-notebook
```

## 📊 Monitoring

### Health Checks

```bash
# Backend health check
curl http://localhost:3000/api/health

# Frontend health check
curl http://localhost:80/health
```

### Container Metrics

```bash
# Container resource kullanımı
docker stats

# Specific container
docker stats location-notebook-backend
docker stats location-notebook-frontend
```

## 🔄 Updates

### Uygulamayı Güncelleme

```bash
# Latest code'u çek
git pull origin main

# Container'ları yeniden build et
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

- `.env` dosyasını asla commit etmeyin
- Production'da güçlü JWT secret kullanın
- Google OAuth credentials'ları güvenli tutun

### Container Security

```bash
# Container'ları non-root user ile çalıştırın
# Security updates'leri düzenli olarak uygulayın
# Network isolation kullanın
```

## 📝 Notes

- Frontend Nginx ile serve edilir
- Backend Node.js ile çalışır
- MongoDB bağlantısı yoksa in-memory storage kullanılır
- Cloudinary photo upload için gereklidir
- Google OAuth authentication için gereklidir

## 🆘 Support

Sorun yaşıyorsanız:

1. Container loglarını kontrol edin
2. Environment variables'ları doğrulayın
3. Network connectivity'yi test edin
4. GitHub Issues'da sorun bildirin
