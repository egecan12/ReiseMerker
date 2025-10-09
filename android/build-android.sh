#!/bin/bash

# Location Notebook Android Build Script
# Bu script Android uygulamasını derler ve hazırlar

echo "🚀 Location Notebook Android Build Script"
echo "========================================"

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Hata kontrolü
set -e

# Node.js kontrolü
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js bulunamadı. Lütfen Node.js'i yükleyin.${NC}"
    exit 1
fi

# NPM kontrolü
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ NPM bulunamadı. Lütfen NPM'i yükleyin.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Bağımlılıklar yükleniyor...${NC}"
npm install

echo -e "${YELLOW}🔨 Angular uygulaması derleniyor...${NC}"
npm run build

echo -e "${YELLOW}📱 Capacitor Android platformu kontrol ediliyor...${NC}"
if [ ! -d "android" ]; then
    echo -e "${YELLOW}📱 Android platformu ekleniyor...${NC}"
    npx cap add android
else
    echo -e "${GREEN}✅ Android platformu mevcut${NC}"
fi

echo -e "${YELLOW}📋 Capacitor'a kopyalanıyor...${NC}"
npx cap copy android

echo -e "${YELLOW}🔄 Capacitor senkronize ediliyor...${NC}"
npx cap sync android

echo -e "${GREEN}✅ Build tamamlandı!${NC}"
echo ""
echo -e "${YELLOW}📱 Android Studio'yu açmak için:${NC}"
echo -e "${GREEN}   npx cap open android${NC}"
echo ""
echo -e "${YELLOW}🚀 Geliştirme için:${NC}"
echo -e "${GREEN}   npm run android:dev${NC}"
echo ""
echo -e "${YELLOW}📦 Production build için:${NC}"
echo -e "${GREEN}   npm run android:prod${NC}"
echo ""
echo -e "${GREEN}🎉 Android uygulamanız hazır!${NC}"
