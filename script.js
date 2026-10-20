import { SIGNALS, FILTER_CATEGORIES } from './signals-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // ── Typed Hero Animation ────────────────────────────
  const typed = document.querySelector('#typed-text');
  const words = ['Obscure', 'Hidden', 'Weird', 'Unseen', 'Curious'];
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

  // ── Discovery: Expandable Row Accordion State ───────
  let expandedSignalId = null;

  function toggleRow(signalId) {
    if (expandedSignalId === signalId) {
      collapseRow(signalId);
      expandedSignalId = null;
    } else {
      if (expandedSignalId) {
        collapseRow(expandedSignalId);
      }
      expandRow(signalId);
      expandedSignalId = signalId;
    }
  }

  function expandRow(signalId) {
    const row = document.querySelector(`.feed-row[data-id="${signalId}"]`);
    if (!row) return;
    row.classList.add('is-expanded');
    const btn = row.querySelector('.feed-row-header');
    btn?.setAttribute('aria-expanded', 'true');
  }

  function collapseRow(signalId) {
    const row = document.querySelector(`.feed-row[data-id="${signalId}"]`);
    if (!row) return;
    row.classList.remove('is-expanded');
    const btn = row.querySelector('.feed-row-header');
    btn?.setAttribute('aria-expanded', 'false');
  }

  // ── Discovery: Random Button ────────────────────────
  document.getElementById('random-btn').addEventListener('click', () => {
    const signals = getFilteredSignals();
    if (!signals.length) return;
    const randomSignal = signals[Math.floor(Math.random() * signals.length)];
    toggleRow(randomSignal.id);
    const row = document.querySelector(`.feed-row[data-id="${randomSignal.id}"]`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
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
      const isExpanded = signal.id === expandedSignalId;
      const largerDesc = signal.largerDescription || signal.fullDescription || signal.description;
      const whyPoints = (signal.whyVisit || (signal.bestFor ? signal.bestFor.slice(0, 3) : []));
      const tags = (signal.tags || []).slice(0, 4);

      const row = document.createElement('article');
      row.className = `feed-row${isExpanded ? ' is-expanded' : ''}`;
      row.dataset.id = signal.id;
      row.setAttribute('role', 'listitem');

      row.innerHTML = `
        <button class="feed-row-header" type="button" aria-expanded="${isExpanded ? 'true' : 'false'}" aria-controls="panel-${signal.id}" aria-label="Toggle details for ${signal.name}">
          <span class="feed-item-index">${idx}</span>
          <div class="feed-item-info">
            <span class="feed-item-name">${signal.name}</span>
            <span class="feed-item-desc">${signal.description}</span>
          </div>
          <span class="feed-item-cat">${signal.category}</span>
          <span class="feed-item-year">${year}</span>
          <span class="feed-item-toggle" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M4 6l4 4 4-4"/>
            </svg>
          </span>
        </button>

        <div class="feed-row-panel" id="panel-${signal.id}" role="region" aria-label="${signal.name} details">
          <div class="panel-inner">
            <div class="panel-grid">
              <div class="panel-media">
                <img class="panel-img" src="${signal.screenshot || ''}" alt="${signal.name} screenshot" loading="lazy">
                <span class="panel-reticle tl"></span>
                <span class="panel-reticle tr"></span>
                <span class="panel-reticle bl"></span>
                <span class="panel-reticle br"></span>
              </div>

              <div class="panel-content">
                <div class="panel-tags-row">
                  <span class="panel-cat-badge">${(signal.category || 'SIGNAL').toUpperCase()}</span>
                  ${tags.map(t => `<span class="panel-tag">${t.startsWith('#') ? t : '#' + t}</span>`).join('')}
                </div>

                <p class="panel-desc">${largerDesc}</p>

                <div class="panel-why">
                  <span class="panel-why-heading">WHY VISIT</span>
                  <ul class="panel-why-list">
                    ${whyPoints.map(p => `<li>${p}</li>`).join('')}
                  </ul>
                </div>

                <div class="panel-actions">
                  <a class="panel-visit-btn" href="${signal.url}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${signal.name} in new tab">
                    Visit Website <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Toggle inline accordion on header click
      const headerBtn = row.querySelector('.feed-row-header');
      headerBtn.addEventListener('click', () => {
        toggleRow(signal.id);
      });

      feedList.appendChild(row);
    });
  }

  renderFeed();

  // ── Animated Luxury Background (Silk / Flowing Contour Moiré) ──
  const canvas = document.querySelector('#bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Smooth subtle mouse parallax
    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / (width || 1) - 0.5) * 2;
      mouse.y = (e.clientY / (height || 1) - 0.5) * 2;
    }, { passive: true });

    // 32-second slow loop period
    const LOOP_PERIOD = 32;
    const startTime = performance.now();

    function render(now) {
      requestAnimationFrame(render);
      const elapsed = (now - startTime) / 1000;
      const t = (elapsed % LOOP_PERIOD) / LOOP_PERIOD * (Math.PI * 2);

      // Gentle mouse tracking lag
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.02;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.02;

      // Deep rich obsidian black base
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      // ── Layer 1: Flowing horizontal silk wave contours ──
      const lineCount1 = 18;
      const stepY = (height + 160) / lineCount1;
      ctx.lineWidth = 0.85;

      for (let i = 0; i < lineCount1; i++) {
        const baseY = -80 + i * stepY;
        const phase = (i / lineCount1) * Math.PI * 2;

        // Faint silk opacities: 0.016 to 0.032 (extremely subtle, almost invisible)
        // Single subtle red signature thread
        const isAccent = (i === 6);
        if (isAccent) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.026)';
        } else {
          ctx.strokeStyle = `rgba(245, 245, 247, ${0.016 + (i % 3) * 0.005})`;
        }

        ctx.beginPath();
        const segments = 36;
        const dx = width / segments;

        for (let s = 0; s <= segments; s++) {
          const x = s * dx;
          // Dual harmonic slow wave distortion (20-40s loop)
          const wave1 = Math.sin(x * 0.0015 + t + phase) * 26;
          const wave2 = Math.cos(x * 0.003 - t * 0.7 + phase * 1.4) * 13;
          const mouseDisplace = (Math.sin(x * 0.002 + t) * smoothMouse.y * 10) + (smoothMouse.x * 5);
          const y = baseY + wave1 + wave2 + mouseDisplace;

          if (s === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // ── Layer 2: Angled shear contour lines (subtle moiré pattern) ──
      const lineCount2 = 14;
      const stepX = (width + 300) / lineCount2;

      for (let j = 0; j < lineCount2; j++) {
        const baseX = -150 + j * stepX;
        const phase2 = (j / lineCount2) * Math.PI * 2;

        ctx.strokeStyle = 'rgba(245, 245, 247, 0.014)';
        ctx.beginPath();

        const segmentsY = 28;
        const dy = height / segmentsY;

        for (let s = 0; s <= segmentsY; s++) {
          const y = s * dy;
          const waveX1 = Math.sin(y * 0.0018 - t * 0.8 + phase2) * 30;
          const waveX2 = Math.cos(y * 0.0035 + t * 0.6 + phase2 * 1.2) * 15;
          const shearX = (y / (height || 1)) * 70;
          const x = baseX + waveX1 + waveX2 + shearX + (smoothMouse.x * 8);

          if (s === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    }

    requestAnimationFrame(render);
  }
});
