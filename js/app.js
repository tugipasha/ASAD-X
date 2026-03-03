
// Ana Uygulama Mantığı

document.addEventListener('DOMContentLoaded', () => {
    // Oturum Kontrolü
    const currentUser = DataManager.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Kullanıcı Bilgilerini Göster
    document.getElementById('userNameDisplay').textContent = currentUser.name;
    document.getElementById('userRoleDisplay').textContent = getRoleName(currentUser.role);

    // Çıkış İşlemi
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        DataManager.logout();
        window.location.href = 'index.html';
    });

    // --- KAYIP İLANLARI (YENİ) ---
    const openMissingBtn = document.getElementById('openMissingPersonsBtn');
    const closeMissingBtn = document.querySelector('.close-missing-modal');
    const addMissingBtn = document.getElementById('addMissingPersonBtn');
    const missingModal = document.getElementById('missingPersonsModal');

    if (openMissingBtn) {
        openMissingBtn.addEventListener('click', () => {
            if (missingModal) {
                missingModal.style.display = 'block';
                loadMissingPersons();
            }
        });
    }

    // --- AI RAPORLARI (YENİ) ---
    const getAiReportBtn = document.getElementById('getAiReportBtn');
    if (getAiReportBtn) {
        getAiReportBtn.addEventListener('click', async () => {
            const userId = getAiReportBtn.getAttribute('data-user-id');
            if (!userId) return;

            const originalText = getAiReportBtn.innerHTML;
            getAiReportBtn.disabled = true;
            getAiReportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rapor Hazırlanıyor...';

            try {
                const report = await AiManager.generateUserSummary(userId);
                const reportDiv = document.getElementById('aiReportContent');
                if (reportDiv) {
                    reportDiv.innerHTML = report.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
                    reportDiv.style.display = 'block';
                }
            } catch (error) {
                console.error('Rapor hatası:', error);
                alert('Rapor hazırlanırken bir hata oluştu.');
            } finally {
                getAiReportBtn.disabled = false;
                getAiReportBtn.innerHTML = originalText;
            }
        });
    }

    if (closeMissingBtn) {
        closeMissingBtn.addEventListener('click', () => {
            if (missingModal) missingModal.style.display = 'none';
        });
    }

    if (addMissingBtn) {
        addMissingBtn.addEventListener('click', () => {
            const name = document.getElementById('missingName').value;
            const age = document.getElementById('missingAge').value;
            const location = document.getElementById('missingLocation').value;
            const contact = document.getElementById('missingContact').value;
            const description = document.getElementById('missingDescription').value;

            if (!name || !contact) {
                alert('Lütfen en azından İsim ve İletişim bilgilerini giriniz.');
                return;
            }

            const currentUser = DataManager.getCurrentUser();
            const newPerson = {
                name,
                age,
                location,
                contact,
                description,
                addedBy: currentUser.name,
                addedById: currentUser.id
            };

            DataManager.saveMissingPerson(newPerson);
            alert('Kayıp ilanı yayınlandı.');
            
            // Formu temizle
            document.getElementById('missingName').value = '';
            document.getElementById('missingAge').value = '';
            document.getElementById('missingLocation').value = '';
            document.getElementById('missingContact').value = '';
            document.getElementById('missingDescription').value = '';
            
            loadMissingPersons();
        });
    }

    function loadMissingPersons() {
        const listDiv = document.getElementById('missingPersonsList');
        if (!listDiv) return;
        
        const persons = DataManager.getMissingPersons();
        listDiv.innerHTML = '';

        if (persons.length === 0) {
            listDiv.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">' + t('text_no_records') + '</p>';
            return;
        }

        // Yeniden eskiye sırala
        persons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        persons.forEach(p => {
            const div = document.createElement('div');
            div.style.background = 'white';
            div.style.border = '1px solid #eee';
            div.style.padding = '10px';
            div.style.marginBottom = '10px';
            div.style.borderRadius = '5px';
            div.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            
            const currentUser = DataManager.getCurrentUser();
            let deleteBtn = '';
            if (currentUser.role !== 'kullanici' || currentUser.id === p.addedById) {
                deleteBtn = `
                    <button onclick="deleteMissingPerson('${p.id}')" style="float:right; background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer; font-size:0.8rem;">
                        <i class="fas fa-trash"></i> ` + t('btn_remove') + `
                    </button>
                `;
            }

            div.innerHTML = `
                ${deleteBtn}
                <h4 style="margin:0; color:#c0392b;">${p.name} <small style="color:#666; font-weight:normal;">(${p.age || '?'} ` + t('label_age') + `)</small></h4>
                <small style="color:#999;">${new Date(p.createdAt).toLocaleDateString()}</small>
                <div style="margin-top:5px; font-size:0.9rem;">
                    <p style="margin:2px 0;"><strong>` + t('label_last_seen') + `:</strong> ${p.location || t('text_unknown_location')}</p>
                    <p style="margin:2px 0;"><strong>` + t('label_contact') + `:</strong> ${p.contact}</p>
                    <p style="margin:5px 0; color:#555; font-style:italic;">"${p.description || t('text_no_desc')}"</p>
                    <p style="margin:0; font-size:0.8rem; color:#999; margin-top:5px;">` + t('text_added_by') + ` ${p.addedBy}</p>
                </div>
            `;
            listDiv.appendChild(div);
        });
    }

    window.deleteMissingPerson = function(id) {
        if (confirm('Bu kayıp ilanını kaldırmak istediğinize emin misiniz?')) {
            if (DataManager.deleteMissingPerson(id)) {
                loadMissingPersons();
            }
        }
    };

    // Haritayı Başlat
    MapManager.init('map', [37.0662, 37.3833]); // Varsayılan Gaziantep

    // Rol Bazlı İşlemler
    if (currentUser.role === 'kullanici') {
        setupUserInterface(currentUser);
    } else {
        setupOfficialInterface(currentUser);
    }

    // Haritadaki verileri yükle
    loadMapData();

    // Modal Dışına Tıklayınca Kapatma (Global)
    window.onclick = function(event) {
        const notesModal = document.getElementById('notesModal');
        const missingModal = document.getElementById('missingPersonsModal');
        const statsModal = document.getElementById('statsModal');
        
        if (notesModal && event.target == notesModal) {
            notesModal.style.display = 'none';
        }
        if (missingModal && event.target == missingModal) {
            missingModal.style.display = 'none';
        }
        if (statsModal && event.target == statsModal) {
            statsModal.style.display = 'none';
        }
    };

    // Yeni Özellikler: Duyurular, Akıllı Rota, İstatistikler
    setupAnnouncements();
    setupSmartRoute();
    setupStatistics();
});

