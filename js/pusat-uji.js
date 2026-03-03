/* =============================================
   PUSAT-UJI.JS – Digital Assessment System
   ============================================= */

// ========== QUESTION BANK ==========
const QUESTION_BANK = {
    easy: [
        { id: 'e1', q: 'Kepanjangan dari PLC adalah...', opts: ['Programmable Logic Controller', 'Processing Logic Circuit', 'Programmed Line Control', 'Power Logic Computer'], ans: 0, exp: 'PLC = Programmable Logic Controller. Perangkat komputer industri yang diprogram untuk mengontrol proses.' },
        { id: 'e2', q: 'Simbol kontak Normally Open (NO) pada Ladder Diagram berbentuk...', opts: ['Garis vertikal tunggal (|)', 'Dua garis vertikal (|   |)', 'Garis dengan tanda slash (/|   |/)', 'Lingkaran (O)'], ans: 1, exp: 'Kontak NO dilambangkan dengan dua garis vertikal: |   |, sementara NC dilambangkan dengan |/|.' },
        { id: 'e3', q: 'Output dalam Ladder Diagram disimbolkan dengan...', opts: ['Kontak NO (|   |)', 'Kontak NC (|/|)', 'Koil ( ) dalam tanda kurung', 'Blok fungsi ─┤FB├─'], ans: 2, exp: 'Output (Coil) dilambangkan dengan ( ) – tanda kurung yang berarti output aktif saat kondisi rung terpenuhi.' },
        { id: 'e4', q: 'Jika tombol Start ditekan sekali lalu dilepas, tetapi motor tetap ON – ini adalah fungsi dari...', opts: ['Interlock', 'Self-Latch (Pengunci Diri)', 'Timer', 'Counter'], ans: 1, exp: 'Self-Latch menggunakan kontak output parallel dengan tombol Start agar motor tetap ON setelah tombol dilepas.' },
        { id: 'e5', q: 'Tombol STOP pada rangkaian PLC biasanya menggunakan kontak jenis...', opts: ['Normally Open (NO)', 'Normally Closed (NC)', 'Toggle Switch', 'Momentary Push'], ans: 1, exp: 'Tombol STOP menggunakan NC agar ketika ditekan, kontak terbuka dan memutus arus ke output.' },
        { id: 'e6', q: 'Alamat input pada PLC Siemens biasanya diawali dengan huruf...', opts: ['Q', 'M', 'I', 'T'], ans: 2, exp: 'Pada PLC Siemens: I = Input, Q = Output, M = Memory, T = Timer.' },
        { id: 'e7', q: 'Alamat output pada PLC Siemens diawali dengan huruf...', opts: ['I', 'Q', 'M', 'C'], ans: 1, exp: 'Q (Quality/Quarter) digunakan untuk Output pada PLC Siemens. Contoh: Q0.0, Q0.1.' },
        { id: 'e8', q: 'Timer TON adalah singkatan dari...', opts: ['Total ON', 'Timer Off-Delay', 'Timer On-Delay', 'Timer Over Night'], ans: 2, exp: 'TON = Timer On-Delay. Output timer aktif setelah preset time terpenuhi sejak input aktif.' },
        { id: 'e9', q: 'HMI dalam industri singkatan dari...', opts: ['Human Memory Interface', 'Hardware Monitoring Interface', 'Human Machine Interface', 'High Management Input'], ans: 2, exp: 'HMI = Human Machine Interface – antarmuka visual untuk operator mengontrol mesin.' },
        { id: 'e10', q: 'Sensor yang mendeteksi logam tanpa kontak fisik disebut...', opts: ['Temperature Sensor', 'Proximity Sensor (Induktif)', 'Barcode Scanner', 'Flow Meter'], ans: 1, exp: 'Proximity Sensor Induktif mendeteksi logam ferrous tanpa menyentuhnya menggunakan medan elektromagnetik.' },
        { id: 'e11', q: 'Dalam PLC, CTU merupakan jenis...', opts: ['Counter Up (Penghitung Naik)', 'Control Timer Unit', 'Coil Toggle Up', 'Circuit Testing Unit'], ans: 0, exp: 'CTU = Count Up Counter. Menghitung naik dari 0 ke nilai preset, lalu mengaktifkan output Counter Done.' },
        { id: 'e12', q: 'Apa fungsi dari Emergency Stop (E-Stop) pada sistem PLC?', opts: ['Mematikan hanya motor', 'Mereset program PLC', 'Memutus semua output secara cepat untuk keselamatan', 'Mengaktifkan alarm saja'], ans: 2, exp: 'E-Stop dirancang untuk memutus semua output secara cepat dan aman ketika terjadi kondisi berbahaya.' },
        { id: 'e13', q: 'Ladder Diagram yang baik dibaca dari arah...', opts: ['Kanan ke Kiri, Bawah ke Atas', 'Kiri ke Kanan, Atas ke Bawah', 'Tengah ke Tepi', 'Bebas sesuai programmer'], ans: 1, exp: 'Ladder Diagram dibaca seperti membaca tangga: dari kiri ke kanan dalam satu rung, lalu turun ke rung berikutnya.' },
        { id: 'e14', q: 'Berapa tegangan umum yang digunakan pada jalur sinyal input PLC industri?', opts: ['220V AC', '12V DC', '24V DC', '110V AC'], ans: 2, exp: '24V DC adalah tegangan standar industri untuk sinyal input PLC karena aman dan stabil.' },
        { id: 'e15', q: 'Apa yang terjadi pada kontak NC jika koil-nya aktif?', opts: ['Kontak NC tetap tertutup', 'Kontak NC membuka (terbuka)', 'Kontak NC menjadi NO', 'Tidak ada perubahan'], ans: 1, exp: 'Saat koil NC aktif, kontak-nya membuka (berlawanan dengan NO). Ini adalah prinsip dasar kontak NC.' },
    ],
    medium: [
        { id: 'm1', q: 'Interlock pada PLC bertujuan untuk mencegah...', opts: ['Motor terlalu panas', 'Dua output yang saling berlawanan aktif bersamaan', 'Timer melebihi preset', 'Counter overflow'], ans: 1, exp: 'Interlock adalah logika keselamatan yang mencegah dua kondisi berbahaya (misal: Forward & Reverse) aktif bersamaan.' },
        { id: 'm2', q: 'Pada Ladder Diagram, sebuah rung (anak tangga) dieksekusi jika...', opts: ['Ada sinyal di input PLC manapun', 'Semua kondisi dalam rung menghasilkan logika TRUE', 'Program di-compile ulang', 'Timer sudah selesai'], ans: 1, exp: 'Sebuah rung dieksekusi (koil aktif) hanya jika semua kontak dalam jalur kontinuitas rung tersebut bernilai TRUE.' },
        { id: 'm3', q: 'Berikut ini yang BUKAN termasuk bahasa pemrograman PLC standar IEC 61131-3 adalah:', opts: ['Ladder Diagram (LD)', 'Function Block Diagram (FBD)', 'Python Script (PY)', 'Structured Text (ST)'], ans: 2, exp: 'IEC 61131-3 mendefinisikan: LD, FBD, IL, ST, dan SFC. Python bukan bagian dari standar ini.' },
        { id: 'm4', q: 'Pada instruksi SET dan RESET pada PLC, perbedaan utamanya adalah...', opts: ['SET lebih cepat dari RESET', 'SET mengunci output ON, RESET mengunci output OFF', 'SET untuk timer, RESET untuk counter', 'Tidak ada perbedaan'], ans: 1, exp: 'Instruksi SET mengunci output tetap ON meski input sudah tidak aktif. RESET mengunci output tetap OFF.' },
        { id: 'm5', q: 'Jika program PLC memiliki Scan Time 10ms, artinya...', opts: ['PLC membutuhkan 10ms untuk boot', 'Program dieksekusi ulang setiap 10ms', 'Timer akan selalu bernilai 10ms', 'Output merespons input dengan delay 10ms saja'], ans: 1, exp: 'Scan Time adalah waktu PLC membaca semua input, mengeksekusi program, dan memperbarui semua output dalam satu siklus.' },
        { id: 'm6', q: 'Apa perbedaan antara TON (Timer On-Delay) dan TOF (Timer Off-Delay)?', opts: ['TON lebih akurat dari TOF', 'TON: output aktif setelah delay, TOF: output mati setelah delay', 'TOF lebih cepat merespons', 'Tidak ada perbedaan fungsional'], ans: 1, exp: 'TON: output aktif setelah input aktif selama preset time. TOF: output mati setelah input tidak aktif selama preset time.' },
        { id: 'm7', q: 'Instruksi MOVE (MOV) pada PLC digunakan untuk...', opts: ['Menggerakkan robot arm', 'Menyalin nilai dari satu register ke register lain', 'Menghapus semua output', 'Mengaktifkan beberapa output sekaligus'], ans: 1, exp: 'Instruksi MOV menyalin nilai dari source (sumber) ke destination (tujuan) dalam memori PLC.' },
        { id: 'm8', q: 'Protocol komunikasi MODBUS digunakan dalam industri untuk...', opts: ['Komunikasi antara PLC dengan device lain melalui serial/ethernet', 'Encoding data sensor', 'Keamanan jaringan industri', 'Protokol WiFi khusus pabrik'], ans: 0, exp: 'Modbus adalah protokol komunikasi serial/ethernet yang umum digunakan untuk komunikasi master-slave antar perangkat industri.' },
        { id: 'm9', q: 'Dalam control logic PLC, instruksi AND dieksekusi sebagai...', opts: ['Kedua kondisi boleh salah satu', 'Semua kondisi harus TRUE agar output TRUE', 'Salah satu kondisi cukup TRUE', 'Kondisi XOR dari dua input'], ans: 1, exp: 'Instruksi AND memerlukan SEMUA input bernilai TRUE agar output-nya TRUE (logika seri).' },
        { id: 'm10', q: 'Apa itu SCADA dalam konteks industri?', opts: ['Software desain HMI', 'Sistem monitoring dan kontrol skala besar dari jarak jauh', 'Bahasa pemrograman PLC', 'Jenis sensor industri'], ans: 1, exp: 'SCADA = Supervisory Control and Data Acquisition. Sistem untuk memantau dan mengontrol infrastruktur skala besar secara terpusat.' },
    ],
    hard: [
        { id: 'h1', q: 'Sebuah program PLC menggunakan logika: LOAD I0.0 / AND NOT Q0.1 / OUT Q0.0. Apa yang terjadi jika I0.0 aktif dan Q0.1 sudah aktif?', opts: ['Q0.0 aktif', 'Q0.0 tidak aktif – interlock mencegahnya', 'Error runtime', 'Q0.0 dan Q0.1 keduanya aktif'], ans: 1, exp: 'AND NOT Q0.1 berarti Q0.0 hanya bisa aktif jika Q0.1 TIDAK aktif. Ini adalah implementasi interlock yang benar.' },
        { id: 'h2', q: 'Pada sistem Single-Scan PLC, jika sebuah output diSET dan diRESET dalam rung yang berbeda di scan yang sama, hasil akhirnya adalah...', opts: ['Output bernilai SET (ON)', 'Output bernilai RESET (OFF) – rung terakhir menang', 'Akan terjadi error', 'Output alternating antara ON dan OFF'], ans: 1, exp: 'Dalam satu scan, jika ada SET dan RESET untuk output yang sama, nilai terakhir yang dieksekusi yang menentukan hasil akhir.' },
        { id: 'h3', q: 'Apa perbedaan utama antara PROFIBUS dan EtherNet/IP sebagai protokol komunikasi industri?', opts: ['Tidak ada perbedaan', 'PROFIBUS lebih cepat', 'EtherNet/IP menggunakan ethernet standar, PROFIBUS menggunakan bus khusus', 'PROFIBUS hanya untuk Siemens'], ans: 2, exp: 'EtherNet/IP berbasis TCP/IP ethernet biasa (lebih mudah diintegrasikan). PROFIBUS menggunakan bus serial khusus dengan topologi khas industri.' },
        { id: 'h4', q: 'Dalam desain HMI yang baik, warna merah umumnya digunakan untuk...', opts: ['Status normal dan running', 'Alarm, fault, dan kondisi berbahaya', 'Informasi tambahan', 'Indikator motor berhenti normal'], ans: 1, exp: 'Standar ISA-5.5 mendefinisikan warna HMI: Merah = Alarm/Fault/Bahaya, Hijau = Normal/Running, Kuning = Warning.' },
        { id: 'h5', q: 'Redundansi pada sistem PLC industri kritis (seperti di kilang minyak) berarti...', opts: ['Dua monitor untuk satu operator', 'Memiliki sistem backup yang mengambil alih otomatis jika sistem utama gagal', 'Menggunakan dua jenis PLC berbeda', 'Backup data program setiap hari'], ans: 1, exp: 'Sistem redundan (Hot-Standby) memiliki PLC backup yang terus sinkron dengan primary, siap mengambil alih dalam milidetik.' },
        { id: 'h6', q: 'Jika timer T0 memiliki preset 5000ms dan program berjalan dengan scan time 20ms, berapa maksimum error akurasi timer?', opts: ['0ms – timer selalu akurat', 'Hingga 20ms – satu scan time', 'Hingga 5000ms', 'Hingga 10ms – setengah scan'], ans: 1, exp: 'Karena timer diupdate setiap scan, akurasi timer maksimum adalah ±1 scan time (dalam kasus ini ±20ms).' },
        { id: 'h7', q: 'Operator industri menemukan konveyor berhenti tapi tidak ada alarm. Langkah troubleshoot pertama yang PALING tepat adalah...', opts: ['Restart ulang PLC', 'Cek status bit output Q0.0 di PLC monitoring – apakah program sudah memerintahkan OFF?', 'Ganti motor konveyor', 'Hubungi vendor PLC'], ans: 1, exp: 'Diagnosa sistematis: cek status output di PLC dulu. Jika Q0.0 sudah OFF dari program, masalah ada di logika. Jika Q0.0 ON tapi motor tidak bergerak, masalah ada di hardware.' },
        { id: 'h8', q: 'Fungsi dari instruksi JMP (Jump) pada PLC adalah...', opts: ['Reset semua output', 'Loncat ke label tertentu dalam program, melewati instruksi di antaranya', 'Emergency stop program', 'Menyimpan nilai ke memori'], ans: 1, exp: 'JMP melompat ke label yang ditentukan, melewati semua instruksi di antaranya. Berguna untuk conditional execution, tapi harus digunakan hati-hati.' },
        { id: 'h9', q: 'Dalam safety system modern (IEC 61508), sistem PLC Safety Integrity Level 3 (SIL 3) memiliki probability of failure on demand (PFD) sebesar...', opts: ['10⁻¹ hingga 10⁻²', '10⁻² hingga 10⁻³', '10⁻³ hingga 10⁻⁴', '10⁻⁴ hingga 10⁻⁵'], ans: 2, exp: 'SIL 3 memiliki PFD 10⁻³ hingga 10⁻⁴ (failure 1 kali dalam 1000-10000 permintaan). Ini digunakan untuk sistem safety kritis.' },
        { id: 'h10', q: 'Program Ladder Diagram menggunakan instruksi OSP (One Shot Pulse Rising). Apa yang dilakukan instruksi ini?', opts: ['Output selalu ON saat input ON', 'Output aktif hanya SATU scan saat input berubah dari OFF ke ON', 'Output aktif satu detik saat input ON', 'Output alternating setiap scan'], ans: 1, exp: 'OSP (One Shot Pulse) menghasilkan pulsa satu scan saat ada transisi naik (OFF→ON). Berguna untuk trigger/event yang hanya dijalankan sekali.' },
    ]
};

