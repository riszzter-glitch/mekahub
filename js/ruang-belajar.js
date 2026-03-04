/* =============================================
   RUANG-BELAJAR.JS – Module Library
   ============================================= */

const MODULES = [
  { id: 1, num: 'Modul 01', icon: '⚡', title: 'Pengenalan PLC & Sistem Otomasi', level: 'dasar', desc: 'Sejarah, definisi, dan aplikasi PLC di industri modern. Komponen dasar dan arsitektur sistem.', duration: '2x45 min', topics: 6, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 2, num: 'Modul 02', icon: '🔗', title: 'Dasar Pemrograman Ladder Diagram', level: 'dasar', desc: 'Simbol-simbol dasar LD: kontak NO/NC, Coil, dan prinsip logika Boolean pada PLC.', duration: '2x45 min', topics: 8, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 3, num: 'Modul 03', icon: '🔌', title: 'Wiring & Instalasi Input/Output', level: 'dasar', desc: 'Teknik pemasangan kabel sensor ke terminal input PLC dan output ke aktuator secara aman.', duration: '3x45 min', topics: 7, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 4, num: 'Modul 04', icon: '⏱️', title: 'Timer dan Counter PLC', level: 'dasar', desc: 'Penggunaan TON, TOF, RTO (Timer) dan CTU, CTD, CTUD (Counter) dalam logika kontrol.', duration: '2x45 min', topics: 6, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 5, num: 'Modul 05', icon: '🔄', title: 'Logika Interlock & Keselamatan', level: 'menengah', desc: 'Prinsip interlock untuk mencegah konflik output. Implementasi sistem Emergency Stop.', duration: '2x45 min', topics: 7, hasPdf: true, hasVideo: true, hasJobsheet: false },
  { id: 6, num: 'Modul 06', icon: '🏭', title: 'Kontrol Konveyor & Motor', level: 'menengah', desc: 'Program PLC untuk sistem konveyor belt: start/stop, forward/reverse, speed control.', duration: '3x45 min', topics: 9, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 7, num: 'Modul 07', icon: '📊', title: 'Function Block Diagram (FBD)', level: 'menengah', desc: 'Bahasa pemrograman alternatif PLC berbasis blok fungsi untuk logika yang lebih kompleks.', duration: '2x45 min', topics: 6, hasPdf: true, hasVideo: false, hasJobsheet: false },
  { id: 8, num: 'Modul 08', icon: '🎨', title: 'Dasar Desain HMI', level: 'menengah', desc: 'Prinsip desain antarmuka operator: tata letak, pemilihan warna, dan ergonomi panel HMI.', duration: '2x45 min', topics: 8, hasPdf: true, hasVideo: true, hasJobsheet: false },
  { id: 9, num: 'Modul 09', icon: '📡', title: 'Komunikasi PLC & Jaringan Industri', level: 'lanjut', desc: 'Protokol komunikasi Modbus, Profibus, EtherNet/IP untuk integrasi multi-device.', duration: '3x45 min', topics: 10, hasPdf: true, hasVideo: false, hasJobsheet: false },
  { id: 10, num: 'Modul 10', icon: '🔬', title: 'SCADA & Monitoring Produksi', level: 'lanjut', desc: 'Implementasi sistem SCADA untuk supervisory control dan data acquisition skala pabrik.', duration: '4x45 min', topics: 12, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 11, num: 'Modul 11', icon: '🤖', title: 'Integrasi Robot Arm & PLC', level: 'lanjut', desc: 'Sinkronisasi gerakan robot arm dengan logika PLC untuk aplikasi pick-and-place.', duration: '4x45 min', topics: 11, hasPdf: true, hasVideo: true, hasJobsheet: true },
  { id: 12, num: 'Modul 12', icon: '🏆', title: 'Proyek Akhir: Smart Factory Mini', level: 'lanjut', desc: 'Integrasi semua kompetensi dalam proyek pabrik mini: konveyor + sensor + robot + HMI.', duration: '6x45 min', topics: 15, hasPdf: true, hasVideo: true, hasJobsheet: true },
];

const VIDEOS = [
  { icon: '⚡', title: 'Pengenalan PLC: Apa itu PLC dan Bagaimana Cara Kerjanya?', duration: '12:34', module: 'Modul 01', views: '2.4K' },
  { icon: '🔗', title: 'Tutorial Ladder Diagram: Dari Nol Hingga Program Pertamamu', duration: '18:45', module: 'Modul 02', views: '3.1K' },
  { icon: '🔌', title: 'Wiring PLC Step-by-Step: Pasang Sensor & Motor dengan Benar', duration: '22:10', module: 'Modul 03', views: '1.8K' },
  { icon: '⏱️', title: 'Timer TON & Counter CTU: Kapan dan Bagaimana Menggunakannya', duration: '15:20', module: 'Modul 04', views: '2.2K' },
  { icon: '🔄', title: 'Interlock System: Cara Membuat Program PLC yang Aman', duration: '20:05', module: 'Modul 05', views: '1.5K' },
  { icon: '🏭', title: 'Smart Factory Simulator: Tutorial Lengkap Meka-Lab', duration: '25:30', module: 'Meka-Lab', views: '4.7K' },
];