// --- DUYURU SİSTEMİ ---
function setupAnnouncements() {
    loadAnnouncements();

    // Duyuru Kapatma Butonu
    const closeTickerBtn = document.getElementById('closeTickerBtn');
    if (closeTickerBtn) {
        closeTickerBtn.addEventListener('click', () => {
            document.getElementById('announcementTicker').style.display = 'none';
        });
    }

    // Yetkili için Duyuru Ekleme Formu
    const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
    if (addAnnouncementBtn) {
        // Duyuru Listesi Alanı Oluştur
        const announcementListDiv = document.createElement('div');
        announcementListDiv.id = 'adminAnnouncementList';
        announcementListDiv.style.marginTop = '15px';
        announcementListDiv.style.borderTop = '1px solid #ddd';
        announcementListDiv.style.paddingTop = '10px';
        addAnnouncementBtn.parentNode.appendChild(announcementListDiv);

        // Listeyi yükle
        loadAdminAnnouncementList();

        addAnnouncementBtn.addEventListener('click', () => {
            const title = document.getElementById('announcementTitle').value;
            const content = document.getElementById('announcementContent').value;
            const type = document.getElementById('announcementType').value;

            if (title && content) {
                const newAnnouncement = {
                    text: `${title}: ${content}`,
                    type: type, // 'info', 'warning', 'danger'
                    date: new Date().toISOString(),
                    author: DataManager.getCurrentUser().name
                };

                DataManager.addAnnouncement(newAnnouncement);
                alert('Duyuru yayınlandı!');
                document.getElementById('announcementTitle').value = '';
                document.getElementById('announcementContent').value = '';
                loadAnnouncements(); // Ticker'ı güncelle
                loadAdminAnnouncementList(); // Listeyi güncelle
            } else {
                alert('Lütfen başlık ve içerik giriniz.');
            }
        });
    }
}

