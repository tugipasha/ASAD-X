
// Giriş ve Kayıt İşlemleri

document.addEventListener('DOMContentLoaded', () => {
    // Zaten giriş yapılmışsa yönlendir
    const currentUser = DataManager.getCurrentUser();
    if (currentUser) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Element Seçimi
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const regRoleSelect = document.getElementById('regRole');
    const userFields = document.getElementById('userFields');

    // Form Geçişleri
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden-form');
        loginForm.classList.remove('active-form');
        registerForm.classList.remove('hidden-form');
        registerForm.classList.add('active-form');
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden-form');
        registerForm.classList.remove('active-form');
        loginForm.classList.remove('hidden-form');
        loginForm.classList.add('active-form');
    });

    // Rol değişince alanları göster/gizle
    regRoleSelect.addEventListener('change', (e) => {
        if (e.target.value === 'kullanici') {
            userFields.style.display = 'block';
        } else {
            userFields.style.display = 'none';
        }
    });

    // Kayıt İşlemi
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const name = document.getElementById('regName').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        
        // Kullanıcı var mı kontrol et
        const existingUsers = DataManager.getUsers();
        if (existingUsers.find(u => u.username === username)) {
            alert('Bu kullanıcı adı zaten alınmış!');
            return;
        }

        const newUser = {
            username,
            name,
            password,
            role,
            createdAt: new Date().toISOString()
        };

        if (role === 'kullanici') {
            newUser.disability = document.getElementById('regDisability').value;
            newUser.needs = document.getElementById('regNeeds').value;
        }

        DataManager.saveUser(newUser);
        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
        showLoginBtn.click();
    });

    // Giriş İşlemi
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Basit doğrulama (Demo verileri veya kayıtlı kullanıcılar)
        // DataManager içindeki users array'ini kontrol et
        const users = DataManager.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            DataManager.setCurrentUser(user);
            window.location.href = 'dashboard.html';
        } else {
            alert('Kullanıcı adı veya şifre hatalı!');
        }
    });
});
