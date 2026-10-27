document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    var setOpen = function (open) {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', function () { setOpen(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  }

  // Language switcher: remember the choice, close on outside click / Escape
  var lang = document.querySelector('details.lang');
  if (lang) {
    document.addEventListener('click', function (e) {
      if (!lang.contains(e.target)) lang.removeAttribute('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lang.hasAttribute('open')) {
        lang.removeAttribute('open');
        var s = lang.querySelector('summary');
        if (s) s.focus();
      }
    });
    lang.querySelectorAll('a[data-lang]').forEach(function (a) {
      a.addEventListener('click', function () {
        try { localStorage.setItem('brisa-lang', a.getAttribute('data-lang')); } catch (e) {}
      });
    });
  }
});

// Motion layer: scroll reveal, cursor spotlight, count-up figures, header depth. Skipped for reduced motion.
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('header');
  var onScroll = function () { if (header) header.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  // Reveal blocks as they enter the viewport, staggered inside each container
  var sel = 'main section:not(.hero) .section-title, main section:not(.hero) .section-sub, main section:not(.hero) h2:not(.sr), .eyebrow.center, .feature, .case, .tech-item, .steps li, .checklist li, .why-row, .details-table, .cta-box, .pull-quote, .founder-card, .letter p, .profile, .numbers-note, .faq, .pipeline';
  var seen = new Set();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll(sel).forEach(function (el) {
    if (seen.has(el)) return;
    seen.add(el);
    var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty('--d', String(Math.min(idx, 6)));
    el.classList.add('reveal');
    io.observe(el);
  });

  // Cursor spotlight on cards
  var spots = document.querySelectorAll('.feature, .case, .tech-item, .steps li, .checklist li, .why-row');
  spots.forEach(function (el) {
    el.classList.add('spot');
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    el.addEventListener('pointerleave', function () {
      el.style.removeProperty('--mx'); el.style.removeProperty('--my');
    });
  });

  // Count-up for the headline figures (final text is unchanged, so no-JS and screen readers see real values)
  var figs = document.querySelectorAll('.numbers b');
  var co = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      var el = e.target, finalText = el.textContent, parts = finalText.match(/\d+/g);
      if (!parts) return;
      var t0 = null, dur = 1100;
      el.setAttribute('aria-label', finalText);
      var step = function (t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1), k = 1 - Math.pow(1 - p, 3), i = 0;
        el.textContent = finalText.replace(/\d+/g, function (m) { return String(Math.round(parseInt(parts[i++], 10) * k)); });
        if (p < 1) requestAnimationFrame(step); else el.textContent = finalText;
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  figs.forEach(function (f) { co.observe(f); });

  // Portfolio category filter (progressive enhancement: all cards visible without JS)
  var pf = document.getElementById('portfolioFilter');
  if (pf) {
    var cards = document.querySelectorAll('.pgrid .pcard');
    pf.addEventListener('click', function (e) {
      var b = e.target.closest('.pfilter');
      if (!b) return;
      pf.querySelectorAll('.pfilter').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-filter');
      cards.forEach(function (c) {
        c.style.display = (f === 'all' || c.getAttribute('data-cat') === f) ? '' : 'none';
      });
    });
  }
});

// Case-study carousel: arrow buttons scroll the snap track by one card
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.cases-nav').forEach(function (nav) {
    var track = nav.querySelector('.cases-track');
    if (!track) return;
    nav.querySelectorAll('.cases-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = track.querySelector('.ccard');
        var step = card ? card.getBoundingClientRect().width + 18 : 360;
        track.scrollBy({ left: step * Number(btn.getAttribute('data-dir') || 1), behavior: 'smooth' });
      });
    });
  });
});