function loadAdminAnnouncementList() {
    const listDiv = document.getElementById('adminAnnouncementList');
    if (!listDiv) return;

    const announcements = DataManager.getAnnouncements();
    listDiv.innerHTML = '<h5 style="margin-bottom:5px;">Aktif Duyurular</h5>';

    if (announcements.length === 0) {
        listDiv.innerHTML += '<p style="font-size:0.8rem; color:#999;">Duyuru yok.</p>';
        return;
    }

    announcements.forEach(a => {
        const div = document.createElement('div');
        div.style.background = '#f9f9f9';
        div.style.padding = '5px';
        div.style.marginBottom = '5px';
        div.style.borderRadius = '3px';
        div.style.fontSize = '0.8rem';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';

        // Metni kırp
        let text = a.text || 'İçerik yok';
        if (text.length > 30) text = text.substring(0, 30) + '...';

        div.innerHTML = `
            <span style="color:${a.type === 'danger' ? 'red' : (a.type === 'warning' ? '#e67e22' : '#3498db')}">
                ${text}
            </span>
            <button onclick="deleteAnnouncement('${a.id}')" style="border:none; background:none; color:#e74c3c; cursor:pointer;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        listDiv.appendChild(div);
    });
}

// Global Duyuru Silme
window.deleteAnnouncement = function(id) {
    if (confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) {
        if (DataManager.deleteAnnouncement(id)) {
            loadAnnouncements(); // Ticker'ı güncelle
            loadAdminAnnouncementList(); // Listeyi güncelle
        }
    }
};

function loadAnnouncements() {
    const ticker = document.getElementById('announcementTicker');
    const tickerText = document.getElementById('tickerText');
    if (!ticker || !tickerText) return;
    
    const announcements = DataManager.getAnnouncements();
    
    // Son 24 saatteki duyuruları al
    const recentAnnouncements = announcements.filter(a => {
        const timeDiff = new Date() - new Date(a.date);
        return timeDiff < 24 * 60 * 60 * 1000; // 1 gün
    });

    if (recentAnnouncements.length > 0) {
        ticker.style.display = 'flex';
        
        // Basitçe hepsini birleştirip gösterelim
        const textContent = recentAnnouncements.map(a => {
            let prefix = '';
            if (a.type === 'danger') prefix = '⚠️ ' + t('announcement_urgent') + ': ';
            else if (a.type === 'warning') prefix = '⚠️ ' + t('announcement_warning') + ': ';
            else prefix = '📢 ' + t('announcement_general') + ': ';
            
            // Geriye dönük uyumluluk ve undefined kontrolü
            let message = t('text_no_content');
            if (a.text && a.text !== 'undefined') {
                message = a.text;
            } else if (a.title || a.content) {
                const title = (a.title && a.title !== 'undefined') ? a.title : '';
                const content = (a.content && a.content !== 'undefined') ? a.content : '';
                if (title && content) message = `${title}: ${content}`;
                else if (content) message = content;
                else if (title) message = title;
            }

            return `${prefix}${message} (${new Date(a.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`;
        }).join('  |  ');

        tickerText.textContent = textContent;
    } else {
        ticker.style.display = 'none';
    }
}

// --- AKILLI ROTA ---
function setupSmartRoute() {
    // Butonlara tıklama olaylarını ekle
    document.querySelectorAll('.btn-smart-route').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            findAndRouteToResource(type);
        });
    });
}

function findAndRouteToResource(type) {
    // Önce kullanıcının konumunu bul
    MapManager.locateUser((userLat, userLng) => {
        const resources = DataManager.getResources();
        
        // İstenen tipteki kaynakları filtrele
        const targetResources = resources.filter(r => r.type === type);
        
        if (targetResources.length === 0) {
            alert('Bu türde kayıtlı bir yardım noktası bulunamadı.');
            return;
        }

        // En yakını bul
        let nearest = null;
        let minDistance = Infinity;

        targetResources.forEach(res => {
            const dist = MapManager.map.distance([userLat, userLng], [res.lat, res.lng]);
            if (dist < minDistance) {
                minDistance = dist;
                nearest = res;
            }
        });

        if (nearest) {
            // Rotayı Çiz
            drawRoute([userLat, userLng], [nearest.lat, nearest.lng]);
            
            // Bilgi Ver
            const distStr = minDistance > 1000 ? (minDistance/1000).toFixed(1) + ' km' : Math.round(minDistance) + ' m';
            alert(`En yakın ${getResourceName(type)} bulundu! \nMesafe: ${distStr}\nHaritada rota çizildi.`);
        }
    }, (error) => {
        alert('Konumunuz alınamadı. Lütfen GPS izni verin.');
    });
}

let currentRouteLine = null;

function drawRoute(start, end) {
    // Varsa eski rotayı sil
    if (currentRouteLine) {
        MapManager.map.removeLayer(currentRouteLine);
    }

    // Basit bir kesikli çizgi (Polyline)
    currentRouteLine = L.polyline([start, end], {
        color: 'blue',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10', // Kesikli çizgi
        lineCap: 'round'
    }).addTo(MapManager.map);

    // Haritayı bu rotaya odakla
    MapManager.map.fitBounds(currentRouteLine.getBounds(), {padding: [50, 50]});
}

// --- İSTATİSTİKLER ---
function setupStatistics() {
    const existingStatsBtn = document.getElementById('showStatsBtn');
    if (existingStatsBtn) {
        existingStatsBtn.addEventListener('click', openStatsModal);
    }

    // Modal Kapatma
    const closeStatsBtn = document.querySelector('.close-stats-modal');
    if (closeStatsBtn) {
        closeStatsBtn.addEventListener('click', () => {
            document.getElementById('statsModal').style.display = 'none';
        });
    }

    // Explicit modal initialization fix
    const statsModal = document.getElementById('statsModal');
    if (statsModal) {
        statsModal.style.zIndex = '3000';
    }
}

function openStatsModal() {
    const modal = document.getElementById('statsModal');
    if (!modal) return;

    // Verileri Hesapla
    const users = DataManager.getUsers();
    const resources = DataManager.getResources();

    const totalUsers = users.length;
    const emergencyCount = users.filter(u => u.isEmergency).length;
    const safeCount = totalUsers - emergencyCount;

    const resourceCounts = {
        water: resources.filter(r => r.type === 'water').length,
        food: resources.filter(r => r.type === 'food').length,
        medical: resources.filter(r => r.type === 'medical').length,
        tent: resources.filter(r => r.type === 'tent').length
    };

    const content = document.getElementById('statsContent');
    if (content) {
        content.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px;">
                <div style="background:#f8f9fa; padding:15px; border-radius:8px; text-align:center;">
                    <h3 style="color:#2c3e50; font-size:2rem; margin:0;">${totalUsers}</h3>
                    <p style="color:#7f8c8d; margin:0;">` + t('text_total_users') + `</p>
                </div>
                <div style="background:#ffebee; padding:15px; border-radius:8px; text-align:center;">
                    <h3 style="color:#e74c3c; font-size:2rem; margin:0;">${emergencyCount}</h3>
                    <p style="color:#c0392b; margin:0;">` + t('text_emergency_users') + `</p>
                </div>
            </div>
    
            <h4 style="margin-top:20px; border-bottom:1px solid #eee; padding-bottom:5px;">` + t('text_resource_dist') + `</h4>
            <div style="margin-top:10px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span><i class="fas fa-faucet" style="color:#3498db"></i> ` + t('resource_water') + `</span>
                    <strong>${resourceCounts.water}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span><i class="fas fa-utensils" style="color:#e67e22"></i> ` + t('resource_food') + `</span>
                    <strong>${resourceCounts.food}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span><i class="fas fa-clinic-medical" style="color:#e74c3c"></i> ` + t('resource_medical') + `</span>
                    <strong>${resourceCounts.medical}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span><i class="fas fa-campground" style="color:#27ae60"></i> ` + t('resource_tent') + `</span>
                    <strong>${resourceCounts.tent}</strong>
                </div>
            </div>
        `;
    }

    modal.style.display = 'block';
}

function getRoleName(role) {
    switch(role) {
        case 'doktor': return t('role_doctor_name');
        case 'guvenlik': return t('role_security_name');
        case 'kullanici': return t('role_victim_name');
        default: return t('role_user_name');
    }
}

// --- KULLANICI ARAYÜZÜ ---
function setupUserInterface(user) {
    const userActions = document.getElementById('userActions');
    const saveLocationBtn = document.getElementById('saveLocationBtn');
    const findMeBtn = document.getElementById('findMeBtn');
    
    userActions.style.display = 'block';

    // Kullanıcının zaten bir konteyneri var mı?
    const containers = DataManager.getContainers();
    const myContainer = containers.find(c => c.userId === user.id);

    let selectedLat = null;
    let selectedLng = null;

    if (myContainer) {
        // Varsa haritada göster
        MapManager.centerMap(myContainer.lat, myContainer.lng);
        MapManager.addMarker(myContainer.lat, myContainer.lng, "Sizin Konteyneriniz");
        document.getElementById('listContainer').innerHTML = '<p>Konteyner konumunuz kayıtlı.</p>';
        saveLocationBtn.textContent = 'Konumu Güncelle';
    } else {
        document.getElementById('listContainer').innerHTML = '<p>Henüz bir konum bildirmediniz.</p>';
    }

    // Harita tıklama özelliğini aç
    MapManager.enableLocationSelection((lat, lng) => {
        selectedLat = lat;
        selectedLng = lng;
        saveLocationBtn.disabled = false;
    });

    // İhtiyaç ve Barınma Bilgilerini Yükle
    if (user.needsList) {
        user.needsList.forEach(need => {
            const checkbox = document.querySelector(`input[name="need"][value="${need}"]`);
            if (checkbox) checkbox.checked = true;
        });
    } else if (user.needs) {
        // needsList yoksa ama metin olarak needs varsa, checkboxları eşleştirmeye çalış
        const needsLower = user.needs.toLowerCase();
        document.querySelectorAll('input[name="need"]').forEach(checkbox => {
            if (needsLower.includes(checkbox.value.toLowerCase())) {
                checkbox.checked = true;
            }
        });
    }
    if (user.shelterInfo) {
        document.getElementById('shelterInfo').value = user.shelterInfo;
    }
    if (user.occupancy) {
        document.getElementById('occupancyCount').value = user.occupancy;
    }

    // Bilgileri Güncelle Butonu
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    updateStatusBtn.addEventListener('click', () => {
        const selectedNeeds = [];
        document.querySelectorAll('input[name="need"]:checked').forEach(checkbox => {
            selectedNeeds.push(checkbox.value);
        });

        const shelterInfo = document.getElementById('shelterInfo').value;
        const occupancyCount = document.getElementById('occupancyCount').value;

        // Kullanıcı nesnesini güncelle
        user.needsList = selectedNeeds;
        user.shelterInfo = shelterInfo;
        user.occupancy = occupancyCount ? parseInt(occupancyCount) : 1;
        
        // Eski "needs" alanını da geriye dönük uyumluluk için güncelle (opsiyonel ama iyi olur)
        user.needs = selectedNeeds.join(", ");
        if (user.isEmergency) {
            user.needs += (user.needs ? ", " : "") + "ACİL YARDIM";
        }

        if (DataManager.updateUser(user)) {
            alert('Bilgileriniz başarıyla güncellendi.');
            loadMapData(); // Haritayı yenile ki popup güncellensin
        } else {
            alert('Güncelleme sırasında bir hata oluştu.');
        }
    });

    // Konumumu Bul Butonu
    findMeBtn.addEventListener('click', () => {
        findMeBtn.disabled = true;
        findMeBtn.textContent = 'Konum Aranıyor...';
        
        MapManager.locateUser(
            (lat, lng) => {
                // Konum bulundu
                selectedLat = lat;
                selectedLng = lng;
                saveLocationBtn.disabled = false;
                findMeBtn.disabled = false;
                findMeBtn.innerHTML = '<i class="fas fa-check"></i> Konum Bulundu';
                setTimeout(() => {
                    findMeBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Konumumu Bul';
                }, 3000);
            },
            (errorMessage) => {
                // Hata
                alert('Konum bulunamadı: ' + errorMessage);
                findMeBtn.disabled = false;
                findMeBtn.textContent = 'Tekrar Dene';
            }
        );
    });

    // Acil Durum Butonu
    const emergencyBtn = document.getElementById('emergencyBtn');
    
    // Kullanıcının mevcut durumunu kontrol et
    if (user.isEmergency) {
        emergencyBtn.innerHTML = '<i class="fas fa-check"></i> YARDIM İSTENDİ';
        emergencyBtn.disabled = true;
    }

    emergencyBtn.addEventListener('click', () => {
        if (confirm('DİKKAT! Bu butona sadece hayati tehlike veya acil tıbbi yardım durumunda basınız. Yetkililere konumunuz ve acil durum çağrınız iletilecektir. Onaylıyor musunuz?')) {
            // Kullanıcıyı güncelle
            user.isEmergency = true;
            user.emergencyTime = new Date().toISOString();
            user.needs = (user.needs ? user.needs + ", " : "") + "ACİL YARDIM";
            
            DataManager.updateUser(user);
            
            // Konteyner varsa onu da güncelle (opsiyonel ama iyi olur)
            // Şimdilik sadece user üzerinden gidiyoruz çünkü harita user'a bakıyor.

            alert('Acil yardım çağrınız yetkililere iletildi!');
            emergencyBtn.innerHTML = '<i class="fas fa-check"></i> YARDIM İSTENDİ';
            emergencyBtn.disabled = true;
            
            // Haritayı yenile
            loadMapData();
        }
    });

    saveLocationBtn.addEventListener('click', () => {
        if (selectedLat && selectedLng) {
            const containerData = {
                userId: user.id,
                lat: selectedLat,
                lng: selectedLng,
                type: 'standard', // İleride geliştirilebilir
                notes: user.needs // Kullanıcının ihtiyaçlarını nota ekleyelim
            };

            // Kullanıcının zaten bir konteyneri var mı kontrol et
            const existingContainer = DataManager.getContainers().find(c => c.userId === user.id);

            if (existingContainer) {
                // Güncelle
                DataManager.updateContainer(containerData);
                alert('Konumunuz başarıyla güncellendi!');
            } else {
                // Yeni Ekle
                DataManager.saveContainer(containerData);
                alert('Konumunuz başarıyla kaydedildi!');
            }
            
            window.location.reload(); // Sayfayı yenile ki harita güncellensin
        }
    });
}

// --- YETKİLİ (DOKTOR/GÜVENLİK) ARAYÜZÜ ---
function setupOfficialInterface(user) {
    const sidebarHeader = document.getElementById('sidebarHeader');
    const filterControls = document.getElementById('filterControls');
    const listContainer = document.getElementById('listContainer');
    const filterSelect = document.getElementById('filterNeeds');

    filterControls.style.display = 'block';

    // Filtreleme mantığı
    filterSelect.addEventListener('change', () => {
        loadMapData(filterSelect.value);
    });

    // Kaynak Filtreleme (Yeni)
    document.querySelectorAll('.resource-filter').forEach(cb => {
        cb.addEventListener('change', () => {
            loadMapData(filterSelect.value);
        });
    });

    // Kaynak Ekleme Mantığı
    const addResourceBtn = document.getElementById('addResourceBtn');
    const resourceType = document.getElementById('resourceType');
    let selectedResourceLat = null;
    let selectedResourceLng = null;

    // Harita tıklama özelliğini yetkili için de aç (kaynak eklemek için)
    MapManager.enableLocationSelection((lat, lng) => {
        selectedResourceLat = lat;
        selectedResourceLng = lng;
        addResourceBtn.disabled = false;
        addResourceBtn.innerHTML = `<i class="fas fa-check"></i> Konum Seçildi (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    });

    addResourceBtn.addEventListener('click', () => {
        if (!selectedResourceLat || !selectedResourceLng) return;

        const type = resourceType.value;
        const quantity = document.getElementById('resourceQuantity').value;
        const unit = document.getElementById('resourceUnit').value;

        const newResource = {
            type: type,
            lat: selectedResourceLat,
            lng: selectedResourceLng,
            addedBy: user.name,
            createdAt: new Date().toISOString(),
            quantity: quantity ? parseInt(quantity) : 0,
            unit: unit || 'Adet'
        };

        DataManager.saveResource(newResource);
        alert('Yardım noktası başarıyla eklendi!');
        
        // Reset
        addResourceBtn.disabled = true;
        addResourceBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Nokta Ekle';
        document.getElementById('resourceQuantity').value = '';
        document.getElementById('resourceUnit').value = '';
        selectedResourceLat = null;
        selectedResourceLng = null;
        
        // Haritayı yenile
        loadMapData(filterSelect.value);
    });
}

// --- VERİ YÜKLEME VE HARİTA ---
function loadMapData(filter = 'all') {
    MapManager.clearMarkers();
    const listContainer = document.getElementById('listContainer');
    listContainer.innerHTML = '';
    let count = 0;

    // --- 1. KULLANICI KONTEYNERLARI ---
    const containers = DataManager.getContainers();
    const users = DataManager.getUsers();
    const currentUser = DataManager.getCurrentUser();

    // Konteynerları kullanıcı bilgileriyle eşleştir
    const items = containers.map(container => {
        const owner = users.find(u => u.id === container.userId);
        return { ...container, owner };
    }).filter(item => item.owner); // Sahibi olmayanları (silinmiş vs) gösterme

    // --- 2. KAYNAK NOKTALARI (YENİ) ---
    // Kaynaklar loadResources() fonksiyonu ile yükleniyor.
 
    items.forEach(item => {
        // Filtreleme Mantığı
        if (filter !== 'all') {
            const needs = item.owner.needsList || [];
            const needsStr = (item.owner.needs || "").toLowerCase();
            
            if (filter === 'emergency') {
                if (!item.owner.isEmergency && !needsStr.includes('acil')) return;
            } else if (filter === 'medical') {
                if (!needs.includes('İlaç') && !needsStr.includes('ilaç') && item.owner.role !== 'doktor') return;
            } else if (filter === 'food') {
                if (!needs.includes('Gıda') && !needsStr.includes('gıda') && !needs.includes('Su') && !needsStr.includes('su')) return;
            } else if (filter === 'heating') {
                if (!needs.includes('Isınma') && !needsStr.includes('ısınma')) return;
            } else if (filter === 'baby') {
                if (!needs.includes('Bebek') && !needsStr.includes('bebek')) return;
            }
        }
        
        // Marker Ekle
        let needsDisplay = item.owner.needsList && item.owner.needsList.length > 0 ? item.owner.needsList.join(", ") : "Yok";
        if (item.owner.isEmergency) {
            needsDisplay = "<strong style='color:red'>ACİL YARDIM</strong>" + (needsDisplay !== "Yok" ? ", " + needsDisplay : "");
        }
        
        let popupContent = `
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: #2c3e50;">${item.owner.name}</h4>
                <hr style="margin: 5px 0; border: 0; border-top: 1px solid #eee;">
                <strong>Durum:</strong> ${item.owner.isEmergency ? '<span style="color:red; font-weight:bold;">ACİL</span>' : 'Stabil'}<br>
                <strong>Barınma:</strong> ${item.owner.shelterInfo || 'Belirtilmemiş'}<br>
                <strong>İhtiyaçlar:</strong> ${needsDisplay}<br>
                <strong>Engel:</strong> ${item.owner.disability || 'Yok'}
        `;

        // Yetkililer için işlem butonları
        if (DataManager.getCurrentUser().role !== 'kullanici') {
            popupContent += `
                <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
                <button onclick="openUserModal('${item.owner.id}')" style="width:100%; padding:5px; background:#3498db; color:white; border:none; border-radius:3px; cursor:pointer;">
                    <i class="fas fa-notes-medical"></i> Notlar & İşlemler
                </button>
            </div>`;
        } else {
            popupContent += `</div>`;
        }
        
        // İkon Tipini Belirle
        let markerType = 'default';
        if (item.owner.role === 'doktor') {
            markerType = 'medical';
        } else if (item.owner.role === 'guvenlik') {
            markerType = 'security';
        } else if (item.owner.isEmergency || item.owner.needs && item.owner.needs.includes("ACİL")) {
            markerType = 'emergency';
        } else if (item.owner.disability && item.owner.disability.toLowerCase() !== 'yok') {
            markerType = 'disability';
        }

        const marker = MapManager.addMarker(item.lat, item.lng, popupContent, markerType);

        // Listeye Ekle (Sadece yetkililer için veya herkes için?)
        // Kullanıcı kendi panelinde sadece kendini görüyor, yetkililer herkesi.
        const currentUser = DataManager.getCurrentUser();
        if (currentUser.role !== 'kullanici') {
            const card = document.createElement('div');
            card.className = 'user-card';
            if (item.owner.isEmergency) card.classList.add('emergency'); // İhtiyacı varsa kırmızı
            
            card.innerHTML = `
                <h4>${item.owner.name}</h4>
                <p><small>${item.owner.needs || 'İhtiyaç belirtilmemiş'}</small></p>
                ${item.owner.isEmergency ? '<span class="badge" style="background:red">ACİL</span>' : ''}
            `;
            
            card.addEventListener('click', () => {
                MapManager.centerMap(item.lat, item.lng);
                marker.openPopup();
            });

            listContainer.appendChild(card);
            count++;
        }
    });

    // Kaynak Noktalarını Yükle
    loadResources(filter);

    // Son Aktiviteleri Yükle
    loadRecentActivity();

    if (count === 0 && DataManager.getCurrentUser().role !== 'kullanici') {
        listContainer.innerHTML = '<p style="text-align:center; margin-top:20px;">Kayıt bulunamadı.</p>';
    }
}

function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    const activities = [];
    const users = DataManager.getUsers();
    const resources = DataManager.getResources();

    // 1. Acil Durumlar
    users.forEach(user => {
        if (user.isEmergency && user.emergencyTime) {
            activities.push({
                type: 'emergency',
                text: t('text_emergency_call', {name: user.name}),
                time: new Date(user.emergencyTime),
                icon: 'fa-exclamation-triangle',
                color: '#e74c3c'
            });
        }
        
        // 2. Notlar
        if (user.notes) {
            user.notes.forEach(note => {
                activities.push({
                    type: 'note',
                    text: t('text_note_added_log', {name: user.name, note: note.content.substring(0, 20)}),
                    time: new Date(note.date),
                    icon: 'fa-sticky-note',
                    color: '#3498db'
                });
            });
        }
    });

    // 3. Kaynaklar
    resources.forEach(res => {
        activities.push({
            type: 'resource',
            text: t('text_new_resource_added', {type: getResourceName(res.type)}),
            time: new Date(res.createdAt),
            icon: 'fa-plus-circle',
            color: '#27ae60'
        });
    });

    // Tarihe göre sırala (En yeniden en eskiye)
    activities.sort((a, b) => b.time - a.time);

    // İlk 10 aktiviteyi göster
    activities.slice(0, 10).forEach(act => {
        const div = document.createElement('div');
        div.style.padding = '5px 0';
        div.style.borderBottom = '1px solid #eee';
        div.style.display = 'flex';
        div.style.gap = '10px';
        div.style.alignItems = 'center';
        
        const timeStr = act.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        div.innerHTML = `
            <div style="color:${act.color};"><i class="fas ${act.icon}"></i></div>
            <div style="flex:1;">
                <div style="font-size:0.85rem;">${act.text}</div>
                <div style="font-size:0.7rem; color:#999;">${act.time.toLocaleDateString()} ${timeStr}</div>
            </div>
        `;
        activityList.appendChild(div);
    });

    if (activities.length === 0) {
        activityList.innerHTML = '<p style="color:#999; text-align:center;">' + t('text_no_activity') + '</p>';
    }
}

// --- KAYNAK NOKTALARI (YENİ) ---
function loadResources(filter = 'all') {
    const resources = DataManager.getResources();
    const currentUser = DataManager.getCurrentUser();
    
    // Kaynak Filtrelerini Kontrol Et
    const activeFilters = [];
    document.querySelectorAll('.resource-filter').forEach(cb => {
        if (cb.checked) activeFilters.push(cb.value);
    });

    // Eğer yetkili değilse (veya filtreler sayfada yoksa) varsayılan olarak hepsini göster
    // Ancak filtreler DOM'da var (gizli olabilir).
    // Kullanıcı giriş yapmışsa ve filtreler gizliyse, varsayılan hepsi seçili olmalı.
    // HTML'de "checked" attribute var, yani varsayılan seçili.

    resources.forEach(res => {
        // Tip filtresine uyuyor mu?
        if (activeFilters.length > 0 && !activeFilters.includes(res.type)) return;

        let iconType = 'default';
        let iconColor = '#34495e';
        let iconClass = 'fa-map-marker-alt';

        switch(res.type) {
            case 'water': 
                iconType = 'water'; iconColor = '#3498db'; iconClass = 'fa-faucet'; break;
            case 'food': 
                iconType = 'food'; iconColor = '#e67e22'; iconClass = 'fa-utensils'; break;
            case 'medical': 
                iconType = 'hospital'; iconColor = '#e74c3c'; iconClass = 'fa-clinic-medical'; break;
            case 'tent': 
                iconType = 'tent'; iconColor = '#27ae60'; iconClass = 'fa-campground'; break;
            case 'fire':
                iconType = 'fire'; iconColor = '#d35400'; iconClass = 'fa-fire-extinguisher'; break;
            case 'security':
                iconType = 'security'; iconColor = '#2c3e50'; iconClass = 'fa-shield-halved'; break;
            case 'paramedic':
                iconType = 'medical'; iconColor = '#e74c3c'; iconClass = 'fa-user-nurse'; break;
            case 'pharmacy':
                iconType = 'pharmacy'; iconColor = '#8e44ad'; iconClass = 'fa-pills'; break;
        }

        const quantity = res.quantity !== undefined ? res.quantity : 0;
        const unit = res.unit || 'Adet';

        let popupContent = `
            <div style="text-align:center; min-width: 150px;">
                <h4 style="color:${iconColor}; margin:0 0 5px 0;"><i class="fas ${iconClass}"></i> ${getResourceName(res.type)}</h4>
                <div style="background:#f9f9f9; padding:5px; border-radius:3px; margin:5px 0;">
                    <strong style="display:block; font-size:1.1rem; color:#2c3e50;">${quantity} ${unit}</strong>
                    <small style="color:#7f8c8d;">Mevcut Stok</small>
                </div>
                <p style="margin:0; font-size:0.8rem;">Ekleyen: ${res.addedBy}</p>
                <small style="color:#999; font-size:0.7rem;">${new Date(res.createdAt).toLocaleString()}</small>
        `;

        // Yetkili ise Sil ve Güncelle Butonları
        if (currentUser.role !== 'kullanici') {
            popupContent += `
                <hr style="margin:5px 0; border:0; border-top:1px solid #eee;">
                <div style="display:flex; gap:5px; justify-content:center; margin-bottom:5px;">
                    <button onclick="updateResourceStock('${res.id}', -1)" style="background:#e67e22; color:white; border:none; padding:2px 8px; border-radius:3px; cursor:pointer;">-</button>
                    <button onclick="updateResourceStock('${res.id}', 1)" style="background:#27ae60; color:white; border:none; padding:2px 8px; border-radius:3px; cursor:pointer;">+</button>
                    <button onclick="updateResourceStock('${res.id}', 10)" style="background:#27ae60; color:white; border:none; padding:2px 8px; border-radius:3px; cursor:pointer;">+10</button>
                </div>
                <button onclick="deleteResource('${res.id}')" style="background:#e74c3c; color:white; border:none; padding:4px 8px; border-radius:3px; cursor:pointer; width:100%; font-size:0.8rem;">
                    <i class="fas fa-trash"></i> Sil
                </button>
            `;
        }
        popupContent += `</div>`;

        // Özel ikon oluşturma (basitçe divIcon kullanarak)
        const customIcon = L.divIcon({
            className: 'custom-resource-icon',
            html: `<div style="background:${iconColor}; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center; color:white; border:2px solid white; box-shadow:0 0 5px rgba(0,0,0,0.5);">
                    <i class="fas ${iconClass}"></i>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        L.marker([res.lat, res.lng], {icon: customIcon})
            .addTo(MapManager.map)
            .bindPopup(popupContent);
    });
}

// Global Silme Fonksiyonu
window.deleteResource = function(id) {
    if (confirm('Bu yardım noktasını silmek istediğinize emin misiniz?')) {
        if (DataManager.deleteResource(id)) {
            loadMapData(); // Haritayı yenile
            alert('Yardım noktası silindi.');
        } else {
            alert('Silme işlemi başarısız.');
        }
    }
};

// Global Stok Güncelleme
window.updateResourceStock = function(id, change) {
    const resource = DataManager.getResources().find(r => r.id === id);
    if (resource) {
        let currentQty = resource.quantity !== undefined ? resource.quantity : 0;
        let newQty = currentQty + change;
        if (newQty < 0) newQty = 0;
        
        if (DataManager.updateResource(id, { quantity: newQty })) {
            loadMapData(); // Haritayı yenile (popup kapanabilir, bu yüzden kullanıcı tekrar tıklamalı veya açık kalmasını sağlamalıyız)
            // Harita yenilenince popup kapanır. Kullanıcı deneyimi için popup'ı tekrar açmak iyi olur ama şimdilik basit tutalım.
        }
    }
};

function getResourceName(type) {
    switch(type) {
        case 'water': return t('resource_type_water');
        case 'food': return t('resource_type_food');
        case 'medical': return t('resource_type_medical');
        case 'tent': return t('resource_type_tent');
        case 'fire': return t('resource_type_fire');
        case 'security': return t('resource_type_security');
        case 'paramedic': return t('resource_type_paramedic');
        case 'pharmacy': return t('resource_type_pharmacy');
        default: return t('resource_label').replace(':', '');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Acil Durum Çözme
    const resolveBtn = document.getElementById('resolveEmergencyBtn');
    if (resolveBtn) {
        resolveBtn.addEventListener('click', () => {
            if (confirm('Bu kullanıcının acil durumunu "Çözüldü" olarak işaretlemek istediğinize emin misiniz?')) {
                if (DataManager.resolveEmergency(currentModalUserId)) {
                    alert('Acil durum çözüldü olarak işaretlendi.');
                    document.getElementById('notesModal').style.display = 'none';
                    loadMapData(); // Haritayı güncelle (kırmızı marker normale dönsün)
                }
            }
        });
    }

    // Modal Kapatma
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('notesModal').style.display = 'none';
        });
    }


    // Not Kaydetme
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', () => {
            const noteText = document.getElementById('newNoteText').value;
            if (!noteText.trim()) return;

            const currentUser = DataManager.getCurrentUser();
            const newNote = {
                content: noteText,
                author: currentUser.name,
                role: getRoleName(currentUser.role),
                date: new Date().toISOString()
            };

            if (DataManager.addNoteToUser(currentModalUserId, newNote)) {
                document.getElementById('newNoteText').value = '';
                // Modalı yenile
                window.openUserModal(currentModalUserId);
                alert('Not eklendi.');
            }
        });
    }
});

