/* La Boutique de las Uñas · maqueta v2
   Todo funciona sin JavaScript. Con JavaScript y sin «reducir movimiento»
   se añade la capa de movimiento (GSAP + ScrollTrigger desde cdnjs). */
(function () {
  'use strict';
  var d = document, root = d.documentElement;

  /* ---------- Cabecera y menú ---------- */
  var header = d.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var nav = d.getElementById('nav'), toggle = d.getElementById('navToggle');
  function setNav(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  toggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  /* ---------- Medición: cada clic en una llamada a la acción va a dataLayer (GA4 / GTM) ---------- */
  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cta]'); if (!a) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'cta_click', cta: a.getAttribute('data-cta'), destino: a.getAttribute('href') });
  });

  /* ---------- Mapa: se carga solo al pulsar (rendimiento y cookies de terceros) ---------- */
  var mapBtn = d.getElementById('mapBtn'), mapBox = d.getElementById('mapBox');
  if (mapBtn && mapBox) mapBtn.addEventListener('click', function () {
    var f = d.createElement('iframe'); f.className = 'map'; f.src = mapBox.getAttribute('data-src');
    f.title = 'Mapa de La Boutique de las Uñas en Arroyomolinos'; f.referrerPolicy = 'no-referrer-when-downgrade';
    mapBox.replaceWith(f);
  });

  /* ---------- Opiniones: flechas y «Leer más» ---------- */
  var track = d.getElementById('revTrack');
  function step() { var c = track.querySelector('.review'); return c ? c.getBoundingClientRect().width + 18 : 320; }
  d.getElementById('opPrev').addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  d.getElementById('opNext').addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  function addMore() {
    track.querySelectorAll('.review').forEach(function (r) {
      var q = r.querySelector('blockquote'), had = r.querySelector('.more');
      if (had || r.classList.contains('open')) return;
      if (q.scrollHeight > q.clientHeight + 2) {
        var b = d.createElement('button'); b.type = 'button'; b.className = 'more'; b.textContent = 'Leer más';
        b.addEventListener('click', function () { r.classList.add('open'); b.remove(); });
        r.insertBefore(b, r.querySelector('figcaption'));
      }
    });
  }
  (d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve()).then(addMore);

  /* ---------- Movimiento ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Ventana altísima = captura de página entera, impresión o rastreador (Google renderiza así):
     no hay scroll que dispare nada, así que se muestra todo ya, sin capa de movimiento. */
  function tall() { return window.innerHeight > 2200; }
  function eagerImages() { d.querySelectorAll('img[loading="lazy"]').forEach(function (i) { i.loading = 'eager'; }); }
  if (tall()) eagerImages();
  if (reduce || tall() || !window.gsap || !window.ScrollTrigger) return;
  root.classList.add('motion');
  gsap.registerPlugin(ScrollTrigger);

  /* Portada: las líneas del titular suben y la píldora se abre */
  /* (la entrada de la portada va en CSS: ver styles.css) */

  /* Aparición general (una vez) */
  var reveals = gsap.utils.toArray('[data-reveal]').filter(function (el) { return !el.closest('.hero'); });
  gsap.set(reveals, { opacity: 0, y: 28 });
  ScrollTrigger.batch(reveals, {
    start: 'top 90%', once: true,
    onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, overwrite: true }); }
  });

  /* Paralaje de las fotos dentro de su marco */
  gsap.utils.toArray('[data-parallax]').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Texto que se enciende palabra a palabra con el scroll */
  function splitWords(el) {
    var walker = d.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var frag = d.createDocumentFragment();
      n.nodeValue.split(/(\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(p)); return; }
        var s = d.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s);
      });
      n.parentNode.replaceChild(frag, n);
    });
    return el.querySelectorAll('.w');
  }
  gsap.utils.toArray('[data-lit]').forEach(function (el) {
    var words = splitWords(el);
    gsap.to(words, { opacity: 1, ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: true } });
  });

  /* Filas «de → a»: se tacha lo viejo y entra lo nuevo */
  gsap.utils.toArray('.row').forEach(function (row) {
    var old = row.querySelector('.old span'), nw = row.querySelector('.new');
    gsap.set(old, { backgroundSize: '0% 2px', opacity: 1 });
    gsap.set(nw, { opacity: 0, x: 30 });
    gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 74%', once: true } })
      .to(old, { backgroundSize: '100% 2px', duration: 0.6, ease: 'power1.inOut' })
      .to(old, { opacity: 0.5, duration: 0.4 }, '>-0.1')
      .to(nw, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '<0.1');
  });

  /* Cifras que cuentan, con coma decimal */
  gsap.utils.toArray('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-dec') || '0', 10),
        pre = el.getAttribute('data-pre') || '', o = { v: 0 };
    function fmt(v) { return pre + (dec ? v.toFixed(dec).replace('.', ',') : Math.round(v)); }
    el.setAttribute('data-final', el.textContent);
    el.textContent = fmt(0);
    gsap.to(o, { v: end, duration: 1.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: function () { el.textContent = fmt(o.v); } });
  });

  /* Cinta que acelera con la velocidad del scroll */
  var mt = d.querySelector('.marquee-track');
  if (mt) {
    mt.style.animation = 'none';
    var mq = gsap.to(mt, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 }), timer;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (self) {
      mq.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 600, 5));
      clearTimeout(timer); timer = setTimeout(function () { gsap.to(mq, { timeScale: 1, duration: 1.4 }); }, 90);
    } });
  }

  /* Sello de Google: gira con el scroll de toda la página */
  gsap.to('.seal-ring', { rotation: 720, transformOrigin: '50% 50%', ease: 'none',
    scrollTrigger: { trigger: d.body, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });

  /* Botones imantados (solo con ratón) */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    gsap.utils.toArray('.magnet').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1,0.35)' }),
          yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1,0.35)' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3); yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
      });
      el.addEventListener('mouseleave', function () { xTo(0); yTo(0); gsap.to(el, { scale: 1, duration: 0.2 }); });
      el.addEventListener('pointerdown', function () { gsap.to(el, { scale: 0.97, duration: 0.12 }); });
      el.addEventListener('pointerup', function () { gsap.to(el, { scale: 1, duration: 0.25, ease: 'power3.out' }); });
    });
  }

  /* Pie que se descubre al llegar al final (solo escritorio) */
  var footer = d.getElementById('pie'), main = d.getElementById('contenido');
  function layoutFooter() {
    var on = window.innerWidth > 1000 && footer.offsetHeight < window.innerHeight * 0.92;
    root.classList.toggle('reveal-footer', on);
    main.style.marginBottom = on ? footer.offsetHeight + 'px' : '';
  }
  layoutFooter();
  gsap.fromTo('.foot-in', { y: -70 }, { y: 0, ease: 'none',
    scrollTrigger: { trigger: main, start: 'bottom bottom', end: function () { return '+=' + footer.offsetHeight; }, scrub: true } });
  /* Salida de emergencia: si la ventana se vuelve altísima (captura de página entera) o se imprime, se enseña todo */
  var shown = false;
  function revealAll() {
    if (shown) return; shown = true;
    ScrollTrigger.getAll().forEach(function (s) { s.kill(); });
    root.classList.remove('motion');
    gsap.set('[data-reveal],.row .new,.row .old span,.w,.foot-in', { clearProps: 'all' });
    d.querySelectorAll('[data-count]').forEach(function (el) { gsap.killTweensOf(el); if (el.getAttribute('data-final')) el.textContent = el.getAttribute('data-final'); });
    d.querySelectorAll('.row .old span').forEach(function (s) { s.style.backgroundSize = '100% 2px'; s.style.opacity = '.5'; });
    eagerImages();
  }
  window.addEventListener('beforeprint', revealAll);
  var rt; window.addEventListener('resize', function () {
    if (tall()) { revealAll(); return; }
    clearTimeout(rt); rt = setTimeout(function () { layoutFooter(); ScrollTrigger.refresh(); }, 150);
  });

  (d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve()).then(function () { addMore(); layoutFooter(); ScrollTrigger.refresh(); });
  window.addEventListener('load', function () { layoutFooter(); ScrollTrigger.refresh(); });
})();
