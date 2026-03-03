/* =============================================
   MEKABOT.JS – AI Chatbot Assistant
   ============================================= */

const MEKABOT_KNOWLEDGE = {
    greetings: ['halo', 'hai', 'hello', 'hei', 'hi', 'selamat'],
    plc: {
        'apa itu plc': 'PLC (Programmable Logic Controller) adalah komputer industri yang dirancang untuk mengontrol proses manufaktur, seperti jalur perakitan atau mesin otomatis.',
        'ladder diagram': 'Ladder Diagram (LD) adalah bahasa pemrograman grafis PLC yang bentuknya menyerupai tangga. Terdiri dari rung (anak tangga) dengan kontak (input) dan koil (output).',
        'normally open': 'Kontak Normally Open (NO) adalah kontak yang dalam kondisi normal terbuka (tidak aktif). Kontak ini menutup (aktif) ketika mendapat sinyal logika 1 dari sensor atau tombol.',
        'normally closed': 'Kontak Normally Closed (NC) adalah kontak yang dalam kondisi normal tertutup (aktif). Kontak ini membuka (tidak aktif) ketika mendapat sinyal logika 1.',
        'interlock': 'Interlock adalah logika keamanan dalam PLC yang mencegah dua perangkat beroperasi secara bersamaan untuk menghindari kerusakan. Misalnya, motor forward dan reverse tidak bisa aktif bersamaan.',
        'timer': 'Timer pada PLC digunakan untuk menunda aksi. TON (Timer On-Delay) mulai menghitung ketika kondisi input terpenuhi, dan output aktif setelah preset time tercapai.',
        'counter': 'Counter digunakan untuk menghitung jumlah pulsa. CTU (Count Up) menghitung naik dari 0 hingga nilai preset, lalu mengaktifkan output.',
        'coil': 'Koil (Output Coil) adalah simbol output dalam Ladder Diagram. Ketika semua kondisi dalam sebuah rung terpenuhi, koil diaktifkan (logika 1) dan output PLC nyala.',
        'hmi': 'HMI (Human Machine Interface) adalah antarmuka grafis yang memungkinkan operator memantau dan mengendalikan proses industri. Biasanya berupa layar sentuh yang terhubung ke PLC.',
        'scada': 'SCADA (Supervisory Control and Data Acquisition) adalah sistem untuk memantau dan mengontrol infrastruktur skala besar menggunakan komputer, jaringan, dan sensor.',
        'sensor': 'Sensor dalam sistem PLC mendeteksi kondisi fisik seperti keberadaan objek (proximity sensor), warna, tekanan, atau suhu, lalu mengirim sinyal ke input PLC.',
        'wiring': 'Wiring PLC adalah proses menghubungkan kabel dari sensor/tombol ke terminal input PLC, dan dari terminal output PLC ke aktuator (motor, solenoid, lampu).',
        'i/o': 'I/O (Input/Output) adalah port komunikasi PLC. Input menerima sinyal dari sensor/tombol. Output mengirim sinyal ke aktuator. Contoh: I0.0 (input 0), Q0.0 (output 0).',
    },
    navigation: {
        'modul counter': '📚 Modul tentang Counter tersedia di <b>Ruang Belajar → Modul 4: Timer & Counter</b>. <a href="ruang-belajar.html" class="msg-link">Klik di sini untuk ke Ruang Belajar</a>.',
        'modul timer': '📚 Materi Timer ada di <b>Modul 4: Timer & Counter PLC</b>. <a href="ruang-belajar.html" class="msg-link">Buka Ruang Belajar</a>.',
        'modul ladder': '📚 Pemrograman Ladder Diagram ada di <b>Modul 2: Dasar Pemrograman PLC</b>. <a href="ruang-belajar.html" class="msg-link">Lihat modul</a>.',
        'asesmen': '🚪 Untuk tes bakat dan minat, pergi ke <a href="asesmen.html" class="msg-link">Pintu Masuk (Asesmen Bakat)</a>.',
        'ujian': '📝 Asesmen kompetensi tersedia di <a href="pusat-uji.html" class="msg-link">Pusat Uji</a>.',
        'simulasi': '🏭 Simulasi Smart Factory ada di <a href="meka-lab.html" class="msg-link">Meka-Lab</a>.',
        'download': '⬇️ Semua file PDF dan Jobsheet bisa diunduh dari <a href="ruang-belajar.html" class="msg-link">Ruang Belajar</a>.',
        'badge': '🏆 Badge kompetensi bisa didapatkan di <a href="pusat-uji.html" class="msg-link">Pusat Uji</a> setelah lulus setiap level ujian.',
    },
    errors: {
        'korsleting': '⚡ Error "Korsleting Virtual" biasanya terjadi karena dua output aktif bersamaan tanpa interlock. Tambahkan kontak NC pada rung output yang berlawanan.',
        'system crash': '💥 "System Crash" muncul ketika logika PLC menyebabkan kondisi tidak aman, seperti motor bergerak tanpa konfirmasi sensor posisi. Periksa logika interlock-mu.',
        'tidak bergerak': '🔧 Konveyor tidak bergerak? Periksa: (1) Tombol START sudah diprogram dengan benar? (2) Emergency stop dalam kondisi NC? (3) Output Q0.0 sudah terhubung ke motor?',
        'sensor tidak aktif': '🔬 Sensor tidak terdeteksi? Kemungkinan: (1) Alamat sensor salah (cek I0.x), (2) Kabel sensor tidak terhubung, (3) Jarak objek terlalu jauh dari sensor.',
    }
};

