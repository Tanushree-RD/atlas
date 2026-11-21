import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SIGNALS, FILTER_CATEGORIES } from './signals-data.js';
import { initThreeBackground } from './three-background.js';
import { initHeroNetwork } from './hero-network.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const SAVED_KEY = 'atlas:saved-signals';

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function pad(value, length = 2) {
  return String(value).padStart(length, '0');
}

function loadSaved() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return new Set(Array.isArray(raw) ? raw.filter((id) => typeof id === 'string') : []);
  } catch (error) {
    return new Set();
  }
}

function persistSaved(saved) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]));
  } catch (error) {
    /* Storage may be unavailable — the session still works. */
  }
}

const state = {
  filter: 'all',
  sort: 'recent',
  query: '',
  expandedId: null,
  saved: loadSaved()
};

let toastTimer = null;
let openRandomSignal = () => {};

/* ══════════════════════════════════════════════════════
   Boot
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initThreeBackground($('#bg-canvas'));
  initHeroNetwork();

  initCursorGlow();
  initHeader();
  initMobileMenu();
  initTypedHeadline();
  initScanner();
  initTicker();
  initHeroIntro();
  initCounters();
  initReveals();
  initScrollProgress();
  initMagneticElements();
  initNavObserver();
  initSpotlight();
  initArchive();
  initFooterLinks();
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
  $('.mobile-random', menu)?.addEventListener('click', () => setOpen(false));

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) setOpen(false);
  });
}

function initNavObserver() {
  const links = $$('.site-nav .nav-link');
  if (!links.length || !('IntersectionObserver' in window)) return;

  const entries = links
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute('href'))
    }))
    .filter((entry) => entry.section);

  const observer = new IntersectionObserver((observed) => {
    observed.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.remove('is-active'));
      const match = entries.find((item) => item.section === entry.target);
      match?.link.classList.add('is-active');
    });
  }, { rootMargin: '-42% 0px -52% 0px' });

  entries.forEach((entry) => observer.observe(entry.section));
}

/* ══════════════════════════════════════════════════════
   Hero
   ══════════════════════════════════════════════════════ */

function initTypedHeadline() {
  const typed = $('#typed-text');
  if (!typed) return;

  const words = ['unseen', 'weird', 'hidden', 'curious', 'obscure'];

  if (prefersReducedMotion) {
    typed.textContent = words[0];
    return;
  }

  let wordIndex = 0;
  let position = words[0].length;
  let deleting = true;

  function loop() {
    const current = words[wordIndex];

    if (deleting) {
      position -= 1;
      typed.textContent = current.slice(0, position);

      if (position === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(loop, 380);
        return;
      }
    } else {
      const next = words[wordIndex];
      position += 1;
      typed.textContent = next.slice(0, position);

      if (position === next.length) {
        deleting = true;
        setTimeout(loop, 1900);
        return;
      }
    }

    setTimeout(loop, deleting ? 65 : 105);
  }

  setTimeout(loop, 2100);
}

function initScanner() {
  const name = $('#scanner-name');
  const category = $('#scanner-cat');
  const score = $('#scanner-score');
  const index = $('#scanner-index');
  const meter = $('#scanner-meter');
  if (!name || !category || !score || !index || !meter) return;

  let cursor = 0;

  const render = () => {
    const signal = SIGNALS[cursor % SIGNALS.length];
    const signalScore = signal.metadata?.score ?? 80;

    name.textContent = signal.name;
    category.textContent = `${signal.category} / ${signal.year}`;
    score.textContent = signalScore;
    index.textContent = `${pad((cursor % SIGNALS.length) + 1)} / ${pad(SIGNALS.length)}`;

    gsap.set(meter, { scaleX: signalScore / 100 });
  };

  const advance = (animate = true) => {
    if (!animate || prefersReducedMotion) {
      render();
      return;
    }

    gsap.timeline()
      .to([name, category, score, index], {
        opacity: 0,
        y: -5,
        duration: 0.22,
        stagger: 0.02,
        ease: 'power2.in'
      })
      .add(render)
      .to([name, category, score, index], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.out'
      });

    gsap.fromTo(meter, { scaleX: 0 }, {
      scaleX: (SIGNALS[cursor % SIGNALS.length].metadata?.score ?? 80) / 100,
      duration: 1,
      ease: 'expo.out'
    });
  };

  render();

  if (prefersReducedMotion) return;

  setInterval(() => {
    if (document.hidden) return;
    cursor += 1;
    advance(true);
  }, 4300);
}

