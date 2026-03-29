/* ─── BUILDRS SCROLL DEMO — app.js ──────────────────────────────────────── */

const FRAME_COUNT = 121;
const FRAME_SPEED = 2.0;
const IMAGE_SCALE = 0.88;
const BG_COLOR    = '#09090b';
const FRAME_EXT   = 'jpg';

// ─── Elements ────────────────────────────────────────────────────────────────
const loader       = document.getElementById('loader');
const loaderBar    = document.getElementById('loader-bar');
const loaderPct    = document.getElementById('loader-percent');
const canvas       = document.getElementById('canvas');
const canvasWrap   = document.getElementById('canvas-wrap');
const darkOverlay  = document.getElementById('dark-overlay');
const scrollCont   = document.getElementById('scroll-container');
const heroSection  = document.getElementById('hero');
const marqueeWrap  = document.getElementById('marquee');

const ctx = canvas.getContext('2d');
const frames = new Array(FRAME_COUNT).fill(null);
let currentFrame = 0;
let loadedCount  = 0;

// ─── Canvas Resize ────────────────────────────────────────────────────────────
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  drawFrame(currentFrame);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ─── Draw Frame ───────────────────────────────────────────────────────────────
function drawFrame(index) {
  const img = frames[index];
  const dpr = window.devicePixelRatio || 1;
  const cw  = canvas.width  / dpr;
  const ch  = canvas.height / dpr;

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, cw, ch);

  if (!img || !img.complete) return;

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  ctx.drawImage(img, dx, dy, dw, dh);
}

// ─── Frame Preloader (two-phase) ──────────────────────────────────────────────
function loadFrames() {
  const FIRST_BATCH = 12;

  function padded(n) {
    return String(n).padStart(4, '0');
  }

  function onLoad() {
    loadedCount++;
    const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
    loaderBar.style.width = pct + '%';
    loaderPct.textContent = pct + '%';
    if (loadedCount === FRAME_COUNT) {
      loader.classList.add('hidden');
      initScrollExperience();
    }
  }

  // Phase 1 — first 12 frames immediately
  for (let i = 1; i <= FIRST_BATCH; i++) {
    const img = new Image();
    img.onload  = onLoad;
    img.onerror = onLoad;
    img.src = `frames/frame_${padded(i)}.${FRAME_EXT}`;
    frames[i - 1] = img;
  }

  // Phase 2 — remaining frames
  setTimeout(() => {
    for (let i = FIRST_BATCH + 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.onload  = onLoad;
      img.onerror = onLoad;
      img.src = `frames/frame_${padded(i)}.${FRAME_EXT}`;
      frames[i - 1] = img;
    }
  }, 50);
}

