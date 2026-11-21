import * as THREE from 'three';
import gsap from 'gsap';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Full-screen WebGL atmosphere.
 * A domain-warped ember fog + a drifting particle field, both following the pointer.
 */
export function initThreeBackground(canvas) {
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
  } catch (error) {
    canvas.style.display = 'none';
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x050507, 1);
  renderer.autoClear = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    58,
    window.innerWidth / window.innerHeight,
    0.1,
    80
  );
  camera.position.set(0, 0, 7);

  /* ── Backdrop plane ─────────────────────────────────── */
  const bgScene = new THREE.Scene();
  const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const bgUniforms = {
    uTime: { value: 0 },
    uRes: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uScroll: { value: 0 }
  };

  const bgMaterial = new THREE.ShaderMaterial({
    uniforms: bgUniforms,
    depthTest: false,
    depthWrite: false,
    vertexShader: /* glsl */ `
      void main() {
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;

      uniform vec2 uRes;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uScroll;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.02;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uRes.xy;
        float aspect = uRes.x / uRes.y;
        vec2 p = uv - 0.5;
        p.x *= aspect;

        float t = uTime * 0.045;

        vec2 mp = uPointer - 0.5;
        mp.x *= aspect;

        // Domain-warped ember fog
        vec2 q = vec2(
          fbm(p * 1.6 + vec2(t, -t * 0.7)),
          fbm(p * 1.6 + vec2(5.2, 1.3) - t)
        );
        float fog = fbm(p * 2.2 + q * 1.8 + vec2(0.0, t * 1.4));
        float ribbon = smoothstep(0.50, 0.96, fog);

        vec3 base = vec3(0.019, 0.019, 0.026);
        vec3 wine = vec3(0.32, 0.035, 0.05);
        vec3 ember = vec3(0.95, 0.16, 0.12);

        vec3 col = base;
        col += wine * ribbon * 0.30;

        float fog2 = fbm(p * 1.3 + vec2(-t * 0.8, t * 0.5) + q);
        col += vec3(0.10, 0.02, 0.03) * smoothstep(0.55, 1.0, fog2) * 0.7;

        // Pointer bloom
        float d = length(p - mp);
        col += ember * exp(-d * 3.6) * 0.10;
        col += wine * exp(-d * 1.6) * 0.16;

        // Soft concentric ripple around the pointer
        float ripple = sin(d * 26.0 - uTime * 1.6) * exp(-d * 5.0);
        col += ember * ripple * 0.018;

        // Film grain
        float grain = hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5;
        col += grain * 0.022;

        // Vignette
        float vig = smoothstep(1.35, 0.25, length(p));
        col *= 0.55 + 0.45 * vig;

        col *= 1.0 - uScroll * 0.15;

        gl_FragColor = vec4(col, 1.0);
      }
    `
  });

  bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMaterial));

  /* ── Particle field ─────────────────────────────────── */
  const isSmall = window.innerWidth < 768;
  const COUNT = isSmall ? 1300 : 2600;

  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const phases = new Float32Array(COUNT);
  const warms = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() * 2 - 1) * 10;
    positions[i3 + 1] = (Math.random() * 2 - 1) * 6;
    positions[i3 + 2] = (Math.random() * 2 - 1) * 6 - 1;

    sizes[i] = 0.55 + Math.random() * 1.75;
    phases[i] = Math.random() * Math.PI * 2;
    warms[i] = Math.random() < 0.16 ? 1 : Math.random() * 0.22;
  }

  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  pointGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  pointGeometry.setAttribute('aWarm', new THREE.BufferAttribute(warms, 1));

  const pointUniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uPixelRatio: { value: dpr }
  };

  const pointMaterial = new THREE.ShaderMaterial({
    uniforms: pointUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uPixelRatio;

      attribute float aSize;
      attribute float aPhase;
      attribute float aWarm;

      varying float vAlpha;
      varying float vWarm;

      void main() {
        vec3 p = position;

        p.x += sin(uTime * 0.18 + aPhase) * 0.18;
        p.y += cos(uTime * 0.15 + aPhase * 1.7) * 0.14;
        p.z += sin(uTime * 0.12 + aPhase * 0.8) * 0.10;

        vec2 m = uPointer * vec2(10.0, 6.0);
        vec2 d = p.xy - m;
        float dist = length(d);
        float influence = smoothstep(3.4, 0.0, dist);

        p.xy += normalize(d + vec2(0.0001)) * influence * 0.7;
        p.z += influence * 0.6;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPixelRatio * (10.0 / max(-mv.z, 0.1));

        vAlpha = 0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * 0.9 + aPhase * 5.0));
        vAlpha *= 0.35 + influence * 0.9;
        vWarm = aWarm;
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;

      varying float vAlpha;
      varying float vWarm;

      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        float a = smoothstep(0.5, 0.0, d);
        a = pow(a, 2.0);

        vec3 col = mix(vec3(0.85, 0.86, 0.90), vec3(1.0, 0.30, 0.26), vWarm);
        gl_FragColor = vec4(col, a * vAlpha);
      }
    `
  });

  const points = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(points);

  /* ── Pointer easing ─────────────────────────────────── */
  const pointer = { x: 0.5, y: 0.5 };
  const pointerWorld = new THREE.Vector2(0, 0);

  const setPointerX = gsap.quickTo(pointer, 'x', {
    duration: 0.9,
    ease: 'power3.out'
  });
  const setPointerY = gsap.quickTo(pointer, 'y', {
    duration: 0.9,
    ease: 'power3.out'
  });

  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType === 'touch') return;
      setPointerX(event.clientX / window.innerWidth);
      setPointerY(event.clientY / window.innerHeight);
    },
    { passive: true }
  );

  /* ── Resize ─────────────────────────────────────────── */
  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    bgUniforms.uRes.value.set(width, height);
    pointUniforms.uPixelRatio.value = pixelRatio;
  }

  window.addEventListener('resize', resize, { passive: true });

  /* ── Render loop ────────────────────────────────────── */
  const clock = new THREE.Clock();
  let frameId = null;

  function renderFrame() {
    frameId = requestAnimationFrame(renderFrame);

    if (document.hidden) return;

    const elapsed = clock.getElapsedTime();
    const scrollProgress = Math.min(
      window.scrollY / Math.max(window.innerHeight, 1),
      1.4
    );

    bgUniforms.uTime.value = elapsed;
    bgUniforms.uScroll.value = scrollProgress;
    bgUniforms.uPointer.value.set(pointer.x, 1 - pointer.y);

    pointUniforms.uTime.value = elapsed;
    pointerWorld.set((pointer.x - 0.5) * 2, (0.5 - pointer.y) * 2);
    pointUniforms.uPointer.value.copy(pointerWorld);

    camera.position.x += ((pointer.x - 0.5) * 0.9 - camera.position.x) * 0.03;
    camera.position.y += ((0.5 - pointer.y) * 0.6 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.clear();
    renderer.render(bgScene, bgCamera);
    renderer.clearDepth();
    renderer.render(scene, camera);
  }

  function renderStatic() {
    bgUniforms.uTime.value = 2.4;
    bgUniforms.uPointer.value.set(0.5, 0.5);
    renderer.clear();
    renderer.render(bgScene, bgCamera);
    renderer.clearDepth();
    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    renderStatic();
    window.addEventListener('resize', renderStatic, { passive: true });
  } else {
    renderFrame();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    } else if (!document.hidden && !prefersReducedMotion && !frameId) {
      clock.start();
      renderFrame();
    }
  });
}
