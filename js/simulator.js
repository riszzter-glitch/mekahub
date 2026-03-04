/* =============================================
   SIMULATOR.JS – Smart Factory PLC Simulator
   ============================================= */

// ========== SIMULATION STATE ==========
let simState = {
    running: false,
    paused: false,
    speed: 1,
    cycle: 0,
    errors: 0,
    scenario: 'basic',
    tick: 0,
    // I/O
    inputs: { 'I0.0': 0, 'I0.1': 1, 'I0.2': 0, 'I0.3': 0, 'I0.4': 0, 'I0.5': 0 },
    outputs: { 'Q0.0': 0, 'Q0.1': 0, 'Q0.2': 0, 'Q0.3': 0 },
    timers: { 'T0': { val: 0, preset: 5000, done: 0 }, 'T1': { val: 0, preset: 3000, done: 0 } },
    // Factory objects
    bottles: [], conveyor: { speed: 2, active: false },
    robotArm: { x: 480, y: 220, angle: -1.2, gripping: false, targetX: 480, targetY: 220 },
    sensor: { x: 300, y: 220, beam: false },
    sortBin: { red: 0, blue: 0, white: 0 },
};

let animFrame;
let lastTick = 0;
const TICK_MS = 100;

// ========== CANVAS SETUP ==========
let fCanvas, fCtx;

function initFactory() {
    fCanvas = document.getElementById('factoryCanvas');
    fCtx = fCanvas.getContext('2d');
    // Gunakan offsetWidth hanya jika lebih besar dari nilai HTML attr
    // Hindari reset ke 0 saat elemen belum render
    function resizeCanvas() {
        const w = fCanvas.offsetWidth;
        const h = fCanvas.offsetHeight;
        if (w > 0 && h > 0) {
            fCanvas.width = w;
            fCanvas.height = h;
        }
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        if (!simState.running) drawFactory();
    });

    buildIOPanel();
    buildOverrides();
    renderScenariosGrid();
    spawnBottles();
    drawFactory();
}

// ========== I/O PANEL ==========
const IO_DEFS = {
    inputs: [
        { addr: 'I0.0', label: 'Start BTN', desc: 'Tombol START' },
        { addr: 'I0.1', label: 'Stop BTN', desc: 'Tombol STOP (NC)' },
        { addr: 'I0.2', label: 'Sensor 1', desc: 'Sensor Posisi Konveyor' },
        { addr: 'I0.3', label: 'Sensor Warna', desc: 'Sensor Identifikasi Warna' },
        { addr: 'I0.4', label: 'Limit Arm', desc: 'Limit Switch Robot Arm' },
        { addr: 'I0.5', label: 'E-Stop', desc: 'Emergency Stop' },
    ],
    outputs: [
        { addr: 'Q0.0', label: 'Motor Konveyor', desc: 'Motor penggerak konveyor' },
        { addr: 'Q0.1', label: 'Robot Move', desc: 'Perintah gerak robot' },
        { addr: 'Q0.2', label: 'Alarm', desc: 'Lampu/suara alarm' },
        { addr: 'Q0.3', label: 'Gate Sorter', desc: 'Pintu sorter' },
    ]
};

function buildIOPanel() {
    const inGrid = document.getElementById('inputGrid');
    const outGrid = document.getElementById('outputGrid');
    const timerG = document.getElementById('timerGrid');

    IO_DEFS.inputs.forEach(io => {
        const el = document.createElement('div');
        el.className = 'io-item' + (simState.inputs[io.addr] ? ' active' : '');
        el.id = 'io-' + io.addr;
        el.innerHTML = `<span class="io-name">${io.addr}</span><span class="io-label">${io.label}</span><span class="io-state">${simState.inputs[io.addr] ? 'ON' : 'OFF'}</span>`;
        el.title = io.desc;
        inGrid.appendChild(el);
    });

    IO_DEFS.outputs.forEach(io => {
        const el = document.createElement('div');
        el.className = 'io-item';
        el.id = 'io-' + io.addr;
        el.innerHTML = `<span class="io-name">${io.addr}</span><span class="io-label">${io.label}</span><span class="io-state">OFF</span>`;
        el.title = io.desc;
        outGrid.appendChild(el);
    });

    ['T0', 'T1'].forEach(t => {
        const el = document.createElement('div');
        el.className = 'timer-item';
        el.id = 'timer-' + t;
        el.innerHTML = `<span>${t}</span><span class="timer-val">0ms / ${simState.timers[t].preset}ms</span>`;
        timerG.appendChild(el);
    });
}

