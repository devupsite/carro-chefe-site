/* ═══════════════════════════════════════════════════════════
   FORM HANDLER
   Formspree ID: substituir FORMSPREE_ID pelo ID real
   https://formspree.io — gratuito até 50 submissões/mês
════════════════════════════════════════════════════════════ */
(function() {

  var FORMSPREE_ID = 'YOUR_FORMSPREE_ID';
  var WA_NUMBER    = '5511962979609';

  function getFields(form) {
    var data = {};
    form.querySelectorAll('.f-field, .f-area, .field-inline').forEach(function(el) {
      var lbl = el.previousElementSibling;
      if (lbl && lbl.classList.contains('f-lbl')) {
        var key = lbl.textContent.trim().replace(/\s+/g,'_').toLowerCase();
        data[key] = el.value.trim();
      }
    });
    return data;
  }

  function buildWAMessage(data, pageTitle) {
    var parts = ['Olá! Tenho interesse em realizar um evento no Carro Chefe.', ''];
    parts.push('Página: ' + (pageTitle || document.title));
    Object.keys(data).forEach(function(k) {
      if (data[k]) {
        parts.push(k.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()}) + ': ' + data[k]);
      }
    });
    return encodeURIComponent(parts.join('\n'));
  }

  function validate(data) {
    var name = data['nome'] || data['seu_nome'] || data['nome_completo'] || '';
    var wa   = data['whatsapp'] || '';
    if (!name) { return 'Por favor, informe seu nome.'; }
    if (!wa)   { return 'Por favor, informe seu WhatsApp.'; }
    return null;
  }

  function showError(btn, msg) {
    var err = btn.parentElement.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      err.style.cssText = 'font-size:11px;color:#C06830;margin-top:10px;font-weight:500;text-align:center';
      btn.parentElement.appendChild(err);
    }
    err.textContent = msg;
    setTimeout(function() { err.textContent = ''; }, 4000);
  }

  function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.dataset.orig = btn.dataset.orig || btn.textContent;
    btn.textContent = loading ? 'ENVIANDO...' : btn.dataset.orig;
    btn.style.opacity = loading ? '0.7' : '1';
  }

  async function submitToFormspree(data) {
    if (!FORMSPREE_ID || FORMSPREE_ID === 'YOUR_FORMSPREE_ID') return true;
    try {
      var res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch(e) { return false; }
  }

  function handleSubmit(btn) {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();

      /* Find parent form/card */
      var container = btn.closest('.form-card') || btn.closest('#form') || btn.closest('section') || btn.closest('.contact-form-col');
      if (!container) return;

      var data   = getFields(container);
      var errMsg = validate(data);
      if (errMsg) { showError(btn, errMsg); return; }

      setLoading(btn, true);

      /* Fire tracking */
      if (window.dataLayer) { window.dataLayer.push({'event':'generate_lead'}); }
      if (window.fbq)       { fbq('track', 'Lead'); }

      /* Submit to Formspree (async, non-blocking) */
      submitToFormspree(Object.assign({ page: window.location.href, title: document.title }, data));

      /* Small delay for UX */
      await new Promise(function(r) { setTimeout(r, 600); });

      /* Open WhatsApp */
      var msg = buildWAMessage(data, document.title);
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + msg, '_blank');

      /* Redirect to /obrigado */
      window.location.href = '/obrigado';
    });
  }

  /* Attach to all CTA buttons */
  document.querySelectorAll('.btn-fill, .f-submit button').forEach(handleSubmit);

  /* Field focus styles (for inline fields without CSS focus) */
  document.querySelectorAll('.f-field, .field-inline, .f-area').forEach(function(f) {
    f.addEventListener('focus', function() { this.style.borderColor = '#C06830'; });
    f.addEventListener('blur',  function() { this.style.borderColor = ''; });
  });

  /* Contato page: textarea submit */
  var textAreaBtn = document.querySelector('.contact-form-col .btn-fill');
  if (textAreaBtn) handleSubmit(textAreaBtn);

}());
