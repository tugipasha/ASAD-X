
// ASAD-X AI Danışmanı ve Nefes Egzersizi

const AiManager = {
    apiKey: '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',
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    chatHistory: [],

    init: function() {
        this.setupEventListeners();
        this.loadChatHistory();
    },

    setupEventListeners: function() {
        const openBtn = document.getElementById('openAiChatBtn');
        const modal = document.getElementById('aiChatModal');
        const closeBtn = modal.querySelector('.close-modal');
        const sendBtn = document.getElementById('sendAiMsgBtn');
        const input = document.getElementById('aiChatInput');

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                modal.style.display = 'block';
                this.scrollToBottom();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleSendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSendMessage();
            });
        }

        // Nefes Egzersizi
        const startBreathingBtn = document.getElementById('startBreathingBtn');
        const breathingModal = document.getElementById('breathingModal');
        const stopBreathingBtn = document.getElementById('stopBreathingBtn');
        const closeBreathingBtn = breathingModal.querySelector('.close-modal');

        if (startBreathingBtn) {
            startBreathingBtn.addEventListener('click', () => {
                breathingModal.style.display = 'block';
                this.startBreathingCycle();
            });
        }

        if (stopBreathingBtn) {
            stopBreathingBtn.addEventListener('click', () => {
                this.stopBreathingCycle();
                breathingModal.style.display = 'none';
            });
        }
        
        if (closeBreathingBtn) {
            closeBreathingBtn.addEventListener('click', () => {
                this.stopBreathingCycle();
                breathingModal.style.display = 'none';
            });
        }
    },

    loadChatHistory: function() {
        const saved = localStorage.getItem('asadx_ai_chat');
        if (saved) {
            this.chatHistory = JSON.parse(saved);
            this.renderMessages();
        }
    },

    saveChatHistory: function() {
        localStorage.setItem('asadx_ai_chat', JSON.stringify(this.chatHistory));
    },

    handleSendMessage: async function() {
        const input = document.getElementById('aiChatInput');
        const text = input.value.trim();
        if (!text) return;

        // User message
        this.addMessage('user', text);
        input.value = '';
        this.renderMessages();

        // Acil Durum Tespiti (İntihar vb.)
        this.checkEmergencyStatus(text);

        // AI is thinking...
        const thinkingId = 'ai-thinking-' + Date.now();
        this.addMessage('ai', '...', thinkingId);
        this.renderMessages();

        try {
            const response = await this.getAiResponse(text);
            this.updateMessage(thinkingId, response);
            
            // AI yanıtında da acil durum kontrolü yap (Yapay zeka bazen kendisi tespit eder)
            this.checkEmergencyStatus(response);

            // Check if AI suggests breathing exercise
            if (response.toLowerCase().includes('nefes') || response.toLowerCase().includes('breath')) {
                this.showBreathingSuggestion();
            }
        } catch (error) {
            console.error('AI Error:', error);
            this.updateMessage(thinkingId, t('ai_error_msg') || 'Üzgünüm, şu an yanıt veremiyorum. Lütfen tekrar deneyin.');
        }
    },

    checkEmergencyStatus: function(text) {
        const lowerText = text.toLowerCase();
        const emergencyKeywords = [
            'intihar', 'ölmek istiyorum', 'kendime zarar', 'canıma kıy', 
            'suicide', 'want to die', 'kill myself', 'harm myself',
            'yaşamak istemiyorum', 'son ver'
        ];

        const isEmergency = emergencyKeywords.some(keyword => lowerText.includes(keyword));

        if (isEmergency) {
            const user = DataManager.getCurrentUser();
            if (user && !user.isEmergency) {
                user.isEmergency = true;
                user.emergencyTime = new Date().toISOString();
                user.needs = (user.needs ? user.needs + ', ' : '') + 'PSİKOLOJİK ACİL DURUM (AI Tespiti)';
                
                if (DataManager.updateUser(user)) {
                    console.log('AI Kritik durum tespit etti ve acil durum başlattı.');
                    // Haritayı yenilemek için bir event tetiklenebilir veya app.js'e bildirilebilir
                    if (window.loadMapData) window.loadMapData();
                }
            }
        }
    },

    addMessage: function(role, content, id = null) {
        this.chatHistory.push({
            id: id || Date.now(),
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });
        
        // Geçmişi son 20 mesajla sınırla
        if (this.chatHistory.length > 20) {
            this.chatHistory = this.chatHistory.slice(-20);
        }
        
        this.saveChatHistory();
    },

    updateMessage: function(id, content) {
        const msg = this.chatHistory.find(m => m.id === id);
        if (msg) {
            msg.content = content;
            this.saveChatHistory();
            this.renderMessages();
        }
    },

    renderMessages: function() {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;

        container.innerHTML = '';
        this.chatHistory.forEach(msg => {
            const div = document.createElement('div');
            const isAi = msg.role === 'ai';
            
            div.style.padding = '8px 12px';
            div.style.borderRadius = isAi ? '15px 15px 15px 0' : '15px 15px 0 15px';
            div.style.alignSelf = isAi ? 'flex-start' : 'flex-end';
            div.style.maxWidth = '80%';
            div.style.fontSize = '0.9rem';
            div.style.background = isAi ? '#f1f1f1' : '#3498db';
            div.style.color = isAi ? '#333' : 'white';
            
            // Markdown Kalın (**) Desteği
            let content = msg.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Kalın harf
                .replace(/\n/g, '<br>'); // Alt satır
            
            div.innerHTML = content;
            container.appendChild(div);
        });
        this.scrollToBottom();
    },

    scrollToBottom: function() {
        const container = document.getElementById('aiChatMessages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    },

    getAiResponse: async function(userText) {
        const user = DataManager.getCurrentUser();
        if (!user) throw new Error('User not logged in');

        const systemPrompt = `
            Sen ASAD-X afet yönetim sisteminde bir yapay zekasın ama her şeyden önce kullanıcının en yakın dostu, dert ortağı ve ailesinden biri gibisin.
            Adın: ASAD-X Dost.
            Kullanıcının adı: ${user.name}.
            
            Karakter Özelliklerin:
            1. Çok samimi, empatik ve sıcakkanlı konuşursun.
            2. Cümlelerin kısa, öz ve halden anlayan bir tonda olmalı.
            3. Asla robot gibi konuşma, "Anlıyorum", "Yanındayım", "Birlikte atlatacağız" gibi sıcak ifadeler kullan.
            4. Bir aile ferdi gibi koruyucu ve güven verici ol.
            5. Eğer kullanıcı çok kötüyse (stres, kaygı) hemen bir nefes egzersizi öner.
            6. Yanıtlarında asla bozuk kelimeler veya anlamsız ifadeler kullanma, temiz ve akıcı bir Türkçe ile konuş.
        `;

        // "thinking" mesajlarını ve mevcut mesajı geçmişten çıkar
        const filteredHistory = this.chatHistory.filter(m => 
            m.content !== '...' && 
            m.content !== userText &&
            !m.id.toString().startsWith('ai-thinking-')
        );

        const messages = [
            { role: 'system', content: systemPrompt },
            ...filteredHistory.slice(-6).map(m => ({ 
                role: m.role === 'ai' ? 'assistant' : 'user', 
                content: m.content 
            })),
            { role: 'user', content: userText }
        ];

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://asad-x.local',
                'X-Title': 'ASAD-X AI Advisor'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-lite-001', // Daha akıcı bir model tercih ediyoruz
                messages: messages,
                temperature: 0.7, // Daha insansı bir yaratıcılık için
                max_tokens: 500
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('OpenRouter Error:', data.error);
            throw new Error(data.error.message || 'API Error');
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Unexpected API Response:', data);
            throw new Error('Invalid response structure');
        }

        return data.choices[0].message.content;
    },

    showBreathingSuggestion: function() {
        const container = document.getElementById('aiChatMessages');
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.style.marginTop = '10px';
        btn.style.background = '#2980b9';
        btn.innerHTML = '<i class="fas fa-wind"></i> ' + (t('start_breathing') || 'Nefes Egzersizi Yap');
        btn.onclick = () => {
            document.getElementById('aiChatModal').style.display = 'none';
            document.getElementById('breathingModal').style.display = 'block';
            this.startBreathingCycle();
        };
        container.appendChild(btn);
        this.scrollToBottom();
    },

    // --- NEFES EGZERSİZİ MANTIĞI ---
    breathingTimer: null,
    startBreathingCycle: function() {
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        
        let phase = 0; // 0: inhale, 1: hold, 2: exhale
        
        const update = () => {
            if (phase === 0) {
                circle.style.transform = 'scale(2)';
                circle.style.background = 'rgba(52, 152, 219, 0.6)';
                text.textContent = t('breath_in') || 'Nefes Al';
                phase = 1;
                this.breathingTimer = setTimeout(update, 4000);
            } else if (phase === 1) {
                text.textContent = t('breath_hold') || 'Tut';
                phase = 2;
                this.breathingTimer = setTimeout(update, 2000);
            } else {
                circle.style.transform = 'scale(1)';
                circle.style.background = 'rgba(52, 152, 219, 0.3)';
                text.textContent = t('breath_out') || 'Nefes Ver';
                phase = 0;
                this.breathingTimer = setTimeout(update, 4000);
            }
        };

        update();
    },

    stopBreathingCycle: function() {
        if (this.breathingTimer) {
            clearTimeout(this.breathingTimer);
            this.breathingTimer = null;
        }
        const circle = document.getElementById('breathingCircle');
        if (circle) circle.style.transform = 'scale(1)';
    },

    // --- DOKTORLAR İÇİN HASTA ÖZETİ ---
    generateUserSummary: async function(userId) {
        // Bu fonksiyon sadece doktorlar tarafından çağrılır (app.js kontrol eder)
        const users = DataManager.getUsers();
        const targetUser = users.find(u => u.id === userId);
        if (!targetUser) return 'Kullanıcı bulunamadı.';

        const prompt = `
            Kullanıcı Adı: ${targetUser.name}
            İhtiyaçlar: ${targetUser.needs || 'Yok'}
            Barınma: ${targetUser.shelterInfo || 'Bilinmiyor'}
            Kişi Sayısı: ${targetUser.occupancy || 1}
            Notlar: ${targetUser.notes ? targetUser.notes.map(n => n.content).join(' | ') : 'Not yok'}

            Doktor için bu hastanın genel durumunu özetleyen profesyonel bir rapor hazırla.
            Rapor dili temiz ve akıcı Türkçe olmalı. Bozuk karakter veya anlamsız kelime kullanma.
            Önemli bir durum varsa kalın harflerle belirt.
        `;

        const messages = [
            { role: 'system', content: 'Sen ASAD-X sisteminde doktorlara rapor sunan profesyonel bir asistan ve tıbbi analiz uzmanısın. Yanıtların her zaman temiz ve doğru bir Türkçeyle olmalı.' },
            { role: 'user', content: prompt }
        ];

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://asad-x.local',
                    'X-Title': 'ASAD-X AI Advisor'
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.0-flash-lite-001',
                    messages: messages,
                    temperature: 0.3 // Raporlar için daha net ve tahmin edilebilir yanıtlar
                })
            });

            const data = await response.json();
            
            if (data.error) throw new Error(data.error.message);
            
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Rapor oluşturma hatası:', error);
            return 'Rapor şu an oluşturulamıyor, lütfen tekrar deneyin.';
        }
    }
};

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    AiManager.init();
});