function buildOverrides() {
    const cont = document.getElementById('overrideBtns');
    IO_DEFS.inputs.forEach(io => {
        const btn = document.createElement('button');
        btn.className = 'override-btn' + (simState.inputs[io.addr] ? ' pressed' : '');
        btn.id = 'ov-' + io.addr;
        btn.innerHTML = `<span>${io.addr}: <strong>${io.label}</strong></span><span>${simState.inputs[io.addr] ? '■ ON' : '○ OFF'}</span>`;
        btn.addEventListener('click', () => toggleInput(io.addr));
        cont.appendChild(btn);
    });
}

function toggleInput(addr) {
    simState.inputs[addr] = simState.inputs[addr] ? 0 : 1;
    updateIODisplay();
    const btn = document.getElementById('ov-' + addr);
    if (btn) {
        btn.classList.toggle('pressed', !!simState.inputs[addr]);
        btn.innerHTML = `<span>${addr}: <strong>${IO_DEFS.inputs.find(i => i.addr === addr)?.label}</strong></span><span>${simState.inputs[addr] ? '■ ON' : '○ OFF'}</span>`;
    }
}

function updateIODisplay() {
    IO_DEFS.inputs.forEach(io => {
        const el = document.getElementById('io-' + io.addr);
        if (!el) return;
        el.className = 'io-item' + (simState.inputs[io.addr] ? ' active' : '');
        el.querySelector('.io-state').textContent = simState.inputs[io.addr] ? 'ON' : 'OFF';
    });
    IO_DEFS.outputs.forEach(io => {
        const el = document.getElementById('io-' + io.addr);
        if (!el) return;
        el.className = 'io-item' + (simState.outputs[io.addr] ? ' output-active' : '');
        el.querySelector('.io-state').textContent = simState.outputs[io.addr] ? 'ON' : 'OFF';
    });
    Object.keys(simState.timers).forEach(t => {
        const el = document.getElementById('timer-' + t);
        if (el) el.querySelector('.timer-val').textContent = `${simState.timers[t].val}ms / ${simState.timers[t].preset}ms`;
    });
}

