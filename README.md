# Shuttleport MVP - Transfer Rezervasyon Sistemi

Yatırımcı sunumu için hazırlanmış, Shuttleport benzeri bir transfer rezervasyon sistemi MVP'si.

## 🚀 Teknolojiler

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**

## 📁 Proje Yapısı

```
Anti/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Ana sayfa
│   │   └── globals.css         # Global stiller
│   ├── types/
│   │   └── index.ts            # TypeScript tipleri
│   └── lib/
│       └── data.ts             # Mock data ve yardımcı fonksiyonlar
├── public/                     # Statik dosyalar
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## 🎯 Özellikler

### Mevcut
- ✅ Modern ve responsive tasarım
- ✅ Transfer arama formu
- ✅ Tek yön / Gidiş-dönüş seçenekleri
- ✅ Lokasyon, tarih, saat ve yolcu seçimi
- ✅ Özellikler bölümü
- ✅ TypeScript tip tanımlamaları
- ✅ Mock data (araçlar ve lokasyonlar)

### Gelecek Adımlar
- [ ] Araç listeleme sayfası
- [ ] Araç filtreleme ve sıralama
- [ ] Rezervasyon detay sayfası
- [ ] Ödeme entegrasyonu
- [ ] Kullanıcı paneli
- [ ] Admin paneli

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcınızda açın:
```
http://localhost:3000
```

## 📦 Komutlar

- `npm run dev` - Geliştirme sunucusunu başlatır
- `npm run build` - Production build oluşturur
- `npm run start` - Production sunucusunu başlatır
- `npm run lint` - Kod kalitesini kontrol eder

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: Mavi tonları (#0ea5e9)
- **Secondary**: Mor tonları (#d946ef)
- **Gradients**: Modern gradient kombinasyonları

### Bileşenler
- `btn-primary`: Ana butonlar
- `btn-secondary`: İkincil butonlar
- `input-field`: Form inputları
- `card`: Kart bileşenleri

## 📝 Veri Modeli

### Vehicle (Araç)
- id, name, type, capacity, luggage
- pricePerKm, basePrice, image, features

### Location (Lokasyon)
- id, name, type (airport/hotel/address)
- coordinates (lat, lng)

### TransferSearch (Transfer Araması)
- from, to, date, time, passengers
- isRoundTrip, returnDate, returnTime

### Reservation (Rezervasyon)
- transferSearch, vehicle, totalPrice
- distance, duration, passengerInfo, status

## 🚗 Araç Tipleri

- **Sedan**: 3 yolcu, 2 bagaj
- **Van**: 6 yolcu, 4 bagaj
- **Minibus**: 12 yolcu, 8 bagaj
- **Bus**: 20+ yolcu

## 📍 Örnek Lokasyonlar

- İstanbul Havalimanı (IST)
- Sabiha Gökçen Havalimanı (SAW)
- Taksim
- Sultanahmet
- Beşiktaş

## 💡 Notlar

Bu proje MVP aşamasındadır ve yatırımcı sunumu için hazırlanmıştır. Gerçek bir üretim ortamında kullanılmadan önce:

- Gerçek API entegrasyonları yapılmalı
- Ödeme sistemi entegre edilmeli
- Güvenlik önlemleri alınmalı
- SEO optimizasyonları yapılmalı
- Test coverage artırılmalı

## 📄 Lisans

Bu proje MVP amaçlı oluşturulmuştur.