// ========== BADGES ==========
const BADGES_DATA = [
    { icon: '🌱', name: 'Pemula PLC', desc: 'Selesaikan Asesmen Level Easy', req: 'easy' },
    { icon: '⚡', name: 'Technician', desc: 'Selesaikan Asesmen Level Medium', req: 'medium' },
    { icon: '🔬', name: 'Engineer', desc: 'Selesaikan Asesmen Level Hard', req: 'hard' },
    { icon: '🏆', name: 'Master PLC', desc: 'Lulus semua level dengan nilai ≥90', req: 'master' },
    { icon: '🤖', name: 'Simulator Pro', desc: 'Jalankan semua skenario di Meka-Lab', req: 'sim' },
    { icon: '📚', name: 'Kutu Buku', desc: 'Selesaikan semua modul di Ruang Belajar', req: 'modules' },
];

// ========== LEADERBOARD ==========
const LEADERBOARD_DATA = [
    { rank: 1, name: 'Rizqi Ahmad Z.', school: 'SMKN 2 Surabaya', scores: [95, 88, 78], badges: '🌱⚡🔬' },
    { rank: 2, name: 'Siti Nurhayati', school: 'SMKN 1 Malang', scores: [92, 85, 70], badges: '🌱⚡🔬' },
    { rank: 3, name: 'Budi Santoso', school: 'SMKN 3 Jakarta', scores: [90, 82, 75], badges: '🌱⚡🔬' },
    { rank: 4, name: 'Dewi Rahayu', school: 'SMKN 1 Bandung', scores: [88, 80, 0], badges: '🌱⚡' },
    { rank: 5, name: 'Ahmad Fauzi', school: 'SMKN 2 Yogyakarta', scores: [85, 78, 0], badges: '🌱⚡' },
    { rank: 6, name: 'Putri Amalia', school: 'SMKN 1 Semarang', scores: [82, 72, 0], badges: '🌱⚡' },
    { rank: 7, name: 'Dani Pratama', school: 'SMKN 4 Surabaya', scores: [80, 0, 0], badges: '🌱' },
    { rank: 8, name: 'Fatimah S.', school: 'SMKN 2 Malang', scores: [78, 0, 0], badges: '🌱' },
];

