document.addEventListener('DOMContentLoaded', () => {
  const typed = document.querySelector('#typed-text');
  const words = ['UNSEEN', 'HIDDEN', 'FORGOTTEN', 'BURIED'];
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

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.desktop-nav');
  menu?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.desktop-nav a')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => observer.observe(section));

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
