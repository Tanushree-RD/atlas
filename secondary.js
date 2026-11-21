import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SIGNALS } from './signals-data.js';
import { initThreeBackground } from './three-background.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/* ══════════════════════════════════════════════════════
   Boot
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initThreeBackground($('#bg-canvas'));
  initCursorGlow();
  initHeader();
  initMobileMenu();
  initScrollProgress();
  initReveals();
  initMagneticElements();
  initRandomSignals();
  initBackToTop();

  window.addEventListener('load', () => ScrollTrigger.refresh());
});

/* ══════════════════════════════════════════════════════
   Cursor glow
   ══════════════════════════════════════════════════════ */

function initCursorGlow() {
  const glow = $('.cursor-glow');
  if (!glow || prefersReducedMotion || !hasFinePointer) return;

  gsap.set(glow, { xPercent: -50, yPercent: -50 });

  const moveX = gsap.quickTo(glow, 'x', { duration: 0.8, ease: 'power3.out' });
  const moveY = gsap.quickTo(glow, 'y', { duration: 0.8, ease: 'power3.out' });
  let visible = false;

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;

    if (!visible) {
      visible = true;
      gsap.to(glow, { opacity: 1, duration: 0.9, ease: 'power2.out' });
    }

    moveX(event.clientX);
    moveY(event.clientY);
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    visible = false;
    gsap.to(glow, { opacity: 0, duration: 0.5 });
  });
}

/* ══════════════════════════════════════════════════════
   Header + mobile menu
   ══════════════════════════════════════════════════════ */

function initHeader() {
  const header = $('#site-header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 28);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initMobileMenu() {
  const toggle = $('.menu-toggle');
  const menu = $('#mobile-menu');
  if (!toggle || !menu) return;

  let isOpen = false;

  const setOpen = (next) => {
    isOpen = next;
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', isOpen);
    menu.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('menu-open', isOpen);

    if (prefersReducedMotion) {
      gsap.set(menu, { autoAlpha: isOpen ? 1 : 0 });
      return;
    }

    if (isOpen) {
      gsap.fromTo(menu, { autoAlpha: 0 }, {
        autoAlpha: 1,
        duration: 0.35,
        ease: 'power2.out'
      });
      gsap.fromTo($$('.mobile-link', menu), { y: 32, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.07,
        delay: 0.08,
        ease: 'expo.out'
      });
      gsap.fromTo($('.mobile-menu-foot', menu), { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(menu, { autoAlpha: 0, duration: 0.28, ease: 'power2.in' });
    }
  };

  toggle.addEventListener('click', () => setOpen(!isOpen));

  $$('.mobile-link', menu).forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) setOpen(false);
  });
}

/* ══════════════════════════════════════════════════════
   Page motion
   ══════════════════════════════════════════════════════ */

function initScrollProgress() {
  const bar = $('#scroll-progress-bar');
  if (!bar) return;

  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });
}

function initReveals() {
  if (prefersReducedMotion) return;

  $$('[data-reveal]').forEach((element) => {
    gsap.from(element, {
      y: 34,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        once: true
      }
    });
  });
}

function initMagneticElements() {
  if (prefersReducedMotion || !hasFinePointer) return;

  $$('.magnetic').forEach((element) => {
    const moveX = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' });
    const moveY = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' });

    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
      moveX(relativeX * 8);
      moveY(relativeY * 8);
    });

    element.addEventListener('pointerleave', () => {
      moveX(0);
      moveY(0);
    });
  });
}

/* ══════════════════════════════════════════════════════
   Random signal jump + footer
   ══════════════════════════════════════════════════════ */

function initRandomSignals() {
  const buttons = $$('[data-random-signal]');
  if (!buttons.length || !SIGNALS.length) return;

  const currentId = new URLSearchParams(window.location.search).get('id');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const pool = SIGNALS.filter((signal) => signal.id !== currentId);
      const signal = pool[Math.floor(Math.random() * pool.length)] || SIGNALS[0];
      window.location.href = `signal.html?id=${encodeURIComponent(signal.id)}`;
    });
  });
}

function initBackToTop() {
  $('#back-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}