const RANK_COLORS = { 1: 'gold', 2: 'silver', 3: 'bronze' };
const AVATAR_COLORS = ['#00c8ff', '#39ff14', '#a855f7', '#ff6b00', '#00ffd5', '#ffd700', '#ff4080', '#00bfff'];

// ========== EXAM STATE ==========
let examState = {
    level: null,
    questions: [],
    current: 0,
    answers: {},
    timer: null,
    timeLeft: 0,
};

// ========== INIT ==========
window.addEventListener('DOMContentLoaded', () => {
    renderBadges();
    renderLevels();
    renderLeaderboard();
});

// ========== RENDER BADGES ==========
function renderBadges() {
    const grid = document.getElementById('badgesGrid');
    const earnedSet = Store.get('earnedBadges', []);

    grid.innerHTML = BADGES_DATA.map(b => {
        const earned = earnedSet.includes(b.req);
        return `
    <div class="badge-card ${earned ? 'earned' : 'locked'}">
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-name">${b.name}</div>
      <div class="badge-desc">${b.desc}</div>
      ${earned ? '<span class="badge-earned-label">✓ Diperoleh</span>' : '<span class="badge-locked-label">🔒 Terkunci</span>'}
    </div>`;
    }).join('');
}

// ========== RENDER LEVELS ==========
function renderLevels() {
    const grid = document.getElementById('levelsGrid');
    const scores = Store.get('examScores', {});
    const config = [
        { level: 'easy', icon: '🌱', color: 'easy', title: 'Level Easy', desc: 'Cocok untuk pemula. Soal dasar teori dan konsep PLC.', qCount: 15, duration: 20, minPass: 70 },
        { level: 'medium', icon: '⚡', color: 'medium', title: 'Level Medium', desc: 'Untuk yang sudah paham dasar. Logika dan analisis program PLC.', qCount: 10, duration: 25, minPass: 70, reqPrev: 'easy' },
        { level: 'hard', icon: '🔬', color: 'hard', title: 'Level Hard', desc: 'Tingkat lanjut. Troubleshooting, safety, dan komunikasi industri.', qCount: 10, duration: 30, minPass: 70, reqPrev: 'medium' },
    ];

    grid.innerHTML = config.map(c => {
        const best = scores[c.level]?.best || null;
        const locked = c.reqPrev && !(scores[c.reqPrev]?.passed);

        return `
    <div class="level-card ${c.color} ${locked ? 'locked' : ''}" onclick="${locked ? '' : `openExam('${c.level}')`}">
      <div class="level-icon">${c.icon}</div>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <div class="level-info">
        <div class="linfo"><span class="linfo-val">${c.qCount}</span><span class="linfo-label">Soal</span></div>
        <div class="linfo"><span class="linfo-val">${c.duration}</span><span class="linfo-label">Menit</span></div>
        <div class="linfo"><span class="linfo-val">${c.minPass}</span><span class="linfo-label">Min. Lulus</span></div>
      </div>
      <div class="level-best">${best !== null ? `Skor Terbaikmu: <strong>${best}</strong>` : locked ? '🔒 Selesaikan level sebelumnya' : 'Belum pernah dikerjakan'}</div>
      <button class="btn ${c.level === 'easy' ? 'btn-green' : c.level === 'medium' ? 'btn-primary' : 'btn-outline'} ${locked ? '' : ''}" ${locked ? 'disabled' : ''}>
        ${locked ? '🔒 Terkunci' : best !== null ? '🔄 Ulangi Ujian' : '🚀 Mulai Ujian'}
      </button>
    </div>`;
    }).join('');
}