// ========== PLC LOGIC EXECUTION ==========
function executePLCLogic() {
    const I = simState.inputs;
    const Q = simState.outputs;
    const T = simState.timers;
    const code = document.getElementById('plcCodeEditor')?.value || '';

    // Default logic based on scenario
    switch (simState.scenario) {
        case 'basic':
            // Motor = (Start AND (NOT Stop)) OR SelfLatch
            Q['Q0.0'] = (I['I0.0'] && I['I0.1'] && !I['I0.5']) ? 1 : (Q['Q0.0'] && I['I0.1'] && !I['I0.5']) ? Q['Q0.0'] : 0;
            break;

        case 'conveyor':
            Q['Q0.0'] = (I['I0.0'] && I['I0.1'] && !I['I0.5']) ? 1 : (!I['I0.1'] || I['I0.5']) ? 0 : Q['Q0.0'];
            // Timer: if bottle detected at sensor, pause conveyor for 2s
            if (I['I0.2']) {
                T['T0'].val = Math.min(T['T0'].val + TICK_MS, T['T0'].preset);
                if (T['T0'].val >= T['T0'].preset) { T['T0'].done = 1; }
            } else {
                T['T0'].val = 0;
                T['T0'].done = 0;
            }
            if (T['T0'].done) Q['Q0.0'] = 0;
            break;

        case 'sorting':
            Q['Q0.0'] = I['I0.0'] && I['I0.1'] && !I['I0.5'] ? 1 : 0;
            Q['Q0.3'] = I['I0.3'] ? 1 : 0; // Open gate for non-white bottles
            Q['Q0.1'] = I['I0.2'] && I['I0.3'] ? 1 : 0; // Robot moves if bottle + color sensor
            break;

        case 'interlock': {
            // Interlock: Forward AND NOT Reverse, and vice versa
            // Wrap in block to allow const declarations in switch-case
            const fwd = I['I0.0'] && !Q['Q0.1'] && I['I0.1'] && !I['I0.5'];
            const rev = I['I0.2'] && !Q['Q0.0'] && I['I0.1'] && !I['I0.5'];
            // Check for interlock violation
            if (I['I0.0'] && I['I0.2']) {
                logError('INTERLOCK FAULT: Forward & Reverse aktif bersamaan!');
                showCrash('Interlock Violation! Motor Forward dan Reverse diaktifkan bersamaan — ini akan merusak hardware nyata!');
                return;
            }
            Q['Q0.0'] = fwd ? 1 : 0;
            Q['Q0.1'] = rev ? 1 : 0;
            break;
        }
    }

    simState.conveyor.active = !!Q['Q0.0'];
}

// ========== FACTORY DRAWING ==========
function drawFactory() {
    if (!fCtx) return;
    const W = fCanvas.width, H = fCanvas.height;
    fCtx.clearRect(0, 0, W, H);

    // Background grid
    fCtx.strokeStyle = 'rgba(0,200,255,0.04)';
    fCtx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { fCtx.beginPath(); fCtx.moveTo(x, 0); fCtx.lineTo(x, H); fCtx.stroke(); }
    for (let y = 0; y < H; y += 40) { fCtx.beginPath(); fCtx.moveTo(0, y); fCtx.lineTo(W, y); fCtx.stroke(); }

    // Conveyor belt
    drawConveyor();

    // Sensor beam
    drawSensor();

    // Robot arm
    drawRobotArm();

    // Bottles
    simState.bottles.forEach(b => drawBottle(b));

    // Bin labels
    drawBins();

    // Status overlay
    drawStatusOverlay();
}

function drawConveyor() {
    const W = fCanvas.width, H = fCanvas.height;
    const cy = H * 0.55;
    const beltH = 20;

    // Belt track
    fCtx.fillStyle = 'rgba(30,50,80,0.8)';
    fCtx.roundRect(40, cy - beltH / 2, W - 80, beltH, 4);
    fCtx.fill();

    // Belt lines (animated)
    const offset = simState.conveyor.active ? (simState.tick * 2 % 40) : 0;
    fCtx.strokeStyle = 'rgba(0,200,255,0.2)';
    fCtx.lineWidth = 1;
    for (let x = 40 + offset; x < W - 40; x += 40) {
        fCtx.beginPath(); fCtx.moveTo(x, cy - beltH / 2); fCtx.lineTo(x, cy + beltH / 2); fCtx.stroke();
    }

    // Rollers
    [{ x: 50 }, { x: W - 50 }].forEach(r => {
        fCtx.beginPath(); fCtx.arc(r.x, cy, 14, 0, Math.PI * 2);
        fCtx.fillStyle = '#1a3050'; fCtx.fill();
        fCtx.strokeStyle = simState.conveyor.active ? 'rgba(0,200,255,0.6)' : 'rgba(255,255,255,0.1)';
        fCtx.lineWidth = 2; fCtx.stroke();
        // Rotation mark
        if (simState.conveyor.active) {
            const angle = (simState.tick * 0.1) % (Math.PI * 2);
            fCtx.beginPath();
            fCtx.moveTo(r.x, cy);
            fCtx.lineTo(r.x + Math.cos(angle) * 10, cy + Math.sin(angle) * 10);
            fCtx.strokeStyle = 'rgba(0,200,255,0.5)'; fCtx.lineWidth = 2; fCtx.stroke();
        }
    });

    // Label
    fCtx.fillStyle = simState.conveyor.active ? 'rgba(57,255,20,0.9)' : 'rgba(255,255,255,0.2)';
    fCtx.font = 'bold 10px JetBrains Mono, monospace';
    fCtx.textAlign = 'center';
    fCtx.fillText(simState.conveyor.active ? 'CONVEYOR: RUN' : 'CONVEYOR: STOP', W / 2, cy + beltH / 2 + 16);
}

