/* =============================================
   MEKABOT.JS – AI Chatbot Assistant (Powered by OpenRouter)
   ============================================= */

// Deteksi apakah kita di root atau di subfolder pages/
const _scriptSrc = document.currentScript?.src || '';
const _isInPages = _scriptSrc.includes('/pages/') ||
    window.location.href.includes('/pages/') ||
    window.location.href.replace(/\\/g, '/').includes('/pages/');
const _base = _isInPages ? '' : 'pages/';

// ========== OPENROUTER CONFIG ==========
const OPENROUTER_CONFIG = {
    // API key baru (fresh rate limit)
    apiKey: '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',
    // API key lama sebagai backup
    apiKeyBackup: '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',
    // Model utama: Gemma 3 4B (fresh key, cepat, efisien)
    model: 'google/gemma-3-4b-it:free',
    // Fallback chain jika rate limit
    modelFallbacks: [
        'meta-llama/llama-3.3-70b-instruct:free',
        'google/gemma-3-12b-it:free',
        'qwen/qwen3-4b:free',
        'mistralai/mistral-small-3.1-24b-instruct:free',
    ],
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    maxTokens: 600,
    systemPrompt: `Kamu adalah Meka-Bot, asisten AI khusus untuk platform pembelajaran PLC (Programmable Logic Controller) dan Smart Factory bernama MekaSmart Hub. Platform ini ditujukan untuk siswa SMK Indonesia.

KEPRIBADIAN:
- Ramah, sabar, dan suportif seperti mentor/kakak kelas
- Gunakan Bahasa Indonesia yang santai tapi informatif
- Sertakan emoji yang relevan untuk membuat pesan lebih menarik
- Jawaban singkat, padat, jelas (max 3-4 paragraf)
- SELALU jawab dalam Bahasa Indonesia

KEAHLIANMU:
- PLC (Programmable Logic Controller): konsep, pemrograman, troubleshooting
- Ladder Diagram, Function Block Diagram (FBD), Instruction List (IL)
- Smart Factory, IoT industri, otomasi
- Hardware PLC: Siemens SIMATIC, Mitsubishi MELSEC, Omron Sysmac, Allen-Bradley, Schneider
- Komponen: sensor, aktuator, motor, konveyor, robot arm, HMI, SCADA
- Wiring PLC, pneumatik

FITUR PLATFORM (berikan link yang tepat):
- Pintu Masuk / Asesmen Bakat: ${_base}asesmen.html (tes RIASEC & GATB 25 soal)
- Ruang Belajar: ${_base}ruang-belajar.html (modul PDF, video tutorial, jobsheet)
- Meka-Lab: ${_base}meka-lab.html (simulasi Smart Factory virtual, editor Ladder Diagram)
- Pusat Uji: ${_base}pusat-uji.html (ujian bertingkat Easy/Medium/Hard, badge kompetensi)
- Panduan: ${_base}panduan.html

PANDUAN FORMAT RESPONS:
- Untuk pertanyaan teknis: jelaskan konsep + contoh praktis
- Untuk navigasi platform: arahkan ke halaman yang tepat dengan link HTML <a href="...">
- Untuk error/troubleshooting: berikan langkah diagnosa yang terstruktur (1, 2, 3...)
- Untuk sapaan: balas hangat dan tawarkan bantuan
- Jika tidak tahu: akui dengan jujur dan arahkan ke sumber terpercaya

BATASAN:
- Fokus pada topik PLC, otomasi industri, dan platform MekaSmart Hub
- Jika ditanya di luar topik, arahkan kembali dengan ramah
- WAJIB gunakan Bahasa Indonesia dalam semua respons`
};

// ========== FALLBACK KNOWLEDGE ==========
// Digunakan saat API tidak tersedia / error
const FALLBACK_KNOWLEDGE = {
    greetings: ['halo', 'hai', 'hello', 'hei', 'hi', 'selamat'],
    quickAnswers: {
        'plc': '📘 **PLC (Programmable Logic Controller)** adalah komputer industri untuk mengontrol proses manufaktur. Dirancang tahan banting untuk lingkungan pabrik. Mau tahu lebih lanjut?',
        'ladder': '📊 **Ladder Diagram** adalah bahasa pemrograman PLC berbentuk tangga. Rung = baris logika, Kontak = input, Koil = output. Coba simulasikan di <a href="' + _base + 'meka-lab.html" class="msg-link">Meka-Lab!</a>',
        'timer': '⏱️ **Timer TON (Timer On-Delay)** mulai menghitung saat input aktif. Output aktif setelah mencapai preset time. Contoh: Motor berhenti 5 detik setelah botol terdeteksi.',
        'interlock': '🔒 **Interlock** adalah logika keamanan yang mencegah dua output aktif bersamaan. Selalu tambahkan kontak NC output lawan pada setiap rung motor.',
    }
};

