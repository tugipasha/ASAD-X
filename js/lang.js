const translations = {
    tr: {
        // Index
        "title_login": "ASAD-X - Giriş",
        "header_subtitle": "Afet Sonrası Acil Destek ve Haritalama Sistemi",
        "login_header": "Giriş Yap",
        "login_username": "Kullanıcı Adı",
        "login_password": "Şifre",
        "login_btn": "Giriş Yap",
        "no_account": "Hesabın yok mu?",
        "register_link": "Kayıt Ol",
        "register_header": "Kayıt Ol",
        "register_username": "Kullanıcı Adı",
        "register_name": "Ad Soyad",
        "register_password": "Şifre",
        "role_user": "Kullanıcı (Afetzede)",
        "role_doctor": "Doktor",
        "role_security": "Güvenlik Görevlisi",
        "disability_placeholder": "Engel Durumu (Varsa)",
        "needs_placeholder": "Acil İhtiyaçlar",
        "register_btn": "Kayıt Ol",
        "have_account": "Zaten hesabın var mı?",
        "login_link": "Giriş Yap",

        // Dashboard
        "title_dashboard": "ASAD-X - Panel",
        "logout": "Çıkış",
        "sidebar_header": "Konteynerlar / Kişiler",
        "stats_btn": "Durum İstatistikleri",
        "missing_btn": "Kayıp İlanları Panosu",
        "filter_label": "Filtrele:",
        "filter_all": "Tümü",
        "filter_emergency": "Sadece Acil Durumlar",
        "filter_medical": "İlaç/Tıbbi İhtiyaç",
        "filter_food": "Gıda/Su İhtiyacı",
        "filter_heating": "Isınma İhtiyacı",
        "filter_baby": "Bebek İhtiyacı",
        "resource_label": "Kaynak Noktaları:",
        "resource_water": "Su",
        "resource_food": "Yemek",
        "resource_medical": "Sağlık",
        "resource_tent": "Çadır",
        "add_resource_label": "Yardım Noktası Ekle:",
        "add_resource_desc": "Haritaya tıklayıp konum seçin, sonra ekleyin.",
        "resource_type_water": "Su Dağıtım",
        "resource_type_food": "Yemek Dağıtım",
        "resource_type_medical": "Sahra Hastanesi",
        "resource_type_tent": "Çadır Kent",
        "resource_qty_placeholder": "Miktar",
        "resource_unit_placeholder": "Birim (Adet/Lt)",
        "add_resource_btn": "Nokta Ekle",
        "announcement_label": "Duyuru Yayınla:",
        "announcement_title_placeholder": "Başlık",
        "announcement_content_placeholder": "Mesajınız...",
        "announcement_type_info": "Bilgilendirme (Mavi)",
        "announcement_type_warning": "Uyarı (Sarı)",
        "announcement_type_danger": "Acil Durum (Kırmızı)",
        "publish_btn": "Yayınla",
        "loading": "Yükleniyor...",
        "recent_activity": "Son Aktiviteler",
        "report_location": "Konum Bildir",
        "report_location_desc": "Haritaya tıklayarak veya GPS ile konumunuzu belirleyin.",
        "find_me_btn": "Konumumu Bul",
        "save_location_btn": "Konumu Kaydet",
        "smart_route": "Akıllı Rota (En Yakın)",
        "smart_route_desc": "Size en yakın yardım noktasını bulup rota çizer.",
        "report_status": "Durum ve İhtiyaç Bildir",
        "report_status_desc": "İhtiyaçlarınızı seçin ve barınma detaylarını girin.",
        "need_water": "Su",
        "need_food": "Gıda",
        "need_heating": "Isınma (Battaniye/Isıtıcı)",
        "need_medicine": "İlaç / Tıbbi Malzeme",
        "need_baby": "Bebek Ürünü (Mama/Bez)",
        "need_clothes": "Kıyafet",
        "shelter_placeholder": "Barınma Detayı (Örn: Konteyner A-12, Çadır 5)",
        "update_info_btn": "Bilgileri Güncelle",
        "emergency_header": "Acil Durum",
        "emergency_desc": "Hayati tehlike veya acil tıbbi yardım durumunda bu butona basın.",
        "emergency_btn": "ACİL YARDIM ÇAĞRISI",
        
        // Modals
        "missing_title": "Kayıp İlanları",
        "missing_persons_header": "Kayıp İlanları",
        "new_missing_header": "Yeni İlan Oluştur",
        "create_missing_report": "Yeni İlan Oluştur",
        "missing_name_placeholder": "Kayıp Kişinin Adı Soyadı",
        "missing_age_placeholder": "Yaş (Tahmini)",
        "missing_location_placeholder": "En Son Görüldüğü Yer",
        "missing_contact_placeholder": "İletişim Numarası",
        "missing_desc_placeholder": "Fiziksel özellikler, kıyafet vb. detaylar...",
        "publish_missing_btn": "İlan Yayınla",
        "current_missing_header": "Güncel İlanlar",
        "current_missing_reports": "Güncel İlanlar",
        "stats_title": "Afet Durum Paneli",
        "stats_header": "Afet Durum Paneli",
        "add_note_placeholder": "Notunuzu buraya yazın...",
        "notes_placeholder": "Notunuzu buraya yazın...",
        "add_note_btn": "Not Ekle",
        "resolve_emergency_btn": "Acil Durumu Çözüldü İşaretle",
        "loading_announcements": "Duyurular yükleniyor...",
        "notes_user_name": "Kullanıcı Adı",
        "label_age": "Yaş",
        "label_last_seen": "Son Konum",
        "label_contact": "İletişim",
        "announcement_urgent": "ACİL",
        "announcement_warning": "UYARI",
        "announcement_general": "DUYURU",
        "text_no_content": "İçerik yok",

        // JS Dynamic
        "alert_missing_fields": "Lütfen en azından İsim ve İletişim bilgilerini giriniz.",
        "alert_missing_published": "Kayıp ilanı yayınlandı.",
        "alert_delete_missing_confirm": "Bu kayıp ilanını kaldırmak istediğinize emin misiniz?",
        "text_unknown_location": "Bilinmiyor",
        "text_no_desc": "Açıklama yok.",
        "text_owner": "İlan Sahibi:",
        "alert_no_resource": "Bu türde kayıtlı bir yardım noktası bulunamadı.",
        "alert_nearest_found": "En yakın {type} bulundu! \nMesafe: {dist}\nHaritada rota çizildi.",
        "alert_location_error": "Konumunuz alınamadı. Lütfen GPS izni verin.",
        "text_total_users": "Toplam Kullanıcı",
        "text_emergency_users": "Acil Durum",
        "text_resource_dist": "Kaynak Dağılımı",
        "alert_info_updated": "Bilgileriniz başarıyla güncellendi.",
        "alert_update_error": "Güncelleme sırasında bir hata oluştu.",
        "text_location_found": "Konum Bulundu",
        "text_finding_location": "Konum Aranıyor...",
        "alert_location_not_found": "Konum bulunamadı: ",
        "text_help_requested": "YARDIM İSTENDİ",
        "confirm_emergency": "DİKKAT! Bu butona sadece hayati tehlike veya acil tıbbi yardım durumunda basınız. Yetkililere konumunuz ve acil durum çağrınız iletilecektir. Onaylıyor musunuz?",
        "alert_help_sent": "Acil yardım çağrınız yetkililere iletildi!",
        "alert_location_updated": "Konumunuz başarıyla güncellendi!",
        "alert_location_saved": "Konumunuz başarıyla kaydedildi!",
        "text_location_selected": "Konum Seçildi",
        "alert_resource_added": "Yardım noktası başarıyla eklendi!",
        "confirm_delete_resource": "Bu yardım noktası silmek istediğinize emin misiniz?",
        "alert_resource_deleted": "Yardım noktası silindi.",
        "alert_delete_failed": "Silme işlemi başarısız.",
        "confirm_resolve_emergency": "Bu kullanıcının acil durumunu \"Çözüldü\" olarak işaretlemek istediğinize emin misiniz?",
        "alert_emergency_resolved": "Acil durum çözüldü olarak işaretlendi.",
        "alert_note_added": "Not eklendi.",
        "text_no_notes": "Henüz not eklenmemiş.",
        "text_no_records": "Kayıt bulunamadı.",
        "text_no_activity": "Henüz aktivite yok.",
        "text_your_container": "Sizin Konteyneriniz",
        "text_no_location_reported": "Henüz bir konum bildirmediniz.",
        "text_container_registered": "Konteyner konumunuz kayıtlı.",
        "btn_update_location": "Konumu Güncelle",
        "text_new_resource_added": "Yeni <strong>{type}</strong> eklendi.",
        "text_emergency_call": "<strong>{name}</strong> acil yardım çağrısı yaptı!",
        "text_note_added_log": "<strong>{name}</strong> için not eklendi: \"{note}...\"",
        "role_doctor_name": "Doktor",
        "role_security_name": "Güvenlik",
        "role_victim_name": "Afetzede",
        "role_user_name": "Kullanıcı",
        "text_status_stabil": "Stabil",
        "text_status_emergency": "ACİL",
        "text_shelter": "Barınma:",
        "text_needs": "İhtiyaçlar:",
        "text_disability": "Engel:",
        "text_status": "Durum:",
        "text_unspecified": "Belirtilmemiş",
        "text_none": "Yok",
        "btn_notes_actions": "Notlar & İşlemler",
        "text_needs_unspecified": "İhtiyaç belirtilmemiş",
        "text_current_stock": "Mevcut Stok",
        "text_added_by": "Ekleyen:",
        "btn_delete": "Sil",
        "btn_remove": "Kaldır"
    },
    en: {
        // Index
        "title_login": "ASAD-X - Login",
        "header_subtitle": "Post-Disaster Emergency Support and Mapping System",
        "login_header": "Login",
        "login_username": "Username",
        "login_password": "Password",
        "login_btn": "Login",
        "no_account": "Don't have an account?",
        "register_link": "Register",
        "register_header": "Register",
        "register_username": "Username",
        "register_name": "Full Name",
        "register_password": "Password",
        "role_user": "User (Victim)",
        "role_doctor": "Doctor",
        "role_security": "Security Guard",
        "disability_placeholder": "Disability Status (If any)",
        "needs_placeholder": "Urgent Needs",
        "register_btn": "Register",
        "have_account": "Already have an account?",
        "login_link": "Login",

        // Dashboard
        "title_dashboard": "ASAD-X - Dashboard",
        "logout": "Logout",
        "sidebar_header": "Containers / People",
        "stats_btn": "Status Statistics",
        "missing_btn": "Missing Persons Board",
        "filter_label": "Filter:",
        "filter_all": "All",
        "filter_emergency": "Emergency Only",
        "filter_medical": "Medicine/Medical Needs",
        "filter_food": "Food/Water Needs",
        "filter_heating": "Heating Needs",
        "filter_baby": "Baby Needs",
        "resource_label": "Resource Points:",
        "resource_water": "Water",
        "resource_food": "Food",
        "resource_medical": "Medical",
        "resource_tent": "Tent",
        "add_resource_label": "Add Resource Point:",
        "add_resource_desc": "Click on map to select location, then add.",
        "resource_type_water": "Water Distribution",
        "resource_type_food": "Food Distribution",
        "resource_type_medical": "Field Hospital",
        "resource_type_tent": "Tent City",
        "resource_qty_placeholder": "Quantity",
        "resource_unit_placeholder": "Unit (Pcs/Lt)",
        "add_resource_btn": "Add Point",
        "announcement_label": "Publish Announcement:",
        "announcement_title_placeholder": "Title",
        "announcement_content_placeholder": "Message...",
        "announcement_type_info": "Info (Blue)",
        "announcement_type_warning": "Warning (Yellow)",
        "announcement_type_danger": "Emergency (Red)",
        "publish_btn": "Publish",
        "loading": "Loading...",
        "recent_activity": "Recent Activity",
        "report_location": "Report Location",
        "report_location_desc": "Determine your location by clicking on the map or using GPS.",
        "find_me_btn": "Find Me",
        "save_location_btn": "Save Location",
        "smart_route": "Smart Route (Nearest)",
        "smart_route_desc": "Finds the nearest help point and draws a route.",
        "report_status": "Report Status & Needs",
        "report_status_desc": "Select your needs and enter shelter details.",
        "need_water": "Water",
        "need_food": "Food",
        "need_heating": "Heating (Blanket/Heater)",
        "need_medicine": "Medicine / Medical Supplies",
        "need_baby": "Baby Products (Food/Diapers)",
        "need_clothes": "Clothes",
        "shelter_placeholder": "Shelter Detail (e.g. Container A-12, Tent 5)",
        "update_info_btn": "Update Info",
        "emergency_header": "Emergency",
        "emergency_desc": "Press this button ONLY in case of life-threatening danger or urgent medical help.",
        "emergency_btn": "EMERGENCY CALL",
        
        // Modals
        "missing_title": "Missing Persons",
        "missing_persons_header": "Missing Persons",
        "new_missing_header": "Create New Report",
        "create_missing_report": "Create New Report",
        "missing_name_placeholder": "Missing Person Name",
        "missing_age_placeholder": "Age (Estimated)",
        "missing_location_placeholder": "Last Seen Location",
        "missing_contact_placeholder": "Contact Number",
        "missing_desc_placeholder": "Physical features, clothes etc...",
        "publish_missing_btn": "Publish Report",
        "current_missing_header": "Current Reports",
        "current_missing_reports": "Current Reports",
        "stats_title": "Disaster Status Panel",
        "stats_header": "Disaster Status Panel",
        "add_note_placeholder": "Write your note here...",
        "notes_placeholder": "Write your note here...",
        "add_note_btn": "Add Note",
        "resolve_emergency_btn": "Mark Emergency as Resolved",
        "loading_announcements": "Loading announcements...",
        "notes_user_name": "User Name",
        "label_age": "Age",
        "label_last_seen": "Last Seen",
        "label_contact": "Contact",
        "announcement_urgent": "URGENT",
        "announcement_warning": "WARNING",
        "announcement_general": "ANNOUNCEMENT",
        "text_no_content": "No content",

        // JS Dynamic
        "alert_missing_fields": "Please enter at least Name and Contact information.",
        "alert_missing_published": "Missing person report published.",
        "alert_delete_missing_confirm": "Are you sure you want to remove this missing person report?",
        "text_unknown_location": "Unknown",
        "text_no_desc": "No description.",
        "text_owner": "Owner:",
        "alert_no_resource": "No resource point of this type found.",
        "alert_nearest_found": "Nearest {type} found! \nDistance: {dist}\nRoute drawn on map.",
        "alert_location_error": "Could not get your location. Please allow GPS access.",
        "text_total_users": "Total Users",
        "text_emergency_users": "Emergency",
        "text_resource_dist": "Resource Distribution",
        "alert_info_updated": "Your information has been successfully updated.",
        "alert_update_error": "An error occurred during update.",
        "text_location_found": "Location Found",
        "text_finding_location": "Finding Location...",
        "alert_location_not_found": "Location not found: ",
        "text_help_requested": "HELP REQUESTED",
        "confirm_emergency": "WARNING! Press this button ONLY in case of life-threatening danger or urgent medical help. Your location and emergency call will be sent to authorities. Do you confirm?",
        "alert_help_sent": "Your emergency call has been sent to authorities!",
        "alert_location_updated": "Your location has been successfully updated!",
        "alert_location_saved": "Your location has been successfully saved!",
        "text_location_selected": "Location Selected",
        "alert_resource_added": "Resource point successfully added!",
        "confirm_delete_resource": "Are you sure you want to delete this resource point?",
        "alert_resource_deleted": "Resource point deleted.",
        "alert_delete_failed": "Deletion failed.",
        "confirm_resolve_emergency": "Are you sure you want to mark this user's emergency as \"Resolved\"?",
        "alert_emergency_resolved": "Emergency marked as resolved.",
        "alert_note_added": "Note added.",
        "text_no_notes": "No notes yet.",
        "text_no_records": "No records found.",
        "text_no_activity": "No activity yet.",
        "text_your_container": "Your Container",
        "text_no_location_reported": "You haven't reported a location yet.",
        "text_container_registered": "Your container location is registered.",
        "btn_update_location": "Update Location",
        "text_new_resource_added": "New <strong>{type}</strong> added.",
        "text_emergency_call": "<strong>{name}</strong> made an emergency call!",
        "text_note_added_log": "Note added for <strong>{name}</strong>: \"{note}...\"",
        "role_doctor_name": "Doctor",
        "role_security_name": "Security",
        "role_victim_name": "Victim",
        "role_user_name": "User",
        "text_status_stabil": "Stable",
        "text_status_emergency": "EMERGENCY",
        "text_shelter": "Shelter:",
        "text_needs": "Needs:",
        "text_disability": "Disability:",
        "text_status": "Status:",
        "text_unspecified": "Unspecified",
        "text_none": "None",
        "btn_notes_actions": "Notes & Actions",
        "text_needs_unspecified": "Needs unspecified",
        "text_current_stock": "Current Stock",
        "text_added_by": "Added by:",
        "btn_delete": "Delete",
        "btn_remove": "Remove"
    }
};