const SUGGESTIONS_LIST = [
    'Apa itu Interlock?',
    'Jelaskan Timer TON',
    'Carikan modul Counter',
    'Cara ke Simulasi?',
    'Apa itu Ladder Diagram?',
    'Error System Crash?',
];

let mekaBotOpen = false;
let mekaBotInitialized = false;

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
    // Welcome message
    appendBotMsg('👋 Halo! Aku <strong>Meka-Bot</strong>, asisten PLC-mu. Tanya apa saja tentang materi, navigasi web, atau error yang kamu temui!');

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

function sendMessage() {
    const input = document.getElementById('mekabotInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';
    appendUserMsg(text);

    // Show typing indicator
    const typingMsg = appendBotMsg('', true);

    setTimeout(() => {
        typingMsg.remove();
        const response = getResponse(text.toLowerCase());
        appendBotMsg(response);
        renderSuggestions();
    }, 700 + Math.random() * 600);
}

function getResponse(text) {
    // Greetings
    if (MEKABOT_KNOWLEDGE.greetings.some(g => text.includes(g))) {
        return '😊 Halo juga! Ada yang bisa aku bantu? Tanya tentang <strong>materi PLC</strong>, <strong>navigasi web</strong>, atau <strong>troubleshoot error</strong>!';
    }

    // Navigation queries
    for (const [key, val] of Object.entries(MEKABOT_KNOWLEDGE.navigation)) {
        if (text.includes(key.split(' ')[0]) && (key.split(' ')[1] ? text.includes(key.split(' ')[1]) : true)) {
            // Better check: all words in key exist in text
            const words = key.split(' ');
            if (words.every(w => text.includes(w))) return val;
        }
    }

    // Simple navigation shortcuts
    if (text.includes('modul') && text.includes('counter')) return MEKABOT_KNOWLEDGE.navigation['modul counter'];
    if (text.includes('modul') && text.includes('timer')) return MEKABOT_KNOWLEDGE.navigation['modul timer'];
    if (text.includes('modul') && text.includes('ladder')) return MEKABOT_KNOWLEDGE.navigation['modul ladder'];
    if (text.includes('simulasi') || text.includes('lab')) return MEKABOT_KNOWLEDGE.navigation['simulasi'];
    if (text.includes('ujian') || text.includes('uji')) return MEKABOT_KNOWLEDGE.navigation['ujian'];
    if (text.includes('asesmen') || text.includes('bakat')) return MEKABOT_KNOWLEDGE.navigation['asesmen'];
    if (text.includes('download') || text.includes('unduh')) return MEKABOT_KNOWLEDGE.navigation['download'];
    if (text.includes('badge')) return MEKABOT_KNOWLEDGE.navigation['badge'];

    // Error troubleshooting
    for (const [key, val] of Object.entries(MEKABOT_KNOWLEDGE.errors)) {
        if (text.includes(key)) return val;
    }
    if (text.includes('crash')) return MEKABOT_KNOWLEDGE.errors['system crash'];
    if (text.includes('tidak') && text.includes('bergerak')) return MEKABOT_KNOWLEDGE.errors['tidak bergerak'];

    // PLC knowledge
    for (const [key, val] of Object.entries(MEKABOT_KNOWLEDGE.plc)) {
        const words = key.split(' ');
        if (words.length === 1 && text.includes(key)) return `📘 <strong>${key.toUpperCase()}</strong><br><br>${val}`;
        if (words.every(w => text.includes(w))) return `📘 <strong>${key.toUpperCase()}</strong><br><br>${val}`;
    }

    // Topic-specific fallbacks
    if (text.includes('plc')) return MEKABOT_KNOWLEDGE.plc['apa itu plc'];
    if (text.includes('ladder')) return MEKABOT_KNOWLEDGE.plc['ladder diagram'];
    if (text.includes('timer')) return MEKABOT_KNOWLEDGE.plc['timer'];
    if (text.includes('counter')) return MEKABOT_KNOWLEDGE.plc['counter'];
    if (text.includes('sensor')) return MEKABOT_KNOWLEDGE.plc['sensor'];
    if (text.includes('hmi')) return MEKABOT_KNOWLEDGE.plc['hmi'];
    if (text.includes('interlock')) return MEKABOT_KNOWLEDGE.plc['interlock'];
    if (text.includes('wiring')) return MEKABOT_KNOWLEDGE.plc['wiring'];
    if (text.includes('scada')) return MEKABOT_KNOWLEDGE.plc['scada'];
    if (text.includes('coil')) return MEKABOT_KNOWLEDGE.plc['coil'];

    // Default fallback
    const fallbacks = [
        '🤔 Pertanyaanmu menarik! Coba tanyakan lebih spesifik, misalnya: "Apa itu Timer TON?" atau "Carikan modul Ladder Diagram".',
        '📚 Aku tidak menemukan jawaban pastinya. Coba cek <a href="../pages/ruang-belajar.html" class="msg-link">Ruang Belajar</a> untuk materi lengkap.',
        '💡 Untuk pertanyaan teknis yang kompleks, tanyakan langsung ke gurumu atau cek forum diskusi. Aku bisa membantu navigasi dan pertanyaan dasar PLC!',
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

window.toggleMekaBot = toggleMekaBot;
window.openMekaBot = openMekaBot;
