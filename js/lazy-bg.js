/* Lazy loading de background-image via IntersectionObserver.
   Elementos com [data-bg] carregam a imagem só quando entram na viewport
   (com margem de 200px de antecedência). Usado porque loading="lazy"
   nativo não se aplica a background-image em CSS. */
(function () {
  if (!('IntersectionObserver' in window)) {
    // Fallback: navegadores sem suporte carregam tudo de imediato
    document.querySelectorAll('[data-bg]').forEach(function (el) {
      el.style.backgroundImage = "url('" + el.dataset.bg + "')";
      el.removeAttribute('data-bg');
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.backgroundImage = "url('" + el.dataset.bg + "')";
        el.removeAttribute('data-bg');
        el.classList.remove('lazy-bg');
        el.classList.add('lazy-bg-loaded');
        observer.unobserve(el);
      });
    },
    { rootMargin: '200px 0px', threshold: 0.01 }
  );

  document.querySelectorAll('[data-bg]').forEach(function (el) {
    io.observe(el);
  });
}());
