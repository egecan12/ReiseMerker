# 📸 Cloudinary Photo Upload Setup

Bu rehber, Location Tracking App'e fotoğraf yükleme özelliğini aktif hale getirmek için gereken adımları açıklar.

## 🔧 Cloudinary Hesabı Oluşturma

### 1. Cloudinary'ye Kaydolun
1. https://cloudinary.com adresine gidin
2. **Sign Up** butonuna tıklayın
3. Bilgilerinizi girin ve hesap oluşturun
4. Email doğrulaması yapın

### 2. Dashboard Bilgilerini Alın
1. Cloudinary Dashboard'a giriş yapın
2. **Dashboard** sayfasında aşağıdaki bilgileri bulun:
   - **Cloud Name** (örn: `dxmhc7vhk`)
   - **API Key** (örn: `123456789012345`)
   - **API Secret** (gizli, Show/Hide ile görülebilir)

## ⚙️ Backend Konfigürasyonu

### 1. .env Dosyası Oluşturun
Backend klasöründe `.env` dosyası oluşturun:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# CORS Configuration
FRONTEND_URL=http://localhost:4200
```

### 2. Cloudinary Bilgilerini Ekleyin
Yukarıdaki dosyada `your_cloud_name_here`, `your_api_key_here` ve `your_api_secret_here` kısımlarını kendi bilgilerinizle değiştirin.

**Örnek:**
```env
CLOUDINARY_CLOUD_NAME=myapp-photos
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdef1234567890abcdef1234567890
```

## 🚀 Özellikler

### Fotoğraf Upload
- **Drag & Drop**: Fotoğrafları sürükleyip bırakarak yükleyin
- **Click to Select**: Dosya seçici ile fotoğraf seçin
- **Multiple Upload**: Aynı anda 5 fotoğrafa kadar yükleyin
- **Auto Resize**: Fotoğraflar otomatik olarak 800x600 max boyuta resize edilir
- **Format Support**: JPEG, PNG, GIF, WebP formatları desteklenir
- **Size Limit**: Her fotoğraf max 5MB olabilir

### Fotoğraf Yönetimi
- **Photo Gallery**: Her lokasyon için fotoğraf galerisi
- **Full Size View**: Fotoğrafları büyük boyutta görüntüleme
- **Delete Photos**: İstenmeyen fotoğrafları silme
- **Auto Organization**: Fotoğraflar `location-tracker` klasörüne organize edilir

## 📁 Klasör Yapısı

Cloudinary'de fotoğraflarınız şu şekilde organize edilir:
```
location-tracker/
├── photo1_randomid.jpg
├── photo2_randomid.png
└── photo3_randomid.webp
```

## 🔒 Güvenlik

- **API Key**: Frontend'de gizli tutulur, sadece backend'de kullanılır
- **File Validation**: Sadece image dosyaları kabul edilir
- **Size Limits**: Büyük dosya yüklemesi engellenir
- **Auto Cleanup**: Lokasyon silindiğinde fotoğraflar da Cloudinary'den silinir

## 🆓 Ücretsiz Kullanım

Cloudinary ücretsiz plan:
- **25,000** dönüşüm/ay (resize, format değişimi vs.)
- **25 GB** depolama
- **25 GB** bandwidth

Normal kullanım için oldukça yeterli!

## ❗ Önemli Notlar

1. **.env** dosyasını **asla** Git'e commit etmeyin
2. **API Secret**'ı kimseyle paylaşmayın
3. Production'da farklı Cloudinary hesabı kullanın
4. Backup için önemli fotoğrafları başka yerde de saklayın

## 🔧 Test Etme

1. Backend'i başlatın: `cd backend && npm run dev`
2. Frontend'i başlatın: `cd frontend && ng serve`
3. Yeni lokasyon oluşturun
4. Fotoğraf yükleme bölümünden test edin

## 📞 Sorun Giderme

### Fotoğraf Yüklenmiyor
- Cloudinary bilgilerini kontrol edin
- .env dosyasının backend klasöründe olduğundan emin olun
- Console'da hata mesajlarını kontrol edin

### "Upload Failed" Hatası
- Dosya boyutunu kontrol edin (max 5MB)
- Dosya formatını kontrol edin (sadece resim dosyaları)
- Internet bağlantınızı kontrol edin

### API Key Hatası
- Dashboard'daki bilgileri tekrar kontrol edin
- API Secret'ın doğru olduğundan emin olun
- Serveri yeniden başlatın

---

✅ **Setup tamamlandığında, kullanıcılarınız lokasyonlarına fotoğraf ekleyebilecek!**
