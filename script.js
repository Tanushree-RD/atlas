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

  // ── Luxury Animated Background ──────────────────────
  const canvas = document.querySelector('#bg-canvas');
  if (canvas) {
    let mouse = { x: 0.5, y: 0.45 };
    let targetMouse = { x: 0.5, y: 0.45 };
    let hasMoved = false;

    window.addEventListener('mousemove', (e) => {
      hasMoved = true;
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
      document.documentElement.style.setProperty('--spot-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--spot-y', `${e.clientY}px`);
    }, { passive: true });

    const gl = canvas.getContext('webgl', {
      antialias: true,
      alpha: false,
      powerPreference: 'low-power'
    });

    if (gl) {
      initWebGLBackground(gl, canvas, mouse, targetMouse, () => hasMoved);
    } else {
      init2DBackground(canvas, mouse, targetMouse, () => hasMoved);
    }
  }

  function initWebGLBackground(gl, canvas, mouse, targetMouse, getHasMoved) {
    const vsSource = `
      attribute vec2 a_pos;
      void main() {
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fsSource = `
      #ifdef GL_ES
      precision highp float;
      #endif
      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;

      void main() {
        vec2 st = gl_FragCoord.xy / u_res.xy;
        float aspect = u_res.x / u_res.y;
        vec2 p = st;
        p.x *= aspect;

        vec2 m = u_mouse;
        m.x *= aspect;

        // Extremely slow and premium breathing rate
        float t = u_time * 0.032;

        // Subtle organic dark silk wave distortion
        float w1 = sin(p.y * 1.8 + t * 0.75) * 0.055;
        float w2 = cos(p.x * 1.4 - t * 0.60) * 0.055;
        vec2 wp = p + vec2(w1, w2);

        // Drifting organic dark red / oxblood mesh centers
        vec2 c1 = vec2((0.32 + 0.16 * sin(t * 0.70)) * aspect, 0.68 + 0.12 * cos(t * 0.55));
        vec2 c2 = vec2((0.74 + 0.15 * cos(t * 0.50 + 1.4)) * aspect, 0.38 + 0.14 * sin(t * 0.65 + 0.8));
        vec2 c3 = vec2((0.48 + 0.18 * sin(t * 0.40 + 2.6)) * aspect, 0.80 + 0.10 * cos(t * 0.45 + 1.9));
        vec2 c4 = vec2((0.18 + 0.12 * cos(t * 0.60 + 3.2)) * aspect, 0.30 + 0.12 * sin(t * 0.35 + 2.2));

        // Broad, soft radial falloffs
        float d1 = length(wp - c1);
        float d2 = length(wp - c2);
        float d3 = length(wp - c3);
        float d4 = length(wp - c4);

        float m1 = smoothstep(1.15, 0.0, d1);
        float m2 = smoothstep(1.05, 0.0, d2);
        float m3 = smoothstep(0.90, 0.0, d3);
        float m4 = smoothstep(0.80, 0.0, d4);

        // Gentle spotlight tracking mouse
        float mDist = length(p - m);
        float spot = smoothstep(0.80, 0.0, mDist);

        // Color scheme: Almost black void with subtle deep wine / dark red highlights
        vec3 cVoid     = vec3(0.024, 0.024, 0.028); // #060608 deep obsidian
        vec3 cWine     = vec3(0.095, 0.010, 0.016); // subtle dark wine
        vec3 cGarnet   = vec3(0.145, 0.015, 0.025); // deep garnet
        vec3 cCrimson  = vec3(0.195, 0.022, 0.035); // dark ruby highlight
        vec3 cSpot     = vec3(0.085, 0.010, 0.015); // gentle cursor sheen

        // Composite mesh colors
        vec3 col = cVoid;
        col += cWine    * (m1 * 0.70);
        col += cGarnet  * (m2 * 0.60);
        col += cCrimson * (m3 * 0.45);
        col += cWine    * (m4 * 0.40);
        col += cSpot    * (spot * 0.40);

        // Very subtle contour depth
        float wave = sin((wp.x * 2.5 + wp.y * 3.0 + t) * 3.14159) * 0.5 + 0.5;
        col += cCrimson * (wave * 0.018);

        // Soft internal vignette
        vec2 vCoord = (st - 0.5) * vec2(aspect, 1.0);
        float vig = smoothstep(1.3, 0.35, length(vCoord));
        col *= (0.50 + 0.50 * vig);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      init2DBackground(canvas, mouse, targetMouse, getHasMoved);
      return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      init2DBackground(canvas, mouse, targetMouse, getHasMoved);
      return;
    }

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       3, -1,
      -1,  3
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_pos');
    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const startTime = performance.now();

    function render(now) {
      requestAnimationFrame(render);
      const elapsed = (now - startTime) * 0.001;

      if (!getHasMoved()) {
        targetMouse.x = 0.5 + 0.08 * Math.sin(elapsed * 0.4);
        targetMouse.y = 0.5 + 0.06 * Math.cos(elapsed * 0.35);
      }

      mouse.x += (targetMouse.x - mouse.x) * 0.03;
      mouse.y += (targetMouse.y - mouse.y) * 0.03;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    requestAnimationFrame(render);
  }

  function init2DBackground(canvas, mouse, targetMouse, getHasMoved) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const startTime = performance.now();
    function render(now) {
      requestAnimationFrame(render);
      const elapsed = (now - startTime) * 0.001;
      const t = elapsed * 0.032;
      const w = canvas.width;
      const h = canvas.height;

      if (!getHasMoved()) {
        targetMouse.x = 0.5 + 0.08 * Math.sin(elapsed * 0.4);
        targetMouse.y = 0.5 + 0.06 * Math.cos(elapsed * 0.35);
      }

      mouse.x += (targetMouse.x - mouse.x) * 0.03;
      mouse.y += (targetMouse.y - mouse.y) * 0.03;

      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, w, h);

      const x1 = (0.32 + 0.16 * Math.sin(t * 0.7)) * w;
      const y1 = (0.68 + 0.12 * Math.cos(t * 0.55)) * h;
      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, w * 0.55);
      g1.addColorStop(0, 'rgba(160, 20, 36, 0.28)');
      g1.addColorStop(1, 'rgba(6, 6, 8, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const x2 = (0.74 + 0.15 * Math.cos(t * 0.5 + 1.4)) * w;
      const y2 = (0.38 + 0.14 * Math.sin(t * 0.65 + 0.8)) * h;
      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, w * 0.5);
      g2.addColorStop(0, 'rgba(210, 28, 48, 0.22)');
      g2.addColorStop(1, 'rgba(6, 6, 8, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      const sx = mouse.x * w;
      const sy = (1.0 - mouse.y) * h;
      const gs = ctx.createRadialGradient(sx, sy, 0, sx, sy, 500);
      gs.addColorStop(0, 'rgba(239, 68, 68, 0.10)');
      gs.addColorStop(1, 'rgba(6, 6, 8, 0)');
      ctx.fillStyle = gs;
      ctx.fillRect(0, 0, w, h);
    }
    requestAnimationFrame(render);
  }
});
