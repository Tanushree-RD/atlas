import { SIGNALS, FILTER_CATEGORIES } from './signals-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // ── Typed Hero Animation ────────────────────────────
  const typed = document.querySelector('#typed-text');
  const words = ['OBSCURE', 'HIDDEN', 'WEIRD', 'UNSEEN', 'CURIOUS'];
  let word = 0;
  let position = words[0].length;
  let deleting = true;

  function typeLoop() {
    if (!typed) return;
    const current = words[word];
    if (deleting) {
      position -= 1;
      typed.textContent = current.slice(0, position);
      if (position === 0) {
        deleting = false;
        word = (word + 1) % words.length;
        setTimeout(typeLoop, 350);
        return;
      }
    } else {
      const next = words[word];
      position += 1;
      typed.textContent = next.slice(0, position);
      if (position === next.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
    }
    setTimeout(typeLoop, deleting ? 75 : 115);
  }
  setTimeout(typeLoop, 1900);

  // ── Mobile Menu ─────────────────────────────────────
  const menu = document.querySelector('.menu-toggle');
  menu?.addEventListener('click', () => {
    // No nav links on this simplified page — placeholder for future use
  });

  // ── Discovery: State ────────────────────────────────
  let activeFilter = 'all';
  let activeSort = 'recent';
  let searchQuery = '';

  // ── Discovery: Build Filters ────────────────────────
  const filterRow = document.getElementById('filter-row');
  const extendedCategories = [
    ...FILTER_CATEGORIES.slice(0, 1), // ALL
    { key: 'interactive', label: 'INTERACTIVE' },
    { key: 'portfolio', label: 'PORTFOLIO' },
    { key: 'ai', label: 'AI' },
    { key: 'tool', label: 'TOOLS' },
    { key: 'art', label: 'ART' },
    { key: 'game', label: 'GAMES' },
    { key: 'opensource', label: 'OPEN SOURCE' },
    { key: 'weird', label: 'WEIRD' },
    { key: 'retro', label: 'RETRO' },
    { key: 'experiment', label: 'EXPERIMENTAL' }
  ];

  extendedCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn${cat.key === 'all' ? ' active' : ''}`;
    btn.textContent = cat.label;
    btn.dataset.filter = cat.key;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', cat.key === 'all' ? 'true' : 'false');
    btn.addEventListener('click', () => {
      activeFilter = cat.key;
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderFeed();
    });
    filterRow.appendChild(btn);
  });

  // ── Discovery: Sort Buttons ─────────────────────────
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSort = btn.dataset.sort;
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFeed();
    });
  });

  // ── Discovery: Search ───────────────────────────────
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderFeed();
  });

  // ── Discovery: Random Button ────────────────────────
  document.getElementById('random-btn').addEventListener('click', () => {
    const randomSignal = SIGNALS[Math.floor(Math.random() * SIGNALS.length)];
    window.open(`signal.html?id=${randomSignal.id}`, '_self');
  });

  // ── Discovery: Render Feed ──────────────────────────
  const feedList = document.getElementById('feed-list');
  const feedEmpty = document.getElementById('feed-empty');

  function getFilteredSignals() {
    let filtered = [...SIGNALS];

    // Category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(s => {
        const cats = s.filterCategories || [];
        const mainCat = (s.category || '').toLowerCase();
        // Check filterCategories array and main category
        return cats.includes(activeFilter) || mainCat === activeFilter;
      });
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s => {
        const haystack = `${s.name} ${s.description} ${s.category} ${(s.tags || []).join(' ')}`.toLowerCase();
        return haystack.includes(searchQuery);
      });
    }

    // Sort
    if (activeSort === 'popular') {
      filtered.sort((a, b) => (b.metadata?.score || 0) - (a.metadata?.score || 0));
    } else if (activeSort === 'random') {
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
    }
    // 'recent' keeps original order (default)

    return filtered;
  }

  function renderFeed() {
    const signals = getFilteredSignals();
    feedList.innerHTML = '';

    if (signals.length === 0) {
      feedEmpty.style.display = '';
      return;
    }
    feedEmpty.style.display = 'none';

    signals.forEach((signal, i) => {
      const idx = String(i + 1).padStart(2, '0');
      const year = signal.year || '';
      const a = document.createElement('a');
      a.className = 'feed-item';
      a.href = `signal.html?id=${signal.id}`;
      a.setAttribute('role', 'listitem');
      a.innerHTML = `
        <span class="feed-item-index">${idx}</span>
        <div class="feed-item-info">
          <span class="feed-item-name">${signal.name}</span>
          <span class="feed-item-desc">${signal.description}</span>
        </div>
        <span class="feed-item-cat">${signal.category}</span>
        <span class="feed-item-year">${year}</span>
        <span class="feed-item-arrow">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M5 11L11 5M11 5H6M11 5V10"/>
          </svg>
        </span>
      `;
      feedList.appendChild(a);
    });
  }

  renderFeed();

  // ── Three.js Background ─────────────────────────────
  if (typeof THREE === 'undefined') return;
  const canvas = document.querySelector('#bg-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 1, 500);
  camera.position.z = 95;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.setSize(innerWidth, innerHeight);

  const count = 900;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const radius = 40 + Math.random() * 130;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 105;
    positions[i * 3 + 2] = Math.sin(angle) * radius - 30;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xef4444, size: 0.7, transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth - 0.5) * 2;
    mouse.y = (event.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    target.x += (mouse.x - target.x) * 0.025;
    target.y += (mouse.y - target.y) * 0.025;
    particles.rotation.y = elapsed * 0.018 + target.x * 0.08;
    particles.rotation.x = Math.sin(elapsed * 0.12) * 0.05 + target.y * 0.05;
    renderer.render(scene, camera);
  }
  animate();
});
