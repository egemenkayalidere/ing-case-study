# ING Çalışan Yönetim Uygulaması

Bu proje, ING Case Study kapsamında Lit Element kullanılarak geliştirilmiş modern bir Çalışan Yönetim Uygulamasıdır. Uygulama, çalışan kayıtlarını listeleme, ekleme, düzenleme ve silme işlemlerini gerçekleştirebilen interaktif bir web arayüzü sunmaktadır.

## Kurulum

Projeyi kurmak için aşağıdaki komutları çalıştırın:

```bash
# Bağımlılıkları yükleyin
npm install
```

## Geliştirme

Geliştirme sunucusunu başlatmak için:

```bash
npm start
```

Bu komut, uygulamayı geliştirme modunda çalıştıracak ve tarayıcınızda otomatik olarak açacaktır. Kodda yapılan değişiklikler otomatik olarak yenilenir.

## Derleme

Projeyi derlemek için:

```bash
npm run build
```

Bu komut, uygulamayı `/dist` klasörüne derleyecektir.

## Derlenen Uygulamayı Çalıştırma

Derlenen uygulamayı çalıştırmak için:

```bash
npm run serve
```

## Test

Birim testlerini çalıştırmak için:

```bash
npm test
```

## Teknolojiler

- **Lit Element**: Web bileşenleri oluşturmak için
- **Vaadin Router**: Sayfa yönlendirmesi için
- **LocalStorage**: Veri saklama için
- **Modern JavaScript (ES6+)**: Arrow functions, destructuring, template literals vb.
- **CSS Custom Properties**: Tema ve stil yönetimi için

## Özellikler

- **Çalışan Kayıtlarını Listeleme**: Tablo ve liste görünümü, sayfalama, arama
- **Yeni Çalışan Kaydı Ekleme**: Form doğrulama ile yeni kayıt oluşturma
- **Mevcut Çalışan Kaydını Düzenleme**: Var olan kayıtları güncelleme
- **Çalışan Kaydını Silme**: Onay diyaloğu ile silme işlemi
- **Çoklu Dil Desteği**: Türkçe ve İngilizce dil seçenekleri
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- **LocalStorage**: Tarayıcı belleğinde veri saklama

## Proje Yapısı

```
lit-element-project/
├── src/                  # Kaynak kodları
│   ├── components/       # Web bileşenleri
│   │   ├── employee/     # Çalışan ile ilgili bileşenler
│   │   │   ├── employee-form.js  # Çalışan ekleme/düzenleme formu
│   │   │   └── employee-list.js  # Çalışan listesi
│   │   ├── shared/       # Paylaşılan bileşenler
│   │   │   └── confirm-dialog.js # Onay diyaloğu
│   │   ├── app-root.js   # Ana uygulama bileşeni
│   │   └── nav-bar.js    # Navigasyon çubuğu
│   ├── services/         # Servisler
│   │   └── employee-service.js # Çalışan veri servisi
│   ├── i18n/             # Dil desteği
│   │   ├── i18n-service.js # Dil servisi
│   │   └── translations.js # Çeviriler
│   ├── utils/            # Yardımcı modüller
│   │   └── router.js     # Sayfa yönlendirme
│   ├── assets/           # Resimler ve diğer varlıklar
│   ├── styles/           # Stil dosyaları
│   ├── index.html        # Ana HTML dosyası
│   ├── index.js          # Uygulama giriş noktası
│   └── styles.css        # Global stiller
├── public/               # Statik dosyalar
├── test/                 # Test dosyaları
├── package.json          # Proje bağımlılıkları ve komutları
├── rollup.config.js      # Rollup yapılandırması
└── web-dev-server.config.js # Geliştirme sunucusu yapılandırması
```