function initTicker() {
  const track = $('#ticker-track');
  if (!track || prefersReducedMotion) return;

  const tween = gsap.to(track, {
    xPercent: -50,
    duration: 34,
    ease: 'none',
    repeat: -1
  });

  track.parentElement?.addEventListener('mouseenter', () => tween.timeScale(0.25));
  track.parentElement?.addEventListener('mouseleave', () => tween.timeScale(1));
}

function initHeroIntro() {
  if (prefersReducedMotion) return;

  const timeline = gsap.timeline({
    delay: 0.15,
    defaults: { ease: 'expo.out' }
  });

  timeline
    .from('.hero-top > *', { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 })
    .from('.title-inner', { yPercent: 115, duration: 1.25, stagger: 0.09 }, '-=0.55')
    .from('.hero-description', { y: 24, opacity: 0, duration: 0.9 }, '-=0.75')
    .from('.hero-actions .btn', { y: 18, opacity: 0, duration: 0.8, stagger: 0.07 }, '-=0.7')
    .from('.scanner-card', { y: 34, opacity: 0, rotate: 2, duration: 1.1 }, '-=1')
    .from('.hero-stats .stat', { y: 16, opacity: 0, duration: 0.7, stagger: 0.06 }, '-=0.8')
    .from('.hero-bottom > *', { y: 14, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.7')
    .from('.ticker', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
    .add(() => {
      gsap.to('.scanner-card', {
        y: -9,
        duration: 4.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    });
}

/* ══════════════════════════════════════════════════════
   Page motion
   ══════════════════════════════════════════════════════ */

function initCounters() {
  $$('[data-count]').forEach((element) => {
    const target = Number(element.dataset.count || 0);
    const digits = Number(element.dataset.pad || 0);

    const render = (value) => {
      const rounded = Math.round(value);
      element.textContent = digits ? pad(rounded, digits) : String(rounded);
    };

    if (prefersReducedMotion) {
      render(target);
      return;
    }

    const proxy = { value: 0 };
    const tween = gsap.to(proxy, {
      value: target,
      duration: 1.6,
      ease: 'expo.out',
      paused: true,
      onUpdate: () => render(proxy.value)
    });

    if (element.closest('.hero')) {
      tween.delay(0.85).play();
      return;
    }

    ScrollTrigger.create({
      trigger: element,
      start: 'top 92%',
      once: true,
      onEnter: () => tween.play()
    });
  });
}

function initReveals() {
  if (prefersReducedMotion) return;

  $$('[data-reveal]').forEach((element) => {
    gsap.from(element, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%',
        once: true
      }
    });
  });

  const manifestoLines = $$('.manifesto-title .reveal-line');
  if (manifestoLines.length) {
    gsap.from(manifestoLines, {
      yPercent: 112,
      opacity: 0,
      duration: 1.1,
      stagger: 0.09,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '.manifesto-title',
        start: 'top 85%',
        once: true
      }
    });
  }
}

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
   Archive
   ══════════════════════════════════════════════════════ */

function signalMatchesFilter(signal, filter) {
  if (filter === 'all') return true;
  if (filter === 'saved') return state.saved.has(signal.id);

  const categories = (signal.filterCategories || []).map((category) => category.toLowerCase());
  const mainCategory = (signal.category || '').toLowerCase();

  return categories.includes(filter) || mainCategory === filter;
}

function getFilteredSignals() {
  let signals = SIGNALS.filter((signal) => signalMatchesFilter(signal, state.filter));

  if (state.query) {
    const query = state.query;
    signals = signals.filter((signal) => {
      const haystack = [
        signal.name,
        signal.description,
        signal.largerDescription,
        signal.fullDescription,
        signal.category,
        signal.creator,
        ...(signal.tags || [])
      ].join(' ').toLowerCase();

      return haystack.includes(query);
    });
  }

  switch (state.sort) {
    case 'popular':
      signals.sort((a, b) => (b.metadata?.score || 0) - (a.metadata?.score || 0));
      break;
    case 'az':
      signals.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'random':
      for (let i = signals.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [signals[i], signals[j]] = [signals[j], signals[i]];
      }
      break;
    case 'recent':
    default:
      signals.sort((a, b) => (b.year || 0) - (a.year || 0));
      break;
  }

  return signals;
}

function initArchive() {
  const filterRow = $('#filter-row');
  const sortOptions = $('#sort-options');
  const searchInput = $('#search-input');
  const searchClear = $('#search-clear');
  const searchKbd = $('#search-kbd');
  const feedList = $('#feed-list');
  const feedEmpty = $('#feed-empty');
  const resetButton = $('#reset-filters');
  if (!filterRow || !sortOptions || !searchInput || !feedList || !feedEmpty) return;

  const renderFeed = () => {
    const signals = getFilteredSignals();
    feedList.innerHTML = '';
    updateResultsMeta(signals.length);

    feedEmpty.hidden = signals.length > 0;
    feedList.hidden = signals.length === 0;

    if (!signals.length) return;

    const fragment = document.createDocumentFragment();
    signals.forEach((signal, index) => {
      fragment.appendChild(buildFeedRow(signal, index));
    });
    feedList.appendChild(fragment);

    if (state.expandedId) {
      const expandedRow = feedList.querySelector(`.feed-row[data-id="${state.expandedId}"]`);
      if (expandedRow) {
        openRow(expandedRow, false);
      } else {
        state.expandedId = null;
      }
    }

    if (!prefersReducedMotion) {
      gsap.fromTo(
        feedList.querySelectorAll('.feed-row'),
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.035,
          ease: 'power2.out',
          overwrite: true
        }
      );
    }
  };

  const updateResultsMeta = (count) => {
    const resultsCount = $('#results-count');
    const resultsContext = $('#results-context');
    if (resultsCount) {
      resultsCount.textContent = `${pad(count)} ${count === 1 ? 'signal' : 'signals'}`;
    }
    if (!resultsContext) return;

    const filterLabel = state.filter === 'all'
      ? 'ALL SIGNALS'
      : state.filter === 'saved'
        ? 'SAVED SIGNALS'
        : state.filter.toUpperCase();

    const parts = [filterLabel];
    if (state.query) parts.push(`“${state.query}”`);
    if (state.sort === 'popular') parts.push('BY SIGNAL STRENGTH');
    else if (state.sort === 'az') parts.push('A–Z');
    else if (state.sort === 'recent') parts.push('NEWEST FIRST');

    resultsContext.textContent = parts.join(' / ');
  };

  const updateFilterButtons = () => {
    $$('.filter-btn', filterRow).forEach((button) => {
      const isActive = button.dataset.filter === state.filter;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
  };

  const updateSavedCount = () => {
    const savedCount = filterRow.querySelector('[data-filter="saved"] b');
    if (savedCount) savedCount.textContent = pad(state.saved.size);
  };

  const buildFeedRow = (signal, index) => {
    const row = document.createElement('article');
    const isSaved = state.saved.has(signal.id);
    const largerDescription = signal.largerDescription || signal.fullDescription || signal.description;
    const tags = (signal.tags || []).slice(0, 4);
    const whyPoints = (signal.whyVisit || signal.bestFor || []).slice(0, 3);
    const panelId = `panel-${signal.id}`;

    row.className = 'feed-row';
    row.dataset.id = signal.id;
    row.setAttribute('role', 'listitem');

    row.innerHTML = `
      <div class="feed-row-head">
        <button class="feed-row-header" type="button" aria-expanded="false" aria-controls="${escapeHTML(panelId)}">
          <span class="feed-index">${pad(index + 1)}</span>
          <span class="feed-info">
            <span class="feed-name">${escapeHTML(signal.name)}</span>
            <span class="feed-desc">${escapeHTML(signal.description)}</span>
          </span>
          <span class="feed-cat">${escapeHTML(signal.category)}</span>
          <span class="feed-year">${escapeHTML(signal.year || '')}</span>
        </button>

        <button class="feed-save${isSaved ? ' is-saved' : ''}" type="button"
          data-id="${escapeHTML(signal.id)}" data-name="${escapeHTML(signal.name)}"
          aria-label="${isSaved ? 'Remove' : 'Save'} ${escapeHTML(signal.name)}"
          aria-pressed="${isSaved}">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
            <path d="M4 2.5h8a.5.5 0 0 1 .5.5v11l-4.5-3-4.5 3v-11a.5.5 0 0 1 .5-.5Z"></path>
          </svg>
        </button>

        <button class="feed-toggle" type="button" aria-label="Expand ${escapeHTML(signal.name)}"
          aria-expanded="false" aria-controls="${escapeHTML(panelId)}">
          <span class="icon-plus" aria-hidden="true"></span>
        </button>
      </div>

      <div class="feed-row-panel" id="${escapeHTML(panelId)}" role="region"
        aria-label="${escapeHTML(signal.name)} details">
        <div class="panel-grid">
          <div class="panel-media panel-anim">
            <img class="panel-img" src="${escapeHTML(signal.screenshot || '')}"
              alt="${escapeHTML(signal.name)} website preview" loading="lazy">
            <span class="panel-media-tag">SIGNAL ${escapeHTML(signal.id.replace('SIG-', ''))} / CAPTURE</span>
          </div>

          <div class="panel-content">
            <div class="panel-tags panel-anim">
              <span class="panel-cat">${escapeHTML(signal.category)}</span>
              ${tags.map((tag) => `<span class="panel-tag">#${escapeHTML(tag)}</span>`).join('')}
            </div>

            <p class="panel-desc panel-anim">${escapeHTML(largerDescription)}</p>

            <div class="panel-data panel-anim">
              <div><span>Creator</span><strong>${escapeHTML(signal.creator || 'Unknown')}</strong></div>
              <div><span>Year</span><strong>${escapeHTML(signal.year || '—')}</strong></div>
              <div><span>Stack</span><strong>${escapeHTML(signal.tech || '—')}</strong></div>
            </div>

            <div class="panel-why panel-anim">
              <span class="panel-why-heading">Why visit</span>
              <ul class="panel-why-list">
                ${whyPoints.map((point) => `<li>${escapeHTML(point)}</li>`).join('')}
              </ul>
            </div>

            <div class="panel-actions panel-anim">
              <a class="btn btn--primary panel-visit" href="${escapeHTML(signal.url)}"
                target="_blank" rel="noopener noreferrer">
                Visit website <span class="btn-arrow">↗</span>
              </a>
              <button class="btn btn--ghost panel-save" type="button" data-id="${escapeHTML(signal.id)}">
                ${isSaved ? 'Saved ✓' : 'Save signal ✳'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    row.querySelector('.feed-row-header').addEventListener('click', () => toggleRow(signal.id));
    row.querySelector('.feed-toggle').addEventListener('click', () => toggleRow(signal.id));

    row.querySelector('.feed-save').addEventListener('click', (event) => {
      event.stopPropagation();
      toggleSave(signal.id);
    });

    row.querySelector('.panel-save').addEventListener('click', () => toggleSave(signal.id));

    return row;
  };

  const openRow = (row, animate = true) => {
    const panel = row.querySelector('.feed-row-panel');
    const toggle = row.querySelector('.feed-toggle');
    const header = row.querySelector('.feed-row-header');
    if (!panel || !toggle || !header) return;

    row.classList.add('is-expanded');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Collapse details');
    header.setAttribute('aria-expanded', 'true');

    if (!animate || prefersReducedMotion) {
      panel.style.height = 'auto';
      return;
    }

    gsap.killTweensOf(panel);
    gsap.fromTo(panel, { height: 0 }, {
      height: 'auto',
      duration: 0.6,
      ease: 'expo.out',
      onComplete: () => {
        panel.style.height = 'auto';
      }
    });

    gsap.fromTo(panel.querySelectorAll('.panel-anim'), { y: 18, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.65,
      stagger: 0.045,
      delay: 0.08,
      ease: 'power3.out',
      overwrite: true
    });
  };

  const closeRow = (row) => {
    const panel = row.querySelector('.feed-row-panel');
    const toggle = row.querySelector('.feed-toggle');
    const header = row.querySelector('.feed-row-header');
    if (!panel || !toggle || !header) return;

    row.classList.remove('is-expanded');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Expand details');
    header.setAttribute('aria-expanded', 'false');

    if (prefersReducedMotion) {
      panel.style.height = '0px';
      return;
    }

    gsap.to(panel, {
      height: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      overwrite: true
    });
  };

  const toggleRow = (id) => {
    const row = feedList.querySelector(`.feed-row[data-id="${id}"]`);
    if (!row) return;

    if (state.expandedId === id) {
      closeRow(row);
      state.expandedId = null;
      return;
    }

    if (state.expandedId) {
      const previous = feedList.querySelector(`.feed-row[data-id="${state.expandedId}"]`);
      if (previous) closeRow(previous);
    }

    openRow(row);
    state.expandedId = id;
  };

  const updateSavedUI = () => {
    $$('.feed-save', feedList).forEach((button) => {
      const isSaved = state.saved.has(button.dataset.id);
      const name = button.dataset.name || 'signal';
      button.classList.toggle('is-saved', isSaved);
      button.setAttribute('aria-pressed', String(isSaved));
      button.setAttribute('aria-label', `${isSaved ? 'Remove' : 'Save'} ${name}`);
    });

    $$('.panel-save', feedList).forEach((button) => {
      button.textContent = state.saved.has(button.dataset.id) ? 'Saved ✓' : 'Save signal ✳';
    });

    updateSavedCount();
  };

  const toggleSave = (id) => {
    const wasSaved = state.saved.has(id);

    if (wasSaved) state.saved.delete(id);
    else state.saved.add(id);

    persistSaved(state.saved);
    updateSavedUI();
    showToast(wasSaved ? 'Removed from your index' : 'Saved to your index');

    if (state.filter === 'saved') renderFeed();
  };

  const buildFilters = () => {
    const counts = FILTER_CATEGORIES.map((category) => ({
      ...category,
      count: SIGNALS.filter((signal) => signalMatchesFilter(signal, category.key)).length
    }));

    const categories = [
      ...counts,
      { key: 'saved', label: 'Saved', count: state.saved.size }
    ];

    filterRow.innerHTML = categories.map((category) => `
      <button class="filter-btn${state.filter === category.key ? ' active' : ''}" type="button"
        role="tab" aria-selected="${state.filter === category.key}" data-filter="${category.key}">
        <span>${escapeHTML(category.label)}</span><b>${pad(category.count)}</b>
      </button>
    `).join('');

    $$('.filter-btn', filterRow).forEach((button) => {
      button.addEventListener('click', () => {
        state.filter = button.dataset.filter;
        state.expandedId = null;
        updateFilterButtons();
        renderFeed();
      });
    });
  };

  const resetFilters = () => {
    state.filter = 'all';
    state.sort = 'recent';
    state.query = '';
    state.expandedId = null;
    searchInput.value = '';
    searchClear?.classList.remove('is-visible');
    $$('.sort-btn', sortOptions).forEach((button) => {
      button.classList.toggle('active', button.dataset.sort === 'recent');
    });
    updateFilterButtons();
    renderFeed();
  };

  buildFilters();
  renderFeed();

  $$('.sort-btn', sortOptions).forEach((button) => {
    button.addEventListener('click', () => {
      state.sort = button.dataset.sort;
      state.expandedId = null;
      $$('.sort-btn', sortOptions).forEach((item) => {
        item.classList.toggle('active', item === button);
      });
      renderFeed();
    });
  });

  let searchTimer = null;
  searchInput.addEventListener('input', () => {
    const value = searchInput.value;
    searchClear?.classList.toggle('is-visible', value.length > 0);

    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = value.trim().toLowerCase();
      state.expandedId = null;
      renderFeed();
    }, 130);
  });

  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    state.query = '';
    state.expandedId = null;
    searchClear.classList.remove('is-visible');
    searchInput.focus();
    renderFeed();
  });

  resetButton?.addEventListener('click', resetFilters);

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  if (searchKbd) searchKbd.textContent = isMac ? '⌘ K' : 'Ctrl K';

  window.addEventListener('keydown', (event) => {
    const active = document.activeElement;
    const isTyping = active instanceof HTMLInputElement
      || active instanceof HTMLTextAreaElement
      || active?.isContentEditable;

    if ((event.key === '/' && !isTyping) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
    }

    if (event.key === 'Escape' && active === searchInput) {
      searchInput.blur();
    }
  });

  $$('[data-jump-filter]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      state.filter = element.dataset.jumpFilter;
      state.expandedId = null;
      updateFilterButtons();
      renderFeed();
      $('#archive')?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });
}

