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

  // Headline figures are static text: trust numbers must never animate through wrong values.

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

// Contact form: client validation, POST /api/contact, mailto fallback if the endpoint is not configured
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var btn = form.querySelector('button[type="submit"]');
  var L = {
    required: form.getAttribute('data-required') || 'Required',
    sending: form.getAttribute('data-sending') || 'Sending…',
    ok: form.getAttribute('data-ok') || 'Sent.',
    err: form.getAttribute('data-error') || 'Could not send.'
  };
  var email = form.getAttribute('data-email') || '';

  var setStatus = function (msg, cls) {
    status.textContent = msg;
    status.className = 'form-status' + (cls ? ' ' + cls : '');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var bad = [];
    form.querySelectorAll('[required]').forEach(function (el) {
      var wrap = el.closest('.field');
      var ok = String(el.value || '').trim().length > 0;
      if (el.type === 'email' && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value);
      if (wrap) wrap.classList.toggle('invalid', !ok);
      if (!ok) bad.push(el);
    });
    if (bad.length) { bad[0].focus(); setStatus(L.required, 'err'); return; }

    var payload = {};
    data.forEach(function (v, k) { payload[k] = v; });
    payload.page = location.href;
    payload.lang = document.documentElement.lang;

    btn.disabled = true;
    setStatus(L.sending, '');
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (res) {
        if (res && res.ok) {
          form.reset();
          setStatus(L.ok, 'ok');
          return;
        }
        if (res && res.mailto) {
          setStatus(L.ok, 'ok');
          location.href = res.mailto;
          return;
        }
        throw new Error('not ok');
      })
      .catch(function () {
        var body = 'Name: ' + (payload.lastName || '') + ' ' + (payload.firstName || '') +
          '\nCompany: ' + (payload.company || '') + '\nRole: ' + (payload.role || '') +
          '\nWebsite: ' + (payload.website || '') + '\nCountry: ' + (payload.country || '') +
          '\n\n' + (payload.message || '');
        setStatus(L.err, 'err');
        if (email) location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Website enquiry') +
          '&body=' + encodeURIComponent(body);
      })
      .finally(function () { btn.disabled = false; });
  });
});
