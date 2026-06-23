(function () {
  const hdr      = document.getElementById('hdr');
  const navLinks = document.querySelectorAll('#nav a');
  const sections = ['home','eventos','espaco','galeria','orcamento','contato'];

  // ── Scroll: header + active nav ──────────────────────────────
  function onScroll () {
    // Header state
    if (window.scrollY > 56) {
      hdr.classList.add('scrolled');
    } else {
      hdr.classList.remove('scrolled');
    }

    // Active section detection
    let current = 'home';
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && window.scrollY >= el.offsetTop - 110) {
        current = sections[i];
        break;
      }
    }
    navLinks.forEach(a => {
      a.classList.toggle('active', a.dataset.sec === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Field focus/blur ─────────────────────────────────────────
  document.querySelectorAll('.field').forEach(function (f) {
    f.addEventListener('focus', function () { this.style.borderColor = '#C06830'; });
    f.addEventListener('blur',  function () { this.style.borderColor = '#201A14'; });
  });

})();