// ========== OPEN EXAM ==========
function openExam(level) {
    const configs = { easy: { title: 'Dasar PLC – Level Easy', duration: 20, qCount: 15 }, medium: { title: 'Pemrograman PLC – Level Medium', duration: 25, qCount: 10 }, hard: { title: 'Teknik Lanjut – Level Hard', duration: 30, qCount: 10 } };
    const cfg = configs[level];

    examState.level = level;
    examState.questions = shuffleArray(QUESTION_BANK[level]).slice(0, cfg.qCount);
    examState.current = 0;
    examState.answers = {};
    examState.timeLeft = cfg.duration * 60;

    // Set exam info
    document.getElementById('examLevelBadge').textContent = level.toUpperCase();
    document.getElementById('examLevelBadge').className = `exam-level-badge ${level.toUpperCase()}`;
    document.getElementById('examTitle').textContent = cfg.title;
    document.getElementById('examDuration').textContent = cfg.duration + ' menit';
    document.getElementById('examQCount').textContent = cfg.qCount + '';

    // Show modal
    document.getElementById('examStart').style.display = 'block';
    document.getElementById('examQuestions').style.display = 'none';
    document.getElementById('examResult').style.display = 'none';
    document.getElementById('examModal').classList.add('open');
    document.getElementById('examModalBg').classList.add('open');

    // Listeners
    document.getElementById('startExamBtn').onclick = startExam;
    document.getElementById('closeExamModal').onclick = closeExam;
    document.getElementById('examModalBg').onclick = null; // Don't close on bg
}