function drawSensor() {
    const W = fCanvas.width, H = fCanvas.height;
    const cy = H * 0.55;
    const sx = W * 0.45;

    // Sensor housing
    fCtx.fillStyle = '#1a3050';
    fCtx.strokeStyle = 'rgba(57,255,20,0.6)';
    fCtx.lineWidth = 1.5;
    fCtx.beginPath(); fCtx.roundRect(sx - 10, cy - 40, 20, 25, 4); fCtx.fill(); fCtx.stroke();

    // Sensor label
    fCtx.fillStyle = 'rgba(57,255,20,0.8)';
    fCtx.font = '9px JetBrains Mono, monospace';
    fCtx.textAlign = 'center';
    fCtx.fillText('SEN', sx, cy - 21);

    // Beam
    simState.sensor.beam = simState.inputs['I0.2'] === 1;
    if (simState.sensor.beam) {
        const grad = fCtx.createLinearGradient(sx, cy - 15, sx, cy + 10);
        grad.addColorStop(0, 'rgba(57,255,20,0.8)');
        grad.addColorStop(1, 'rgba(57,255,20,0)');
        fCtx.fillStyle = grad;
        fCtx.fillRect(sx - 2, cy - 15, 4, 25);
    }
}

function drawRobotArm() {
    const W = fCanvas.width, H = fCanvas.height;
    const arm = simState.robotArm;

    // Robot base
    fCtx.fillStyle = '#0d1f38';
    fCtx.strokeStyle = simState.outputs['Q0.1'] ? 'rgba(0,200,255,0.8)' : 'rgba(255,255,255,0.15)';
    fCtx.lineWidth = 2;
    fCtx.beginPath(); fCtx.roundRect(arm.x - 20, arm.y + 60, 40, 50, 4); fCtx.fill(); fCtx.stroke();

    // Arm with joint
    const angle1 = arm.angle + (simState.outputs['Q0.1'] ? Math.sin(simState.tick * 0.05) * 0.3 : 0);
    const angle2 = -0.8;
    const armLen = 60;

    const j1x = arm.x;
    const j1y = arm.y + 60;
    const j2x = j1x + Math.cos(angle1 - Math.PI / 2) * armLen;
    const j2y = j1y + Math.sin(angle1 - Math.PI / 2) * armLen;
    const gripx = j2x + Math.cos(angle1 + angle2 - Math.PI / 2) * 40;
    const gripy = j2y + Math.sin(angle1 + angle2 - Math.PI / 2) * 40;

    // Draw arm segments
    fCtx.strokeStyle = simState.outputs['Q0.1'] ? '#00c8ff' : '#1a3050';
    fCtx.lineWidth = 8; fCtx.lineCap = 'round';
    fCtx.beginPath(); fCtx.moveTo(j1x, j1y); fCtx.lineTo(j2x, j2y); fCtx.stroke();
    fCtx.lineWidth = 6;
    fCtx.beginPath(); fCtx.moveTo(j2x, j2y); fCtx.lineTo(gripx, gripy); fCtx.stroke();

    // Joints
    [{ x: j1x, y: j1y }, { x: j2x, y: j2y }].forEach(j => {
        fCtx.beginPath(); fCtx.arc(j.x, j.y, 5, 0, Math.PI * 2);
        fCtx.fillStyle = '#00c8ff'; fCtx.fill();
    });

    // Gripper
    fCtx.strokeStyle = simState.outputs['Q0.1'] ? 'rgba(0,255,213,0.9)' : 'rgba(255,255,255,0.3)';
    fCtx.lineWidth = 3;
    fCtx.beginPath(); fCtx.arc(gripx, gripy, 8, 0, Math.PI * 2); fCtx.stroke();

    // Label
    fCtx.fillStyle = simState.outputs['Q0.1'] ? 'rgba(0,200,255,0.9)' : 'rgba(255,255,255,0.2)';
    fCtx.font = '9px JetBrains Mono, monospace';
    fCtx.textAlign = 'center';
    fCtx.fillText(simState.outputs['Q0.1'] ? 'ARM: ACTIVE' : 'ARM: IDLE', arm.x, arm.y + 125);
}

