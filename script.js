/**
 * CIPHER CSE ASSOCIATION
 * Three.js 3D Particle Starfield, Typewriter Headline & Stack-Card Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. DYNAMIC TYPEWRITER HEADLINE ANIMATION
  // =========================================================================
  const typewriterElement = document.getElementById('typewriter');
  const wordsToCycle = ['community.', 'future.', 'prompt.', 'gala.'];
  
  let currentWordIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function handleTypewriter() {
    if (!typewriterElement) return;

    const currentWord = wordsToCycle[currentWordIndex];

    if (isDeleting) {
      // Remove characters
      typewriterElement.textContent = currentWord.substring(0, currentCharIndex - 1);
      currentCharIndex--;
      typingSpeed = 45;
    } else {
      // Add characters
      typewriterElement.textContent = currentWord.substring(0, currentCharIndex + 1);
      currentCharIndex++;
      typingSpeed = 105;
    }

    // Finished typing full word
    if (!isDeleting && currentCharIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause to let user read
    } 
    // Finished deleting full word
    else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % wordsToCycle.length;
      typingSpeed = 400; // Brief pause before starting next word
    }

    setTimeout(handleTypewriter, typingSpeed);
  }

  // Start Typewriter
  setTimeout(handleTypewriter, 600);

  // =========================================================================
  // 2. THREE.JS 3D INTERACTIVE PARTICLE STARFIELD
  // =========================================================================
  const bgCanvas = document.getElementById('bg-canvas');

  if (bgCanvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Cloud Geometry
    const particleCount = 1350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color('#38bdf8'), // Electric Cyan
      new THREE.Color('#0284c7'), // Deep Cyan
      new THREE.Color('#c084fc'), // Cyber Purple
      new THREE.Color('#ffffff')  // Pure Star White
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 230;
      positions[i3 + 1] = (Math.random() - 0.5) * 170;
      positions[i3 + 2] = (Math.random() - 0.5) * 140;

      const chosenColor = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular particle texture generator
    const generateRadialTexture = () => {
      const size = 64;
      const cvs = document.createElement('canvas');
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext('2d');

      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(cvs);
      texture.needsUpdate = true;
      return texture;
    };

    // Material
    const material = new THREE.PointsMaterial({
      size: 1.7,
      vertexColors: true,
      map: generateRadialTexture(),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starCloud = new THREE.Points(geometry, material);
    scene.add(starCloud);

    // Mouse Parallax Damping
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.0006;
      mouseY = (event.clientY - windowHalfY) * 0.0006;
    });

    // Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Animation Loop
    let clock = new THREE.Clock();

    const renderLoop = () => {
      requestAnimationFrame(renderLoop);

      const elapsed = clock.getElapsedTime();

      // Smooth inertia lerping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Cosmic slow rotation + responsive mouse tilt
      starCloud.rotation.y = elapsed * 0.035 + targetX * 1.6;
      starCloud.rotation.x = Math.sin(elapsed * 0.03) * 0.08 + targetY * 1.6;

      renderer.render(scene, camera);
    };

    renderLoop();
  }

  // =========================================================================
  // 3. INTERACTIVE STACKED CARDS CLICK REORDER (MOBILE & DESKTOP)
  // =========================================================================
  const stackCards = document.querySelectorAll('.stack-card');
  const stackContainer = document.getElementById('stack-container');

  if (stackContainer && stackCards.length > 0) {
    stackCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        // Bring clicked card to the front of the stack
        stackCards.forEach((c) => {
          c.style.zIndex = '1';
        });
        card.style.zIndex = '10';
      });
    });
  }

  // =========================================================================
  // 4. STICKY NAVBAR DYNAMICS
  // =========================================================================
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll);
  onScroll();

  // =========================================================================
  // 5. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileToggleBtn.classList.add('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close on link click
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 6. SCROLL SPY - ACTIVE NAVIGATION ITEM HIGHLIGHTING
  // =========================================================================
  const observedSections = document.querySelectorAll('section[id]');
  const desktopNavItems = document.querySelectorAll('.nav-item');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 140;

    observedSections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        desktopNavItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink);
});