// ─── Lenis + GSAP Init ────────────────────────────────────────────────────────
function initScrollExperience() {
  // Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.defaults({ scroller: window });

  // Draw first frame
  drawFrame(0);

  // ── Hero word-split entrance ──────────────────────────────────────────────
  const heroWords = heroSection.querySelectorAll('.word');
  gsap.from(heroWords, {
    y: 60,
    opacity: 0,
    duration: 1.0,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.2,
  });
  gsap.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.8, delay: 0.1, ease: 'power2.out' });
  gsap.from('.hero-tagline',  { opacity: 0, y: 30, duration: 0.8, delay: 0.6, ease: 'power2.out' });
  gsap.from('.hero-scroll-hint', { opacity: 0, duration: 0.6, delay: 1.2 });

  // ── Hero Transition + Canvas Circle-Wipe ─────────────────────────────────
  ScrollTrigger.create({
    trigger: scrollCont,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;

      // Hero fade out
      heroSection.style.opacity = Math.max(0, 1 - p * 18);

      // Canvas circle wipe in
      const wipeP = Math.min(1, Math.max(0, (p - 0.005) / 0.07));
      const radius = wipeP * 75;
      canvasWrap.style.clipPath = `circle(${radius}% at 50% 50%)`;

      // Marquee visibility
      if (p > 0.12 && p < 0.85) {
        marqueeWrap.classList.add('visible');
      } else {
        marqueeWrap.classList.remove('visible');
      }
    },
  });

  // ── Frame Scroll Binding ──────────────────────────────────────────────────
  ScrollTrigger.create({
    trigger: scrollCont,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
      const index = Math.min(
        Math.floor(accelerated * FRAME_COUNT),
        FRAME_COUNT - 1
      );
      if (index !== currentFrame) {
        currentFrame = index;
        requestAnimationFrame(() => drawFrame(currentFrame));
      }
    },
  });

  // ── Dark Overlay for Stats ────────────────────────────────────────────────
  const statSection = document.querySelector('[data-overlay-enter]');
  if (statSection) {
    const enter = parseFloat(statSection.dataset.overlayEnter);
    const leave = parseFloat(statSection.dataset.overlayLeave);
    const fadeRange = 0.04;

    ScrollTrigger.create({
      trigger: scrollCont,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        let opacity = 0;
        if (p >= enter - fadeRange && p <= enter) {
          opacity = (p - (enter - fadeRange)) / fadeRange;
        } else if (p > enter && p < leave) {
          opacity = 0.9;
        } else if (p >= leave && p <= leave + fadeRange) {
          opacity = 0.9 * (1 - (p - leave) / fadeRange);
        }
        darkOverlay.style.opacity = opacity;
      },
    });
  }

  // ── Marquee Scroll-Driven ─────────────────────────────────────────────────
  const marqueeText = marqueeWrap.querySelector('.marquee-text');
  const speed = parseFloat(marqueeWrap.dataset.scrollSpeed) || -22;
  gsap.to(marqueeText, {
    xPercent: speed,
    ease: 'none',
    scrollTrigger: {
      trigger: scrollCont,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });

  // ── Section Animations ────────────────────────────────────────────────────
  const sections = document.querySelectorAll('.scroll-section');
  const totalH   = scrollCont.offsetHeight;

  sections.forEach((section) => {
    const enterPct = parseFloat(section.dataset.enter) / 100;
    const leavePct = parseFloat(section.dataset.leave) / 100;
    const midPct   = (enterPct + leavePct) / 2;
    const persist  = section.dataset.persist === 'true';

    // Position absolutely at the midpoint
    const topPx = midPct * totalH;
    section.style.top = topPx + 'px';

    const animType = section.dataset.animation;
    const children = section.querySelectorAll(
      '.section-label, .section-heading, .section-body, .section-note, .stack-chips, .stats-grid, .stat, .cta-inner, .cta-heading, .cta-price, .cta-button, .cta-note'
    );

    const tl = gsap.timeline({ paused: true });

    switch (animType) {
      case 'fade-up':
        tl.from(children, { y: 50, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' });
        break;
      case 'slide-left':
        tl.from(children, { x: -80, opacity: 0, stagger: 0.14, duration: 0.9, ease: 'power3.out' });
        break;
      case 'slide-right':
        tl.from(children, { x: 80, opacity: 0, stagger: 0.14, duration: 0.9, ease: 'power3.out' });
        break;
      case 'scale-up':
        tl.from(children, { scale: 0.85, opacity: 0, stagger: 0.12, duration: 1.0, ease: 'power2.out' });
        break;
      case 'rotate-in':
        tl.from(children, { y: 40, rotation: 3, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out' });
        break;
      case 'stagger-up':
        tl.from(children, { y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out' });
        break;
      case 'clip-reveal':
        tl.from(children, {
          clipPath: 'inset(100% 0 0 0)',
          opacity: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power4.inOut',
        });
        break;
      default:
        tl.from(children, { opacity: 0, duration: 0.6 });
    }

    let played = false;
    let reversed = false;

    ScrollTrigger.create({
      trigger: scrollCont,
      start: 'top top',
      end: 'bottom bottom',
      scrub: false,
      onUpdate: (self) => {
        const p = self.progress;
        const inRange = p >= enterPct && p <= leavePct;

        if (inRange) {
          section.classList.add('active');
          if (!played) {
            tl.restart();
            played = true;
            reversed = false;
          }
        } else {
          if (!persist) {
            section.classList.remove('active');
            if (played && !reversed) {
              tl.reverse();
              reversed = true;
              played = false;
            }
          }
        }

        // Persist: once active, never hide
        if (persist && p >= enterPct) {
          section.classList.add('active');
          if (!played) { tl.restart(); played = true; }
        }
      },
    });
  });

  // ── Counter Animations ────────────────────────────────────────────────────
  document.querySelectorAll('.stat-number').forEach((el) => {
    const target   = parseFloat(el.dataset.value);
    const decimals = parseInt(el.dataset.decimals || '0');
    const statSection = el.closest('.scroll-section');

    ScrollTrigger.create({
      trigger: scrollCont,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const enterPct = parseFloat(statSection.dataset.enter) / 100;
        if (self.progress >= enterPct && !el._counted) {
          el._counted = true;
          gsap.to(el, {
            textContent: target,
            duration: 1.8,
            ease: 'power1.out',
            snap: { textContent: decimals === 0 ? 1 : 0.01 },
            onUpdate() {
              el.textContent = decimals === 0
                ? Math.round(parseFloat(el.textContent))
                : parseFloat(el.textContent).toFixed(decimals);
            },
          });
        }
      },
    });
  });

  // ── Refresh ScrollTrigger ─────────────────────────────────────────────────
  setTimeout(() => ScrollTrigger.refresh(), 200);
}

// ─── Start ────────────────────────────────────────────────────────────────────
loadFrames();
