(function () {
  'use strict';

  function track(eventName, parameters) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, Object.assign({
      page_path: window.location.pathname,
      transport_type: 'beacon'
    }, parameters || {}));
  }

  function cleanText(element) {
    return (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var text = cleanText(link);
    var lowerText = text.toLowerCase();
    var data = { link_text: text, link_url: href };

    if (href.indexOf('wa.me/') !== -1) {
      track('whatsapp_click', Object.assign({ contact_method: 'whatsapp' }, data));
      return;
    }

    if (href.indexOf('mailto:') === 0) {
      if (lowerText.indexOf('sample') !== -1) {
        track('sample_request', Object.assign({ contact_method: 'email' }, data));
      } else if (lowerText.indexOf('quote') !== -1 || lowerText.indexOf('inquiry') !== -1) {
        track('quote_request', Object.assign({ contact_method: 'email' }, data));
      } else {
        track('email_click', Object.assign({ contact_method: 'email' }, data));
      }
      return;
    }

    if (/\/(coffee-cup|meal-box|round-plates|square-plates|tea-set)\.html$/.test(new URL(link.href, window.location.href).pathname)) {
      track('product_detail_click', Object.assign({ product_name: text }, data));
    }
  });

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (element) {
      observer.observe(element);
    });
  }
})();
