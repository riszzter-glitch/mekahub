/* =============================================
   RUANG-BELAJAR.JS – Module Library (Updated)
   ============================================= */

const MODULES = [
  { id: 1, num: 'Modul 01', icon: '⚡', title: 'Pengenalan PLC & Sistem Otomasi', level: 'dasar', desc: 'Sejarah, definisi, dan aplikasi PLC di industri modern. Komponen dasar dan arsitektur sistem.', duration: '2x45 min', topics: 6, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 2, num: 'Modul 02', icon: '🔗', title: 'Dasar Pemrograman Ladder Diagram', level: 'dasar', desc: 'Simbol-simbol dasar LD: kontak NO/NC, Coil, dan prinsip logika Boolean pada PLC.', duration: '2x45 min', topics: 8, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 3, num: 'Modul 03', icon: '🔌', title: 'Wiring & Instalasi Input/Output', level: 'dasar', desc: 'Teknik pemasangan kabel sensor ke terminal input PLC dan output ke aktuator secara aman.', duration: '3x45 min', topics: 7, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 4, num: 'Modul 04', icon: '⏱️', title: 'Timer dan Counter PLC', level: 'dasar', desc: 'Penggunaan TON, TOF, RTO (Timer) dan CTU, CTD, CTUD (Counter) dalam logika kontrol.', duration: '2x45 min', topics: 6, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 5, num: 'Modul 05', icon: '🔄', title: 'Logika Interlock & Keselamatan', level: 'menengah', desc: 'Prinsip interlock untuk mencegah konflik output. Implementasi sistem Emergency Stop.', duration: '2x45 min', topics: 7, hasPdf: true, hasVideo: true, hasJobsheet: false },
  { id: 6, num: 'Modul 06', icon: '🏭', title: 'Kontrol Konveyor & Motor', level: 'menengah', desc: 'Program PLC untuk sistem konveyor belt: start/stop, forward/reverse, speed control.', duration: '3x45 min', topics: 9, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 7, num: 'Modul 07', icon: '📊', title: 'Function Block Diagram (FBD)', level: 'menengah', desc: 'Bahasa pemrograman alternatif PLC berbasis blok fungsi untuk logika yang lebih kompleks.', duration: '2x45 min', topics: 6, hasPdf: true, hasVideo: false, hasJobsheet: false },
  { id: 8, num: 'Modul 08', icon: '🎨', title: 'Dasar Desain HMI', level: 'menengah', desc: 'Prinsip desain antarmuka operator: tata letak, pemilihan warna, dan ergonomi panel HMI.', duration: '2x45 min', topics: 8, hasPdf: true, hasVideo: false, hasJobsheet: false },
];

const VIDEOS = [
  { icon: '⚡', title: 'Pengenalan PLC: Apa itu PLC dan Bagaimana Cara Kerjanya?', duration: '12:34', module: 'Modul 01', views: '2.4K', ytId: 'DU27_ece_50' },
  { icon: '🔗', title: 'Tutorial Ladder Diagram: Dari Nol Hingga Program Pertamamu', duration: '18:45', module: 'Modul 02', views: '3.1K', ytId: '2tneV_ZeUSA' },
  { icon: '🔌', title: 'Wiring PLC Step-by-Step: Pasang Sensor & Motor dengan Benar', duration: '22:10', module: 'Modul 03', views: '1.8K', ytId: 'dpnkcAXpZS0' },
  { icon: '⏱️', title: 'Timer TON & Counter CTU: Kapan dan Bagaimana Menggunakannya', duration: '15:20', module: 'Modul 04', views: '2.2K', ytId: 'ZlSqC9QARvQ' },
  { icon: '🔄', title: 'Interlock System: Cara Membuat Program PLC yang Aman', duration: '20:05', module: 'Modul 05', views: '1.5K', ytId: 'olAIftsvdjU' },
  { icon: '📺', title: 'Apa itu DIFU dan DIFD instruksi differential up dan Differential down CX programmer', duration: '25:30', module: 'Meka-Lab', views: '4.7K', ytId: 'psJHH1Znn6Q' },
];


const JOBSHEETS = [
  { icon: '📄', title: 'JS-02: Program Kontrol Motor Tiga Fasa', size: '1.8 MB', module: 'Modul 06', id: '02' },
  { icon: '📄', title: 'JS-03: Implementasi Timer & Counter', size: '1.2 MB', module: 'Modul 04', id: '03' },
  { icon: '📄', title: 'JS-04: Sistem Interlock Emergency Stop', size: '2.1 MB', module: 'Modul 05', id: '04' },
  { icon: '📄', title: 'JS-06: Proyek Smart Factory Mini', size: '5.2 MB', module: 'Modul 12', id: '06' },
];

// ===== PROGRESS =====
function loadProgress() {
  const progress = Store.get('moduleProgress', {});
  const completed = Object.values(progress).filter(v => v >= 100).length;
  const total = MODULES.length;
  const pct = Math.round((completed / total) * 100);

  document.getElementById('completedModules').textContent = completed;
  document.getElementById('totalMinutes').textContent = completed * 90;
  document.getElementById('earnedBadges').textContent = Math.floor(completed / 4);
  document.getElementById('progressPercent').textContent = pct + '%';

  const ring = document.getElementById('progressRing');
  if (ring) {
    const circ = 326.7;
    ring.style.strokeDashoffset = circ - (pct / 100) * circ;
    ring.style.stroke = 'var(--accent-blue)';
  }

  // Award badge at 4 modules milestone
  const prev = Store.get('prevCompleted', 0);
  if (completed >= 4 && prev < 4 && typeof showBadgeNotif === 'function') {
    showBadgeNotif('🏅 Pembelajar Hebat – 4 Modul Selesai!');
  }
  if (completed >= 8 && prev < 8 && typeof showBadgeNotif === 'function') {
    showBadgeNotif('🏆 PLC Master – Semua Modul Selesai!');
  }
  Store.set('prevCompleted', completed);
}

