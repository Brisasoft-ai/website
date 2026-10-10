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
