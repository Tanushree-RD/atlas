/**
 * CIPHER CSE ASSOCIATION // RAW EDITORIAL ENGINE
 * Dynamic Typing Engine, Three.js 3D Background Engine,
 * Architectural Telemetry Clock & Interface Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. DYNAMIC JAVASCRIPT TEXT CYCLING (TYPEWRITER)
  // =========================================================================
  const typedTextElement = document.getElementById('typed-text');
  const wordsToCycle = ['community.', 'future.', 'prompt.', 'gala.'];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function cycleText() {
    if (!typedTextElement) return;

    const currentWord = wordsToCycle[wordIndex];

    if (isDeleting) {
      typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 105;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause on complete word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % wordsToCycle.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(cycleText, typingSpeed);
  }

  setTimeout(cycleText, 500);

  // =========================================================================
  // 2. INTERACTIVE 3D BACKGROUND (THREE.JS PARTICLES / STARS)
  // =========================================================================
  const bgCanvas = document.getElementById('bg-canvas');

  if (bgCanvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 75;

    const renderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1200+ Stars / Particle Point Cloud
    const particleCount = 1300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Color Palette: Amber (#ff6b00), Soft Gold (#f59e0b), White (#f3f4f6), Muted Gray (#888888)
    const colorPalette = [
      new THREE.Color('#ff6b00'),
      new THREE.Color('#f59e0b'),
      new THREE.Color('#f3f4f6'),
      new THREE.Color('#888888')
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 220;
      positions[i3 + 1] = (Math.random() - 0.5) * 160;
      positions[i3 + 2] = (Math.random() - 0.5) * 140;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular particle texture generator for smooth glowing points
    const createParticleTexture = () => {
      const size = 64;
      const cvs = document.createElement('canvas');
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext('2d');

      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.25, 'rgba(255, 107, 0, 0.85)');
      gradient.addColorStop(0.65, 'rgba(255, 107, 0, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(cvs);
      texture.needsUpdate = true;
      return texture;
    };

    const material = new THREE.PointsMaterial({
      size: 1.65,
      vertexColors: true,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starCloud = new THREE.Points(geometry, material);
    scene.add(starCloud);

    // Mouse coordinate tracking & lerp inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const halfWindowX = window.innerWidth / 2;
    const halfWindowY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - halfWindowX) * 0.0007;
      mouseY = (e.clientY - halfWindowY) * 0.0007;
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Render loop
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Organic rotation + interactive mouse tilt
      starCloud.rotation.y = elapsedTime * 0.03 + targetX * 1.5;
      starCloud.rotation.x = Math.sin(elapsedTime * 0.025) * 0.08 + targetY * 1.5;

      renderer.render(scene, camera);
    };

    animate();
  }

  // =========================================================================
  // 3. REAL-TIME TELEMETRY CLOCK
  // =========================================================================
  const clockElement = document.getElementById('clock-display');

  const updateClock = () => {
    if (!clockElement) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds} IST`;
  };

  setInterval(updateClock, 1000);
  updateClock();

  // =========================================================================
  // 4. MOBILE TABLE OF CONTENTS (TOC) DRAWER
  // =========================================================================
  const menuTrigger = document.getElementById('menu-trigger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (menuTrigger && mobileDrawer) {
    menuTrigger.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        menuTrigger.querySelector('.trigger-label').textContent = '[TOC]';
      } else {
        mobileDrawer.classList.add('open');
        menuTrigger.querySelector('.trigger-label').textContent = '[CLOSE]';
      }
    });

    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuTrigger.querySelector('.trigger-label').textContent = '[TOC]';
      });
    });

    document.addEventListener('click', (e) => {
      if (!menuTrigger.contains(e.target) && !mobileDrawer.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        menuTrigger.querySelector('.trigger-label').textContent = '[TOC]';
      }
    });
  }

  // =========================================================================
  // 5. SCROLL-SPY ACTIVE LINK SYNCHRONIZATION
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-anchor');

  const onScroll = () => {
    const scrollPos = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll);
});
