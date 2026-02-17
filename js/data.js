
//Veri Yönetimi

const STORAGE_KEYS = {
    USERS: 'asadx_users',
    CURRENT_USER: 'asadx_current_user',
    CONTAINERS: 'asadx_containers',
    RESOURCES: 'asadx_resources', // Yeni: Kaynak Noktaları
    ANNOUNCEMENTS: 'asadx_announcements' // Yeni: Duyurular
};

const DataManager = {
    // Kullanıcı İşlemleri
    getUsers: function() {
        const users = localStorage.getItem(STORAGE_KEYS.USERS);
        return users ? JSON.parse(users) : [];
    },

    saveUser: function(user) {
        const users = this.getUsers();
        // ID oluşturma (eğer yoksa)
        if (!user.id) {
            user.id = Date.now().toString();
        }
        users.push(user);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return user;
    },

    updateUser: function(updatedUser) {
        let users = this.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            // Oturumdaki kullanıcıyı da güncelle
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === updatedUser.id) {
                this.setCurrentUser(updatedUser);
            }
            return true;
        }
        return false;
    },

    // Yeni: Kullanıcıya Not Ekleme
    addNoteToUser: function(userId, note) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            const user = users[userIndex];
            if (!user.notes) user.notes = [];
            user.notes.push(note);
            users[userIndex] = user;
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            return true;
        }
        return false;
    },

    // Yeni: Acil Durumu Çözüldü İşaretleme
    resolveEmergency: function(userId) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            const user = users[userIndex];
            user.isEmergency = false;
            user.emergencyTime = null;
            // İhtiyaç listesinden "ACİL YARDIM"ı temizle
            if (user.needs) {
                user.needs = user.needs.replace(/ACİL YARDIM,?\s*/g, '').replace(/,\s*$/, '');
            }
            users[userIndex] = user;
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            return true;
        }
        return false;
    },

    findUser: function(username, password) {
        const users = this.getUsers();
        return users.find(u => u.username === username && u.password === password);
    },

    // --- Kaynak Noktaları (Su, Yemek vb.) ---
    getResources: function() {
        const resources = localStorage.getItem(STORAGE_KEYS.RESOURCES);
        return resources ? JSON.parse(resources) : [];
    },

    saveResource: function(resource) {
        const resources = this.getResources();
        resource.id = Date.now().toString();
        resources.push(resource);
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
        return resource;
    },

    deleteResource: function(id) {
        let resources = this.getResources();
        const initialLength = resources.length;
        resources = resources.filter(r => r.id !== id);
        if (resources.length !== initialLength) {
            localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
            return true;
        }
        return false;
    },

    // --- Duyurular (Yeni) ---
    getAnnouncements: function() {
        const announcements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
        return announcements ? JSON.parse(announcements) : [];
    },

    addAnnouncement: function(announcement) {
        const announcements = this.getAnnouncements();
        announcement.id = Date.now().toString();
        announcements.unshift(announcement); // En başa ekle
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
        return announcement;
    },

    deleteAnnouncement: function(id) {
        let announcements = this.getAnnouncements();
        const initialLength = announcements.length;
        announcements = announcements.filter(a => a.id !== id);
        if (announcements.length !== initialLength) {
            localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
            return true;
        }
        return false;
    },

    // --- Oturum Yönetimi ---
    setCurrentUser: function(user) {
        // Şifreyi saklamayalım güvenlik için
        const sessionUser = { ...user };
        delete sessionUser.password;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    },

    getCurrentUser: function() {
        const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },

    logout: function() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    // Konteyner İşlemleri
    getContainers: function() {
        const containers = localStorage.getItem(STORAGE_KEYS.CONTAINERS);
        return containers ? JSON.parse(containers) : [];
    },

    saveContainer: function(container) {
        const containers = this.getContainers();
        container.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        container.createdAt = new Date().toISOString();
        containers.push(container);
        localStorage.setItem(STORAGE_KEYS.CONTAINERS, JSON.stringify(containers));
        return container;
    },

    // Konteyner Güncelleme
    updateContainer: function(updatedContainer) {
        let containers = this.getContainers();
        const index = containers.findIndex(c => c.userId === updatedContainer.userId);
        if (index !== -1) {
            // Mevcut alanları koru, yenileri ekle
            containers[index] = { ...containers[index], ...updatedContainer };
            localStorage.setItem(STORAGE_KEYS.CONTAINERS, JSON.stringify(containers));
            return true;
        }
        return false;
    },

    // Başlangıç verileri
    init: function() {
        // İlk kullanımda boş array'leri oluştur
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
        }
        
        if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
            localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify([]));
        }

        if (!localStorage.getItem(STORAGE_KEYS.CONTAINERS)) {
            localStorage.setItem(STORAGE_KEYS.CONTAINERS, JSON.stringify([]));
        }

        if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
            localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify([]));
        }
    }
};

DataManager.init();