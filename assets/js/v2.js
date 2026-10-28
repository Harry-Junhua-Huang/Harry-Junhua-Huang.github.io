/* v2.js: lazy in-view video loops, theme toggle, mobile nav and metric definitions
   for the v2 layout. No dependencies; loaded with defer. */
(function () {
  'use strict';

  var root = document.documentElement;
  function each(sel, fn, ctx) { Array.prototype.forEach.call((ctx || document).querySelectorAll(sel), fn); }
  function mq(q) { return window.matchMedia ? window.matchMedia(q) : { matches: false }; }
  function onChange(m, fn) {
    if (m.addEventListener) m.addEventListener('change', fn);
    else if (m.addListener) m.addListener(fn);
  }

  /* ---- theme: light/dark toggle, stored as localStorage 'theme' ---- */
  var darkMq = mq('(prefers-color-scheme: dark)');
  function theme() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return darkMq.matches ? 'dark' : 'light';
  }
  function syncTheme() {
    var dark = theme() === 'dark';
    each('[data-theme-toggle]', function (b) {
      b.setAttribute('aria-pressed', dark ? 'true' : 'false');
      b.setAttribute('aria-label', 'Dark theme');
      b.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    });
  }
  each('[data-theme-toggle]', function (b) {
    b.addEventListener('click', function () {
      var next = theme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: theme lasts this visit */ }
      syncTheme();
    });
  });
  onChange(darkMq, syncTheme);
  syncTheme();

  /* ---- mobile nav ---- */
  var navBtn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function setNav(open) {
    if (!navBtn) return;
    navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    navBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    root.classList.toggle('nav-open', open);
  }
  if (navBtn && nav) {
    navBtn.addEventListener('click', function () { setNav(navBtn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) setNav(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 640) setNav(false); });
  }

  /* ---- metric chips: definition on hover (CSS) or tap/click (here) ---- */
  function closeStats(except) {
    each('.stat', function (s) {
      if (s === except) return;
      s.classList.remove('is-open');
      var b = s.querySelector('button.stat__btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  each('button.stat__btn', function (b) {
    b.addEventListener('click', function () {
      var stat = b.parentNode;
      var open = !stat.classList.contains('is-open');
      closeStats(stat);
      stat.classList.toggle('is-open', open);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (!(e.target.closest && e.target.closest('.stat'))) closeStats(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeStats(null); setNav(false); }
  });

  /* ---- lazy looping clips ----
     <video class="js-loop" preload="none" data-poster="..."><source data-src="..."></video>
     Posters are set when a clip comes within ~800 px (the hero has a real poster attribute).
     Video bytes are fetched only after the page has loaded and the clip is near the viewport;
     clips play while >= 25% visible and pause off-screen or in a hidden tab. With
     prefers-reduced-motion or Save-Data nothing autoplays and the Play button starts a clip.
     A <source data-media="(max-width: 760px)"> is used only when its query matches, so the
     stacked cut is served on phones and the wide one elsewhere. */
  var vids = Array.prototype.slice.call(document.querySelectorAll('video.js-loop'));
  if (!vids.length) return;
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  function still() { return reduce.matches || saveData; }
  var visible = [];

  function setPoster(v) {
    var p = v.getAttribute('data-poster');
    if (!p) return;
    var pn = v.getAttribute('data-poster-narrow');
    if (pn && mq('(max-width: 760px)').matches) p = pn;
    v.poster = p;
    v.removeAttribute('data-poster');
  }

  function attach(v) {
    if (v.getAttribute('data-ready')) return;
    each('source[data-src]', function (s) {
      var q = s.getAttribute('data-media');
      if (q && !mq(q).matches) { s.parentNode.removeChild(s); return; }
      s.src = s.getAttribute('data-src');
      s.removeAttribute('data-src');
    }, v);
    v.setAttribute('data-ready', '1');
    v.load();
  }
  function play(v) {
    attach(v);
    v.muted = true;
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* autoplay refused: poster stays, Play button works */ });
  }

  vids.forEach(function (v) {
    var btn = v.parentNode.querySelector('.media__toggle');
    if (!btn) return;
    var name = v.getAttribute('aria-label') || 'video';
    function sync() {
      var on = !v.paused;
      btn.setAttribute('data-state', on ? 'playing' : 'paused');
      btn.setAttribute('aria-label', (on ? 'Pause: ' : 'Play: ') + name);
    }
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    btn.addEventListener('click', function () {
      if (v.paused) { v.setAttribute('data-user', 'play'); setPoster(v); play(v); }
      else { v.setAttribute('data-user', 'pause'); v.pause(); }
    });
    btn.hidden = false;
    sync();
  });

  if (!('IntersectionObserver' in window)) {
    vids.forEach(setPoster);
    if (!still()) vids.forEach(play);
    return;
  }

  var pio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { setPoster(e.target); pio.unobserve(e.target); }
    });
  }, { rootMargin: '800px 0px' });
  vids.forEach(function (v) { if (v.getAttribute('data-poster')) pio.observe(v); });

  var near = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !still()) { attach(e.target); near.unobserve(e.target); }
    });
  }, { rootMargin: '100px 0px' });

  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      var i = visible.indexOf(v);
      if (e.isIntersecting) {
        if (i < 0) visible.push(v);
        if (!still() && v.getAttribute('data-user') !== 'pause' && !document.hidden) play(v);
      } else {
        if (i >= 0) visible.splice(i, 1);
        if (!v.paused) v.pause();
      }
    });
  }, { threshold: 0.25 });

  /* start after the load event so video bytes do not compete with fonts, CSS and posters */
  function go() { vids.forEach(function (v) { near.observe(v); seen.observe(v); }); }
  if (document.readyState === 'complete') go();
  else window.addEventListener('load', go);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { vids.forEach(function (v) { if (!v.paused) v.pause(); }); return; }
    visible.forEach(function (v) {
      if (!still() && v.getAttribute('data-user') !== 'pause') play(v);
    });
  });
})();
