/* =============================================
   MAIN.JS – Global Site Utilities
   ============================================= */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ---- Mobile hamburger ----
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// ---- Counter animation ----
function animateCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// ---- Scroll reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fadeInUp');
      entry.target.style.opacity = '1';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Auto-reveal glass-cards and workflow-steps
document.querySelectorAll('.glass-card, .workflow-step, .feature-card, .type-card').forEach(el => {
  el.style.opacity = '0';
  revealObserver.observe(el);
});

// ---- Animate counters when hero is visible ----
const heroSection = document.getElementById('hero');
if (heroSection) {
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      heroObserver.unobserve(heroSection);
    }
  }, { threshold: 0.3 });
  heroObserver.observe(heroSection);
}

// ---- Progress Bar Animations ----
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.progress-fill');
      fills.forEach(fill => {
        const w = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => { fill.style.width = w; }, 100);
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.progress-bar').forEach(b => progressObserver.observe(b));

// ---- Toast notification ----
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;
  toastMsg.textContent = msg;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ---- LocalStorage helpers ----
const Store = {
  get(key, def = null) {
    try { return JSON.parse(localStorage.getItem('meka_' + key)) ?? def; } catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('meka_' + key, JSON.stringify(val)); } catch {}
  },
  update(key, def, fn) {
    const current = this.get(key, def);
    const updated = fn(current);
    this.set(key, updated);
    return updated;
  }
};

window.Store = Store;
window.showToast = showToast;