function spawnBottles() {
    simState.bottles = Array.from({ length: 4 }, (_, i) => ({
        x: 80 + (i * 120),
        y: 0,  // will be set to conveyor y
        color: ['#ffffff', '#ff4040', '#4080ff', '#ff4040'][i % 4],
        type: ['white', 'red', 'blue', 'red'][i % 4],
        w: 16, h: 28,
        sorted: false
    }));
}

function drawBottle(b) {
    const H = fCanvas.height;
    const cy = H * 0.55 - 14;
    b.y = cy;

    fCtx.fillStyle = b.color;
    fCtx.globalAlpha = b.sorted ? 0.3 : 1;
    fCtx.beginPath();
    fCtx.roundRect(b.x - b.w / 2, b.y - b.h, b.w, b.h, [4, 4, 2, 2]);
    fCtx.fill();

    // Bottle cap
    fCtx.fillStyle = 'rgba(255,255,255,0.4)';
    fCtx.beginPath(); fCtx.roundRect(b.x - 4, b.y - b.h - 6, 8, 7, 2); fCtx.fill();
    fCtx.globalAlpha = 1;

    // Glow if under sensor
    if (Math.abs(b.x - fCanvas.width * 0.45) < 20) {
        fCtx.shadowColor = b.color; fCtx.shadowBlur = 15;
        fCtx.beginPath(); fCtx.arc(b.x, b.y - b.h / 2, b.w / 2 + 2, 0, Math.PI * 2);
        fCtx.strokeStyle = b.color; fCtx.lineWidth = 2; fCtx.stroke();
        fCtx.shadowBlur = 0;
        simState.inputs['I0.2'] = 1;
        if (b.type !== 'white') simState.inputs['I0.3'] = 1;
    }
}

function drawBins() {
    const W = fCanvas.width, H = fCanvas.height;
    const cy = H * 0.55;

    // Bins at end of conveyor
    const binY = cy + 30;
    [
        { label: 'PUTIH', count: simState.sortBin.white, color: 'rgba(255,255,255,0.3)', x: W - 40 },
        { label: 'MERAH', count: simState.sortBin.red, color: 'rgba(255,60,60,0.6)', x: W - 40 },
        { label: 'BIRU', count: simState.sortBin.blue, color: 'rgba(60,120,255,0.6)', x: W - 40 },
    ].forEach((bin, i) => {
        fCtx.fillStyle = 'rgba(0,0,0,0.3)';
        fCtx.strokeStyle = bin.color;
        fCtx.lineWidth = 1;
        fCtx.beginPath(); fCtx.roundRect(W - 90, binY + i * 35, 80, 28, 4); fCtx.fill(); fCtx.stroke();
        fCtx.fillStyle = bin.color;
        fCtx.font = 'bold 10px Outfit, sans-serif';
        fCtx.textAlign = 'left';
        fCtx.fillText(`${bin.label}: ${bin.count}`, W - 84, binY + i * 35 + 18);
    });
}

