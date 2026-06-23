(function() {
  /* ── FILTRO ── */
  var btns  = document.querySelectorAll('.filter-btn');
  var gItems = document.querySelectorAll('.g-item');
  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var f = this.dataset.filter;
      btns.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      gItems.forEach(function(item) {
        item.style.display = (f === 'all' || item.dataset.cat === f) ? '' : 'none';
      });
    });
  });

  /* ── LIGHTBOX ── */
  var lb         = document.getElementById('lb');
  var lbImg      = document.getElementById('lb-img');
  var lbCaption  = document.getElementById('lb-caption');
  var lbClose    = document.getElementById('lb-close');
  var lbPrev     = document.getElementById('lb-prev');
  var lbNext     = document.getElementById('lb-next');
  var visItems   = [];
  var current    = 0;

  function getVisible() {
    return Array.from(gItems).filter(function(item) {
      var inner = item.querySelector('.g-item-inner');
      return inner && inner.style.backgroundImage && item.style.display !== 'none';
    });
  }

  function show(idx) {
    var item  = visItems[idx];
    var inner = item.querySelector('.g-item-inner');
    var lbl   = item.querySelector('.g-item-lbl');
    lbImg.style.backgroundImage = inner.style.backgroundImage;
    lbCaption.textContent = lbl ? lbl.textContent : '';
    lbPrev.style.visibility = visItems.length > 1 ? 'visible' : 'hidden';
    lbNext.style.visibility = visItems.length > 1 ? 'visible' : 'hidden';
  }

  function open(idx) {
    visItems = getVisible();
    current  = idx;
    show(current);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prev() { current = (current - 1 + visItems.length) % visItems.length; show(current); }
  function next() { current = (current + 1) % visItems.length; show(current); }

  /* clique em cada card */
  gItems.forEach(function(item) {
    var inner = item.querySelector('.g-item-inner');
    if (inner && inner.style.backgroundImage) {
      item.style.cursor = 'zoom-in';
      item.addEventListener('click', function() {
        var vis = getVisible();
        var i   = vis.indexOf(item);
        if (i >= 0) open(i);
      });
    }
  });

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', function(e) { if (e.target === lb) close(); });
  lbPrev.addEventListener('click', function(e) { e.stopPropagation(); prev(); });
  lbNext.addEventListener('click', function(e) { e.stopPropagation(); next(); });

  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
}());