/* ══════════════════════════════════════════════════════
   Random spotlight
   ══════════════════════════════════════════════════════ */

function initSpotlight() {
  const spotlight = $('#spotlight');
  const panel = $('.spotlight-panel', spotlight);
  const image = $('#spotlight-img');
  const category = $('#spotlight-cat');
  const title = $('#spotlight-title');
  const description = $('#spotlight-desc');
  const tags = $('#spotlight-tags');
  const link = $('#spotlight-link');
  const another = $('#spotlight-another');
  const closeButton = $('.spotlight-close', spotlight);
  if (!spotlight || !panel || !image || !category || !title || !description || !tags || !link) return;

  let lastFocused = null;
  let currentSignal = null;

  const fill = (signal) => {
    currentSignal = signal;
    image.src = signal.screenshot || '';
    image.alt = `${signal.name} website preview`;
    category.textContent = `${signal.category} / ${signal.year}`;
    title.textContent = signal.name;
    description.textContent = signal.largerDescription || signal.fullDescription || signal.description;
    tags.innerHTML = (signal.tags || []).slice(0, 6)
      .map((tag) => `<span class="spotlight-tag">#${escapeHTML(tag)}</span>`)
      .join('');
    link.href = signal.url;
    link.setAttribute('aria-label', `Visit ${signal.name} in a new tab`);
  };

  const pickSignal = () => {
    const pool = getFilteredSignals();
    const candidates = pool.length ? pool : SIGNALS;
    if (candidates.length === 1) return candidates[0];

    let next = candidates[Math.floor(Math.random() * candidates.length)];
    let guard = 0;
    while (currentSignal && next.id === currentSignal.id && guard < 12) {
      next = candidates[Math.floor(Math.random() * candidates.length)];
      guard += 1;
    }
    return next;
  };

  const open = () => {
    const signal = pickSignal();
    if (!signal) return;

    fill(signal);
    lastFocused = document.activeElement;

    spotlight.classList.add('is-open');
    spotlight.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (!prefersReducedMotion) {
      gsap.fromTo(panel, { y: 28, scale: 0.97, opacity: 0 }, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.65,
        ease: 'expo.out'
      });
      gsap.fromTo($$('.spotlight-content > *', spotlight), { y: 16, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.045,
        delay: 0.08,
        ease: 'power2.out'
      });
    } else {
      gsap.set(panel, { clearProps: 'all' });
    }

    setTimeout(() => closeButton?.focus(), 80);
  };

  const close = () => {
    if (!spotlight.classList.contains('is-open')) return;

    const finish = () => {
      spotlight.classList.remove('is-open');
      spotlight.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      lastFocused?.focus?.();
    };

    if (prefersReducedMotion) {
      finish();
      return;
    }

    gsap.to(panel, {
      y: 16,
      scale: 0.98,
      opacity: 0,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: finish
    });
  };

  const shuffle = () => {
    const signal = pickSignal();
    if (!signal) return;

    if (prefersReducedMotion) {
      fill(signal);
      return;
    }

    const content = $$('.spotlight-content > *', spotlight);
    gsap.to(content, {
      opacity: 0,
      y: 8,
      duration: 0.2,
      stagger: 0.02,
      onComplete: () => {
        fill(signal);
        gsap.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.035,
          ease: 'power2.out'
        });
      }
    });
  };

  openRandomSignal = open;

  $$('[data-random], #random-btn').forEach((button) => {
    button.addEventListener('click', open);
  });

  $$('[data-close-spotlight]', spotlight).forEach((element) => {
    element.addEventListener('click', close);
  });

  another?.addEventListener('click', shuffle);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

/* ══════════════════════════════════════════════════════
   Footer + toast
   ══════════════════════════════════════════════════════ */

function initFooterLinks() {
  $('#back-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

function initBackToTop() {
  /* Reserved for future footer behaviour. */
}

function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('is-visible');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2200);
}