function drawStatusOverlay() {
    const W = fCanvas.width;
    const io = simState.outputs;

    const statusItems = [
        { label: 'I: START', active: simState.inputs['I0.0'], x: 10 },
        { label: `Q0.0: ${io['Q0.0'] ? 'ON' : 'OFF'}`, active: io['Q0.0'], x: 90 },
        { label: `Q0.1: ${io['Q0.1'] ? 'ON' : 'OFF'}`, active: io['Q0.1'], x: 170 },
        { label: `ALARM: ${io['Q0.2'] ? 'ON' : 'OFF'}`, active: io['Q0.2'], x: 250 },
    ];

    statusItems.forEach(s => {
        fCtx.fillStyle = s.active ? 'rgba(57,255,20,0.15)' : 'rgba(255,255,255,0.04)';
        fCtx.strokeStyle = s.active ? 'rgba(57,255,20,0.5)' : 'rgba(255,255,255,0.08)';
        fCtx.lineWidth = 1;
        fCtx.beginPath(); fCtx.roundRect(s.x, 10, 74, 22, 4); fCtx.fill(); fCtx.stroke();
        fCtx.fillStyle = s.active ? 'rgba(57,255,20,0.9)' : 'rgba(255,255,255,0.3)';
        fCtx.font = 'bold 9px JetBrains Mono, monospace';
        fCtx.textAlign = 'center';
        fCtx.fillText(s.label, s.x + 37, 25);
    });
}

// ========== SIMULATION LOOP ==========
function simLoop(ts) {
    if (!simState.running) return;
    if (ts - lastTick >= TICK_MS / simState.speed) {
        lastTick = ts;
        simState.tick++;

        // Reset per-tick inputs
        simState.inputs['I0.2'] = 0;
        simState.inputs['I0.3'] = 0;

        // Execute PLC logic
        executePLCLogic();

        // Move bottles
        if (simState.conveyor.active) {
            simState.bottles.forEach(b => {
                if (!b.sorted) {
                    b.x += 1.5 * simState.speed;
                    if (b.x > fCanvas.width - 50) {
                        b.sorted = true;
                        simState.cycle++;
                        simState.sortBin[b.type]++;
                        // wrap around
                        setTimeout(() => { b.x = 60; b.sorted = false; }, 2000);
                    }
                }
            });
        }

        updateIODisplay();
        document.getElementById('cycleNum').textContent = simState.cycle;
        document.getElementById('errorNum').textContent = simState.errors;
        // Trigger first-time badge
        if (simState.cycle === 10 && typeof showBadgeNotif === 'function') {
            showBadgeNotif('🔬 Explorer Simulator – 10 Siklus Selesai!');
        }
    }

    drawFactory();
    animFrame = requestAnimationFrame(simLoop);
}

// ========== ERROR LOG ==========
function logError(msg) {
    simState.errors++;
    const log = document.getElementById('errorLog');
    if (!log) return;
    const empty = log.querySelector('.error-log-empty');
    if (empty) empty.remove();
    const entry = document.createElement('div');
    entry.className = 'error-entry';
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    entry.innerHTML = `<time>${now}</time> ${msg}`;
    log.prepend(entry);
    const errNumEl = document.getElementById('errorNum');
    if (errNumEl) errNumEl.textContent = simState.errors;
}

function showCrash(msg) {
    stopSim();
    const overlay = document.getElementById('crashOverlay');
    document.getElementById('crashMsg').textContent = msg;
    overlay.classList.add('visible');
}

// ========== CONTROLS ==========
function runSim() {
    if (simState.running) return;
    simState.running = true;
    simState.inputs['I0.0'] = 1; // Auto-SET start
    updateIODisplay();
    document.getElementById('simStatus').innerHTML = '<span class="status-dot active"></span> Simulator: RUNNING';
    animFrame = requestAnimationFrame(simLoop);
    showToast('▶ Simulasi dimulai!', 'success');
}

function stopSim() {
    simState.running = false;
    simState.inputs['I0.0'] = 0;
    simState.outputs['Q0.0'] = 0;
    simState.conveyor.active = false;
    cancelAnimationFrame(animFrame);
    document.getElementById('simStatus').innerHTML = '<span class="status-dot"></span> Simulator: STOPPED';
    updateIODisplay();
    drawFactory();
}

