/* PureNetX — Animation Layer
   Subtle fade-up on scroll + nav scroll effect.
   Respects prefers-reduced-motion. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── NAV SCROLL EFFECT ──────────────────────────────────── */
  var nav = document.querySelector('nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 24) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── EARLY EXIT if reduced motion ───────────────────────── */
  if (reduced) return;

  /* ── HELPERS ─────────────────────────────────────────────── */
  function setHidden(el, delay) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition =
      'opacity 0.35s ease-out ' + (delay || 0) + 'ms, ' +
      'transform 0.35s ease-out ' + (delay || 0) + 'ms';
  }

  function reveal(el) {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }

  /* ── INTERSECTION OBSERVER ───────────────────────────────── */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  /* ── SECTION-LEVEL LABELS, HEADINGS, PARAGRAPHS ─────────── */
  var sectionTargets = document.querySelectorAll(
    '.section > .container > .label,' +
    '.section > .container > h2,' +
    '.section-sm > .container > .label,' +
    '.banner,' +
    '.compare-wrap,' +
    '.arch-flow,' +
    '.code-block,' +
    '.doc-section,' +
    '.toc'
  );
  sectionTargets.forEach(function (el) {
    setHidden(el, 0);
    io.observe(el);
  });

  /* ── CARDS — staggered inside grids ─────────────────────── */
  var gridParents = document.querySelectorAll(
    '.grid-2, .grid-3, .grid-4, .grid-auto'
  );
  gridParents.forEach(function (parent) {
    var cards = parent.querySelectorAll(':scope > .card');
    cards.forEach(function (card, i) {
      setHidden(card, i * 75);
      io.observe(card);
    });
  });

  /* ── CARDS not in grid (standalone) ─────────────────────── */
  var standaloneCards = document.querySelectorAll(
    '.card:not(.grid-2 > .card):not(.grid-3 > .card):not(.grid-4 > .card):not(.grid-auto > .card)'
  );
  standaloneCards.forEach(function (el) {
    setHidden(el, 0);
    io.observe(el);
  });

  /* ── TIMELINE ITEMS — staggered ─────────────────────────── */
  var tlItems = document.querySelectorAll('.timeline-item');
  tlItems.forEach(function (el, i) {
    setHidden(el, i * 100);
    io.observe(el);
  });

  /* ── STATUS-LIST ITEMS — staggered ──────────────────────── */
  var statusLists = document.querySelectorAll('.status-list');
  statusLists.forEach(function (list) {
    var items = list.querySelectorAll('.status-item');
    items.forEach(function (item, i) {
      setHidden(item, i * 60);
      io.observe(item);
    });
  });

  /* ── HERO — animate on page-load (not on scroll) ────────── */
  var heroSeq = document.querySelectorAll(
    '.hero-notice, .hero h1, .hero .sub, .hero-btns, .hero-stage, .hero .banner'
  );
  heroSeq.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition =
      'opacity 0.55s ease-out ' + (80 + i * 110) + 'ms, ' +
      'transform 0.55s ease-out ' + (80 + i * 110) + 'ms';
  });
  // Double-rAF ensures transition fires after paint
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroSeq.forEach(function (el) { reveal(el); });
    });
  });

  /* ── PAGE-HEADER (inner pages) — animate on load ─────────── */
  var phSeq = document.querySelectorAll(
    '.page-header .label, .page-header h1, .page-header p, .page-header .badge'
  );
  phSeq.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition =
      'opacity 0.45s ease-out ' + (60 + i * 90) + 'ms, ' +
      'transform 0.45s ease-out ' + (60 + i * 90) + 'ms';
  });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      phSeq.forEach(function (el) { reveal(el); });
    });
  });

  /* ── FOOTER LINKS — stagger on scroll ───────────────────── */
  var ftLinks = document.querySelectorAll('.footer-links a');
  ftLinks.forEach(function (el, i) {
    setHidden(el, i * 50);
    io.observe(el);
  });

})();
