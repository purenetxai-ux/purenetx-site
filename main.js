// PureNetX — shared interactions
(function () {
  var nav = document.getElementById('nav');
  if (nav) {
    addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', scrollY > 8);
    }, { passive: true });
  }

  var mBtn = document.getElementById('menuBtn');
  var mNav = document.getElementById('mobileNav');
  if (mBtn && mNav) {
    mBtn.addEventListener('click', function () { mNav.classList.toggle('open'); });
    mNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mNav.classList.remove('open'); });
    });
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Contact form → Formspree (AJAX) + success state
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (r.ok) {
          form.style.display = 'none';
          var ok = document.getElementById('formSuccess');
          if (ok) ok.classList.add('show');
        } else {
          throw new Error('send failed');
        }
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = 'Send Inquiry';
        alert('Something went wrong. Please email purenetx.ai@gmail.com directly.');
      });
    });
  }
})();
