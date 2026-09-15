// Phoenix Housing Group — site scripts
(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Forms: submit in the background, then always land on the branded thank-you page
  var ENDPOINT = 'https://formsubmit.co/ajax/admin@phoenixhousinggroup.com';
  document.querySelectorAll('form[data-phg-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      if (!window.fetch || !window.FormData) { return; } // very old browsers: normal POST + redirect
      ev.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var label = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      var note = form.querySelector('.form-error');
      if (note) { note.remove(); }
      var data = new FormData(form);
      data.delete('_next'); data.delete('_captcha');
      fetch(ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
          if (res.ok || (res.body && String(res.body.message || '').toLowerCase().indexOf('activat') > -1)) {
            window.location.href = 'thank-you.html';
          } else { throw new Error(res.body && res.body.message ? res.body.message : 'Send failed'); }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = label; }
          var p = document.createElement('p');
          p.className = 'form-error';
          p.textContent = 'Sorry, your message could not be sent just now. Please try again in a moment.';
          form.appendChild(p);
        });
    });
  });

  // Footer year
  var y = document.querySelector('[data-year]');
  if (y) { y.textContent = new Date().getFullYear(); }
})();
