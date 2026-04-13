/* ============================================================
   UPSERV — Premium interactions
   Global easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
   Custom cursor, section reveals, sequential hero animation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     HERO BACKGROUND — Neat gradient removed.
     Background is now CSS: #FAFAFA + two Cold Teal radial blobs + dot grid.
     ================================================================ */

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

  function updateHeader() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 80);
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
  updateHeader();

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
     GSAP + SCROLLTRIGGER
     ================================================================ */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ================================================================
     S01b: HERO — Arrival animation now handled by CSS @keyframes fadeUp.
     No JS-driven .hero-part toggling needed.
     ================================================================ */

  /* ================================================================
     S01c: HERO ASSET — Selection Cycle Controller
     ================================================================ */
  (function initSelectionCycle() {
    const candidates = document.querySelectorAll('.cand-card');
    const selCard = document.querySelector('.sel-card');
    if (!candidates.length || !selCard) return;

    const EVAL_DUR = 2200;
    const REJECT_RECOVER = 2000;

    let lastPicked = -1;
    let cycleCount = 0;

    function pickCandidate() {
      let idx;
      do { idx = Math.floor(Math.random() * candidates.length); }
      while (idx === lastPicked && candidates.length > 1);
      lastPicked = idx;
      return idx;
    }

    function runCycle() {
      cycleCount++;
      const idx = pickCandidate();
      const card = candidates[idx];

      // Phase 1: Evaluate — card rises and brightens
      card.classList.remove('rejected', 'accepted', 'respawning', 'respawn-in');
      card.classList.add('evaluating');

      setTimeout(() => {
        // Phase 2: Resolve — accept every 3rd cycle
        const accepted = cycleCount % 3 === 0;
        card.classList.remove('evaluating');

        if (accepted) {
          card.classList.add('accepted');
          selCard.classList.add('refreshing');
          setTimeout(() => selCard.classList.remove('refreshing'), 1200);
          // Respawn candidate after it fades out
          setTimeout(() => {
            card.classList.remove('accepted');
            card.classList.add('respawning');
            setTimeout(() => {
              card.classList.remove('respawning');
              card.classList.add('respawn-in');
              setTimeout(() => card.classList.remove('respawn-in'), 1500);
            }, 60);
          }, 1300);
        } else {
          card.classList.add('rejected');
          setTimeout(() => card.classList.remove('rejected'), REJECT_RECOVER);
        }
      }, EVAL_DUR);

      // Schedule next — first 3 cycles faster so user sees it quickly
      const delay = cycleCount <= 3
        ? 4000 + Math.random() * 2000   // 4-6s for first 3
        : 8000 + Math.random() * 4000;  // 8-12s steady state
      setTimeout(runCycle, delay);
    }

    // First cycle starts 2.5s after page load
    setTimeout(runCycle, 2500);
  })();

  /* ================================================================
     S01d: HERO ASSET — Scroll-Driven Resolution Choreography
     Layers scroll bias on top of ambient animation.
     4 stages: idle → compress → resolve → settled
     ================================================================ */
  (function initScrollChoreography() {
    const asset = document.querySelector('.hero-asset');
    const stickyWrap = document.querySelector('.nectar-sticky-row-wrap--top');
    const field = document.querySelector('.asset-field');
    const candCards = document.querySelectorAll('.cand-card');
    const selCard = document.querySelector('.sel-card');
    const selGlow = document.querySelector('.sel-glow');
    const frags = document.querySelectorAll('.sel-frag');
    const chips = document.querySelectorAll('.ai-chip');

    if (!asset || !stickyWrap || !selCard) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Full choreography runs on all screen sizes

    // Lerp helper
    function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

    // Stage boundaries — sequence completes by 85%, then holds
    // 0-15%:  idle (ambient only)
    // 15-35%: compress (field recedes, candidates align)
    // 35-55%: resolve (one candidate favored, selected strengthens)
    // 55-75%: chips appear (AI signals reveal)
    // 75-85%: settle (final hold begins)
    // 85-100%: pure hold — resolved state breathes before release
    const S1 = 0.15, S2 = 0.35, S3 = 0.55;

    // Map progress within a stage to 0-1
    function stageT(p, start, end) {
      return Math.max(0, Math.min(1, (p - start) / (end - start)));
    }

    // Pause candidate CSS animations when scroll takes over
    let scrollActive = false;

    ScrollTrigger.create({
      trigger: stickyWrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: function(self) {
        const p = self.progress; // 0 to 1

        // Pause CSS breathe animations once scroll engages
        if (p > 0.05 && !scrollActive) {
          scrollActive = true;
          candCards.forEach(c => c.style.animationPlayState = 'paused');
        } else if (p <= 0.05 && scrollActive) {
          scrollActive = false;
          candCards.forEach(c => { c.style.animationPlayState = ''; c.style.transform = ''; c.style.opacity = ''; c.style.filter = ''; });
          selCard.style.transform = '';
          selCard.style.boxShadow = '';
          selCard.classList.remove('resolved', 'crystallized');
          frags.forEach(f => { f.style.transform = ''; f.style.opacity = ''; });
          if (selGlow) selGlow.style.opacity = '0';
          asset.style.setProperty('--scroll-glow', '0');
          asset.style.setProperty('--scroll-field-opacity', '1');
          asset.style.setProperty('--scroll-field-compress', '1');
          chips.forEach(c => { c.classList.remove('drifting', 'condensing'); });
          if (window.__neatGradient) window.__neatGradient.yOffset = 0;
        }

        if (p <= 0.05) return; // Stage 1: pure ambient, no scroll influence

        // === NEAT GRADIENT — drive yOffset with scroll for evolving atmosphere ===
        if (window.__neatGradient) {
          window.__neatGradient.yOffset = lerp(0, 8000, p);
        }

        // === BACKGROUND FIELD — fade and scatter outward ===
        const fieldFade = lerp(1, 0.15, stageT(p, S1, 0.65));
        const fieldCompress = lerp(1, 0.82, stageT(p, S1, 0.55));
        asset.style.setProperty('--scroll-field-opacity', fieldFade);
        asset.style.setProperty('--scroll-field-compress', fieldCompress);

        // === CANDIDATE LAYER — consider, then reject ===
        // 3 phases per candidate:
        //   align (S1→S2): candidates pull inward
        //   consider (S2→0.42): ALL candidates rise slightly — being evaluated
        //   resolve (0.42→S3): winner keeps rising, losers sink back and fade
        if (candCards.length >= 3) {
          const alignT = stageT(p, S1, S2);
          const considerT = stageT(p, S2, 0.42);
          const resolveT2 = stageT(p, 0.42, S3);

          candCards.forEach((card, i) => {
            const isFavored = (i === 1);

            if (resolveT2 > 0) {
              // RESOLVE: winner rises further, losers rejected
              if (isFavored) {
                const ty = lerp(-10, -26, resolveT2);
                const sc = lerp(1.04, 1.10, resolveT2);
                const op = lerp(0.72, 0.90, resolveT2);
                card.style.opacity = op;
                card.style.transform = `translateX(-50%) translateY(${ty}px) scale(${sc})`;
                card.style.filter = '';
              } else {
                // Losers: sink back, fade, blur slightly
                const ty = lerp(-8, 12, resolveT2);
                const sc = lerp(1.02, 0.90, resolveT2);
                const op = lerp(0.68, 0.18, resolveT2);
                const bl = lerp(0, 2.5, resolveT2);
                card.style.opacity = op;
                card.style.transform = `translateX(-50%) translateY(${ty}px) scale(${sc})`;
                card.style.filter = `blur(${bl.toFixed(1)}px)`;
              }
            } else if (considerT > 0) {
              // CONSIDER: all candidates rise together — being evaluated
              const ty = lerp(0, isFavored ? -10 : -8, considerT);
              const sc = lerp(1, isFavored ? 1.04 : 1.02, considerT);
              const op = lerp(0.58, isFavored ? 0.72 : 0.68, considerT);
              card.style.opacity = op;
              card.style.transform = `translateX(-50%) translateY(${ty}px) scale(${sc})`;
              card.style.filter = '';
            } else if (alignT > 0) {
              const pullX = i === 0 ? 8 : i === 2 ? -8 : 0;
              card.style.transform = `translateX(calc(-50% + ${lerp(0, pullX, alignT)}px))`;
              card.style.opacity = lerp(0.6, 0.58, alignT);
              card.style.filter = '';
            } else {
              card.style.filter = '';
            }
          });
        }

        // === SELECTED LAYER ===
        const resolveT = stageT(p, S1, 0.70);
        const selScale = lerp(1, 1.06, resolveT);
        selCard.style.transform = `translate(-50%, -52%) scale(${selScale})`;

        // Card state progression: resolved at 45%, crystallized at 68%
        if (p > 0.68) {
          if (!selCard.classList.contains('crystallized')) selCard.classList.add('crystallized');
        } else if (p > 0.45) {
          selCard.classList.remove('crystallized');
          if (!selCard.classList.contains('resolved')) selCard.classList.add('resolved');
        } else {
          selCard.classList.remove('resolved', 'crystallized');
        }

        // === GLOW + ATMOSPHERE ===
        const glowT = stageT(p, 0.25, 0.60);
        const crystalGlow = stageT(p, 0.65, 0.78);
        if (selGlow) {
          const gScale = lerp(1, 1.08, glowT) + lerp(0, 0.04, crystalGlow);
          const gOp = lerp(0, 1, glowT) + lerp(0, 0.15, crystalGlow);
          selGlow.style.opacity = Math.min(1, gOp);
          selGlow.style.transform = `translate(-50%, -52%) scale(${gScale})`;
        }
        asset.style.setProperty('--scroll-glow', lerp(0, 1, stageT(p, 0.15, 0.50)));

        // === CONVERGENCE — fragments tighten, then lock in crystallized state ===
        const convT = stageT(p, 0.30, 0.55);
        const lockT = stageT(p, 0.65, 0.75);
        frags.forEach((frag, i) => {
          const tx = lerp(0, (i === 0 ? -8 : 8), convT) + lerp(0, (i === 0 ? -3 : 3), lockT);
          const ty = lerp(0, (i === 0 ? 6 : -6), convT) + lerp(0, (i === 0 ? 2 : -2), lockT);
          const op = lerp(0.55, 0.78, convT) + lerp(0, 0.12, lockT);
          frag.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
          frag.style.opacity = Math.min(0.92, op);
        });

        // === SIGNAL CONDENSATION — the key cinematic beat ===
        // Each chip has 3 phases:
        //   drift start → mote appears, begins drifting inward
        //   condense start → mote dissolves, label materializes at final position
        // Staggered across 5 chips for sequential reveal
        if (chips.length) {
          const schedule = [
            { drift: 0.30, condense: 0.44 },  // Business Category (upper-left)
            { drift: 0.33, condense: 0.48 },  // Trust Signals (upper-right)
            { drift: 0.38, condense: 0.54 },  // Services (mid-right)
            { drift: 0.42, condense: 0.60 },  // Location (lower-left)
          ];

          chips.forEach((chip, i) => {
            if (i >= schedule.length) return;
            const s = schedule[i];

            if (p >= s.condense) {
              chip.classList.remove('drifting');
              chip.classList.add('condensing');
            } else if (p >= s.drift) {
              chip.classList.add('drifting');
              chip.classList.remove('condensing');
            } else {
              chip.classList.remove('drifting', 'condensing');
            }
          });
        }
      }
    });
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
     S04: STICKY MEDIA SECTIONS
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
          if (lenis) lenis.scrollTo(mediaPanels[idx], { offset: -100 });
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