function resetSim() {
    stopSim();
    simState.cycle = 0;
    simState.errors = 0;
    simState.sortBin = { red: 0, blue: 0, white: 0 };
    simState.inputs = { 'I0.0': 0, 'I0.1': 1, 'I0.2': 0, 'I0.3': 0, 'I0.4': 0, 'I0.5': 0 };
    simState.outputs = { 'Q0.0': 0, 'Q0.1': 0, 'Q0.2': 0, 'Q0.3': 0 };
    simState.timers = { 'T0': { val: 0, preset: 5000, done: 0 }, 'T1': { val: 0, preset: 3000, done: 0 } };
    spawnBottles();
    updateIODisplay();
    drawFactory();
    document.getElementById('crashOverlay').classList.remove('visible');
    document.getElementById('successOverlay').classList.remove('visible');
    document.getElementById('simStatus').innerHTML = '<span class="status-dot active"></span> Simulator: READY';
    showToast('🔄 Simulasi direset');
}

// ========== SCENARIOS ==========
const SCENARIOS_DATA = [
    { id: 'basic', level: 'Dasar', icon: '⚡', color: 'tag-blue', title: 'Kontrol Motor ON/OFF', desc: 'Program start/stop motor menggunakan tombol dan self-latch logic.', locked: false },
    { id: 'conveyor', level: 'Menengah', icon: '🏭', color: 'tag-orange', title: 'Konveyor Otomatis', desc: 'Konveyor berjalan otomatis dengan timer untuk berhenti saat botol terdeteksi.', locked: false },
    { id: 'sorting', level: 'Lanjut', icon: '🎨', color: 'tag-purple', title: 'Sorting Warna Botol', desc: 'Sensor warna mengidentifikasi botol dan robot arm menyortir ke bin yang tepat.', locked: false },
    { id: 'interlock', level: 'Expert', icon: '🔒', color: 'tag-blue', title: 'Interlock Safety System', desc: 'Implementasi interlock untuk mencegah Forward dan Reverse aktif bersamaan.', locked: false },
];

const SCENARIO_CODES = {
    basic: `// Skenario Dasar: Kontrol Motor ON/OFF
// I0.0 = Tombol START
// I0.1 = Tombol STOP (NC)
// Q0.0 = Motor Konveyor

LOAD  I0.0   // START button
AND   I0.1   // STOP button (NC)
OR    Q0.0   // Self-latch
OUT   Q0.0   // Motor active`,

    conveyor: `// Skenario Menengah: Konveyor Otomatis
// I0.0 = START, I0.1 = STOP (NC)
// I0.2 = Sensor Posisi Botol
// Q0.0 = Motor Konveyor

LOAD  I0.0
AND   I0.1
OUT   Q0.0   // Motor ON

LOAD  I0.2   // Botol terdeteksi
TON   T0, 5000ms  // Timer 5 detik
OUT   T0.DN  // Timer done

LOAD  T0.DN  // Jika timer selesai
Reset Q0.0   // Stop motor sementara`,

    sorting: `// Skenario Lanjut: Sorting Warna Botol
// I0.2 = Sensor Posisi, I0.3 = Sensor Warna
// Q0.0 = Konveyor, Q0.1 = Robot, Q0.3 = Gate

LOAD  I0.0
AND   I0.1
OUT   Q0.0   // Jalankan konveyor

LOAD  I0.2   // Botol di sensor pos
AND   I0.3   // Bukan botol putih
OUT   Q0.3   // Buka gate sorter
OUT   Q0.1   // Aktifkan robot arm`,

    interlock: `// Skenario Expert: Interlock Safety
// I0.0 = Input Forward, I0.2 = Input Reverse
// Q0.0 = Motor Forward, Q0.1 = Motor Reverse
// PENTING: Interlock mencegah konflik!

LOAD  I0.0   // Forward request
AND   NOT Q0.1  // INTERLOCK: Reverse tidak aktif
AND   I0.1      // Stop OK
OUT   Q0.0   // Motor Forward

LOAD  I0.2   // Reverse request
AND   NOT Q0.0  // INTERLOCK: Forward tidak aktif
AND   I0.1      // Stop OK
OUT   Q0.1   // Motor Reverse`,
};