function setLanguage(lang) {
    localStorage.setItem('asadx_lang', lang);
    document.documentElement.lang = lang;
    
    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // Update options in selects
    document.querySelectorAll('option[data-i18n]').forEach(element => {
         const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Trigger custom event so other scripts can react
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
}

function t(key, params = {}) {
    const lang = localStorage.getItem('asadx_lang') || 'tr';
    let text = translations[lang][key] || key;
    
    for (const param in params) {
        text = text.replace(`{${param}}`, params[param]);
    }
    return text;
}

function initLanguage() {
    const savedLang = localStorage.getItem('asadx_lang') || 'tr';
    setLanguage(savedLang);
    
    // Add language switcher if not exists
    if (!document.getElementById('lang-switcher')) {
        const switcher = document.createElement('div');
        switcher.id = 'lang-switcher';
        switcher.style.zIndex = '9999';
        switcher.style.display = 'flex';
        switcher.style.gap = '5px';
        switcher.style.alignItems = 'center';
        
        const btnTr = document.createElement('button');
        btnTr.textContent = 'TR';
        btnTr.onclick = (e) => { e.preventDefault(); setLanguage('tr'); };
        btnTr.style.padding = '5px 10px';
        btnTr.style.cursor = 'pointer';
        btnTr.style.border = '1px solid #ddd';
        btnTr.style.borderRadius = '3px';
        btnTr.style.background = 'white';
        btnTr.style.fontWeight = 'bold';
        btnTr.style.color = '#333';
        
        const btnEn = document.createElement('button');
        btnEn.textContent = 'EN';
        btnEn.onclick = (e) => { e.preventDefault(); setLanguage('en'); };
        btnEn.style.padding = '5px 10px';
        btnEn.style.cursor = 'pointer';
        btnEn.style.border = '1px solid #ddd';
        btnEn.style.borderRadius = '3px';
        btnEn.style.background = 'white';
        btnEn.style.fontWeight = 'bold';
        btnEn.style.color = '#333';
        
        switcher.appendChild(btnTr);
        switcher.appendChild(btnEn);
        
        // Placement logic
        const nav = document.querySelector('nav');
        if (nav) {
             // In dashboard, put it in nav
             nav.appendChild(switcher);
        } else {
            // In login page, put it top right
            switcher.style.position = 'absolute';
            switcher.style.top = '15px';
            switcher.style.right = '15px';
            document.body.appendChild(switcher);
        }
    }
}

document.addEventListener('DOMContentLoaded', initLanguage);