// ===== RENDER MODULES =====
function renderModules(filter = 'all') {
  const grid = document.getElementById('modulesGrid');
  const progr = Store.get('moduleProgress', {});
  grid.innerHTML = '';

  MODULES.filter(m => filter === 'all' || m.level === filter).forEach((mod) => {
    const pct = progr[mod.id] || 0;
    const basicMenengahDone = MODULES
      .filter(m => m.level !== 'lanjut')
      .filter(m => (progr[m.id] || 0) >= 100).length;
    const locked = mod.level === 'lanjut' && basicMenengahDone < 3;
    const done = pct >= 100;

    const card = document.createElement('div');
    card.className = 'module-card' + (locked ? ' locked' : '') + (done ? ' completed' : '');

    const tagColor = { dasar: 'tag-blue', menengah: 'tag-orange', lanjut: 'tag-purple' }[mod.level];

    // Build PDF/Video/Learn buttons
    let actionBtns = '';
    if (mod.hasPdf) {
      actionBtns += `<button class="module-btn module-btn-pdf" onclick="downloadFile('PDF','${mod.title}',${mod.id})" title="Buka & Unduh PDF modul ini">📄 PDF</button>`;
    }

    if (!locked) {
      actionBtns += `<button class="module-btn" onclick="startModule(${mod.id})" style="background:rgba(57,255,20,0.1);color:var(--accent-green)" title="Tandai modul sebagai selesai">📖 Belajar</button>`;
    }

    card.innerHTML = `
      <div class="module-badge-lock">${done ? '✅' : locked ? '🔒' : '🔓'}</div>
      <div class="module-num">${mod.num}</div>
      <div class="module-icon">${mod.icon}</div>
      <h3>${mod.title}</h3>
      <span class="tag ${tagColor}">${mod.level.charAt(0).toUpperCase() + mod.level.slice(1)}</span>
      <p>${mod.desc}</p>
      <div class="module-meta">
        <span>⏱ ${mod.duration}</span>
        <span>📌 ${mod.topics} topik</span>
        ${mod.hasJobsheet ? '<span style="color:var(--accent-green)">📄 Jobsheet</span>' : ''}
      </div>
      <div class="module-progress">
        <div class="module-progress-label">
          <span>Progress</span><span>${pct}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="module-actions">${actionBtns}</div>
    `;
    grid.appendChild(card);
  });
}

// ===== RENDER VIDEOS =====
function renderVideos() {
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = VIDEOS.map(v => `
    <div class="video-card" onclick="playVideo('${v.title}','${v.module}','${v.ytId}')" title="Tonton: ${v.title}" style="cursor:pointer">
      <div class="video-thumb" style="position:relative;overflow:hidden;border-radius:10px 10px 0 0;aspect-ratio:16/9;background:#000;">
        <img
          src="https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg"
          alt="${v.title}"
          style="width:100%;height:100%;object-fit:cover;display:block;"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
        />
        <div style="display:none;position:absolute;inset:0;justify-content:center;align-items:center;background:#1a1a2e;font-size:2.5rem;">${v.icon}</div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.25);transition:background 0.2s;"
             onmouseover="this.style.background='rgba(0,0,0,0.45)'"
             onmouseout="this.style.background='rgba(0,0,0,0.25)'">
          <div style="width:52px;height:52px;background:rgba(255,0,0,0.9);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.5);">
            <span style="color:#fff;font-size:1.3rem;margin-left:4px;">▶</span>
          </div>
        </div>
      </div>
      <div class="video-info">
        <h4>${v.title}</h4>
        <p>${v.module} • ${v.views} penonton</p>
        <span class="video-duration">▶ ${v.duration}</span>
      </div>
    </div>
  `).join('');
}


// ===== RENDER JOBSHEETS =====
function renderJobsheets() {
  const grid = document.getElementById('jobsheetGrid');
  grid.innerHTML = JOBSHEETS.map(j => `
    <div class="jobsheet-card">
      <div class="jobsheet-icon">${j.icon}</div>
      <div class="jobsheet-info">
        <h4>${j.title}</h4>
        <span>${j.module} • ${j.size}</span>
      </div>
      <button class="jobsheet-dl" onclick="downloadFile('Jobsheet','${j.title}','${j.id}')" title="Unduh jobsheet ini">⬇ Unduh</button>
    </div>
  `).join('');
}

// ===== START MODULE =====
function startModule(id) {
  const progress = Store.update('moduleProgress', {}, p => {
    p[id] = Math.min((p[id] || 0) + 20, 100);
    return p;
  });
  loadProgress();
  renderModules(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
  showToast(`📚 Progress Modul ${id} diperbarui! +20%`);
}

// ===== DEFAULT FALLBACKS (overridden by ruang-belajar.html inline scripts) =====
function downloadFile(type, name, moduleId) {
  // This is overridden in HTML for real PDF/download behavior
  showToast(`⬇️ Mengunduh ${type}: "${name.substring(0, 40)}..."`);
}

function playVideo(title, moduleLabel, ytId) {
  // This is overridden in HTML to open the YouTube modal
  showToast(`▶ Membuka video: "${title.substring(0, 40)}..."`);
}

// ===== FILTER BUTTONS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderModules(btn.dataset.filter);
  });
});

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  renderModules();
  renderVideos();
  renderJobsheets();
});

// Expose global
window.downloadFile = downloadFile;
window.playVideo = playVideo;
window.startModule = startModule;