function renderScenariosGrid() {
    const grid = document.getElementById('scenariosGrid');
    if (!grid) return;
    grid.innerHTML = SCENARIOS_DATA.map(s => `
    <div class="scenario-card ${s.id === simState.scenario ? 'active' : ''}" onclick="selectScenario('${s.id}')">
      <span class="scenario-level tag ${s.color}">${s.level}</span>
      <div class="scenario-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </div>
  `).join('');
}

function selectScenario(id) {
    stopSim();
    simState.scenario = id;
    document.getElementById('scenarioSelect').value = id;
    const code = SCENARIO_CODES[id] || '';
    document.getElementById('plcCodeEditor').value = code;
    renderScenariosGrid();
    showToast(`📋 Skenario "${SCENARIOS_DATA.find(s => s.id === id)?.title}" dimuat`);
    // Update hint panel if open
    const hp = document.getElementById('hintPanel');
    if (hp && hp.classList.contains('visible') && typeof updateHintContent === 'function') {
        updateHintContent(id);
    }
}

// ========== EVENT LISTENERS ==========
window.addEventListener('DOMContentLoaded', () => {
    initFactory();

    document.getElementById('runSimBtn')?.addEventListener('click', runSim);
    document.getElementById('stopSimBtn')?.addEventListener('click', stopSim);
    document.getElementById('stepBtn')?.addEventListener('click', () => {
        if (!simState.running) {
            executePLCLogic();
            updateIODisplay();
            drawFactory();
            showToast('⏭ Satu langkah dieksekusi');
        } else {
            showToast('⚠️ Hentikan simulasi dulu sebelum step mode', 'warning');
        }
    });
    document.getElementById('resetFactory')?.addEventListener('click', resetSim);
    document.getElementById('resetCrash')?.addEventListener('click', resetSim);
    document.getElementById('nextScenario')?.addEventListener('click', () => {
        const idx = SCENARIOS_DATA.findIndex(s => s.id === simState.scenario);
        const next = SCENARIOS_DATA[(idx + 1) % SCENARIOS_DATA.length];
        selectScenario(next.id);
        document.getElementById('successOverlay').classList.remove('visible');
    });

    document.getElementById('clearCode')?.addEventListener('click', () => {
        document.getElementById('plcCodeEditor').value = '';
        showToast('🗑️ Kode dikosongkan');
    });
    document.getElementById('loadTemplate')?.addEventListener('click', () => {
        document.getElementById('plcCodeEditor').value = SCENARIO_CODES[simState.scenario] || '';
        showToast('📋 Template kode dimuat');
    });
    // Sync code button - copy IL code to editor display
    document.getElementById('syncCode')?.addEventListener('click', () => {
        const code = document.getElementById('plcCodeEditor').value;
        if (code.trim()) {
            showToast('🔄 Kode PLC tersinkronisasi dengan simulator');
        } else {
            showToast('⚠️ Tulis kode PLC terlebih dahulu', 'warning');
        }
    });
    document.getElementById('speedControl')?.addEventListener('click', () => {
        simState.speed = simState.speed >= 4 ? 1 : simState.speed * 2;
        document.getElementById('speedControl').textContent = `⚡${simState.speed}x`;
        showToast(`Kecepatan: ${simState.speed}x`);
    });
    document.getElementById('scenarioSelect')?.addEventListener('change', e => {
        selectScenario(e.target.value);
    });

    // Load demo code
    const editor = document.getElementById('plcCodeEditor');
    if (editor && !editor.value.trim()) {
        editor.value = SCENARIO_CODES['basic'];
    }
});

window.selectScenario = selectScenario;