let mekaBotOpen = false;
let mekaBotInitialized = false;
let conversationHistory = [];
let isAILoading = false;

// ========== TOGGLE & INIT ==========
function toggleMekaBot() {
    mekaBotOpen = !mekaBotOpen;
    const win = document.getElementById('mekabotWindow');
    if (mekaBotOpen) {
        win.classList.add('open');
        if (!mekaBotInitialized) {
            initMekaBot();
            mekaBotInitialized = true;
        }
        document.getElementById('mekabotInput').focus();
    } else {
        win.classList.remove('open');
    }
}

function openMekaBot() {
    if (!mekaBotOpen) toggleMekaBot();
}

function initMekaBot() {
    // Welcome message dengan indikator AI
    appendBotMsg(`👋 Halo! Aku <strong>Meka-Bot</strong>, asisten AI PLC-mu yang didukung oleh <span class="ai-badge">✨ Gemini AI</span>!<br><br>Tanya apa saja tentang PLC, Ladder Diagram, Smart Factory, atau navigasi platform ini. Aku siap bantu kamu belajar! 🚀`);

    // Suggestions
    renderSuggestions();

    // Input listeners
    const input = document.getElementById('mekabotInput');
    const sendBtn = document.getElementById('mekabotSend');

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    sendBtn.addEventListener('click', sendMessage);

    // Auto-resize textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });
}

// ========== SUGGESTIONS ==========
const SUGGESTIONS_LIST = [
    'Apa itu PLC?',
    'Jelaskan Timer TON',
    'Apa itu Interlock?',
    'Cara ke Simulasi?',
    'Apa itu Ladder Diagram?',
    'Error System Crash?',
    'Apa itu HMI dan SCADA?',
    'Bagaimana wiring PLC?',
    'Bedanya NO dan NC?',
    'Cara mulai asesmen bakat?',
];

function renderSuggestions() {
    const container = document.getElementById('mekabotSuggestions');
    if (!container) return;
    container.innerHTML = '';
    const shown = SUGGESTIONS_LIST.sort(() => 0.5 - Math.random()).slice(0, 4);
    shown.forEach(s => {
        const chip = document.createElement('button');
        chip.className = 'suggestion-chip';
        chip.textContent = s;
        chip.addEventListener('click', () => {
            document.getElementById('mekabotInput').value = s;
            sendMessage();
        });
        container.appendChild(chip);
    });
}

// ========== MESSAGE RENDERING ==========
function appendBotMsg(html, isTyping = false) {
    const messages = document.getElementById('mekabotMessages');
    const msg = document.createElement('div');
    msg.className = 'msg msg-bot';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '🤖';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    if (isTyping) {
        bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        msg.id = 'typingMsg';
    } else {
        bubble.innerHTML = html;
    }

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
}

