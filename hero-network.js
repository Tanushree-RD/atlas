/**
 * The hero's topological dot field.
 * Magnetic pointer distortion + a slow radar sweep, drawn on a 2D canvas.
 */
export function initHeroNetwork() {
  const canvas = document.getElementById('halftone-canvas');
  if (!canvas) return;

  const wrap = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;

  motionQuery.addEventListener('change', (event) => {
    prefersReducedMotion = event.matches;
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
    spacing: 32,
    baseRadius: 1.25,
    maxDisplacement: 16,
    influenceRadius: 160,
    spring: 0.068,
    damping: 0.83,
    whiteBase: 'rgba(244, 242, 237, 0.15)',
    redBase: 'rgba(255, 75, 62, 0.28)',
    wavePeriod: 6.5,
    waveWidth: 140,
    waveAngle: 0.55
  };

  function createNetwork() {
    nodes = [];

    /* Layer 0 — deep, slower, subtle */
    const bgSpacing = 48;
    const bgCols = Math.ceil(width / bgSpacing) + 2;
    const bgRows = Math.ceil(height / (bgSpacing * 0.866)) + 2;
    const bgStartX = (width - (bgCols - 1) * bgSpacing) / 2;
    const bgStartY = (height - (bgRows - 1) * (bgSpacing * 0.866)) / 2;

    for (let r = 0; r < bgRows; r++) {
      const isOffset = r % 2 === 1;
      const y = bgStartY + r * (bgSpacing * 0.866);

      for (let c = 0; c < bgCols; c++) {
        const x = bgStartX + c * bgSpacing + (isOffset ? bgSpacing * 0.5 : 0);

        nodes.push({
          layer: 0,
          depth: 0.42,
          glyph: (c + r * 3) % 4 === 0 ? 'cross' : 'dot',
          ox: x,
          oy: y,
          x,
          y,
          dx: 0,
          dy: 0,
          vx: 0,
          vy: 0,
          targetDx: 0,
          targetDy: 0,
          baseRadius: 0.85,
          scale: 1,
          targetScale: 1,
          isRed: (c * 5 + r * 7) % 7 === 0,
          scanIntensity: 0,
          active: false
        });
      }
    }

    /* Layer 1 — foreground grid */
    const fgSpacing = CONFIG.spacing;
    const rowHeight = fgSpacing * 0.866;
    const extraPad = 30;
    const cols = Math.ceil((width + extraPad * 2) / fgSpacing) + 2;
    const rows = Math.ceil((height + extraPad * 2) / rowHeight) + 2;
    const startX =
      -extraPad + (width + extraPad * 2 - (cols - 1) * fgSpacing) / 2;
    const startY =
      -extraPad + (height + extraPad * 2 - (rows - 1) * rowHeight) / 2;

    for (let r = 0; r < rows; r++) {
      const isOffset = r % 2 === 1;
      const y = startY + r * rowHeight;

      for (let c = 0; c < cols; c++) {
        const jitterX = ((c * 17 + r * 23) % 7 - 3) * 0.4;
        const jitterY = ((c * 19 + r * 13) % 7 - 3) * 0.4;
        const x =
          startX + c * fgSpacing + (isOffset ? fgSpacing * 0.5 : 0) + jitterX;
        const actualY = y + jitterY;

        const hash = (c * 7 + r * 13 + (c % 3) * 5) % 100;
        let glyph = 'dot';
        if (hash > 88) glyph = 'square';
        else if (hash > 70) glyph = 'cross';
        else if (hash > 50) glyph = 'hollow';

        nodes.push({
          layer: 1,
          depth: 1,
          glyph,
          ox: x,
          oy: actualY,
          x,
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
          isRed: (c * 3 + r * 7) % 6 === 0,
          scanIntensity: 0,
          active: false
        });
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

  window.addEventListener(
    'pointermove',
    (event) => updatePointer(event.clientX, event.clientY, true),
    { passive: true }
  );

  window.addEventListener(
    'pointerleave',
    () => updatePointer(0, 0, false),
    { passive: true }
  );

  window.addEventListener(
    'touchmove',
    (event) => {
      if (event.touches.length > 0) {
        updatePointer(event.touches[0].clientX, event.touches[0].clientY, true);
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'touchend',
    () => updatePointer(0, 0, false),
    { passive: true }
  );

  window.addEventListener('resize', resize, { passive: true });
  resize();

  const heroSection = document.querySelector('.hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !prefersReducedMotion && !animationFrameId) {
          startAnimation();
        }
      },
      { threshold: 0.05 }
    );
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

      const proj = d.ox * cosA + d.oy * sinA;
      const distToWave = Math.abs(proj - wavePos);
      d.scanIntensity =
        distToWave < waveWidth
          ? (1 - distToWave / waveWidth) ** 2 * 0.35
          : 0;

      if (mouse.active) {
        const dx = d.ox - mouse.x;
        const dy = d.oy - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < rInfl && dist > 0.001) {
          const t = 1 - dist / rInfl;
          const magneticForce = Math.sin(t * Math.PI);
          const angle = Math.atan2(dy, dx);

          const fRadial = magneticForce * maxDisp * d.depth;
          const fCurl = magneticForce * 5 * d.depth;

          d.targetDx =
            Math.cos(angle) * fRadial - Math.sin(angle) * fCurl;
          d.targetDy =
            Math.sin(angle) * fRadial + Math.cos(angle) * fCurl;
          d.targetScale = 1 + t * 0.4 * d.depth;
          d.active = true;
        } else {
          d.targetDx = 0;
          d.targetDy = 0;
          d.targetScale = 1;
        }
      } else {
        d.targetDx = 0;
        d.targetDy = 0;
        d.targetScale = 1;
      }

      if (!d.active && d.targetDx === 0) continue;

      const ax = (d.targetDx - d.dx) * CONFIG.spring;
      const ay = (d.targetDy - d.dy) * CONFIG.spring;

      d.vx = (d.vx + ax) * CONFIG.damping;
      d.vy = (d.vy + ay) * CONFIG.damping;

      d.dx += d.vx;
      d.dy += d.vy;

      d.scale += (d.targetScale - d.scale) * 0.1;

      if (d.targetDx === 0 && Math.abs(d.dx) < 0.015 && Math.abs(d.vx) < 0.001) {
        d.dx = 0;
        d.vx = 0;
      }
      if (d.targetDy === 0 && Math.abs(d.dy) < 0.015 && Math.abs(d.vy) < 0.001) {
        d.dy = 0;
        d.vy = 0;
      }
      if (d.targetScale === 1 && Math.abs(d.scale - 1) < 0.005) {
        d.scale = 1;
      }

      d.x = d.ox + d.dx;
      d.y = d.oy + d.dy;

      if (
        d.targetDx === 0 &&
        d.dx === 0 &&
        d.vx === 0 &&
        d.dy === 0 &&
        d.vy === 0 &&
        d.scale === 1
      ) {
        d.active = false;
      }
    }
  }

  function render(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    /* Solid white dots */
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

    /* Solid red dots */
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

    /* Hollow dots */
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

    /* Crosses */
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

    /* Squares */
    ctx.beginPath();
    for (let i = 0; i < nodes.length; i++) {
      const d = nodes[i];
      if (d.glyph !== 'square') continue;
      const s = 1.4 * d.scale;
      ctx.rect(d.x - s, d.y - s, s * 2, s * 2);
    }
    ctx.fillStyle = CONFIG.whiteBase;
    ctx.fill();

    /* Illumination sheen */
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

    /* Elliptical fade mask */
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
    radialMask.addColorStop(1, 'rgba(0, 0, 0, 0)');

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
