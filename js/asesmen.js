/* =============================================
   ASESMEN.JS – Bakat Minat Assessment
   ============================================= */

const QUESTIONS = [
    // RIASEC – Realistic
    { id: 1, cat: 'RIASEC', type: 'R', text: 'Saya lebih suka bekerja dengan alat dan mesin fisik daripada bekerja di depan komputer.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    { id: 2, cat: 'RIASEC', type: 'R', text: 'Saya menikmati kegiatan merakit, memperbaiki, atau membuat sesuatu secara nyata.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    { id: 3, cat: 'RIASEC', type: 'R', text: 'Saya merasa nyaman bekerja di lingkungan bengkel atau lantai pabrik.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    // RIASEC – Investigative
    { id: 4, cat: 'RIASEC', type: 'I', text: 'Saya senang menganalisis bagaimana sistem bekerja dan mencari tahu penyebab masalah.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    { id: 5, cat: 'RIASEC', type: 'I', text: 'Saya suka memecahkan teka-teki logika dan tantangan matematis.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    { id: 6, cat: 'RIASEC', type: 'I', text: 'Saya tertarik mempelajari cara kerja teknologi secara mendalam, bukan sekadar menggunakannya.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    // RIASEC – Artistic
    { id: 7, cat: 'RIASEC', type: 'A', text: 'Saya senang mendesain tampilan antarmuka yang menarik dan mudah digunakan.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    { id: 8, cat: 'RIASEC', type: 'A', text: 'Saya lebih suka pekerjaan yang memberikan kebebasan kreatif.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    { id: 9, cat: 'RIASEC', type: 'A', text: 'Saya menikmati membuat visualisasi data yang indah dan informatif.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    // GATB – Spatial
    { id: 10, cat: 'GATB', type: 'S', text: 'Saya mudah membayangkan bentuk 3D dari gambar 2D dalam pikiran saya.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    { id: 11, cat: 'GATB', type: 'S', text: 'Saya bisa memahami denah atau diagram teknis dengan cepat.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    // GATB – Numerical
    { id: 12, cat: 'GATB', type: 'N', text: 'Saya merasa nyaman bekerja dengan angka, rumus, dan perhitungan teknis.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    { id: 13, cat: 'GATB', type: 'N', text: 'Saya bisa mengidentifikasi pola dalam sekumpulan data atau angka dengan cepat.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    // GATB – Verbal
    { id: 14, cat: 'GATB', type: 'V', text: 'Saya bisa menjelaskan konsep teknis yang rumit dengan cara yang mudah dipahami orang lain.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    { id: 15, cat: 'GATB', type: 'V', text: 'Saya suka membaca manual teknis dan mencari informasi dari dokumentasi.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    // GATB – Motor
    { id: 16, cat: 'GATB', type: 'M', text: 'Saya memiliki koordinasi tangan yang baik dan terampil dalam pekerjaan presisi tinggi.', opts: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'] },
    // Scenario-based
    { id: 17, cat: 'Skenario', type: 'scenario', text: 'Ketika sistem berhenti bekerja, hal pertama yang saya lakukan adalah:', opts: ['Mencoba memperbaiki fisik mesin dahulu (kabel, konektor)', 'Menganalisis log error di PLC untuk menemukan akar masalah', 'Melihat apakah tampilan HMI memberi petunjuk visual tentang masalah', 'Membaca manual dan prosedur pemeliharaan'] },
    { id: 18, cat: 'Skenario', type: 'scenario', text: 'Proyek impian saya dalam industri otomasi adalah:', opts: ['Membangun jalur produksi fisik yang efisien', 'Membuat program PLC yang cerdas dan efisien', 'Merancang antarmuka HMI yang intuitif dan cantik', 'Menganalisis data produksi untuk meningkatkan efisiensi'] },
    { id: 19, cat: 'Skenario', type: 'scenario', text: 'Dalam sebuah tim proyek otomasi, saya paling nyaman sebagai:', opts: ['Teknisi lapangan yang memasang dan menyambung kabel', 'Programmer yang menulis logika kontrol', 'Desainer yang membuat tampilan visual sistem', 'Analis yang memantau dan mengoptimalkan kinerja'] },
    { id: 20, cat: 'Skenario', type: 'scenario', text: 'Ketika belajar hal baru, saya lebih suka:', opts: ['Langsung praktik dengan alat nyata', 'Memahami teori dan logika di baliknya dulu', 'Melihat contoh visual dan tampilan yang ada', 'Membaca dokumentasi dan panduan lengkap'] },
    { id: 21, cat: 'Skenario', type: 'scenario', text: 'Kepuasan terbesar saya dalam bekerja berasal dari:', opts: ['Melihat mesin berjalan dengan sempurna setelah saya perbaiki', 'Ketika program yang saya tulis berjalan flawless', 'Saat operator memuji tampilan antarmuka yang saya buat', 'Ketika data menunjukkan peningkatan efisiensi signifikan'] },
    { id: 22, cat: 'Skenario', type: 'scenario', text: 'Jika ada dua pekerjaan: debugging program PLC atau mendesain panel HMI, saya pilih:', opts: ['Saya lebih suka keduanya diganti dengan pekerjaan fisik', 'Debugging program PLC – itu seperti memecahkan teka-teki', 'Mendesain HMI – saya suka membuat sesuatu yang indah', 'Tergantung mana yang lebih dibutuhkan saat itu'] },
    { id: 23, cat: 'Minat', type: 'interest', text: 'Seberapa tertarik Anda dengan pemrograman komputer dan logika digital?', opts: ['Tidak tertarik sama sekali', 'Sedikit tertarik', 'Cukup tertarik', 'Sangat tertarik', 'Sangat tertarik sekali – ini passion saya!'] },
    { id: 24, cat: 'Minat', type: 'interest', text: 'Seberapa nyaman Anda bekerja dengan gambar teknis, diagram, dan simbol industri?', opts: ['Sangat tidak nyaman', 'Kurang nyaman', 'Biasa saja', 'Nyaman', 'Sangat nyaman'] },
    { id: 25, cat: 'Minat', type: 'interest', text: 'Jika kamu bisa memilih satu bidang untuk dikuasai, apa pilihanmu?', opts: ['Mekatronik & Pneumatik (fisik & mekanik)', 'Pemrograman PLC & Kontrol Logika', 'Desain HMI, SCADA & Visualisasi', 'Sistem Jaringan & Komunikasi Industri (IoT)'] },
];

let currentQ = 0;
let answers = {};

function init() {
    document.getElementById('startBtn').addEventListener('click', startQuiz);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
    document.getElementById('retryBtn').addEventListener('click', resetQuiz);
    document.getElementById('downloadResult').addEventListener('click', downloadResult);
}

function startQuiz() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'block';
    renderQuestion();
}

function renderQuestion() {
    const q = QUESTIONS[currentQ];
    document.getElementById('questionCounter').textContent = `Pertanyaan ${currentQ + 1} dari ${QUESTIONS.length}`;
    document.getElementById('quizCategory').textContent = q.cat;
    document.getElementById('quizCategory').className = `tag tag-${q.cat === 'RIASEC' ? 'blue' : q.cat === 'GATB' ? 'green' : 'orange'}`;
    document.getElementById('questionText').textContent = q.text;
    document.getElementById('quizProgressFill').style.width = `${((currentQ + 1) / QUESTIONS.length) * 100}%`;

    const optsEl = document.getElementById('quizOptions');
    optsEl.innerHTML = '';
    q.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option' + (answers[q.id] === idx ? ' selected' : '');
        btn.textContent = opt;
        btn.addEventListener('click', () => selectOption(idx));
        optsEl.appendChild(btn);
    });

    document.getElementById('prevBtn').disabled = currentQ === 0;
    document.getElementById('nextBtn').disabled = answers[q.id] === undefined;
    document.getElementById('nextBtn').textContent = currentQ === QUESTIONS.length - 1 ? '✅ Lihat Hasil' : 'Lanjut →';

    // Animation
    const card = document.getElementById('quizCard');
    card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1'; card.style.transform = 'translateY(0)';
    });
}

function selectOption(idx) {
    const q = QUESTIONS[currentQ];
    answers[q.id] = idx;
    document.querySelectorAll('.quiz-option').forEach((btn, i) => {
        btn.classList.toggle('selected', i === idx);
    });
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    if (currentQ < QUESTIONS.length - 1) {
        currentQ++;
        renderQuestion();
    } else {
        showResult();
    }
}

function prevQuestion() {
    if (currentQ > 0) { currentQ--; renderQuestion(); }
}

function calculateScores() {
    const scores = { R: 0, I: 0, A: 0, S: 0, N: 0, V: 0, M: 0 };

    QUESTIONS.forEach(q => {
        const ans = answers[q.id];
        if (ans === undefined) return;

        if (['R', 'I', 'A', 'S', 'N', 'V', 'M'].includes(q.type)) {
            scores[q.type] += ans; // 0-4 per question
        } else if (q.type === 'scenario') {
            // Map options to types
            const maps = {
                17: ['R', 'I', 'A', 'V'],
                18: ['R', 'I', 'A', 'N'],
                19: ['R', 'I', 'A', 'N'],
                20: ['R', 'I', 'A', 'V'],
                21: ['R', 'I', 'A', 'N'],
                22: ['R', 'I', 'A', 'V'],
            };
            const types = maps[q.id];
            if (types && types[ans]) scores[types[ans]] = (scores[types[ans]] || 0) + 4;
        } else if (q.type === 'interest') {
            if (q.id === 23) scores['I'] += ans;
            if (q.id === 24) scores['S'] += ans;
            if (q.id === 25) {
                const map = { 0: 'R', 1: 'I', 2: 'A', 3: 'N' };
                if (map[ans]) scores[map[ans]] += 4;
            }
        }
    });

    return scores;
}

function determineProfile(scores) {
    const riasec = { R: scores.R, I: scores.I, A: scores.A };
    const dominant = Object.entries(riasec).sort((a, b) => b[1] - a[1]);
    const gatb = { S: scores.S, N: scores.N, V: scores.V, M: scores.M };
    const topGatb = Object.entries(gatb).sort((a, b) => b[1] - a[1])[0];

    const topType = dominant[0][0];

    const profiles = {
        R: {
            icon: '🔧', title: 'Maintenance Engineer',
            tag: 'Realistic-Hands-on',
            desc: 'Kamu adalah tipe praktis yang unggul dalam pekerjaan fisik dan teknis. Kemampuanmu untuk memahami sistem mekanik dan mendiagnosis masalah secara langsung adalah aset besar. Kamu akan cemerlang di bidang pemeliharaan mesin, instalasi sistem kontrol, dan troubleshooting lapangan.',
            recs: ['⚙️ Modul Wiring & Instalasi PLC', '🔧 Pneumatik & Aktuator', '⚡ Troubleshooting & Maintenance', '🏭 Praktik Langsung di Lab']
        },
        I: {
            icon: '💻', title: 'PLC Programmer',
            tag: 'Investigative-Logical',
            desc: 'Otakmu dirancang untuk logika dan analisis. Kamu menikmati memecahkan masalah kompleks dan memahami sistem secara mendalam. Ladder Diagram dan Function Block Diagram adalah bahasa yang akan kamu kuasai. Fokuskan dirimu pada pemrograman PLC tingkat lanjut dan optimasi sistem kontrol.',
            recs: ['💻 Ladder Diagram Dasar & Lanjut', '⏱ Timer, Counter & Boolean Logic', '🔁 Function Block Diagram (FBD)', '🏗️ Implementasi di Smart Factory Simulator']
        },
        A: {
            icon: '🎨', title: 'HMI / SCADA Designer',
            tag: 'Artistic-Visual',
            desc: 'Kamu memiliki kombinasi langka antara kreativitas visual dan pemahaman teknis. Kemampuanmu merancang antarmuka yang intuitif dan informatif sangat dibutuhkan industri. Fokus pada desain HMI, visualisasi SCADA, dan pengalaman pengguna (UX) dalam sistem industri.',
            recs: ['🖥️ Dasar HMI & SCADA Design', '📊 Visualisasi Data Industri', '🎨 Ergonomi & UX untuk Operator', '🔗 Integrasi HMI-PLC']
        }
    };

    return profiles[topType] || profiles['I'];
}

function showResult() {
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'block';

    const scores = calculateScores();
    const profile = determineProfile(scores);

    // Save to localStorage
    Store.set('profileResult', { scores, profile: profile.title, date: new Date().toLocaleDateString('id-ID') });
    Store.set('asesmenDone', true);

    document.getElementById('resultIcon').textContent = profile.icon;
    document.getElementById('resultTitle').textContent = `Profil: ${profile.title}`;
    document.getElementById('resultTag').textContent = profile.tag;
    document.getElementById('resultTag').className = `tag tag-${profile.tag.includes('Artistic') ? 'purple' : profile.tag.includes('Realistic') ? 'orange' : 'blue'}`;

    // Score bars
    const scoreKeys = [
        { key: 'R', label: 'Realistic', color: 'var(--accent-orange)' },
        { key: 'I', label: 'Investigative', color: 'var(--accent-blue)' },
        { key: 'A', label: 'Artistic', color: 'var(--accent-purple)' },
    ];
    const max = Math.max(...scoreKeys.map(s => scores[s.key])) || 1;

    const scoresEl = document.getElementById('resultScores');
    scoresEl.innerHTML = scoreKeys.map(s => `
    <div class="score-item">
      <span class="score-label">${s.label}</span>
      <span class="score-val" style="color:${s.color}">${Math.round((scores[s.key] / max) * 100)}%</span>
      <div class="progress-bar" style="margin-top:8px">
        <div class="progress-fill" style="width:${(scores[s.key] / max) * 100}%;background:${s.color}"></div>
      </div>
    </div>
  `).join('');

    document.getElementById('resultDesc').innerHTML = `<p>${profile.desc}</p>`;

    const recEl = document.getElementById('resultRec');
    recEl.innerHTML = profile.recs.map(r => `<div class="rec-item">${r}</div>`).join('');

    // Set go learn link
    document.getElementById('goLearnBtn').href = 'ruang-belajar.html';

    showToast(`Profil ditemukan: ${profile.title}! 🎉`, 'success');
}

function resetQuiz() {
    currentQ = 0;
    answers = {};
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
}

function downloadResult() {
    const profile = Store.get('profileResult');
    if (!profile) return;
    showToast('Laporan sedang disiapkan... (Fitur unduh PDF akan segera tersedia)', 'success');
}

window.addEventListener('DOMContentLoaded', init);