// --- MODAL VE NOT İŞLEMLERİ (YENİ) ---
let currentModalUserId = null;

// Global fonksiyona ata ki HTML onclick çalışsın
window.openUserModal = function(userId) {
    currentModalUserId = userId;
    const users = DataManager.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const modal = document.getElementById('notesModal');
    const modalUserName = document.getElementById('modalUserName');
    const modalNotesList = document.getElementById('modalNotesList');
    const resolveBtn = document.getElementById('resolveEmergencyBtn');

    modalUserName.textContent = user.name + " - Notlar";
    modalNotesList.innerHTML = '';

    // Geçmiş notları listele
    if (user.notes && user.notes.length > 0) {
        user.notes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note-item';
            noteDiv.innerHTML = `
                <p><strong>${note.author} (${note.role}):</strong> ${note.content}</p>
                <small>${new Date(note.date).toLocaleString()}</small>
            `;
            modalNotesList.appendChild(noteDiv);
        });
    } else {
        modalNotesList.innerHTML = '<p style="color:#999; font-style:italic;">Henüz not eklenmemiş.</p>';
    }

    // Acil durum butonu kontrolü
    if (user.isEmergency) {
        resolveBtn.style.display = 'block';
    } else {
        resolveBtn.style.display = 'none';
    }

    // AI Raporu Kontrolü (Sadece Doktorlar için)
    const aiReportSection = document.getElementById('aiReportSection');
    const getAiReportBtn = document.getElementById('getAiReportBtn');
    const aiReportContent = document.getElementById('aiReportContent');
    const currentUser = DataManager.getCurrentUser();

    if (aiReportSection && currentUser.role === 'doktor') {
        aiReportSection.style.display = 'block';
        getAiReportBtn.setAttribute('data-user-id', userId);
        aiReportContent.style.display = 'none'; // Yeni modal açıldığında içeriği gizle
        aiReportContent.innerHTML = '';
    } else if (aiReportSection) {
        aiReportSection.style.display = 'none';
    }

    modal.style.display = 'block';
};