function startExam() {
    document.getElementById('examStart').style.display = 'none';
    document.getElementById('examQuestions').style.display = 'block';

    renderExamQuestion();
    buildQuestionNav();
    startTimer();
}

function renderExamQuestion() {
    const q = examState.questions[examState.current];
    const ans = examState.answers[q.id];
    const isReview = typeof ans !== 'undefined' && examState.reviewing;

    // Update nav
    document.getElementById('examQIndicator').textContent = `${examState.current + 1} / ${examState.questions.length}`;
    const pct = ((examState.current + 1) / examState.questions.length) * 100;
    document.getElementById('examProgressFill').style.width = pct + '%';

    const container = document.getElementById('examQContainer');
    container.innerHTML = `
    <div class="exam-q">
      <p class="exam-q-text">${examState.current + 1}. ${q.q}</p>
      <div class="exam-q-opts">
        ${q.opts.map((opt, i) => `
          <button class="exam-opt ${ans === i ? 'selected' : ''}" onclick="selectExamOpt(${i})" ${examState.reviewing ? 'disabled' : ''}>
            ${String.fromCharCode(65 + i)}. ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;

    document.getElementById('examPrevBtn').disabled = examState.current === 0;
    document.getElementById('examNextBtn').disabled = false;
    document.getElementById('examNextBtn').textContent = examState.current === examState.questions.length - 1 ? 'Selesai ✓' : 'Berikutnya →';

    document.getElementById('examNextBtn').onclick = examState.current === examState.questions.length - 1 ? () => confirmSubmit() : () => { examState.current++; renderExamQuestion(); updateQNav(); };
    document.getElementById('examPrevBtn').onclick = () => { examState.current--; renderExamQuestion(); updateQNav(); };
    document.getElementById('submitExamBtn').onclick = confirmSubmit;

    updateQNav();
}

