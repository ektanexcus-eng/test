/* Ekta NexCus — shared site behaviour. No external dependencies. */
(function(){
  "use strict";

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.mobile-drawer');
  if(toggle && drawer){
    toggle.addEventListener('click', function(){
      var open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        drawer.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
        document.body.style.overflow='';
      });
    });
  }

  /* ---------- "more" dropdown (desktop nav overflow) ---------- */
  document.querySelectorAll('.nav-more').forEach(function(wrap){
    var btn = wrap.querySelector('.nav-more-btn');
    if(!btn) return;
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function(){
    document.querySelectorAll('.nav-more.open').forEach(function(w){
      w.classList.remove('open');
      var b = w.querySelector('.nav-more-btn');
      if(b) b.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      document.querySelectorAll('.nav-more.open').forEach(function(w){ w.classList.remove('open'); });
      if(drawer && drawer.classList.contains('open')){
        drawer.classList.remove('open');
        if(toggle) toggle.setAttribute('aria-expanded','false');
        document.body.style.overflow='';
      }
    }
  });

  /* ---------- language switch ----------
     Scoped to pages that carry bilingual/trilingual markup:
     elements tagged with [data-lang="en|hi|mr"] are shown/hidden.
     Pages without this markup simply ignore the switch (English-only content). */
  function setLang(l){
    document.documentElement.setAttribute('data-active-lang', l);
    document.querySelectorAll('[data-lang]').forEach(function(el){
      el.style.display = (el.getAttribute('data-lang') === l) ? '' : 'none';
    });
    document.querySelectorAll('.lang-switch button').forEach(function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === l ? 'true' : 'false');
    });
    try{ localStorage.setItem('en-nx-lang', l); }catch(e){}
  }
  document.querySelectorAll('.lang-switch button').forEach(function(b){
    b.addEventListener('click', function(){ setLang(b.getAttribute('data-set-lang')); });
  });
  if(document.querySelector('[data-lang]')){
    var saved = 'en';
    try{ saved = localStorage.getItem('en-nx-lang') || 'en'; }catch(e){}
    setLang(saved);
  }

  /* ---------- scroll reveal ---------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window && !reduced){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, {threshold:0.1});
    document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- lightweight client-side form validation ----------
     Real submission still requires a backend/endpoint to be wired in
     (see /docs/FORMS.md). This layer only checks required fields,
     email/phone shape, and honeypot spam-trap before allowing submit. */
  function validateField(field){
    var input = field.querySelector('input,textarea,select');
    if(!input) return true;
    var ok = input.checkValidity();
    if(input.hasAttribute('required') && !input.value.trim()) ok = false;
    field.classList.toggle('error', !ok);
    return ok;
  }

  document.querySelectorAll('form[data-validate]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var hp = form.querySelector('.honeypot input');
      if(hp && hp.value){ return; } /* silently drop likely-bot submissions */

      var valid = true;
      form.querySelectorAll('.field').forEach(function(f){
        if(!validateField(f)) valid = false;
      });
      var consent = form.querySelector('.consent-row input[type="checkbox"]');
      if(consent && consent.hasAttribute('required') && !consent.checked){
        valid = false;
        consent.closest('.consent-row').style.outline = '2px solid #B3261E';
      } else if(consent){
        consent.closest('.consent-row').style.outline = 'none';
      }

      if(!valid){
        var firstError = form.querySelector('.field.error input, .field.error textarea, .field.error select');
        if(firstError) firstError.focus();
        return;
      }

      /* No backend is wired yet — this simulates success locally.
         Replace this block with a real fetch() call to your API/endpoint. */
      form.reset();
      var success = form.parentElement.querySelector('.form-success');
      if(success){
        success.classList.add('show');
        success.setAttribute('tabindex','-1');
        success.focus();
      }
    });

    form.querySelectorAll('input,textarea,select').forEach(function(input){
      input.addEventListener('blur', function(){
        var field = input.closest('.field');
        if(field) validateField(field);
      });
    });
  });

})();
