# 🔧 MongoDB Kurulum Rehberi

## 📋 Gerekli Adımlar

### 1. .env Dosyası Oluşturun
Backend klasöründe `.env` dosyası oluşturun ve aşağıdaki içeriği ekleyin:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
# Aşağıdaki satırlardan birini uncomment edin ve URI'nizi yapıştırın:

# Yerel MongoDB için:
# MONGODB_URI=mongodb://localhost:27017/location-tracker

# MongoDB Atlas için:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/location-tracker

# Database Name (isteğe bağlı)
DB_NAME=location-tracker

# Cloudinary Configuration (for photo uploads)
# Get these from https://cloudinary.com dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration (isteğe bağlı)
FRONTEND_URL=http://localhost:4200
```

### 2. MongoDB Seçenekleri

#### Seçenek A: Yerel MongoDB
1. MongoDB'yi bilgisayarınıza kurun: https://www.mongodb.com/try/download/community
2. MongoDB servisini başlatın
3. .env dosyasında:
   ```env
   MONGODB_URI=mongodb://localhost:27017/location-tracker
   ```

#### Seçenek B: MongoDB Atlas (Bulut)
1. https://www.mongodb.com/atlas adresine gidin
2. Ücretsiz hesap oluşturun
3. Yeni cluster oluşturun
4. Database Access'ten kullanıcı oluşturun
5. Network Access'ten IP adresinizi ekleyin (veya 0.0.0.0/0 herkese açık)
6. Connect butonuna tıklayıp "Connect your application" seçin
7. Connection string'i kopyalayın
8. .env dosyasında:
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/location-tracker
   ```

### 3. Cloudinary Kurulumu (Fotoğraf Upload)
1. https://cloudinary.com adresine gidin
2. Ücretsiz hesap oluşturun (ayda 25,000 ücretsiz dönüşüm)
3. Dashboard'dan aşağıdaki bilgileri alın:
   - **Cloud Name**: Dashboard'da görünür
   - **API Key**: API Keys bölümünden
   - **API Secret**: API Keys bölümünden (Show/Hide yapın)
4. .env dosyasında:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here  
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

### 4. Serveri Başlatın
```bash
cd backend
npm run dev
```

### 5. Test Edin
Tarayıcınızda http://localhost:3000/api/health adresine gidin.
MongoDB bağlantı durumunu göreceksiniz.

## 🔍 Sorun Giderme

### MongoDB Bağlanamıyor
- .env dosyasının doğru konumda olduğundan emin olun
- MONGODB_URI'nin doğru olduğundan emin olun
- MongoDB Atlas kullanıyorsanız IP whitelist'ini kontrol edin
- MongoDB servisinin çalıştığından emin olun

### .env Dosyası Okunmuyor
- Dosya adının tam olarak `.env` olduğundan emin olun
- Dosyanın backend klasöründe olduğundan emin olun
- Serveri yeniden başlatın

## ✅ Başarılı Bağlantı
Konsol çıktısında şunu görmelisiniz:
```
✅ MongoDB bağlantısı başarılı
📍 Veritabanı: mongodb://localhost:27017/location-tracker
```

## ⚠️ Fallback Mode
MongoDB bağlantısı yoksa sistem otomatik olarak in-memory storage kullanır:
```
⚠️ MONGODB_URI bulunamadı, in-memory storage kullanılıyor
```

Bu durumda veriler geçicidir ve server restart'ta silinir.