function selectExamOpt(idx) {
    const q = examState.questions[examState.current];
    examState.answers[q.id] = idx;
    document.querySelectorAll('.exam-opt').forEach((btn, i) => btn.classList.toggle('selected', i === idx));
    updateQNav();
}

function buildQuestionNav() {
    const nav = document.getElementById('questionNav');
    nav.innerHTML = examState.questions.map((q, i) => `
    <button class="q-nav-btn ${i === examState.current ? 'current' : ''} ${examState.answers[q.id] !== undefined ? 'answered' : ''}" 
            id="qnav-${i}" onclick="goToQ(${i})">${i + 1}</button>
  `).join('');
}

function updateQNav() {
    examState.questions.forEach((q, i) => {
        const btn = document.getElementById('qnav-' + i);
        if (!btn) return;
        btn.className = 'q-nav-btn' + (i === examState.current ? ' current' : '') + (examState.answers[q.id] !== undefined ? ' answered' : '');
    });
}

function goToQ(idx) { examState.current = idx; renderExamQuestion(); updateQNav(); }

function startTimer() {
    clearInterval(examState.timer);
    examState.timer = setInterval(() => {
        examState.timeLeft--;
        const m = Math.floor(examState.timeLeft / 60);
        const s = examState.timeLeft % 60;
        const timerEl = document.getElementById('examTimer');
        timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        timerEl.className = examState.timeLeft < 120 ? 'exam-timer-display warning' : 'exam-timer-display';
        if (examState.timeLeft <= 0) { clearInterval(examState.timer); submitExam(); }
    }, 1000);
}

