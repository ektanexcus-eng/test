/*
 * Ekta NexCus — site script
 * - Language toggle (EN / MR) with persistence
 * - Mobile nav menu
 * - Scroll-reveal animation (respects prefers-reduced-motion)
 * - Smooth in-page navigation
 * - Contact form validation + submit
 */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── LANGUAGE TOGGLE ───────────────────────────────────────── */
  function setLang(lang) {
    var body = document.getElementById('B');
    var html = document.documentElement;
    var btnEn = document.getElementById('ben');
    var btnMr = document.getElementById('bmr');

    body.className = 'lang-' + lang;
    html.setAttribute('lang', lang === 'mr' ? 'mr' : 'en');
    html.setAttribute('data-lang', lang);

    if (btnEn) {
      btnEn.classList.toggle('on', lang === 'en');
      btnEn.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    }
    if (btnMr) {
      btnMr.classList.toggle('on', lang === 'mr');
      btnMr.setAttribute('aria-pressed', lang === 'mr' ? 'true' : 'false');
    }

    try {
      localStorage.setItem('ektaLang', lang);
    } catch (e) {
      /* localStorage unavailable (private browsing, etc.) — ignore */
    }
  }

  function initLang() {
    var saved = null;
    try {
      saved = localStorage.getItem('ektaLang');
    } catch (e) {
      /* ignore */
    }
    if (saved === 'en' || saved === 'mr') {
      setLang(saved);
    }

    var btnEn = document.getElementById('ben');
    var btnMr = document.getElementById('bmr');
    if (btnEn) btnEn.addEventListener('click', function () { setLang('en'); });
    if (btnMr) btnMr.addEventListener('click', function () { setLang('mr'); });
  }

  /* ── MOBILE NAV ─────────────────────────────────────────────── */
  function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Close the menu after choosing a link, and on outside click */
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!links.classList.contains('open')) return;
      if (links.contains(e.target) || toggle.contains(e.target)) return;
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ── SCROLL-REVEAL ──────────────────────────────────────────── */
  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.card,.cta-card,.const-card,.sdg-card,.tl-item,.cf-step,.parent-card,.sector-chip'
    );
    if (!targets.length) return;

    if (reduceMotion) {
      targets.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    targets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      obs.observe(el);
    });
  }

  /* ── SMOOTH IN-PAGE NAVIGATION ──────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', href);
      });
    });
  }

  /* ── CONTACT FORM ───────────────────────────────────────────── */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var status = document.getElementById('cfStatus');
    var submitBtn = document.getElementById('cfSubmit');

    var validators = {
      name: function (v) {
        return v.trim().length > 0 ? '' : 'Please enter your name.';
      },
      email: function (v) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(v.trim()) ? '' : 'Please enter a valid email address.';
      },
      message: function (v) {
        return v.trim().length > 0 ? '' : 'Please enter a message.';
      }
    };

    function showError(field, message) {
      var el = form.querySelector('.form-error[data-for="cf-' + field + '"]');
      if (el) el.textContent = message;
    }

    function validateField(input) {
      var name = input.name;
      if (!validators[name]) return true;
      var message = validators[name](input.value);
      showError(name, message);
      return message === '';
    }

    ['name', 'email', 'message'].forEach(function (field) {
      var input = document.getElementById('cf-' + field);
      if (input) {
        input.addEventListener('blur', function () { validateField(input); });
      }
    });

    form.addEventListener('submit', function (e) {
      var nameInput = document.getElementById('cf-name');
      var emailInput = document.getElementById('cf-email');
      var messageInput = document.getElementById('cf-message');

      var validName = validateField(nameInput);
      var validEmail = validateField(emailInput);
      var validMessage = validateField(messageInput);

      if (!(validName && validEmail && validMessage)) {
        e.preventDefault();
        status.textContent = 'Please fix the highlighted fields.';
        return;
      }

      /* Honeypot: if filled, it's a bot — silently drop the submit */
      var honey = form.querySelector('.hp-field');
      if (honey && honey.value) {
        e.preventDefault();
        return;
      }

      submitBtn.disabled = true;
      status.textContent = 'Sending…';
      /* Form posts normally to Formsubmit.co (see HTML comment above the
         form). If you swap in a JSON API endpoint instead, replace this
         handler with a fetch() call and re-enable the button in .then(). */
    });
  }

  /* ── INIT ───────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initLang();
    initMobileNav();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
  });
})();
