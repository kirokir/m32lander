(function () {
  'use strict';

  /* ---------- Config ---------- */
  var WHATSAPP_NUMBER = '919947960606';
  var WHATSAPP_MESSAGE = 'Hello M32 Dental Centre, I would like to book a Clear Aligner consultation.';
  var WHATSAPP_URL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);

  document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
    el.setAttribute('href', WHATSAPP_URL);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  /* ---------- Announcement bar ---------- */
  var announceBar = document.getElementById('announceBar');
  var announceClose = document.getElementById('announceClose');
  if (announceBar) {
    document.body.classList.add('has-announce');
    if (announceClose) {
      announceClose.addEventListener('click', function () {
        announceBar.classList.add('is-hidden');
        document.body.classList.remove('has-announce');
      });
    }
  }

  /* ---------- Lead capture form -> WhatsApp handoff ---------- */
  var leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('leadName').value.trim();
      var phone = document.getElementById('leadPhone').value.trim();
      if (!name || !phone) return;
      var message = 'Hello M32 Dental Centre, I would like to book a Clear Aligner consultation. My name is ' +
        name + ' and my phone number is ' + phone + '.';
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank', 'noopener,noreferrer');
      leadForm.reset();
    });
  }

  /* ---------- Stat count-up ---------- */
  var statEls = document.querySelectorAll('.stat__num');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1200;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (statEls.length && 'IntersectionObserver' in window) {
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statEls.forEach(function (el) { statIo.observe(el); });
  }

  /* ---------- Preload ---------- */
  window.addEventListener('load', function () {
    var preload = document.getElementById('preload');
    if (preload) {
      setTimeout(function () {
        preload.classList.add('is-hidden');
      }, 350);
    }
  });

  /* ---------- Scroll progress + header state ---------- */
  var scrollBar = document.getElementById('scrollBar');
  var header = document.getElementById('siteHeader');

  function onScroll() {
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    if (scrollBar) scrollBar.style.width = pct + '%';
    if (header) header.classList.toggle('is-scrolled', scrollTop > 12);
    updateActiveNav(scrollTop);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  var hamburger = document.getElementById('hamburgerBtn');
  var drawer = document.getElementById('drawer');

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
  }
  document.querySelectorAll('[data-close-drawer]').forEach(function (el) {
    el.addEventListener('click', closeDrawer);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---------- Ripple effect ---------- */
  document.querySelectorAll('.ripple').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var circle = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(circle);
      setTimeout(function () { circle.remove(); }, 650);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      var panel = trigger.nextElementSibling;

      document.querySelectorAll('.accordion__trigger').forEach(function (t) {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          t.nextElementSibling.style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', String(!expanded));
      panel.style.maxHeight = expanded ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Bottom nav active state ---------- */
  var navItems = document.querySelectorAll('.bottom-nav__item[data-section]');
  var sectionMap = [];
  navItems.forEach(function (item) {
    var id = item.getAttribute('data-section');
    var section = document.getElementById(id);
    if (section) sectionMap.push({ el: item, top: section.offsetTop });
  });

  function updateActiveNav(scrollTop) {
    if (!sectionMap.length) return;
    var offset = scrollTop + window.innerHeight * 0.35;
    var current = sectionMap[0];
    sectionMap.forEach(function (entry) {
      if (offset >= entry.top) current = entry;
    });
    navItems.forEach(function (item) { item.classList.remove('is-active'); });
    current.el.classList.add('is-active');
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