function confirmSubmit() {
    const unanswered = examState.questions.filter(q => examState.answers[q.id] === undefined).length;
    if (unanswered > 0) {
        showToast(`⚠️ Masih ada ${unanswered} soal yang belum dijawab!`, 'warning');
    }
    submitExam();
}

function submitExam() {
    clearInterval(examState.timer);

    let correct = 0;
    examState.questions.forEach(q => {
        if (examState.answers[q.id] === q.ans) correct++;
    });

    const total = examState.questions.length;
    const score = Math.round((correct / total) * 100);
    const passed = score >= 70;

    // Save scores
    const scores = Store.update('examScores', {}, s => {
        if (!s[examState.level]) s[examState.level] = { best: 0, passed: false, attempts: 0 };
        s[examState.level].attempts++;
        if (score > s[examState.level].best) s[examState.level].best = score;
        if (passed) s[examState.level].passed = true;
        return s;
    });

    // Award badge
    if (passed) {
        Store.update('earnedBadges', [], b => {
            if (!b.includes(examState.level)) b.push(examState.level);
            return b;
        });
        renderBadges();
        renderLevels();
    }

    // Show result
    document.getElementById('examQuestions').style.display = 'none';
    document.getElementById('examResult').style.display = 'block';

    const deg = (score / 100) * 360;
    const resultHtml = `
    <div class="${passed ? 'result-passed' : 'result-failed'}">
      <div class="result-score-circle" style="--score-deg:${deg}deg">
        <div class="result-score-inner">
          <span class="result-score-num">${score}</span>
          <span class="result-score-label">/ 100</span>
        </div>
      </div>
      <h2>${passed ? '🎉 LULUS!' : '😔 Belum Lulus'}</h2>
      <p>${passed ? `Selamat! Kamu lulus dengan skor <strong>${score}</strong>. ${score >= 90 ? 'Luar biasa! Hampir sempurna!' : 'Kerja bagus!'}` : `Skor kamu ${score}. Nilai minimum lulus adalah 70. Pelajari kembali materinya dan coba lagi!`}</p>
      <div class="result-breakdown">
        <div class="breakdown-item"><div class="breakdown-num" style="color:var(--accent-green)">${correct}</div><div class="breakdown-label">Benar</div></div>
        <div class="breakdown-item"><div class="breakdown-num" style="color:#ff4040">${total - correct}</div><div class="breakdown-label">Salah</div></div>
        <div class="breakdown-item"><div class="breakdown-num" style="color:var(--accent-blue)">${score}</div><div class="breakdown-label">Skor Akhir</div></div>
      </div>
      <h4 style="margin-bottom:16px;text-align:left">📝 Pembahasan Jawaban:</h4>
      ${examState.questions.map((q, i) => {
        const myAns = examState.answers[q.id];
        const isOk = myAns === q.ans;
        const letter = a => String.fromCharCode(65 + a);
        return `
        <div class="exam-explanation" style="text-align:left;margin-bottom:10px;border-color:${isOk ? 'rgba(57,255,20,0.2)' : 'rgba(255,64,64,0.2)'}">
          <strong style="color:${isOk ? 'var(--accent-green)' : '#ff8080'}">${isOk ? '✓' : '✗'} Soal ${i + 1}:</strong> ${q.q}<br>
          <span style="color:var(--text-muted)">Jawabanmu: ${myAns !== undefined ? letter(myAns) + '. ' + q.opts[myAns] : 'Tidak dijawab'}</span><br>
          <span style="color:var(--accent-green)">Kunci: ${letter(q.ans)}. ${q.opts[q.ans]}</span><br>
          <span style="color:var(--text-secondary);font-size:0.85em;display:block;margin-top:6px">💡 ${q.exp}</span>
        </div>`;
    }).join('')}
      <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="closeExam()">✓ Selesai</button>
        <button class="btn btn-outline" onclick="openExam('${examState.level}')">🔄 Coba Lagi</button>
        ${passed && examState.level !== 'hard' ? `<a href="pusat-uji.html" class="btn btn-green" onclick="closeExam()">▶ Level Berikutnya</a>` : ''}
      </div>
    </div>
  `;
    document.getElementById('examResultDisplay').innerHTML = resultHtml;
}

