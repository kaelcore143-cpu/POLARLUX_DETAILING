(function () {
  'use strict';

  /* ---------- Tema claro / oscuro ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');
  var sun = themeBtn.querySelector('[data-theme-icon="sun"]');
  var moon = themeBtn.querySelector('[data-theme-icon="moon"]');

  function applyTheme(theme) {
    var light = theme === 'light';
    root.dataset.theme = light ? 'light' : 'dark';
    themeBtn.setAttribute('aria-pressed', light ? 'true' : 'false');
    themeBtn.setAttribute('aria-label', light ? 'Activar tema oscuro' : 'Activar tema claro');
    sun.classList.toggle('hidden', light);
    moon.classList.toggle('hidden', !light);
  }
  applyTheme(root.dataset.theme || 'dark');
  themeBtn.addEventListener('click', function () {
    var next = root.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('polarlux-theme', next); } catch (e) {}
  });

  /* ---------- Menú móvil ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var openIcon = menuBtn.querySelector('[data-menu-icon="open"]');
  var closeIcon = menuBtn.querySelector('[data-menu-icon="close"]');

  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    openIcon.classList.toggle('hidden', open);
    closeIcon.classList.toggle('hidden', !open);
    document.body.classList.toggle('overflow-hidden', open);
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('click', function (e) {
    if (!menu.hidden && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
    if (e.matches && !menu.hidden) setMenu(false);
  });

  /* ---------- Imágenes: skeleton y fallback ---------- */
  function fallback(wrapper) {
    if (wrapper.hasAttribute('data-no-fallback') || wrapper.querySelector('.media-fallback')) return;
    var fb = document.createElement('div');
    fb.className = 'media-fallback';
    fb.innerHTML = '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z"/></svg><p>Imagen no disponible</p><button type="button" class="retry" data-retry>Reintentar</button>';
    wrapper.appendChild(fb);
  }

  function markFailed(wrapper) {
    wrapper.classList.remove('is-loading');
    wrapper.classList.add('is-error');
    fallback(wrapper);
  }

  document.querySelectorAll('.media').forEach(function (wrapper) {
    var img = wrapper.querySelector('img');
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth > 0) wrapper.classList.remove('is-loading');
      else markFailed(wrapper);
    }
  });

  document.addEventListener('load', function (e) {
    if (e.target.tagName !== 'IMG') return;
    var wrapper = e.target.closest('.media');
    if (!wrapper) return;
    wrapper.classList.remove('is-loading', 'is-error');
    var fb = wrapper.querySelector('.media-fallback');
    if (fb) fb.remove();
  }, true);

  document.addEventListener('error', function (e) {
    if (e.target.tagName !== 'IMG') return;
    var wrapper = e.target.closest('.media');
    if (wrapper) markFailed(wrapper);
  }, true);

  document.addEventListener('click', function (e) {
    var retry = e.target.closest('[data-retry]');
    if (!retry) return;
    var wrapper = retry.closest('.media');
    var img = wrapper && wrapper.querySelector('img');
    if (!img) return;
    wrapper.classList.remove('is-error');
    wrapper.classList.add('is-loading');
    var fb = wrapper.querySelector('.media-fallback');
    if (fb) fb.remove();
    var base = img.getAttribute('src').split('&_r=')[0];
    img.src = base + '&_r=' + Date.now();
  });

  /* ---------- Toast al abrir WhatsApp ---------- */
  var toast = document.getElementById('toast');
  var toastText = document.getElementById('toast-text');
  var toastTimer;

  function showToast(message) {
    toastText.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 2800);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="wa.me/"]');
    if (link && !link.hasAttribute('data-no-toast')) showToast('Abriendo WhatsApp…');
  });

  /* ---------- Formulario de cotización ---------- */
  var form = document.getElementById('quote-form');
  var success = document.getElementById('quote-success');
  var successLink = document.getElementById('success-link');
  var resetBtn = document.getElementById('quote-reset');
  var fields = Array.prototype.slice.call(form.querySelectorAll('[data-field]'));

  function controlOf(field) { return field.querySelector('input, select'); }

  function setInvalid(control, invalid) {
    var field = control.closest('[data-field]');
    var error = field.querySelector('.field-error');
    field.classList.toggle('is-invalid', invalid);
    control.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    error.hidden = !invalid;
  }

  function isValid(control) {
    if (control.tagName === 'SELECT') return control.value !== '';
    return control.value.trim().length >= 2;
  }

  fields.forEach(function (field) {
    var control = controlOf(field);
    control.addEventListener('input', function () { setInvalid(control, false); });
    control.addEventListener('change', function () { setInvalid(control, false); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;

    fields.forEach(function (field) {
      var control = controlOf(field);
      var valid = isValid(control);
      setInvalid(control, !valid);
      if (!valid && !firstInvalid) firstInvalid = control;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var data = new FormData(form);
    var message = 'Hola Polarlux, soy ' + data.get('nombre').trim() +
      '. Quiero cotizar ' + data.get('servicio') +
      ' para mi ' + data.get('vehiculo').trim() + '.';
    var url = 'https://wa.me/573014576626?text=' + encodeURIComponent(message);

    successLink.href = url;
    window.open(url, '_blank', 'noopener');
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    fields.forEach(function (field) {
      var control = controlOf(field);
      setInvalid(control, false);
      control.removeAttribute('aria-invalid');
    });
    success.hidden = true;
    form.hidden = false;
    document.getElementById('q-name').focus();
  });
})();
