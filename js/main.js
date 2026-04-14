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
     S01c: BROWSER CARD — Scroll-Triggered Transformation
     5 stages across 300vh of pinned scroll distance.
     Each stage reveals one layer of AI-readiness.
     ================================================================ */
  (function initBrowserCardTransform() {
    const heroPin = document.getElementById('heroPin');
    const browserCard = document.getElementById('browserCard');
    if (!heroPin || !browserCard) return;

    const isMobile = window.innerWidth <= 768;

    // Grab elements
    const heroImg = browserCard.querySelector('.bc-hero-img');
    const siteNav = browserCard.querySelector('.bc-site-nav');
    const category = browserCard.querySelector('.bc-category');
    const pulse = browserCard.querySelector('.bc-pulse');
    const title = browserCard.querySelector('.bc-title');
    const desc = browserCard.querySelector('.bc-desc');
    const meta = browserCard.querySelector('.bc-meta');
    const ctaRow = browserCard.querySelector('.bc-cta-row');
    const rating = browserCard.querySelector('.bc-rating');
    const recommended = document.getElementById('bcRecommended');
    const annotations = browserCard.closest('.hero-transform').querySelectorAll('.bc-annotation');

    let currentStage = -1;

    function setStage(stage) {
      if (stage === currentStage) return;
      currentStage = stage;

      // Stage 1: Image gains color
      if (stage >= 1) {
        heroImg.classList.add('s1');
      } else {
        heroImg.classList.remove('s1');
      }

      // Stage 2: Nav restructures
      if (stage >= 2) {
        siteNav.classList.add('s2');
      } else {
        siteNav.classList.remove('s2');
      }

      // Stage 3: Category + title + description
      if (stage >= 3) {
        category.classList.add('s3');
        pulse.classList.add('active');
        title.classList.add('s3');
        desc.classList.add('s3');
      } else {
        category.classList.remove('s3');
        pulse.classList.remove('active');
        title.classList.remove('s3');
        desc.classList.remove('s3');
      }

      // Stage 4: Meta grid + CTA
      if (stage >= 4) {
        meta.classList.add('s4');
        ctaRow.classList.add('s4');
      } else {
        meta.classList.remove('s4');
        ctaRow.classList.remove('s4');
      }

      // Stage 5: Rating + recommended + final shadow
      if (stage >= 5) {
        rating.classList.add('s5');
        browserCard.classList.add('stage-5');
        recommended.classList.add('visible');
      } else {
        rating.classList.remove('s5');
        browserCard.classList.remove('stage-5');
        recommended.classList.remove('visible');
      }

      // Annotations: show via inline styles to override CSS !important
      annotations.forEach(ann => {
        const annStage = parseInt(ann.getAttribute('data-stage'));
        if (annStage <= stage) {
          ann.style.opacity = '1';
          ann.style.visibility = 'visible';
          ann.style.transform = 'translateY(0)';
        }
        // Once visible, never hide again
      });
    }

    ScrollTrigger.create({
      trigger: heroPin,
      start: 'top top',
      end: isMobile ? '+=200%' : '+=300%',
      pin: true,
      scrub: 0.5,
      onUpdate: function(self) {
        const p = self.progress; // 0 to 1 across 300vh

        if (p < 0.04) {
          setStage(0);
        } else if (p < 0.20) {
          setStage(1);
        } else if (p < 0.40) {
          setStage(2);
        } else if (p < 0.60) {
          setStage(3);
        } else if (p < 0.80) {
          setStage(4);
        } else {
          setStage(5);
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