const JOBSHEETS = [
  { icon: '📄', title: 'JS-01: Wiring Dasar PLC Siemens S7-1200', size: '2.4 MB', module: 'Modul 03' },
  { icon: '📄', title: 'JS-02: Program Kontrol Motor Tiga Fasa', size: '1.8 MB', module: 'Modul 06' },
  { icon: '📄', title: 'JS-03: Implementasi Timer & Counter', size: '1.2 MB', module: 'Modul 04' },
  { icon: '📄', title: 'JS-04: Sistem Interlock Emergency Stop', size: '2.1 MB', module: 'Modul 05' },
  { icon: '📄', title: 'JS-05: Desain Panel HMI Standar Industri', size: '3.5 MB', module: 'Modul 08' },
  { icon: '📄', title: 'JS-06: Proyek Smart Factory Mini', size: '5.2 MB', module: 'Modul 12' },
];

// Load progress from store
function loadProgress() {
  const progress = Store.get('moduleProgress', {});
  const completed = Object.values(progress).filter(v => v >= 100).length;
  const total = MODULES.length;
  const pct = Math.round((completed / total) * 100);

  document.getElementById('completedModules').textContent = completed;
  document.getElementById('totalMinutes').textContent = completed * 90;
  document.getElementById('earnedBadges').textContent = Math.floor(completed / 4);
  document.getElementById('progressPercent').textContent = pct + '%';

  // SVG ring (r=52, circumference = 2*π*52 ≈ 326.7)
  const ring = document.getElementById('progressRing');
  if (ring) {
    const circ = 326.7;
    ring.style.strokeDashoffset = circ - (pct / 100) * circ;
    ring.style.stroke = 'var(--accent-blue)';
  }
}

function renderModules(filter = 'all') {
  const grid = document.getElementById('modulesGrid');
  const progr = Store.get('moduleProgress', {});
  grid.innerHTML = '';

  MODULES.filter(m => filter === 'all' || m.level === filter).forEach((mod, i) => {
    const pct = progr[mod.id] || 0;
    // Modul lanjut terkunci jika kurang dari 3 modul dasar/menengah (id 1-8) selesai
    const basicMenengahDone = MODULES.filter(m => m.level !== 'lanjut').filter(m => (progr[m.id] || 0) >= 100).length;
    const locked = mod.level === 'lanjut' && basicMenengahDone < 3;
    const done = pct >= 100;

    const card = document.createElement('div');
    card.className = 'module-card' + (locked ? ' locked' : '') + (done ? ' completed' : '');

    const tagColor = { dasar: 'tag-blue', menengah: 'tag-orange', lanjut: 'tag-purple' }[mod.level];

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
      </div>
      <div class="module-progress">
        <div class="module-progress-label">
          <span>Progress</span><span>${pct}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="module-actions">
        ${mod.hasPdf ? `<button class="module-btn module-btn-pdf" onclick="downloadFile('PDF','${mod.title}')">📄 PDF</button>` : ''}
        ${mod.hasVideo ? `<button class="module-btn module-btn-video" onclick="playVideo('${mod.title}')">▶ Video</button>` : ''}
        ${!locked ? `<button class="module-btn module-btn-pdf" onclick="startModule(${mod.id})" style="background:rgba(57,255,20,0.1);color:var(--accent-green)">📖 Belajar</button>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderVideos() {
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = VIDEOS.map(v => `
    <div class="video-card" onclick="playVideo('${v.title}')">
      <div class="video-thumb">
        <div class="video-thumb-icon">${v.icon}</div>
      </div>
      <div class="video-info">
        <h4>${v.title}</h4>
        <p>${v.module} • ${v.views} penonton</p>
        <span class="video-duration">▶ ${v.duration}</span>
      </div>
    </div>
  `).join('');
}

function renderJobsheets() {
  const grid = document.getElementById('jobsheetGrid');
  grid.innerHTML = JOBSHEETS.map(j => `
    <div class="jobsheet-card">
      <div class="jobsheet-icon">${j.icon}</div>
      <div class="jobsheet-info">
        <h4>${j.title}</h4>
        <span>${j.module} • ${j.size}</span>
      </div>
      <button class="jobsheet-dl" onclick="downloadFile('Jobsheet','${j.title}')">⬇ Unduh</button>
    </div>
  `).join('');
}

function startModule(id) {
  // Update progress +20 per click (demo)
  const progress = Store.update('moduleProgress', {}, p => {
    p[id] = Math.min((p[id] || 0) + 20, 100);
    return p;
  });
  loadProgress();
  renderModules(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
  showToast(`Progress Modul ${id} diperbarui! 📚`);
}

function downloadFile(type, name) {
  showToast(`⬇ Mengunduh ${type}: "${name.substring(0, 40)}..."`, 'success');
}

function playVideo(title) {
  showToast(`▶ Membuka video: "${title.substring(0, 40)}..."`, 'success');
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderModules(btn.dataset.filter);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  renderModules();
  renderVideos();
  renderJobsheets();
});

window.downloadFile = downloadFile;
window.playVideo = playVideo;
window.startModule = startModule;
