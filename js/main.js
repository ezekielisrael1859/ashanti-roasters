// ==========================================================================
// ASHANTI ROASTERS — MAIN JS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WHATSAPP_NUMBER = '2340000000000'; // placeholder — replace with real number

  // ---- Footer year ----
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Load Intro ----
  const loadIntro = document.getElementById('load-intro');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loadIntro) loadIntro.classList.add('is-hidden');
      revealHero();
    }, prefersReducedMotion ? 0 : 900);
  });

  function revealHero() {
    document.querySelectorAll('.reveal-word').forEach((el, i) => {
      if (prefersReducedMotion) {
        el.style.opacity = 1;
        el.style.transform = 'none';
      } else {
        el.style.transition = `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`;
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }
    });
    document.querySelectorAll('.reveal-line').forEach((el, i) => {
      el.style.transition = `opacity 500ms ease ${500 + i * 150}ms`;
      el.style.opacity = 1;
    });
  }

  // ---- Custom Cursor ----
  const cursor = document.getElementById('custom-cursor');
  if (cursor && !window.matchMedia('(hover: none)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-' + el.dataset.cursor));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-' + el.dataset.cursor));
    });
  }

  // ---- Sticky Nav Background ----
  const nav = document.getElementById('site-nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  // ---- Smooth Scroll with Easing ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target.offsetTop - 60);
    });
  });

  function smoothScrollTo(targetY) {
    if (prefersReducedMotion) { window.scrollTo(0, targetY); return; }
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 700;
    let startTime = null;
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function step(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- Magnetic Buttons ----
  if (!window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ---- Origins: scroll-linked progress bar ----
  const originsTrack = document.getElementById('origins-track');
  const originsBar = document.getElementById('origins-progress-bar');
  if (originsTrack && originsBar) {
    originsTrack.addEventListener('scroll', () => {
      const maxScroll = originsTrack.scrollWidth - originsTrack.clientWidth;
      const pct = maxScroll > 0 ? (originsTrack.scrollLeft / maxScroll) * 100 : 0;
      originsBar.style.width = pct + '%';
    }, { passive: true });
  }

  // ---- Roast: scroll-triggered progress bar ----
  const roastTimeline = document.getElementById('roast-timeline');
  const roastBar = document.getElementById('roast-progress-bar');
  if (roastTimeline && roastBar) {
    window.addEventListener('scroll', () => {
      const rect = roastTimeline.getBoundingClientRect();
      const winH = window.innerHeight;
      const total = rect.height - winH * 0.3;
      const scrolled = winH * 0.7 - rect.top;
      const pct = Math.min(Math.max((scrolled / total) * 100, 0), 100);
      roastBar.style.width = pct + '%';
    }, { passive: true });
  }

  // ---- Scroll Reveal (Intersection Observer) ----
  const revealTargets = document.querySelectorAll('.origin-card, .roast-step, .blend-card, .accordion-item');
  revealTargets.forEach(el => { el.style.opacity = 0; el.style.transform = 'translateY(24px)'; });
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 600ms ease, transform 600ms ease';
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  // ---- Brew Guide Tabs ----
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const tabIndicator = document.getElementById('tab-indicator');

  function moveIndicator(btn) {
    if (!tabIndicator) return;
    tabIndicator.style.left = btn.offsetLeft + 'px';
    tabIndicator.style.width = btn.offsetWidth + 'px';
  }

  if (tabBtns.length) {
    moveIndicator(document.querySelector('.tab-btn.is-active'));
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        moveIndicator(btn);

        tabPanels.forEach(panel => {
          if (panel.id === 'panel-' + btn.dataset.tab) {
            panel.hidden = false;
            panel.classList.add('is-active');
          } else {
            panel.hidden = true;
            panel.classList.remove('is-active');
          }
        });
      });
    });
    window.addEventListener('resize', () => {
      moveIndicator(document.querySelector('.tab-btn.is-active'));
    });
  }

  // ---- Sustainability Parallax ----
  const parallaxImg = document.querySelector('.parallax-img');
  if (parallaxImg && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const rect = parallaxImg.parentElement.getBoundingClientRect();
      const offset = rect.top * 0.15;
      parallaxImg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  // ---- Testimonials Marquee: duplicate track for seamless loop ----
  const marqueeTrack = document.getElementById('marquee-track');
  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
    marqueeTrack.parentElement.addEventListener('click', () => {
      marqueeTrack.style.animationPlayState =
        marqueeTrack.style.animationPlayState === 'paused' ? 'running' : 'paused';
    });
  }

  // ---- FAQ Accordion ----
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    const panel = trigger.nextElementSibling;
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion-trigger').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.style.maxHeight = null;
      });
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // ---- Enquiry Form -> WhatsApp ----
  const form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const email = form.email.value.trim();
      const blend = form.blend.value;
      const orderType = form.orderType.value;

      const message = `New enquiry from Ashanti Roasters site:%0A` +
        `Name: ${encodeURIComponent(name)}%0A` +
        `Phone: ${encodeURIComponent(phone)}%0A` +
        `Email: ${encodeURIComponent(email || 'Not provided')}%0A` +
        `Blend: ${encodeURIComponent(blend)}%0A` +
        `Order Type: ${encodeURIComponent(orderType)}`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    });
  }

});
