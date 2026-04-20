/* ============================================================
   UPSERV — Premium interactions
   Global easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
   Custom cursor, section reveals, sequential hero animation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     HERO BACKGROUND — Neat gradient
     ================================================================ */
  (function initNeatGradient() {
    try {
      const canvas = document.getElementById('gradient');
      if (!canvas) return;

      const GradientClass = (typeof neat !== 'undefined' && neat.NeatGradient)
        ? neat.NeatGradient
        : (typeof NeatGradient !== 'undefined') ? NeatGradient : null;
      if (!GradientClass) return;

      // Vibrant, playful gradient — replaces the prior dark teal field
      const config = {
        colors: [
          { color: '#FF5772', enabled: true },
          { color: '#00B7FF', enabled: true },
          { color: '#FFC600', enabled: true },
          { color: '#8B6AE6', enabled: true },
          { color: '#2E0EC7', enabled: true },
          { color: '#FF9A9E', enabled: true },
        ],
        speed: 2.5,
        horizontalPressure: 2,
        verticalPressure: 4,
        waveFrequencyX: 3,
        waveFrequencyY: 3,
        waveAmplitude: 6,
        shadows: 1,
        highlights: 5,
        colorBrightness: 1,
        colorSaturation: 7,
        wireframe: false,
        colorBlending: 8,
        backgroundColor: '#003FFF',
        backgroundAlpha: 1,
        grainScale: 0,
        grainSparsity: 0,
        grainIntensity: 0,
        grainSpeed: 1,
        resolution: 0.35,
        yOffset: -0.16668701171875,
        yOffsetWaveMultiplier: 4,
        yOffsetColorMultiplier: 6.3,
        yOffsetFlowMultiplier: 4,
        flowDistortionA: 0,
        flowDistortionB: 0,
        flowScale: 1,
        flowEase: 0,
        flowEnabled: false,
        enableProceduralTexture: false,
        textureVoidLikelihood: 0.45,
        textureVoidWidthMin: 200,
        textureVoidWidthMax: 486,
        textureBandDensity: 2.15,
        textureColorBlending: 0.01,
        textureSeed: 333,
        textureEase: 0.5,
        proceduralBackgroundColor: '#000000',
        textureShapeTriangles: 20,
        textureShapeCircles: 15,
        textureShapeBars: 15,
        textureShapeSquiggles: 10,
        domainWarpEnabled: false,
        domainWarpIntensity: 0,
        domainWarpScale: 3,
        vignetteIntensity: 0,
        vignetteRadius: 0.8,
        fresnelEnabled: true,
        fresnelPower: 2,
        fresnelIntensity: 0.6,
        fresnelColor: '#F90707',
        iridescenceEnabled: false,
        iridescenceIntensity: 0.5,
        iridescenceSpeed: 1,
        bloomIntensity: 0,
        bloomThreshold: 0.95,
        chromaticAberration: 0,
      };

      const gradient = new GradientClass({ ref: canvas, ...config });
      window.__neatGradient = gradient;

      // Scroll drives yOffset — gradient evolves as user scrolls the hero
      window.addEventListener('scroll', () => {
        try { gradient.yOffset = window.scrollY; } catch (e) {}
      }, { passive: true });
    } catch (e) {
      console.warn('Neat gradient failed to initialize:', e);
    }
  })();

  /* ================================================================
     SCROLLBAR WIDTH
     ================================================================ */
  document.documentElement.style.setProperty(
    '--scrollbar-w',
    (window.innerWidth - document.documentElement.clientWidth) + 'px'
  );

  /* ================================================================
     CUSTOM CURSOR — removed per design context (no cursor trails)
     ================================================================ */

  /* ================================================================
     LENIS SMOOTH SCROLL
     ================================================================ */
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } catch(e) {}

  /* ================================================================
     HEADER — Midnight color switching
     ================================================================ */
  const header = document.getElementById('top');
  const midnightSections = document.querySelectorAll('[data-midnight]');

  let lastSY = -1;

  function updateHeader() {
    // Toggle .scrolled class for nav glass→opaque transition
    const sy = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (sy !== lastSY) {
      lastSY = sy;
      header.classList.toggle('scrolled', sy > 50);
    }
    for (let i = midnightSections.length - 1; i >= 0; i--) {
      const rect = midnightSections[i].getBoundingClientRect();
      if (rect.top <= 60 && rect.bottom > 60) {
        header.setAttribute('data-theme', midnightSections[i].getAttribute('data-midnight'));
        return;
      }
    }
    header.setAttribute('data-theme', 'dark');
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  // Continuous rAF loop — independent of Lenis/GSAP, fires every frame
  (function rafLoop() {
    updateHeader();
    requestAnimationFrame(rafLoop);
  })();

  /* ================================================================
     CTA CLICK ANIMATION
     ================================================================ */
  const heroCta = document.getElementById('heroCta');
  if (heroCta) {
    function ctaPress() {
      heroCta.classList.remove('releasing');
      heroCta.classList.add('pressing');
    }
    function ctaRelease() {
      heroCta.classList.remove('pressing');
      heroCta.classList.add('releasing');
      setTimeout(() => heroCta.classList.remove('releasing'), 400);
    }
    heroCta.addEventListener('mousedown', ctaPress);
    heroCta.addEventListener('mouseup', ctaRelease);
    heroCta.addEventListener('mouseleave', () => {
      if (heroCta.classList.contains('pressing')) ctaRelease();
    });
    heroCta.addEventListener('touchstart', ctaPress, { passive: true });
    heroCta.addEventListener('touchend', ctaRelease);
  }

  /* ================================================================
     SLIDE-OUT MOBILE MENU
     ================================================================ */
  const slideToggle = document.getElementById('slideOutToggle');
  const slideMenu = document.getElementById('slideOutMenu');
  const slideBg = document.getElementById('slideOutBg');
  const slideClose = document.getElementById('slideOutClose');

  function openMenu() {
    slideMenu.classList.add('open');
    slideBg.classList.add('open');
    slideToggle.classList.add('open');
    if (lenis) lenis.stop();
  }
  function closeMenu() {
    slideMenu.classList.remove('open');
    slideBg.classList.remove('open');
    slideToggle.classList.remove('open');
    if (lenis) lenis.start();
  }
  slideToggle?.addEventListener('click', () => {
    slideMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  slideClose?.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); });
  slideBg?.addEventListener('click', closeMenu);
  slideMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ================================================================
     S01c: AI READING GLASS — Layer 1: base card with 3D parallax tilt
     Desktop only. Mouse-tracked rotateX/Y with scale lift.
     Mouseleave returns card to resting state with a slow ease-out.
     No GSAP dependency — runs before the GSAP early-return below.
     ================================================================ */
  (function initCardTilt() {
    // .landing-section has z-index: -1 (sits behind the stacking context)
    // so it cannot receive mouse events directly. Listen on the document
    // and check against the hero's bounds each mousemove.
    const heroRef = document.getElementById('heroPin') || document.querySelector('.landing-section');
    const card = document.getElementById('browserCard');
    const bcBody = card && card.querySelector('.bc-body');
    if (!heroRef || !card) return;
    if (window.innerWidth <= 768) return; // no tilt on touch/mobile

    const MAX_ROT_Y = 8; // mouse X  →  -8..+8 deg
    const MAX_ROT_X = 6; // mouse Y  →  +6..-6 deg (inverted)
    // Lens floats above card surface — counter-shifts opposite to tilt
    // by ~5% of tilt angle (max ~4px on X axis, ~3px on Y axis).
    const LENS_OFFSET_X_PER_DEG = -0.5;
    const LENS_OFFSET_Y_PER_DEG = -0.5;
    let insideHero = false;

    function setLensOffset(ox, oy) {
      if (!bcBody) return;
      bcBody.style.setProperty('--lens-offset-x', ox.toFixed(2) + 'px');
      bcBody.style.setProperty('--lens-offset-y', oy.toFixed(2) + 'px');
    }

    function reset() {
      card.style.transition = 'transform 0.6s ease-out';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      setLensOffset(0, 0);
    }

    document.addEventListener('mousemove', (e) => {
      const rect = heroRef.getBoundingClientRect();
      const within =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;

      if (!within) {
        if (insideHero) { insideHero = false; reset(); }
        return;
      }
      insideHero = true;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top)  / rect.height;
      const rotY = (nx - 0.5) * 2 * MAX_ROT_Y;
      const rotX = (0.5 - ny) * 2 * MAX_ROT_X;
      card.style.transition = 'transform 0.1s ease-out';
      card.style.transform =
        `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.02)`;
      // Lens parallax — opposite direction to tilt
      setLensOffset(rotY * LENS_OFFSET_X_PER_DEG, rotX * LENS_OFFSET_Y_PER_DEG);
    }, { passive: true });

    document.addEventListener('mouseleave', reset);
  })();

  /* ================================================================
     AI READING GLASS — Layer 5 polish: ambient particles in AI layer
     14 tiny teal dots drifting slowly. Felt more than seen.
     ================================================================ */
  (function initAiParticles() {
    const aiLayer = document.querySelector('.bc-ai-layer');
    if (!aiLayer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const COUNT = 14;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'bc-ai-particle';
      p.style.left = (4 + Math.random() * 92).toFixed(1) + '%';
      p.style.top  = (4 + Math.random() * 92).toFixed(1) + '%';
      p.style.setProperty('--p-dx',    ((Math.random() * 36) - 18).toFixed(1) + 'px');
      p.style.setProperty('--p-dy',    ((Math.random() * 36) - 18).toFixed(1) + 'px');
      p.style.setProperty('--p-dur',   (14 + Math.random() * 12).toFixed(1) + 's');
      p.style.setProperty('--p-delay', (-Math.random() * 20).toFixed(1) + 's');
      frag.appendChild(p);
    }
    aiLayer.appendChild(frag);
  })();

  /* ================================================================
     GSAP + SCROLLTRIGGER — everything below requires these libs
     ================================================================ */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ================================================================
     AI READING GLASS — Layer 4: autonomous reading cycle
     GSAP timeline drives --lens-x / --lens-y / --lens-r across the card
     on a deliberate reading path. Mouseover pauses the cycle so the
     3D tilt from Layer 1 can be observed cleanly.
     ================================================================ */
  (function initLensMotion() {
    const bcBody = document.querySelector('.bc-body');
    const lens = document.getElementById('bcLens');
    const readout = document.getElementById('bcLensReadout');
    const recommended = document.getElementById('bcRecommended');
    if (!bcBody || !lens || !readout) return;
    if (window.innerWidth <= 768) return; // desktop-only
    // Honor user's reduced-motion preference — no animation, no lens
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const state = { x: 15, y: 10, r: 0 };
    function writeState() {
      bcBody.style.setProperty('--lens-x', state.x + '%');
      bcBody.style.setProperty('--lens-y', state.y + '%');
      bcBody.style.setProperty('--lens-r', state.r + 'px');
    }
    function setReadout(text) { readout.textContent = text; }
    function pulsePill() {
      if (!recommended) return;
      recommended.classList.remove('is-pulsing');
      void recommended.offsetWidth; // force reflow to restart animation
      recommended.classList.add('is-pulsing');
    }

    // Initial hidden state — no hole, lens invisible
    writeState();
    gsap.set(lens, { opacity: 0, scale: 0.6, transformOrigin: 'center center' });

    const tl = gsap.timeline({ repeat: -1, defaults: { overwrite: 'auto' } });

    // ---------- PHASE 1 — ENTRY (0.8s) ----------
    tl.call(() => {
        state.x = 15; state.y = 10; state.r = 0;
        writeState();
        setReadout('AI_VISION: ACTIVE');
      })
      .fromTo(lens,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out', immediateRender: false }
      )
      .to(state, {
        r: 80, duration: 0.8, ease: 'power2.out', onUpdate: writeState
      }, '<');

    // ---------- PHASE 2 — NAV SCAN (1.5s, linear) ----------
    tl.call(() => setReadout('STRUCTURE: INDEXED'))
      .to(state, {
        x: 85, y: 15, duration: 1.5, ease: 'none', onUpdate: writeState
      });

    // ---------- PHASE 3 — IMAGE DIAGONAL (2s) ----------
    tl.call(() => setReadout('CONTEXT: PARSED'))
      .to(state, {
        x: 15, y: 50, duration: 2, ease: 'power1.inOut', onUpdate: writeState
      });

    // ---------- PHASE 4 — TITLE FOCUS (1.5s: 0.7 travel + 0.8 pulse) ----------
    tl.call(() => setReadout('ENTITY: IDENTIFIED'))
      .to(state, {
        x: 50, y: 65, duration: 0.7, ease: 'power1.inOut', onUpdate: writeState
      })
      .to(lens, { scale: 1.05, duration: 0.4, ease: 'power1.inOut' })
      .to(lens, { scale: 1.00, duration: 0.4, ease: 'power1.inOut' });

    // ---------- PHASE 5 — SERVICES SWEEP (1.5s) ----------
    tl.call(() => setReadout('CATALOG: MAPPED'))
      .to(state, {
        x: 10, y: 82, duration: 0.5, ease: 'power1.inOut', onUpdate: writeState
      })
      .to(state, {
        x: 90, y: 82, duration: 1.0, ease: 'power1.inOut', onUpdate: writeState
      });

    // ---------- PHASE 6 — CTA SETTLE (1s: 0.5 travel + 0.5 hold) ----------
    tl.call(() => setReadout('ACTION: REGISTERED'))
      .to(state, {
        x: 50, y: 91, duration: 0.5, ease: 'power1.inOut', onUpdate: writeState
      })
      .to({}, { duration: 0.5 });

    // ---------- PHASE 7 — RECOMMENDATION (1.5s: 1.0 travel + 0.5 hold, pill pulses) ----------
    tl.call(() => setReadout('RECOMMENDATION: SENT'))
      .to(state, {
        x: 50, y: 98, duration: 1.0, ease: 'power1.inOut', onUpdate: writeState
      })
      .call(pulsePill)
      .to({}, { duration: 0.5 });

    // ---------- PHASE 8 — EXIT + PAUSE (1s) ----------
    tl.to(lens, { opacity: 0, duration: 0.5, ease: 'power2.in' })
      .to(state, { r: 0, duration: 0.5, ease: 'power2.in', onUpdate: writeState }, '<')
      .to({}, { duration: 0.5 });
  })();

  /* ================================================================
     S02: CLIP-PATH REVEAL — scroll-driven
     ================================================================ */
  const clipBgWrap = document.getElementById('clipBgWrap');
  const clipImage = document.getElementById('clipImage');
  const clipReveal = document.getElementById('clipReveal');

  if (clipBgWrap && clipReveal) {
    gsap.fromTo(clipBgWrap,
      { clipPath: 'inset(15% 25% 15% 25% round 50px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'power1.inOut',
        scrollTrigger: { trigger: clipReveal, start: 'top 100%', end: 'top 0%', scrub: 0.3 },
      }
    );
    if (clipImage) {
      gsap.fromTo(clipImage, { scale: 1.3 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: clipReveal, start: 'top 100%', end: 'top 0%', scrub: 0.3 },
      });
    }
  }

  /* ================================================================
     S03: DARK STATEMENT — scroll reveal with stagger
     ================================================================ */
  const s3Reveals = document.querySelectorAll('.s3-reveal');
  const s3Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-reveal-delay')) || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        s3Observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  s3Reveals.forEach(el => s3Observer.observe(el));

  /* ================================================================
     TERMINAL DEMO — Cycling AI search scenarios
     ================================================================ */
  const terminal = document.getElementById('aiTerminal');
  if (terminal) {
    const scenarios = [
      {
        query: 'best dental clinic in Austin Texas',
        results: [
          { name: 'Smile Studio Austin', desc: 'Comprehensive dental care · implants · cosmetic dentistry' },
          { name: 'Austin Dental Care', desc: 'Family dentistry · orthodontics · emergency appointments' },
          { name: 'Pearl Dental Group', desc: 'General & cosmetic dentistry · accepting new patients' },
        ]
      },
      {
        query: 'top personal injury lawyer in Miami',
        results: [
          { name: 'Gonzalez Law Group', desc: 'Personal injury · car accidents · medical malpractice' },
          { name: 'Miami Legal Partners', desc: '30 years experience · free consultations · no win no fee' },
          { name: 'Coastal Injury Attorneys', desc: 'Personal injury specialists · available 24/7' },
        ]
      },
      {
        query: 'best Italian restaurant in Chicago',
        results: [
          { name: 'Trattoria Roma Chicago', desc: 'Authentic Italian cuisine · wood-fired pizza · private dining' },
          { name: 'Via Napoli Ristorante', desc: 'Family recipes · fresh pasta daily · reservations available' },
          { name: 'Osteria del Corso', desc: 'Contemporary Italian · 4.9 stars · open for lunch and dinner' },
        ]
      }
    ];

    const queryEl = document.getElementById('terminalQuery');
    const labelEl = document.getElementById('terminalLabel');
    const results = terminal.querySelectorAll('.terminal-result');
    const missingEl = document.getElementById('terminalMissing');
    let scenarioIdx = 0;
    let terminalStarted = false;

    function resetTerminal() {
      queryEl.innerHTML = '';
      labelEl.classList.remove('show');
      results.forEach(r => r.classList.remove('show'));
      missingEl.classList.remove('show');
    }

    function typeText(text, el, speed, cb) {
      el.innerHTML = '<span class="typed"></span><span class="cursor"></span>';
      const typed = el.querySelector('.typed');
      let i = 0;
      function tick() {
        if (i < text.length) {
          typed.textContent += text[i];
          i++;
          setTimeout(tick, speed);
        } else {
          const cursor = el.querySelector('.cursor');
          if (cursor) cursor.remove();
          if (cb) cb();
        }
      }
      tick();
    }

    function runScenario(s) {
      resetTerminal();

      // Set result content
      document.getElementById('r1Name').textContent = s.results[0].name;
      document.getElementById('r1Desc').textContent = s.results[0].desc;
      document.getElementById('r2Name').textContent = s.results[1].name;
      document.getElementById('r2Desc').textContent = s.results[1].desc;
      document.getElementById('r3Name').textContent = s.results[2].name;
      document.getElementById('r3Desc').textContent = s.results[2].desc;

      setTimeout(() => {
        typeText(s.query, queryEl, 42, () => {
          setTimeout(() => {
            labelEl.classList.add('show');
            setTimeout(() => results[0].classList.add('show'), 100);
            setTimeout(() => results[1].classList.add('show'), 420);
            setTimeout(() => results[2].classList.add('show'), 740);
            setTimeout(() => missingEl.classList.add('show'), 1140);
          }, 300);
        });
      }, 400);
    }

    // Start on intersection
    const terminalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !terminalStarted) {
          terminalStarted = true;
          runScenario(scenarios[0]);
          setInterval(() => {
            scenarioIdx = (scenarioIdx + 1) % scenarios.length;
            runScenario(scenarios[scenarioIdx]);
          }, 10000);
          terminalObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    terminalObserver.observe(terminal);
  }

  /* ================================================================
     FADE-IN-FROM-BOTTOM (legacy)
     ================================================================ */
  document.querySelectorAll('[data-animation="fade-in-from-bottom"]').forEach(el => {
    const delay = parseInt(el.getAttribute('data-delay')) || 0;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%',
      onEnter: () => setTimeout(() => el.classList.add('in-view'), delay),
    });
  });

  /* ================================================================
     S04: INDUSTRY CARDS — full-bleed, no JS needed
     ================================================================ */

  /* ================================================================
     S05: ROTATING WORDS
     ================================================================ */
  const rotatingTitle = document.querySelector('.nectar-rotating-words-title');
  if (rotatingTitle) {
    const words = rotatingTitle.querySelectorAll('.text-wrap');
    const interval = parseInt(rotatingTitle.getAttribute('data-rotation')) || 3000;
    let currentIdx = 0;
    setInterval(() => {
      words[currentIdx].classList.remove('active');
      currentIdx = (currentIdx + 1) % words.length;
      words[currentIdx].classList.add('active');
    }, interval);
  }

  /* ================================================================
     S06: FAQ ACCORDION
     ================================================================ */
  document.querySelectorAll('.toggle-title').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.toggle');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.toggle.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.toggle-title')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ================================================================
     FOOTER — Parallax
     ================================================================ */
  const footerParallax = document.querySelector('.nectar-el-parallax-scroll');
  if (footerParallax) {
    gsap.from(footerParallax, {
      y: -50,
      scrollTrigger: { trigger: footerParallax, start: 'top bottom', end: 'bottom bottom', scrub: 1 },
    });
  }

  /* ================================================================
     6. SCROLL-TRIGGERED SECTION REVEALS (IntersectionObserver)
     threshold: 0.25
     ================================================================ */
  const revealSections = document.querySelectorAll(
    '.hero-text-section, .products-section, .trusted-section, .faq-section, .site-footer'
  );
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  revealSections.forEach(s => sectionObserver.observe(s));

  /* ================================================================
     GENERIC FADE-UP OBSERVER
     ================================================================ */
  const fadeUpEls = document.querySelectorAll('.fade-up');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeUpEls.forEach(el => fadeObserver.observe(el));

  /* ================================================================
     PRICING — scroll reveal
     ================================================================ */
  const pricingReveals = document.querySelectorAll('.pricing-reveal');
  const pricingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        pricingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  pricingReveals.forEach(el => pricingObserver.observe(el));

  /* ================================================================
     SMOOTH SCROLL — Anchor links
     ================================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -80 });
        else target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
