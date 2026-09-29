(() => {
  const d = document;
  const r = d.documentElement;
  const $ = (s) => d.querySelector(s);

  // stand-in icons, swap for real KiCad SVGs whenever
  const ICO =
    '<svg class="i-sch" viewBox="0 0 48 48">' +
    '<rect x="4" y="4" width="40" height="40" rx="5" fill="#f5f4ef" stroke="#840000" stroke-width="2.5"/>' +
    '<path d="M8 24h9M31 24h9M12 12h10v6" fill="none" stroke="#008400" stroke-width="2.5" stroke-linecap="round"/>' +
    '<rect x="17" y="17" width="14" height="14" fill="#ffffc2" stroke="#840000" stroke-width="2.5"/>' +
    '<circle cx="12" cy="12" r="2.4" fill="#008400"/>' +
    '</svg>' +
    '<svg class="i-pcb" viewBox="0 0 48 48">' +
    '<rect x="4" y="4" width="40" height="40" rx="5" fill="#001023" stroke="#d0d2cd" stroke-width="2.5"/>' +
    '<path d="M10 15h11l8 8h9" fill="none" stroke="#c83434" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M10 34h10l6-6h12" fill="none" stroke="#4d7fc4" stroke-width="3" stroke-linecap="round"/>' +
    '<g fill="#f2eda1">' +
    '<circle cx="10" cy="15" r="3.4"/>' +
    '<circle cx="38" cy="23" r="3.4"/>' +
    '<circle cx="10" cy="34" r="3.4"/>' +
    '<circle cx="38" cy="28" r="3.4"/>' +
    '</g>' +
    '<g fill="#001023">' +
    '<circle cx="10" cy="15" r="1.3"/>' +
    '<circle cx="10" cy="34" r="1.3"/>' +
    '</g>' +
    '</svg>';

  d.body.insertAdjacentHTML(
    'afterbegin',
    '<div id="grid"></div>' +
      '<div id="xh"><i></i><i></i></div>' +
      '<button id="tg" aria-label="Toggle PCB / schematic mode" title="Toggle PCB / schematic editor">' +
      ICO +
      '</button>' +
      '<div id="sb"><span id="xy"></span><span id="gr"></span><span id="ly"></span><b>cubit010.dev</b></div>'
  );

  const g = $('#grid');
  const tg = $('#tg');
  const h = $('.hero');
  const xh = $('#xh').children;
  let mx = innerWidth / 2;
  let my = innerHeight / 2;

  const dark = () => r.dataset.theme != 'light';

  function upd() {
    const mm = (v) => v * 0.2646 / 1.27;
    const f = (v) => dark() ? (Math.round(mm(v)) * 1.27).toFixed(2) : Math.round(mm(v)) * 50;

    $('#xy').textContent = 'X ' + f(mx) + '  Y ' + f(my + scrollY) + (dark() ? ' mm' : ' mil');
  }

  function lab() {
    $('#gr').textContent = dark() ? 'grid 1.27 mm' : 'grid 50 mil';
    $('#ly').textContent = dark() ? 'F.Cu' : 'Sheet 1/1';

    const m = $('meta[name=theme-color]');
    if (m) {
      m.setAttribute('content', dark() ? '#001023' : '#f5f4ef');
    }

    upd();
  }

  function sc() {
    const y = scrollY;
    g.style.backgroundPosition = '0 ' + -y + 'px'; // grid scrolls with the page

    if (h) {
      const p = Math.min(1, y / (innerHeight * 0.6));
      h.style.opacity = 1 - p;
      h.style.transform = 'translateY(' + -y * 0.25 + 'px) scale(' + (1 - p * 0.06) + ')';
      h.style.visibility = p >= 1 ? 'hidden' : 'visible';
    }

    upd();
  }

  addEventListener('scroll', () => requestAnimationFrame(sc), { passive: true });

  addEventListener(
    'mousemove',
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      xh[0].style.transform = 'translateX(' + mx + 'px)';
      xh[1].style.transform = 'translateY(' + my + 'px)';
      upd();
    },
    { passive: true }
  );

  tg.onclick = () => {
    const t = dark() ? 'light' : 'dark';
    r.dataset.theme = t;

    try {
      localStorage.t = t;
    } catch (e) {}

    lab();
    tg.classList.remove('p');
    void tg.offsetWidth;
    tg.classList.add('p');
    navigator.vibrate && navigator.vibrate(12);
  };

  d.querySelectorAll('.row').forEach((p) =>
    [...p.children].forEach((e, i) => e.style.setProperty('--d', i * 0.09 + 's'))
  );

  const io = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.2 }
  );

  d.querySelectorAll('.rv').forEach((e) => io.observe(e));

  sc();
  lab();
})();