function appendUserMsg(text) {
    const messages = document.getElementById('mekabotMessages');
    const msg = document.createElement('div');
    msg.className = 'msg msg-user';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '🎓';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

function appendErrorMsg(text) {
    const messages = document.getElementById('mekabotMessages');
    const msg = document.createElement('div');
    msg.className = 'msg msg-bot';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '⚠️';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble msg-error';
    bubble.innerHTML = text;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

// ========== SEND MESSAGE ==========
async function sendMessage() {
    if (isAILoading) return;

    const input = document.getElementById('mekabotInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';
    appendUserMsg(text);

    isAILoading = true;
    input.disabled = true;
    document.getElementById('mekabotSend').disabled = true;

    // Tampilkan typing indicator dulu
    const typingMsg = appendBotMsg('', true);

    try {
        conversationHistory.push({ role: 'user', content: text });

        // Siapkan bubble kosong untuk streaming
        typingMsg.remove();
        const streamBubble = createStreamBubble();

        // Jalankan streaming AI
        const fullText = await callOpenRouterAIStream(
            conversationHistory,
            (delta, accumulated) => {
                // Update bubble secara real-time saat chunk datang
                streamBubble.querySelector('.msg-bubble').textContent = accumulated;
                const messages = document.getElementById('mekabotMessages');
                messages.scrollTop = messages.scrollHeight;
            }
        );

        // Setelah stream selesai, render dengan format markdown
        streamBubble.querySelector('.msg-bubble').innerHTML = formatAIResponse(fullText);
        document.getElementById('mekabotMessages').scrollTop = 9999;
        conversationHistory.push({ role: 'assistant', content: fullText });

    } catch (err) {
        // Jika ada typing indicator yang belum dihapus
        document.getElementById('typingMsg')?.remove();
        // Hapus stream bubble jika sudah dibuat tapi gagal
        document.getElementById('streamingBubble')?.remove();
        console.warn('AI error, using fallback:', err.message);
        const fallbackResponse = getFallbackResponse(text.toLowerCase());
        appendBotMsg(fallbackResponse);
        conversationHistory.push({ role: 'assistant', content: 'fallback' });
    } finally {
        isAILoading = false;
        input.disabled = false;
        document.getElementById('mekabotSend').disabled = false;
        renderSuggestions();
        input.focus();
    }
}

// Buat bubble kosong untuk streaming
function createStreamBubble() {
    const messages = document.getElementById('mekabotMessages');
    const msg = document.createElement('div');
    msg.className = 'msg msg-bot';
    msg.id = 'streamingBubble';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '🤖';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble streaming';
    bubble.textContent = '';

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
}

// ========== OPENROUTER STREAMING API CALL ==========
async function callOpenRouterAIStream(history, onChunk) {
    const recentHistory = history.slice(-10);
    const messages = [
        { role: 'system', content: OPENROUTER_CONFIG.systemPrompt },
        ...recentHistory
    ];

    // Coba dengan key utama dulu, lalu key backup
    const keysAndModels = [
        { key: OPENROUTER_CONFIG.apiKey, model: OPENROUTER_CONFIG.model },
        { key: OPENROUTER_CONFIG.apiKey, model: OPENROUTER_CONFIG.modelFallbacks[0] },
        { key: OPENROUTER_CONFIG.apiKeyBackup, model: OPENROUTER_CONFIG.modelFallbacks[0] },
        { key: OPENROUTER_CONFIG.apiKey, model: OPENROUTER_CONFIG.modelFallbacks[1] },
        { key: OPENROUTER_CONFIG.apiKey, model: OPENROUTER_CONFIG.modelFallbacks[2] },
    ];

    let lastError = null;

    for (const { key, model } of keysAndModels) {
        try {
            const response = await fetch(OPENROUTER_CONFIG.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin || 'https://mekasmart-hub.local',
                    'X-Title': 'MekaSmart Hub – Meka-Bot',
                },
                body: JSON.stringify({
                    model,
                    messages,
                    max_tokens: OPENROUTER_CONFIG.maxTokens,
                    temperature: 0.7,
                    stream: true,   // Aktifkan streaming!
                }),
                signal: AbortSignal.timeout(25000)
            });

            if (!response.ok) {
                const code = response.status;
                if (code === 429 || code === 402 || code === 404) {
                    lastError = new Error(`HTTP ${code} model ${model}`);
                    await new Promise(r => setTimeout(r, 300));
                    continue;
                }
                const errData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${code}: ${errData.error?.message || 'Error'}`);
            }

            // Baca stream SSE
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Simpan baris yang belum selesai

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') break;
                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullText += delta;
                            onChunk(delta, fullText);
                        }
                    } catch (_) { /* skip invalid JSON */ }
                }
            }

            if (!fullText) { lastError = new Error('Empty stream'); continue; }
            return fullText; // ✅ Berhasil!

        } catch (err) {
            if (err.name === 'AbortError' || err.name === 'TimeoutError') {
                lastError = new Error('Timeout: ' + model);
                await new Promise(r => setTimeout(r, 300));
                continue;
            }
            lastError = err;
            await new Promise(r => setTimeout(r, 300));
        }
    }

    throw lastError || new Error('All models failed');
}

// ========== FORMAT AI RESPONSE ==========
function formatAIResponse(text) {
    // Konversi markdown sederhana ke HTML
    let formatted = text
        // Bold: **text** -> <strong>text</strong>
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic: *text* -> <em>text</em>
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Inline code: `code` -> <code>code</code>
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
        // Headers: ## Header -> <strong>Header</strong><br>
        .replace(/^## (.+)$/gm, '<strong>$1</strong>')
        .replace(/^# (.+)$/gm, '<strong>$1</strong>')
        // Numbered list: 1. item
        .replace(/^\d+\.\s+(.+)$/gm, '&nbsp;&nbsp;• $1')
        // Bullet list: - item atau * item
        .replace(/^[-*]\s+(.+)$/gm, '&nbsp;&nbsp;• $1')
        // Newlines -> <br>
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

    // Tambahkan link otomatis untuk halaman platform
    formatted = formatted
        .replace(/\b(Meka-Lab|meka-lab)\b/gi, `<a href="${_base}meka-lab.html" class="msg-link">Meka-Lab</a>`)
        .replace(/\b(Ruang Belajar|ruang belajar)\b/gi, `<a href="${_base}ruang-belajar.html" class="msg-link">Ruang Belajar</a>`)
        .replace(/\b(Pusat Uji|pusat uji)\b/gi, `<a href="${_base}pusat-uji.html" class="msg-link">Pusat Uji</a>`)
        .replace(/\b(Asesmen Bakat|Pintu Masuk)\b/gi, `<a href="${_base}asesmen.html" class="msg-link">Pintu Masuk</a>`);

    return formatted;
}

// ========== FALLBACK RESPONSES ==========
function getFallbackResponse(text) {
    // Greetings
    if (['halo', 'hai', 'hello', 'hei', 'hi', 'selamat'].some(g => text.includes(g))) {
        return `😊 Halo juga! Aku Meka-Bot, asisten PLC-mu!<br><br>Saat ini AI sedang <em>sibuk</em> (rate limit sementara), tapi aku masih bisa menjawab pertanyaan dasar. Tanya tentang: <strong>PLC, Ladder Diagram, Timer, Interlock, HMI</strong>, atau navigasi platform ini!`;
    }

    // Identitas bot
    if (text.includes('kamu siapa') || text.includes('kamu itu') || text.includes('siapa kamu') || text.includes('siapa dirimu')) {
        return `🤖 Aku <strong>Meka-Bot</strong>, asisten AI untuk platform <strong>MekaSmart Hub</strong>!<br><br>Aku dirancang untuk membantu siswa SMK belajar PLC, Ladder Diagram, Smart Factory, dan otomasi industri. Kamu bisa tanya tentang materi PLC atau navigasi platform ini. Apa yang ingin kamu pelajari? 🚀`;
    }

    // Karir & Loker PLC (cek dulu sebelum cek 'plc' umum)
    if (text.includes('loker') || text.includes('kerja') || text.includes('karir') || text.includes('gaji') || text.includes('profesi') || text.includes('pekerjaan')) {
        return `💼 Lulusan yang menguasai PLC punya banyak peluang karir! Beberapa di antaranya:<br><br>&nbsp;&nbsp;• <strong>PLC Programmer / Technician</strong> — memprogram & maintain mesin CNC/PLC di pabrik<br>&nbsp;&nbsp;• <strong>Maintenance Engineer</strong> — troubleshooting sistem otomasi di industri manufaktur<br>&nbsp;&nbsp;• <strong>HMI/SCADA Designer</strong> — merancang tampilan kontrol pabrik<br>&nbsp;&nbsp;• <strong>Automation Engineer</strong> — integrasi sistem IoT industri<br>&nbsp;&nbsp;• <strong>Field Service Engineer</strong> — teknisi lapangan untuk brand seperti Siemens, Mitsubishi<br><br>Gaji entry-level di Indonesia mulai Rp 4-8 juta, bisa lebih tinggi dengan sertifikasi! Mulai belajar di <a href="${_base}ruang-belajar.html" class="msg-link">Ruang Belajar</a> 📚`;
    }

    // Navigasi Platform
    if (text.includes('simulasi') || text.includes('lab')) return `🏭 Simulasi Smart Factory ada di <a href="${_base}meka-lab.html" class="msg-link">Meka-Lab</a>. Di sana kamu bisa uji logika PLC-mu di pabrik virtual!`;
    if (text.includes('ujian') || text.includes('uji')) return `📝 Asesmen kompetensi PLC bertingkat (Easy → Medium → Hard) tersedia di <a href="${_base}pusat-uji.html" class="msg-link">Pusat Uji</a>.`;
    if (text.includes('asesmen') || text.includes('bakat')) return `🧠 Temukan jalur belajar PLC yang sesuai denganmu lewat tes RIASEC & GATB di <a href="${_base}asesmen.html" class="msg-link">Pintu Masuk</a>.`;
    if (text.includes('modul') || text.includes('materi') || text.includes('belajar')) return `📚 Semua modul PDF, video tutorial wiring, dan jobsheet standar industri ada di <a href="${_base}ruang-belajar.html" class="msg-link">Ruang Belajar</a>.`;
    if (text.includes('badge')) return `🏆 Badge kompetensi bisa didapatkan di <a href="${_base}pusat-uji.html" class="msg-link">Pusat Uji</a> setelah lulus setiap level ujian.`;

    // PLC Knowledge — hanya jika BENAR-BENAR tanya definisi PLC
    if (text.includes('plc') && (text.includes('apa itu') || text.includes('what is') || text.includes('pengertian') || text.includes('jelaskan plc'))) {
        return FALLBACK_KNOWLEDGE.quickAnswers['plc'];
    }
    if (text.includes('ladder')) return FALLBACK_KNOWLEDGE.quickAnswers['ladder'];
    if (text.includes('timer')) return FALLBACK_KNOWLEDGE.quickAnswers['timer'];
    if (text.includes('interlock')) return FALLBACK_KNOWLEDGE.quickAnswers['interlock'];

    if (text.includes('normally open') || text.includes(' no ') || text.includes('kontak no')) {
        return '📘 <strong>Normally Open (NO)</strong> adalah kontak yang dalam kondisi NORMAL terbuka (tidak ada arus). Kontak tertutup (aktif) ketika mendapat sinyal dari sensor/tombol.';
    }
    if (text.includes('normally closed') || text.includes(' nc ') || text.includes('kontak nc')) {
        return '📘 <strong>Normally Closed (NC)</strong> adalah kontak yang dalam kondisi NORMAL tertutup (ada arus). Kontak membuka (mati) saat mendapat sinyal. Biasa dipakai untuk tombol STOP & E-Stop.';
    }
    if (text.includes('coil') || text.includes('koil')) {
        return '📘 <strong>Output Coil</strong> adalah simbol output di Ladder Diagram. Saat semua kondisi dalam rung terpenuhi → koil aktif → output PLC menyala (motor, lampu, solenoid).';
    }
    if (text.includes('hmi')) {
        return '📘 <strong>HMI (Human Machine Interface)</strong> adalah layar sentuh/monitor yang menampilkan status mesin secara real-time dan memungkinkan operator mengontrol proses tanpa harus ke panel PLC.';
    }
    if (text.includes('scada')) {
        return '📘 <strong>SCADA</strong> (Supervisory Control and Data Acquisition) adalah sistem pengawasan skala besar untuk memantau & mengontrol banyak PLC sekaligus melalui jaringan komputer.';
    }
    if (text.includes('sensor')) {
        return '📘 <strong>Sensor</strong> mendeteksi kondisi fisik (keberadaan objek, warna, suhu, tekanan) lalu mengirim sinyal ke input PLC. Contoh: Sensor Proximity (I0.0), Sensor Warna (I0.3).';
    }
    if (text.includes('wiring')) {
        return '🔌 <strong>Wiring PLC</strong>: Sensor/tombol → Terminal Input (I0.x) → CPU PLC → Terminal Output (Q0.x) → Aktuator (motor/solenoid/lampu). Polaritas dan tegangan wajib dicek!';
    }
    if (text.includes('counter')) {
        return '📘 <strong>Counter CTU</strong> (Count Up) menghitung jumlah pulsa input. Saat nilai mencapai preset → output aktif. Contoh: Hitung 100 botol → aktifkan alarm pengisian.';
    }
    if (text.includes('crash') || text.includes('korsleting')) {
        return '💥 <strong>System Crash</strong> terjadi karena logika PLC menyebabkan kondisi tidak aman. Periksa: (1) Interlock sudah ada? (2) Emergency stop terpasang? (3) Sensor posisi dikonfirmasi?';
    }
    if (text.includes('tidak bergerak') || text.includes('motor mati') || text.includes('konveyor')) {
        return '🔧 Konveyor/Motor tidak bergerak? Cek: (1) Tombol START sudah diprogram benar? (2) STOP/E-Stop dalam kondisi NC? (3) Output Q0.0 terhubung ke motor? (4) Power supply PLC OK?';
    }

    // Default
    const fallbacks = [
        `🤔 Pertanyaanmu menarik! Saat ini koneksi AI-ku sedang rate-limited sementara. Coba lagi dalam beberapa detik, atau tanyakan hal spesifik seperti: <em>"Apa itu Timer TON?"</em> atau cek <a href="${_base}ruang-belajar.html" class="msg-link">Ruang Belajar</a> untuk materi lengkap.`,
        `💡 AI-ku sedang sibuk sebentar! Untuk pertanyaan teknis kompleks, cek modul di <a href="${_base}ruang-belajar.html" class="msg-link">Ruang Belajar</a> atau coba tanya lagi dalam 1-2 menit.`,
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ========== GLOBAL EXPORTS ==========
window.toggleMekaBot = toggleMekaBot;
window.openMekaBot = openMekaBot;
