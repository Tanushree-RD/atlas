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

        // Drifting organic dark red / oxblood mesh centers positioned toward flanks
        vec2 c1 = vec2((0.18 + 0.10 * sin(t * 0.70)) * aspect, 0.78 + 0.08 * cos(t * 0.55));
        vec2 c2 = vec2((0.84 + 0.10 * cos(t * 0.50 + 1.4)) * aspect, 0.28 + 0.08 * sin(t * 0.65 + 0.8));
        vec2 c3 = vec2((0.78 + 0.10 * sin(t * 0.40 + 2.6)) * aspect, 0.82 + 0.08 * cos(t * 0.45 + 1.9));
        vec2 c4 = vec2((0.14 + 0.08 * cos(t * 0.60 + 3.2)) * aspect, 0.22 + 0.08 * sin(t * 0.35 + 2.2));

        // Broad, soft radial falloffs with ~50% reduced spread and intensity
        float d1 = length(wp - c1);
        float d2 = length(wp - c2);
        float d3 = length(wp - c3);
        float d4 = length(wp - c4);

        float m1 = smoothstep(0.62, 0.0, d1);
        float m2 = smoothstep(0.56, 0.0, d2);
        float m3 = smoothstep(0.48, 0.0, d3);
        float m4 = smoothstep(0.42, 0.0, d4);

        // Gentle spotlight tracking mouse
        float mDist = length(p - m);
        float spot = smoothstep(0.52, 0.0, mDist);

        // Color scheme: Mostly deep obsidian void with very subtle dark wine / red ambient tint
        vec3 cVoid     = vec3(0.016, 0.016, 0.020); // deep obsidian black
        vec3 cWine     = vec3(0.048, 0.005, 0.008); // subtle dark wine (reduced ~50%)
        vec3 cGarnet   = vec3(0.072, 0.008, 0.012); // deep garnet (reduced ~50%)
        vec3 cCrimson  = vec3(0.098, 0.011, 0.018); // dark ruby tint (reduced ~50%)
        vec3 cSpot     = vec3(0.040, 0.005, 0.008); // subtle cursor sheen

        // Composite mesh colors with reduced intensity
        vec3 col = cVoid;
        col += cWine    * (m1 * 0.42);
        col += cGarnet  * (m2 * 0.36);
        col += cCrimson * (m3 * 0.26);
        col += cWine    * (m4 * 0.22);
        col += cSpot    * (spot * 0.22);

        // Very subtle contour depth
        float wave = sin((wp.x * 2.5 + wp.y * 3.0 + t) * 3.14159) * 0.5 + 0.5;
        col += cCrimson * (wave * 0.008);

        // Soft internal vignette keeping center mostly black
        vec2 vCoord = (st - 0.5) * vec2(aspect, 1.0);
        float vig = smoothstep(1.2, 0.25, length(vCoord));
        col *= (0.60 + 0.40 * vig);

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
      -1, 3
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

      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, w, h);

      const x1 = (0.20 + 0.10 * Math.sin(t * 0.7)) * w;
      const y1 = (0.78 + 0.08 * Math.cos(t * 0.55)) * h;
      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, w * 0.32);
      g1.addColorStop(0, 'rgba(120, 15, 22, 0.13)');
      g1.addColorStop(1, 'rgba(5, 5, 7, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const x2 = (0.84 + 0.10 * Math.cos(t * 0.5 + 1.4)) * w;
      const y2 = (0.30 + 0.08 * Math.sin(t * 0.65 + 0.8)) * h;
      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, w * 0.28);
      g2.addColorStop(0, 'rgba(150, 18, 28, 0.10)');
      g2.addColorStop(1, 'rgba(5, 5, 7, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      const sx = mouse.x * w;
      const sy = (1.0 - mouse.y) * h;
      const gs = ctx.createRadialGradient(sx, sy, 0, sx, sy, 300);
      gs.addColorStop(0, 'rgba(180, 22, 32, 0.05)');
      gs.addColorStop(1, 'rgba(5, 5, 7, 0)');
      ctx.fillStyle = gs;
      ctx.fillRect(0, 0, w, h);
    }
    requestAnimationFrame(render);
  }

  // ── Topological Information Network ──────────────────
  initInformationNetwork();

  function initInformationNetwork() {
    const canvas = document.getElementById('halftone-canvas');
    if (!canvas) return;

    const wrap = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    motionQuery.addEventListener('change', (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        resetNodes();
        render(performance.now());
      } else {
        startAnimation();
      }
    });

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let isVisible = true;
    let animationFrameId = null;

    const mouse = { x: -9999, y: -9999, active: false };
    const targetMouse = { x: -9999, y: -9999, active: false };

    const CONFIG = {
      // Primary layer
      spacing: 32,
      baseRadius: 1.25,
      maxDisplacement: 16,
      influenceRadius: 160,
      spring: 0.068,
      damping: 0.83,
      // Colors - slightly lowered opacity for crisp typographic contrast
      whiteBase: 'rgba(240, 242, 246, 0.14)',
      whiteActive: 'rgba(255, 255, 255, 0.30)',
      redBase: 'rgba(175, 26, 38, 0.20)',
      redActive: 'rgba(205, 36, 48, 0.36)',
      // Radar wave parameters
      wavePeriod: 6.5,     // sweeps every 6.5 seconds
      waveWidth: 140,      // pulse width in px
      waveAngle: 0.55      // ~31.5 degrees diagonal sweep
    };

    function createNetwork() {
      nodes = [];

      // ── Layer 0: Background Deep Layer (depth: 0.42, slower, subtle) ──
      const bgSpacing = 48;
      const bgCols = Math.ceil(width / bgSpacing) + 2;
      const bgRows = Math.ceil(height / (bgSpacing * 0.866)) + 2;
      const bgStartX = (width - (bgCols - 1) * bgSpacing) / 2;
      const bgStartY = (height - (bgRows - 1) * (bgSpacing * 0.866)) / 2;

      for (let r = 0; r < bgRows; r++) {
        const isOffset = (r % 2 === 1);
        const y = bgStartY + r * (bgSpacing * 0.866);

        for (let c = 0; c < bgCols; c++) {
          const x = bgStartX + c * bgSpacing + (isOffset ? bgSpacing * 0.5 : 0);

          // Background glyph types: micro-dots and micro-crosses
          const glyphType = ((c + r * 3) % 4 === 0) ? 'cross' : 'dot';
          const isRed = ((c * 5 + r * 7) % 7 === 0);

          nodes.push({
            layer: 0,
            depth: 0.42,
            glyph: glyphType,
            ox: x,
            oy: y,
            x: x,
            y: y,
            dx: 0,
            dy: 0,
            vx: 0,
            vy: 0,
            targetDx: 0,
            targetDy: 0,
            baseRadius: 0.85,
            scale: 1,
            targetScale: 1,
            isRed: isRed,
            scanIntensity: 0,
            active: false
          });
        }
      }

      // ── Layer 1: Foreground Topological Network (depth: 1.0) ──
      const fgSpacing = CONFIG.spacing;
      const rowHeight = fgSpacing * 0.866;
      const extraPad = 30;
      const cols = Math.ceil((width + extraPad * 2) / fgSpacing) + 2;
      const rows = Math.ceil((height + extraPad * 2) / rowHeight) + 2;
      const startX = -extraPad + (width + extraPad * 2 - (cols - 1) * fgSpacing) / 2;
      const startY = -extraPad + (height + extraPad * 2 - (rows - 1) * rowHeight) / 2;

      const grid2D = [];

      for (let r = 0; r < rows; r++) {
        grid2D[r] = [];
        const isOffset = (r % 2 === 1);
        const y = startY + r * rowHeight;

        for (let c = 0; c < cols; c++) {
          // Subtle organic coordinate jitter (+- 1.5px) for authentic topological telemetry
          const jitterX = ((c * 17 + r * 23) % 7 - 3) * 0.4;
          const jitterY = ((c * 19 + r * 13) % 7 - 3) * 0.4;
          const x = startX + c * fgSpacing + (isOffset ? fgSpacing * 0.5 : 0) + jitterX;
          const actualY = y + jitterY;

          // Glyph distribution:
          // 0: solid dot (50%), 1: hollow dot (20%), 2: tiny cross (18%), 3: tiny square (12%)
          const hash = (c * 7 + r * 13 + (c % 3) * 5) % 100;
          let glyphType = 'dot';
          if (hash > 88) glyphType = 'square';
          else if (hash > 70) glyphType = 'cross';
          else if (hash > 50) glyphType = 'hollow';

          const isRed = ((c * 3 + r * 7) % 6 === 0);

          const node = {
            layer: 1,
            depth: 1.0,
            glyph: glyphType,
            ox: x,
            oy: actualY,
            x: x,
            y: actualY,
            dx: 0,
            dy: 0,
            vx: 0,
            vy: 0,
            targetDx: 0,
            targetDy: 0,
            baseRadius: CONFIG.baseRadius,
            scale: 1,
            targetScale: 1,
            isRed: isRed,
            scanIntensity: 0,
            active: false
          };

          nodes.push(node);
          grid2D[r][c] = node;
        }
      }

    }

    function resize() {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      createNetwork();

      if (prefersReducedMotion) {
        render(performance.now());
      }
    }

    function resetNodes() {
      for (let i = 0; i < nodes.length; i++) {
        const d = nodes[i];
        d.dx = 0;
        d.dy = 0;
        d.vx = 0;
        d.vy = 0;
        d.targetDx = 0;
        d.targetDy = 0;
        d.scale = 1;
        d.targetScale = 1;
        d.x = d.ox;
        d.y = d.oy;
        d.active = false;
        d.scanIntensity = 0;
      }
    }

    // Pointer tracking across the hero
    function updatePointer(clientX, clientY, active) {
      if (!active) {
        targetMouse.active = false;
        return;
      }
      const rect = canvas.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        targetMouse.x = clientX - rect.left;
        targetMouse.y = clientY - rect.top;
        if (!targetMouse.active) {
          mouse.x = targetMouse.x;
          mouse.y = targetMouse.y;
        }
        targetMouse.active = true;
      } else {
        targetMouse.active = false;
      }
    }

    window.addEventListener('mousemove', (e) => {
      updatePointer(e.clientX, e.clientY, true);
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      updatePointer(0, 0, false);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      updatePointer(0, 0, false);
    }, { passive: true });

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // IntersectionObserver to pause loop when scrolled out of view
    const heroSection = document.querySelector('.hero');
    if (heroSection && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !prefersReducedMotion && !animationFrameId) {
          startAnimation();
        }
      }, { threshold: 0.05 });
      observer.observe(heroSection);
    }

    function updatePhysics(now) {
      if (targetMouse.active) {
        mouse.x += (targetMouse.x - mouse.x) * 0.18;
        mouse.y += (targetMouse.y - mouse.y) * 0.18;
        mouse.active = true;
      } else {
        mouse.active = false;
      }

      // Radar scan wave calculation
      const elapsed = now * 0.001;
      const cosA = Math.cos(CONFIG.waveAngle);
      const sinA = Math.sin(CONFIG.waveAngle);
      const maxProj = width * cosA + height * sinA;
      const wavePhase = (elapsed % CONFIG.wavePeriod) / CONFIG.wavePeriod;
      const wavePos = wavePhase * (maxProj + 300) - 150;
      const waveWidth = CONFIG.waveWidth;

      const maxDisp = CONFIG.maxDisplacement;
      const rInfl = CONFIG.influenceRadius;

      for (let i = 0; i < nodes.length; i++) {
        const d = nodes[i];

        // 1. Radar wave illumination
        const proj = d.ox * cosA + d.oy * sinA;
        const distToWave = Math.abs(proj - wavePos);
        if (distToWave < waveWidth) {
          const wFactor = 1 - distToWave / waveWidth;
          d.scanIntensity = wFactor * wFactor * 0.35;
        } else {
          d.scanIntensity = 0;
        }

        // 2. Magnetic cursor distortion
        if (mouse.active) {
          const dx = d.ox - mouse.x;
          const dy = d.oy - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < rInfl && dist > 0.001) {
            const t = 1 - (dist / rInfl);
            // Magnetic flux bell-curve (peaks mid-field, smooth dipoles)
            const magneticForce = Math.sin(t * Math.PI);
            const angle = Math.atan2(dy, dx);

            // Dipole displacement + subtle curl vortex
            const fRadial = magneticForce * maxDisp * d.depth;
            const fCurl = magneticForce * 5 * d.depth;

            d.targetDx = Math.cos(angle) * fRadial - Math.sin(angle) * fCurl;
            d.targetDy = Math.sin(angle) * fRadial + Math.cos(angle) * fCurl;
            d.targetScale = 1.0 + t * 0.40 * d.depth;
            d.active = true;
          } else {
            d.targetDx = 0;
            d.targetDy = 0;
            d.targetScale = 1.0;
          }
        } else {
          d.targetDx = 0;
          d.targetDy = 0;
          d.targetScale = 1.0;
        }

        // Fast bail-out for resting nodes
        if (!d.active && d.targetDx === 0) continue;

        // Damped harmonic spring physics
        const ax = (d.targetDx - d.dx) * CONFIG.spring;
        const ay = (d.targetDy - d.dy) * CONFIG.spring;

        d.vx = (d.vx + ax) * CONFIG.damping;
        d.vy = (d.vy + ay) * CONFIG.damping;

        d.dx += d.vx;
        d.dy += d.vy;

        d.scale += (d.targetScale - d.scale) * 0.10;

        // Threshold settling to prevent idle CPU cycles
        if (d.targetDx === 0 && Math.abs(d.dx) < 0.015 && Math.abs(d.vx) < 0.001) {
          d.dx = 0;
          d.vx = 0;
        }
        if (d.targetDy === 0 && Math.abs(d.dy) < 0.015 && Math.abs(d.vy) < 0.001) {
          d.dy = 0;
          d.vy = 0;
        }
        if (d.targetScale === 1.0 && Math.abs(d.scale - 1.0) < 0.005) {
          d.scale = 1.0;
        }

        d.x = d.ox + d.dx;
        d.y = d.oy + d.dy;

        if (d.targetDx === 0 && d.dx === 0 && d.vx === 0 && d.dy === 0 && d.vy === 0 && d.scale === 1.0) {
          d.active = false;
        }
      }
    }

    function render(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);



      // ── 2. Batch Solid Dots (Layer 0 & 1) ──
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const d = nodes[i];
        if (d.glyph !== 'dot' || d.isRed) continue;
        const r = d.baseRadius * d.scale;
        ctx.moveTo(d.x + r, d.y);
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      }
      ctx.fillStyle = CONFIG.whiteBase;
      ctx.fill();

      // Solid Red Dots
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const d = nodes[i];
        if (d.glyph !== 'dot' || !d.isRed) continue;
        const r = d.baseRadius * d.scale;
        ctx.moveTo(d.x + r, d.y);
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      }
      ctx.fillStyle = CONFIG.redBase;
      ctx.fill();

      // ── 3. Batch Hollow Dots (Stroked Circles) ──
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const d = nodes[i];
        if (d.glyph !== 'hollow') continue;
        const r = (d.baseRadius + 0.3) * d.scale;
        ctx.moveTo(d.x + r, d.y);
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      }
      ctx.strokeStyle = CONFIG.whiteBase;
      ctx.stroke();

      // ── 4. Batch Tiny Crosses (+) ──
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const d = nodes[i];
        if (d.glyph !== 'cross') continue;
        const s = 2.4 * d.scale;
        ctx.moveTo(d.x - s, d.y);
        ctx.lineTo(d.x + s, d.y);
        ctx.moveTo(d.x, d.y - s);
        ctx.lineTo(d.x, d.y + s);
      }
      ctx.strokeStyle = CONFIG.whiteBase;
      ctx.stroke();

      // ── 5. Batch Tiny Squares ──
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const d = nodes[i];
        if (d.glyph !== 'square') continue;
        const s = 1.4 * d.scale;
        ctx.rect(d.x - s, d.y - s, s * 2, s * 2);
      }
      ctx.fillStyle = CONFIG.whiteBase;
      ctx.fill();

      // ── 6. Scan Wave & Magnetic Illumination Sheen ──
      let hasIlluminated = false;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].scanIntensity > 0.05 || (nodes[i].active && nodes[i].scale > 1.05)) {
          hasIlluminated = true;
          break;
        }
      }
      if (hasIlluminated) {
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
          const d = nodes[i];
          if (d.scanIntensity > 0.05 || (d.active && d.scale > 1.05)) {
            const r = (d.baseRadius + 0.4) * d.scale;
            ctx.moveTo(d.x + r, d.y);
            ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
          }
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
        ctx.fill();
      }

      // ── 7. Elliptical Radial Opacity Mask ──
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const maskRadius = width * 0.58;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1, height / width);

      const radialMask = ctx.createRadialGradient(0, 0, 0, 0, 0, maskRadius);
      radialMask.addColorStop(0, 'rgba(0, 0, 0, 1)');
      radialMask.addColorStop(0.48, 'rgba(0, 0, 0, 0.96)');
      radialMask.addColorStop(0.72, 'rgba(0, 0, 0, 0.65)');
      radialMask.addColorStop(0.88, 'rgba(0, 0, 0, 0.22)');
      radialMask.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = radialMask;
      ctx.beginPath();
      ctx.arc(0, 0, maskRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();
    }

    function animate(now) {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      if (prefersReducedMotion) {
        render(now);
        animationFrameId = null;
        return;
      }

      updatePhysics(now);
      render(now);
      animationFrameId = requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    startAnimation();
  }
});
