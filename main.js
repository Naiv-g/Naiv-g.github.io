/* ═══════════════════════════════════════════════════════════
   NAIVAIDHYA GARG PORTFOLIO — main.js
   Scroll Animations, Canvas BG, Typed Text, Cursor, Form
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── CUSTOM CURSOR ──────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let ry = 0, rx = 0;
  let dy = 0, dx = 0;

  document.addEventListener('mousemove', (e) => {
    dx = e.clientX; dy = e.clientY;
    dot.style.left  = dx + 'px';
    dot.style.top   = dy + 'px';
  });

  function animateRing() {
    rx += (dx - rx) * 0.12;
    ry += (dy - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .glass-card, .project-card, .skill-tag, .badge')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
})();

/* ── CANVAS STARFIELD + GRID ────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [], grid = { alpha: 0, dir: 1 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((W * H) / 4500);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.008;

    /* Grid */
    const gridSize = 80;
    ctx.strokeStyle = `rgba(0,229,255,${0.025 + 0.01 * Math.sin(t)})`;
    ctx.lineWidth   = 0.5;
    for (let x = 0; x < W; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = -scrollY % gridSize; y < H; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    /* Stars */
    stars.forEach(s => {
      s.pulse += 0.015;
      const a = s.alpha * (0.6 + 0.4 * Math.sin(s.pulse));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,230,255,${a})`;
      ctx.fill();

      /* Slow drift */
      s.y += s.speed * 0.2;
      if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
    });

    /* Scan line */
    const scanY = (scrollY * 0.15 + t * 80) % (H + 200) - 100;
    const grad  = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, 'rgba(0,229,255,0.03)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 80, W, 160);

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ── TYPED TEXT ─────────────────────────────────────────── */
(function initTyped() {
  const el      = document.getElementById('typed-text');
  const phrases = [
    'AI & Machine Learning Engineer',
    'Computer Vision Developer',
    'RAG Systems Builder',
    'Full-Stack AI Developer',
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (deleting) {
      ci--;
      el.textContent = phrase.slice(0, ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 600); return; }
      setTimeout(tick, 45);
    } else {
      ci++;
      el.textContent = phrase.slice(0, ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 2200); return; }
      setTimeout(tick, 65);
    }
  }
  setTimeout(tick, 1000);
})();

/* ── NAVBAR ─────────────────────────────────────────────── */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const progress   = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    navbar.classList.toggle('scrolled', sy > 50);

    /* Progress bar */
    const docH  = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (sy / docH * 100) + '%';

    /* Active nav link */
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (sy >= s.offsetTop - 200) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active', a.dataset.section === current);
    });
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-nav-link').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── SCROLL REVEAL ──────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        /* Animate skill bars when skill section enters */
        e.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });

  /* Also trigger bars when skills section itself is revealed */
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }
      });
    }, { threshold: 0.1 });
    skillObs.observe(skillsSection);
  }
})();

/* ── PARALLAX on hero visual ────────────────────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.08;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  });
})();

/* ── MOUSE PARALLAX on hero card ────────────────────────── */
(function initMouseParallax() {
  const card = document.querySelector('.hero-card');
  if (!card) return;
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    card.style.transform = `translate(-50%, -50%) translateY(${-12 * Math.abs(Math.sin(Date.now()/1000))}px) rotateX(${dy * -6}deg) rotateY(${dx * 6}deg)`;
  });
})();

/* ── PROJECT CARD TILT ──────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.project-card, .skill-group').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateX(${dy * -4}deg) rotateY(${dx * 4}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── CONTACT FORM ───────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn     = document.getElementById('form-submit-btn');

  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Sending…';

    /* Simulate send (replace with real API call if needed) */
    setTimeout(() => {
      form.reset();
      success.classList.add('visible');
      btn.disabled = false;
      btn.innerHTML = 'Send Message <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      setTimeout(() => success.classList.remove('visible'), 4000);
    }, 1200);
  });
})();

/* ── GLITCH EFFECT on name ──────────────────────────────── */
(function initGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;
  let glitching = false;

  setInterval(() => {
    if (glitching) return;
    glitching = true;
    name.style.filter = 'blur(1px)';
    name.style.transform = 'skewX(-2deg)';
    setTimeout(() => {
      name.style.filter = '';
      name.style.transform = '';
      glitching = false;
    }, 80);
  }, 5000 + Math.random() * 3000);
})();

/* ── COUNTER ANIMATION ──────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const raw = el.textContent;
      const num = parseFloat(raw);
      if (isNaN(num)) return;
      const suffix = raw.replace(/[\d.]/g, '');
      let start = 0;
      const step = num / 60;
      const timer = setInterval(() => {
        start = Math.min(start + step, num);
        el.textContent = (Number.isInteger(num) ? Math.round(start) : start.toFixed(1)) + suffix;
        if (start >= num) clearInterval(timer);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.8 });
  counters.forEach(c => obs.observe(c));
})();

/* ── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
