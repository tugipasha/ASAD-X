# ASAD-X (Afet Sonrası Acil Destek ve Haritalama Sistemi)

ASAD-X, deprem sonrası kurulan konteyner kentlerin haritalanması ve afetzedelerin ihtiyaçlarının yetkililere (Doktor, Güvenlik) iletilmesini sağlayan web tabanlı bir projedir.

## Özellikler

- **3 Farklı Kullanıcı Rolü:**
  - **Kullanıcı (Afetzede):** Sisteme kayıt olur, engel durumu ve ihtiyaçlarını belirtir. Harita üzerinden konteyner konumunu işaretler.
  - **Doktor:** Harita üzerinde afetzedelerin konumlarını ve tıbbi ihtiyaçlarını görür.
  - **Güvenlik:** Harita üzerinde tüm konteynerları ve genel asayiş durumunu izler.
- **Haritalama:** Leaflet.js kullanılarak interaktif harita üzerinde konum işaretleme ve görüntüleme.
- **Veri Saklama:** Veriler tarayıcının LocalStorage alanında saklanır (Backend gerektirmez).

## Kurulum ve Çalıştırma

Bu proje herhangi bir sunucu kurulumu gerektirmez. Doğrudan tarayıcı üzerinde çalışır.

1. Proje klasörünü indirin.
2. `index.html` dosyasını bir web tarayıcısında (Chrome, Firefox, Edge vb.) açın.

## Kullanım Senaryosu

1. **Kayıt Ol:** `index.html` üzerinden yeni bir hesap oluşturun.
   - Örnek Roller: Doktor, Güvenlik, Kullanıcı.
2. **Giriş Yap:** Oluşturduğunuz hesap ile giriş yapın.
3. **Kullanıcı İseniz:**
   - Sol panelden "Konum Bildir" butonunu aktif etmek için haritada bulunduğunuz yere tıklayın.
   - "Konumu Kaydet" diyerek yerinizi bildirin.
4. **Yetkili İseniz (Doktor/Güvenlik):**
   - Harita üzerinde kayıtlı tüm konteynerları görebilirsiniz.
   - Sol paneldeki listeden kişilere tıklayarak haritada o kişiye odaklanabilirsiniz.
   - Filtreleme seçenekleri ile acil ihtiyaçları süzebilirsiniz.

## Demo Hesaplar

Sistem ilk açıldığında otomatik olarak aşağıdaki demo hesapları oluşturur:

- **Doktor:** k: `doktor`, ş: `123`
- **Güvenlik:** k: `guvenlik`, ş: `123`
- **Kullanıcı:** k: `user`, ş: `123`

## Teknolojiler

- HTML5, CSS3
- JavaScript (ES6+)
- Leaflet.js (Harita Kütüphanesi)
- Font Awesome (İkonlar)
