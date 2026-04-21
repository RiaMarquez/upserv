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

      // Cool-palette gradient — purples / magentas / indigos only.
      // Every animation frame stays in the cool half of the spectrum so
      // headline contrast holds and the hero never tips into glare.
      const config = {
        colors: [
          { color: '#1E1B4B', enabled: true },  // deep indigo — anchor
          { color: '#4C1D95', enabled: true },  // royal purple
          { color: '#7C3AED', enabled: true },  // vivid violet
          { color: '#C026D3', enabled: true },  // magenta — warmest allowed
          { color: '#5B21B6', enabled: true },  // purple-blue
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
        fresnelColor: '#7C3AED',
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

    const MAX_ROT_Y = 10; // mouse X  →  -10..+10 deg
    const MAX_ROT_X = 10; // mouse Y  →  +10..-10 deg (inverted)
    // Lens floats above card surface — counter-shifts opposite to tilt
    const LENS_OFFSET_X_PER_DEG = -0.5;
    const LENS_OFFSET_Y_PER_DEG = -0.5;
    let insideHero = false;

    function setLensOffset(ox, oy) {
      if (!bcBody) return;
      bcBody.style.setProperty('--lens-offset-x', ox.toFixed(2) + 'px');
      bcBody.style.setProperty('--lens-offset-y', oy.toFixed(2) + 'px');
    }

    // Layer B — highlight offset CSS vars (light-source coupling).
    // The multiplier (8) is the spec's start value; with MAX_ROT ±10deg
    // that gives ±80px offset at maximum tilt.
    const HIGHLIGHT_MULT = 8;
    function setHighlightOffset(rotX, rotY) {
      // Opposite sign so the glow shifts as if the light stays fixed.
      card.style.setProperty('--highlight-offset-x', (-rotY * HIGHLIGHT_MULT).toFixed(2) + 'px');
      card.style.setProperty('--highlight-offset-y', ( rotX * HIGHLIGHT_MULT).toFixed(2) + 'px');
    }

    function reset() {
      card.style.transition = 'transform 0.8s ease-out';
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      setLensOffset(0, 0);
      setHighlightOffset(0, 0);
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
      const rotY = (nx - 0.5) * 2 * MAX_ROT_Y;   // -10..+10
      const rotX = (0.5 - ny) * 2 * MAX_ROT_X;   // +10..-10
      card.style.transition = 'transform 0.1s ease-out, --highlight-offset-x 0.3s ease-out, --highlight-offset-y 0.3s ease-out';
      card.style.transform =
        `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.02)`;
      // Lens parallax — opposite direction to tilt
      setLensOffset(rotY * LENS_OFFSET_X_PER_DEG, rotX * LENS_OFFSET_Y_PER_DEG);
      // Highlight-source coupling — glow shifts opposite to tilt
      setHighlightOffset(rotX, rotY);
    }, { passive: true });

    document.addEventListener('mouseleave', reset);
  })();

  /* ================================================================
     LENS PARALLAX (Layer 2) — cursor-responsive micro-motion on the
     specular highlight, crosshair, and center dot. GSAP path motion
     unaffected. Disabled on mobile + reduced-motion.
     ================================================================ */
  (function initLensParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth <= 768) return;

    const hero = document.getElementById('heroPin') || document.querySelector('.landing-section');
    const lens = document.getElementById('bcLens');
    if (!hero || !lens) return;

    let tX = 0, tY = 0, tDist = 0;   // targets (-1..1, 0..1)
    let cX = 0, cY = 0, cDist = 0;   // current (eased)
    const EASE = 0.1;

    document.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const halfW = rect.width / 2;
      const halfH = rect.height / 2;
      const cx = e.clientX - (rect.left + halfW);
      const cy = e.clientY - (rect.top  + halfH);
      tX = Math.max(-1, Math.min(1, cx / halfW));
      tY = Math.max(-1, Math.min(1, cy / halfH));
      tDist = Math.min(1, Math.sqrt(tX * tX + tY * tY) / Math.SQRT2); // normalize so corner ≈ 1
    }, { passive: true });

    (function tick() {
      cX    += (tX    - cX)    * EASE;
      cY    += (tY    - cY)    * EASE;
      cDist += (tDist - cDist) * EASE;

      // Specular — OPPOSITE direction (real-glass reflection behavior),
      // max ±3px, scale 1.05 at center → 0.95 at edges
      lens.style.setProperty('--spec-dx',    (-cX * 3).toFixed(2) + 'px');
      lens.style.setProperty('--spec-dy',    (-cY * 3).toFixed(2) + 'px');
      lens.style.setProperty('--spec-scale', (1.05 - cDist * 0.10).toFixed(3));

      // Crosshair — SAME direction, max ±1px (subtle "tracking" drift)
      lens.style.setProperty('--cross-dx', (cX * 1).toFixed(2) + 'px');
      lens.style.setProperty('--cross-dy', (cY * 1).toFixed(2) + 'px');

      // Center dot — opacity + glow intensity pulse based on cursor
      // distance from hero center (closer = brighter, "aware" of viewer)
      lens.style.setProperty('--center-opacity', (0.7 + (1 - cDist) * 0.3).toFixed(3));
      lens.style.setProperty('--center-glow',    (0.5 + (1 - cDist) * 0.5).toFixed(3));

      requestAnimationFrame(tick);
    })();
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
     VERDICT CYCLE — Verdict Pill + Query Ticker, driven by one shared
     state so the pill color and the ticker query advance in lockstep.
     Three states on a 5s hold each, 500ms opacity fade between.
     prefers-reduced-motion: freeze on State 1.
     ================================================================ */
  (function initVerdictCycle() {
    const pill    = document.getElementById('bcRecommended');
    const pillTxt = pill && pill.querySelector('.bc-rec-text');
    const pillDot = pill && pill.querySelector('.bc-rec-dot');
    const because = document.getElementById('bcRecBecause');
    if (!pill || !pillTxt || !because) return;

    const STATES = [
      {
        verdict: 'Recommended by ChatGPT',
        dotColor: '#22C55E',
        because: "for \u2018best Invisalign dentist in South Yarra\u2019",
      },
      {
        verdict: 'Mentioned by ChatGPT — not first choice',
        dotColor: '#EAB308',
        because: "for \u2018emergency dentist near Richmond\u2019",
      },
      {
        verdict: "Not in ChatGPT's recommendations",
        dotColor: '#EF4444',
        because: "for \u2018affordable dental cleaning in Melbourne CBD\u2019",
      },
    ];

    function render(idx, instant) {
      const s = STATES[idx];
      // Drive scale via --pill-scale so the CSS `translateX(-50%) scale(...)`
      // keeps the centering translate intact on desktop (and `scale(...)`
      // alone on mobile where the pill is in static flow).
      if (instant) {
        pill.style.transition = 'none';
        pill.style.setProperty('--pill-scale', '1');
        pill.style.opacity = '1';
        pillTxt.textContent = s.verdict;
        because.textContent = s.because;
        pill.setAttribute('data-state', String(idx + 1));
        if (pillDot) pillDot.style.setProperty('background-color', s.dotColor, 'important');
        pillTxt.style.opacity = '1';
        because.style.opacity = '1';
        return;
      }
      // PHASE 1 (200ms ease-in) — shrink + dim the current state
      pill.style.transition = 'transform 200ms ease-in, opacity 200ms ease-in';
      pill.style.setProperty('--pill-scale', '0.96');
      pill.style.opacity = '0.4';
      because.style.opacity = '0';

      setTimeout(() => {
        // PHASE 2 — content swap + start smooth dot color morph
        pillTxt.textContent = s.verdict;
        because.textContent = s.because;
        pill.setAttribute('data-state', String(idx + 1));
        if (pillDot) {
          if (typeof gsap !== 'undefined') {
            gsap.to(pillDot, { backgroundColor: s.dotColor, duration: 0.2, ease: 'power2.out', overwrite: true });
          } else {
            pillDot.style.setProperty('background-color', s.dotColor, 'important');
          }
        }
        // Snap pre-arrival scale without transition, force reflow,
        // then release into Phase 3 spring.
        pill.style.transition = 'none';
        pill.style.setProperty('--pill-scale', '1.02');
        void pill.offsetWidth;

        // PHASE 3 (300ms overshoot) — confident spring arrival
        pill.style.transition = 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease-out';
        pill.style.setProperty('--pill-scale', '1');
        pill.style.opacity = '1';
        because.style.opacity = '1';
      }, 200);
    }

    // Initial render to State 1 without fade
    render(0, true);

    // Honor reduced motion — freeze on State 1, no interval
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % STATES.length;
      render(idx, false);
    }, 5000);
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
    const aiLayer = document.querySelector('.bc-ai-layer');
    const humanLayer = document.querySelector('.bc-human-layer');
    const readout = document.getElementById('bcLensReadout');
    const recommended = document.getElementById('bcRecommended');

    // Diagnostics — confirm DOM + dimensions from DevTools console
    console.log('[ReadingGlass] lens:', lens, lens && lens.getBoundingClientRect());
    console.log('[ReadingGlass] ai-layer (Surface B):', aiLayer, aiLayer && aiLayer.getBoundingClientRect());
    console.log('[ReadingGlass] human-layer (Surface A):', humanLayer, humanLayer && humanLayer.getBoundingClientRect());

    if (!bcBody || !lens || !readout) { console.warn('[ReadingGlass] missing required elements — aborting'); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { console.log('[ReadingGlass] reduced motion, skipping'); return; }
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      console.log('[ReadingGlass] mobile — running animation at restrained tempo');
      // Move readout DOM out of the lens (which sits inside .browser-card
      // with overflow:hidden and clips its content). Reparenting to
      // .hero-transform so it can render below the card. The JS reference
      // (`readout`, `readoutTextEl`) is preserved — just the DOM node moves.
      const wrap = document.querySelector('.browser-card-wrap');
      if (wrap && wrap.parentElement) {
        wrap.parentElement.insertBefore(readout, wrap.nextSibling);
      }
    }

    // Inject a Surface B clone inside the lens for the magnified reveal
    (function mountLensClone() {
      if (!aiLayer || lens.querySelector('.bc-lens-view')) return;
      const view = document.createElement('div');
      view.className = 'bc-lens-view';
      view.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('div');
      inner.className = 'bc-lens-view-inner';
      inner.innerHTML = aiLayer.innerHTML;
      view.appendChild(inner);
      lens.insertBefore(view, lens.firstChild);
    })();

    // Cache bc-body dimensions for pixel-exact clone positioning
    let bcRect = bcBody.getBoundingClientRect();
    function writeBodyDims() {
      bcRect = bcBody.getBoundingClientRect();
      bcBody.style.setProperty('--bc-w', bcRect.width + 'px');
      bcBody.style.setProperty('--bc-h', bcRect.height + 'px');
    }
    writeBodyDims();
    window.addEventListener('resize', writeBodyDims, { passive: true });

    const state = { x: 15, y: 10, r: 0 };
    function writeState() {
      bcBody.style.setProperty('--lens-x', state.x + '%');
      bcBody.style.setProperty('--lens-y', state.y + '%');
      bcBody.style.setProperty('--lens-r', state.r + 'px');
      // Pixel versions for the clone's absolute positioning + scale origin
      bcBody.style.setProperty('--lens-x-px', (bcRect.width  * state.x / 100).toFixed(1) + 'px');
      bcBody.style.setProperty('--lens-y-px', (bcRect.height * state.y / 100).toFixed(1) + 'px');
    }
    // Fade current text out, swap, fade in — 0.2s each way via CSS transition
    const readoutTextEl = readout.querySelector('.bc-lens-readout-text') || readout;
    function setReadout(text) {
      readoutTextEl.style.opacity = '0';
      setTimeout(() => {
        readoutTextEl.textContent = text;
        readoutTextEl.style.opacity = '1';
      }, 200);
    }
    function activatePill() {
      if (!recommended) return;
      recommended.classList.remove('is-active');
      void recommended.offsetWidth; // restart animations
      recommended.classList.add('is-active');
    }
    function releasePill() {
      if (!recommended) return;
      recommended.classList.remove('is-active');
    }
    // Phase 7 horizontal target: pill's center expressed as a % of
    // bc-body width. Function-based — GSAP evaluates at tween start so
    // it survives layout changes (resize, card resize, etc.).
    function pillXPercent() {
      if (!recommended || !bcBody) return 50;
      const pillRect = recommended.getBoundingClientRect();
      const bodyRect = bcBody.getBoundingClientRect();
      if (!bodyRect.width) return 50;
      const pillCenterX = pillRect.left + pillRect.width / 2;
      const xInBody = pillCenterX - bodyRect.left;
      return (xInBody / bodyRect.width) * 100;
    }

    // Initial hidden state — no hole, lens invisible
    writeState();
    gsap.set(lens, { opacity: 0, scale: 0.6, transformOrigin: 'center center' });

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { overwrite: 'auto', force3D: true },
      onStart:    () => console.log('[ReadingGlass] timeline started'),
      onRepeat:   () => console.log('[ReadingGlass] cycle restart'),
    });
    // Mobile: slow the whole cycle ~1.65× → ~18s total (was ~11s on desktop)
    if (isMobile) tl.timeScale(0.6);

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

    // ---------- PHASE 7 — RECOMMENDATION (1.75s: 1.0 travel + 0.25 dwell + pulse + 0.5 hold) ----------
    tl.call(() => setReadout('RECOMMENDATION: SENT'))
      .to(state, {
        x: pillXPercent, y: 98,
        duration: 1.0, ease: 'power1.inOut', onUpdate: writeState
      })
      .to({}, { duration: 0.25 })   // 250ms thinking-beat before pulse
      .call(activatePill)
      .to({}, { duration: 0.5 });   // 500ms hold after pulse fires

    // ---------- PHASE 8 — EXIT + PAUSE (1s) ----------
    tl.call(releasePill)   // pill begins its slow 1.5s return
      .to(lens, { opacity: 0, duration: 0.5, ease: 'power2.in' })
      .to(state, { r: 0, duration: 0.5, ease: 'power2.in', onUpdate: writeState }, '<')
      .to({}, { duration: 0.5 });
  })();

  /* ================================================================
     S02: CLIP-PATH REVEAL — scroll-driven
     ================================================================ */
  const clipBgWrap = document.getElementById('clipBgWrap');
  const clipImage = document.getElementById('clipImage');
  const clipReveal = document.getElementById('clipReveal');
  const heroPin = document.getElementById('heroPin');

  if (clipBgWrap && clipReveal) {
    // Pin the hero so S02 climbs UP OVER it. pinSpacing: false is the
    // key — without a spacer GSAP adds after the pin, S02 scrolls UP
    // into the same viewport position the fixed hero occupies, creating
    // the overlap/climb effect. (pinSpacing:true would leave a gap and
    // S02 would flow below, no overlap.)
    if (heroPin) {
      ScrollTrigger.create({
        trigger: heroPin,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
      });
    }

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
     S04: STICKY MEDIA SECTIONS — scroll-pinned stacking cards
     ================================================================ */
  const productsSection = document.querySelector('.products-section');
  const mediaPanels = document.querySelectorAll('.nectar-sticky-media-section');
  const stickyNav = document.querySelector('.nectar-sticky-media-section__navigation');
  const stickyNavBtns = document.querySelectorAll('.nectar-sticky-media-section__navigation-button');

  if (productsSection && mediaPanels.length > 0) {
    ScrollTrigger.create({
      trigger: productsSection, start: 'top 30%', end: 'bottom 70%',
      onEnter: () => stickyNav?.classList.add('visible'),
      onLeave: () => stickyNav?.classList.remove('visible'),
      onEnterBack: () => stickyNav?.classList.add('visible'),
      onLeaveBack: () => stickyNav?.classList.remove('visible'),
    });

    mediaPanels.forEach((panel, i) => {
      ScrollTrigger.create({
        trigger: panel, start: 'top 50%', end: 'bottom 50%',
        onEnter: () => updateNavBtn(i),
        onEnterBack: () => updateNavBtn(i),
      });
    });

    function updateNavBtn(idx) {
      stickyNavBtns.forEach((btn, i) => btn.classList.toggle('active', i === idx));
    }

    stickyNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-target'));
        if (mediaPanels[idx]) {
          if (typeof lenis !== 'undefined' && lenis) lenis.scrollTo(mediaPanels[idx], { offset: -100 });
          else mediaPanels[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

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
