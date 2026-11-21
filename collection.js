import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SIGNALS } from './signals-data.js';

gsap.registerPlugin(ScrollTrigger);

const COLLECTIONS = {
  '100-websites': {
    title: '100 Websites Everyone Should Visit',
    count: '100 sites',
    desc: 'Essential internet experiences',
    note: 'A preserved index of foundational landmarks, creative breakthroughs, and interactive milestones across thirty years of the open web.',
    ids: ['SIG-001', 'SIG-002', 'SIG-003', 'SIG-004', 'SIG-005', 'SIG-006', 'SIG-007']
  },
  'beautiful-portfolios': {
    title: 'Beautiful Portfolios',
    count: '42 sites',
    desc: 'Exceptional personal websites',
    note: 'Inspiring personal websites, bespoke digital residences, and innovative interaction design crafted by independent designers and developers.',
    ids: ['SIG-003', 'SIG-001', 'SIG-004', 'SIG-009']
  },
  'browser-experiments': {
    title: 'Browser Experiments',
    count: '31 sites',
    desc: 'Interactive web experiments',
    note: 'Projects pushing the raw technical boundaries of WebGL, audio synthesis, shaders, and browser hardware APIs.',
    ids: ['SIG-005', 'SIG-002', 'SIG-007', 'SIG-006']
  },
  'the-weird-internet': {
    title: 'The Weird Internet',
    count: '56 sites',
    desc: 'Strange, surprising, unforgettable',
    note: 'The idiosyncratic, bizarre, and charmingly uncommercial corners of the web that remind us why the internet was invented.',
    ids: ['SIG-006', 'SIG-005', 'SIG-004', 'SIG-008']
  },
  'digital-museums': {
    title: 'Digital Museums',
    count: '18 sites',
    desc: 'Museums, archives and history',
    note: 'Digital archives preserving net history, forgotten ephemera, tactile simulations, and artistic legacies.',
    ids: ['SIG-008', 'SIG-002', 'SIG-004', 'SIG-001']
  },
  'hidden-gems': {
    title: 'Hidden Gems',
    count: '73 sites',
    desc: 'Underrated websites worth exploring',
    note: 'Overlooked discoveries, secret tools, and quiet creations off the beaten track of search engine algorithms.',
    ids: ['SIG-007', 'SIG-003', 'SIG-006', 'SIG-009']
  }
};

const ORDER = [
  'the-weird-internet',
  '100-websites',
  'beautiful-portfolios',
  'hidden-gems',
  'browser-experiments',
  'digital-museums'
];

const $ = (selector) => document.querySelector(selector);

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatTitle(title) {
  const words = title.split(' ');
  const last = words.pop();
  return `${escapeHTML(words.join(' '))} <em>${escapeHTML(last)}</em>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  const key = COLLECTIONS[requestedId] ? requestedId : 'the-weird-internet';
  const data = COLLECTIONS[key];

  if (requestedId !== key) {
    const nextUrl = `${window.location.pathname}?id=${key}`;
    window.history.replaceState({}, '', nextUrl);
  }

  const signals = data.ids
    .map((id) => SIGNALS.find((signal) => signal.id === id))
    .filter(Boolean);

  const siteCount = (data.count.match(/\d+/) || [signals.length])[0];

  document.title = `ATLAS / ${data.title}`;
  $('#breadcrumb-col').textContent = data.title;
  $('#col-title').innerHTML = formatTitle(data.title);
  $('#col-count').textContent = data.count;
  $('#col-desc').textContent = data.desc;
  $('#col-note').textContent = data.note;
  $('#col-shown').textContent = pad(signals.length);
  $('#col-grid-count').innerHTML = `Showing <b>${pad(signals.length)}</b> of ${escapeHTML(siteCount)} curated signals`;

  const grid = $('#exhibit-grid');
  grid.innerHTML = signals.map((signal, index) => `
    <a class="exhibit-card" href="signal.html?id=${encodeURIComponent(signal.id)}">
      <div class="exhibit-media">
        <img src="${escapeHTML(signal.screenshot || '')}" alt="${escapeHTML(signal.name)} website preview" loading="lazy">
        <span class="exhibit-index">${pad(index + 1)}</span>
        <span class="exhibit-cat">${escapeHTML(signal.category)}</span>
        <span class="exhibit-arrow" aria-hidden="true">↗</span>
      </div>
      <div class="exhibit-body">
        <div class="exhibit-head">
          <h3>${escapeHTML(signal.name)}</h3>
          <span class="exhibit-year">${escapeHTML(signal.year || '')}</span>
        </div>
        <p class="exhibit-desc">${escapeHTML(signal.description)}</p>
        <div class="exhibit-foot">
          <span>Open dossier</span>
          <b>${escapeHTML(signal.metadata?.score ?? '—')} / 100</b>
        </div>
      </div>
    </a>
  `).join('');

  const position = ORDER.indexOf(key);
  const previousKey = ORDER[(position - 1 + ORDER.length) % ORDER.length];
  const nextKey = ORDER[(position + 1) % ORDER.length];
  const previous = COLLECTIONS[previousKey];
  const next = COLLECTIONS[nextKey];

  $('#collection-nav').innerHTML = `
    <a class="collection-nav-link" href="collection.html?id=${encodeURIComponent(previousKey)}">
      <span class="nav-arrow" aria-hidden="true">←</span>
      <span class="collection-nav-text">
        <span>Previous collection</span>
        <strong>${escapeHTML(previous.title)}</strong>
      </span>
    </a>
    <a class="collection-nav-link" href="collection.html?id=${encodeURIComponent(nextKey)}">
      <span class="collection-nav-text">
        <span>Next collection</span>
        <strong>${escapeHTML(next.title)}</strong>
      </span>
      <span class="nav-arrow" aria-hidden="true">→</span>
    </a>
  `;

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from(grid.querySelectorAll('.exhibit-card'), {
      y: 26,
      opacity: 0,
      duration: 0.8,
      stagger: 0.06,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 92%',
        once: true
      }
    });

    gsap.from('#collection-nav', {
      y: 22,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '#collection-nav',
        start: 'top 94%',
        once: true
      }
    });
  }
});