function closeExam() {
    clearInterval(examState.timer);
    document.getElementById('examModal').classList.remove('open');
    document.getElementById('examModalBg').classList.remove('open');
    renderLevels();
}

// ========== LEADERBOARD ==========
function renderLeaderboard() {
    const table = document.getElementById('leaderboardTable');
    const total = s => s.filter(x => x > 0).reduce((a, b) => a + b, 0);

    const sorted = [...LEADERBOARD_DATA].sort((a, b) => total(b.scores) - total(a.scores));

    table.innerHTML = `
    <div class="leaderboard-header">
      <span>Rank</span><span>Siswa</span><span>Easy</span><span>Medium</span><span>Hard</span>
    </div>
    ${sorted.map((row, i) => {
        const rank = i + 1;
        const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
        const initials = row.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        return `
      <div class="leaderboard-row">
        <span class="lb-rank ${RANK_COLORS[rank] || ''}">${rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}</span>
        <div class="lb-student">
          <div class="lb-avatar" style="background:${color}20;color:${color};border:1px solid ${color}40">${initials}</div>
          <div><div class="lb-name">${row.name}</div><div class="lb-school">${row.school}</div></div>
        </div>
        <span class="lb-score">${row.scores[0] || '–'}</span>
        <span class="lb-score">${row.scores[1] || '–'}</span>
        <span class="lb-badge">${row.badges}</span>
      </div>`;
    }).join('')}
  `;
}

// ========== HELPERS ==========
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

window.openExam = openExam;
window.closeExam = closeExam;
window.selectExamOpt = selectExamOpt;
window.goToQ = goToQ;
