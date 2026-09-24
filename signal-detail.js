// ATLAS — Signal Dossier & Rabbit Hole Discovery Engine

const SIGNALS_DB = {
  'SIG-001': {
    id: 'SIG-001',
    name: 'Neal.fun',
    tagline: 'Playful interactive experiments that make learning feel like playing.',
    screenshot: 'assets/neal-fun-preview.jpg',
    url: 'https://neal.fun',
    creator: 'Neal Agarwal',
    year: '2019',
    status: 'Active',
    category: 'Interactive',
    tech: 'JavaScript, HTML5, Canvas',
    description: 'Neal.fun is a collection of interactive web experiments created by Neal Agarwal. Each project transforms complex topics — from the size of the universe to the history of money — into intuitive, visually rich experiences you can explore in your browser. No downloads, no sign-ups. Just click and discover.',
    why: 'In a web dominated by static content and engagement loops, Neal.fun proves that the internet can still be a place of wonder. Each experiment is a self-contained journey — beautifully designed, thoughtfully researched, and deeply satisfying to explore. It represents the best of what independent web creation can be.',
    bestFor: [
      'Curious minds who love learning through interaction',
      'Designers looking for creative web inspiration',
      'Anyone tired of doomscrolling and looking for meaningful internet experiences',
      'Teachers seeking engaging educational tools'
    ],
    notableFeatures: [
      { title: 'The Size of Space', desc: 'scroll through the entire universe, from atoms to galaxy superclusters' },
      { title: "Spend Bill Gates' Money", desc: 'an interactive budget simulator with real prices' },
      { title: 'The Deep Sea', desc: 'dive to the bottom of the ocean, discovering creatures at every depth' },
      { title: 'Draw Logos From Memory', desc: 'test how well you remember famous brand logos' }
    ],
    metadata: {
      category: 'Interactive',
      score: 98,
      difficulty: 'Beginner',
      time: '10 min'
    },
    tags: ['#interactive', '#creative', '#fun', '#browser', '#educational', '#experiments'],
    capture: 'SIGNAL CAPTURE // 2024'
  },

  'SIG-002': {
    id: 'SIG-002',
    name: 'Radio Garden',
    tagline: 'Listen to live radio stations broadcast from anywhere on planet Earth.',
    screenshot: 'assets/radio-garden-preview.jpg',
    url: 'https://radio.garden',
    creator: 'Studio Puckey & Moniker',
    year: '2016',
    status: 'Active',
    category: 'Exploration',
    tech: 'WebGL, Three.js, Live Audio Streams',
    description: 'Radio Garden allows listeners to explore processes of broadcasting and hearing by interacting with a 3D globe covered with live radio signals. Spin the planet and drop in on local transmissions across thousands of cities.',
    why: 'A poignant reminder of shared humanity across borders. Tuning into a community broadcast thousands of miles away in real time turns geography into an auditory journey of ambient connection.',
    bestFor: [
      'Music lovers seeking global independent radio stations',
      'Remote workers looking for ambient background audio from other cultures',
      'Linguists and curious world travelers',
      'Anyone wanting to hear what life sounds like across oceans right now'
    ],
    notableFeatures: [
      { title: 'Interactive 3D Globe', desc: 'smoothly rotate and zoom into any region on Earth' },
      { title: 'Thousands of Live Stations', desc: 'unfiltered real-time FM and community internet broadcasts' },
      { title: 'Precise Satellite Reticle', desc: 'lock into specific radio towers with frequency details' },
      { title: 'Favorites & Playlists', desc: 'bookmark stations from Reykjavik to Nairobi' }
    ],
    metadata: {
      category: 'Exploration',
      score: 96,
      difficulty: 'Easy',
      time: '25 min'
    },
    tags: ['#audio', '#globe', '#live', '#webgl', '#culture', '#music'],
    capture: 'SIGNAL CAPTURE // 2024'
  },

  'SIG-003': {
    id: 'SIG-003',
    name: 'Window Swap',
    tagline: "Open a random stranger's window from around the world.",
    screenshot: 'assets/window-swap-preview.jpg',
    url: 'https://www.window-swap.com',
    creator: 'Sonali Ranjit & Vaishnav Balasubramaniam',
    year: '2020',
    status: 'Active',
    category: 'Lifestyle',
    tech: 'HTML5 Video, React, Cloud Hosting',
    description: "Window Swap is a quarantine project turned global phenomenon that lets you gaze out of someone else's window somewhere in the world, accompanied by ambient audio recorded at the scene.",
    why: 'A quiet antidote to the frenetic pace of social media. It fosters calm empathy by showing glimpses of rain in Munich, birds in Kyoto, or dusk in Buenos Aires through authentic unedited perspectives.',
    bestFor: [
      'Focus & deep work background visual contemplation',
      'Ambient relaxation and peaceful meditation',
      'Travel nostalgia and longing for foreign vistas',
      'Mindful digital wandering without algorithms'
    ],
    notableFeatures: [
      { title: 'Uncut Video Feeds', desc: '10-minute HD loops with authentic ambient background audio' },
      { title: 'Global Submission Index', desc: 'over 100 countries represented by ordinary citizens' },
      { title: 'One-Click Window Hop', desc: 'teleport to a completely different continent instantly' },
      { title: 'Zero Notification UI', desc: 'pure serene visual sanctuary with no distractions' }
    ],
    metadata: {
      category: 'Lifestyle',
      score: 93,
      difficulty: 'Passive',
      time: '15 min'
    },
    tags: ['#lifestyle', '#video', '#ambient', '#calm', '#world', '#strangers'],
    capture: 'SIGNAL CAPTURE // 2024'
  },

  'SIG-004': {
    id: 'SIG-004',
    name: 'Zoomquilt',
    tagline: 'Infinite collaborative zoom artwork with surreal transitions.',
    screenshot: 'assets/zoomquilt-preview.jpg',
    url: 'https://zoomquilt.org',
    creator: 'Nikolaus Baumgarten & Illustrators',
    year: '2004',
    status: 'Active',
    category: 'Art',
    tech: 'HTML5 Canvas, Dynamic Scaling, Raster Tile Engine',
    description: 'Zoomquilt is an ongoing collaborative digital painting project initiated in 2004 where illustrators from around the world connect intricate surreal scenes into a seamless, endlessly zooming fantasy loop.',
    why: 'One of the most legendary early internet art experiments that has survived and evolved through multiple technological generations, proving the timeless power of collective creative craft.',
    bestFor: [
      'Digital art connoisseurs and surrealism fans',
      'Visual meditation and mesmerizing contemplation',
      'Retro web culture and collaborative digital heritage',
      'Designers studying seamless spatial transitions'
    ],
    notableFeatures: [
      { title: 'Infinite Zoom Loop', desc: 'never-ending visual depth into hundreds of hand-painted worlds' },
      { title: 'Variable Zoom Speed', desc: 'adjust navigation velocity with keyboard or touch drag' },
      { title: 'Multiple Worlds', desc: 'explore Zoomquilt 1, Zoomquilt 2, and Arkadia loops' },
      { title: 'Full-screen Canvas', desc: 'hypnotic borderless viewport optimization' }
    ],
    metadata: {
      category: 'Art',
      score: 95,
      difficulty: 'Passive',
      time: '12 min'
    },
    tags: ['#art', '#infinite', '#surreal', '#canvas', '#psychedelic', '#illustration'],
    capture: 'SIGNAL CAPTURE // 2024'
  },

  'SIG-005': {
    id: 'SIG-005',
    name: 'Pointer Pointer',
    tagline: 'Finds a photo pointing exactly at your cursor in real time.',
    screenshot: 'assets/pointer-pointer-preview.jpg',
    url: 'https://pointerpointer.com',
    creator: 'Studio Moniker',
    year: '2012',
    status: 'Active',
    category: 'Fun',
    tech: 'JavaScript, Coordinate Mapping, Custom Image DB',
    description: 'Place your cursor anywhere on the screen and stay still. Within moments, the page locates an archived photograph of a person pointing their finger with uncanny accuracy directly at that spot.',
    why: 'Brilliant comedic simplicity combined with technical cleverness. An early viral masterpiece that explores human gesture, surveillance, and playful digital serendipity.',
    bestFor: [
      'Quick comedic breaks and breaking conversational ice',
      'Curious observers of creative web development',
      'Fans of quirky internet artifacts and absurdism',
      'Showcasing the delightfully weird corners of the web'
    ],
    notableFeatures: [
      { title: '2D Coordinate Indexing', desc: 'instant spatial lookup matching cursor X/Y coordinates' },
      { title: 'Curated Photo Archive', desc: 'hundreds of hand-tagged vintage and amateur candid photos' },
      { title: 'Deadpan Minimalist Design', desc: 'zero clutter, pure focus on the pointing gesture' },
      { title: 'Mobile Touch Emulation', desc: 'touch-point detection adapted for modern touchscreens' }
    ],
    metadata: {
      category: 'Fun',
      score: 91,
      difficulty: 'Beginner',
      time: '5 min'
    },
    tags: ['#cursor', '#fun', '#interactive', '#photography', '#humor', '#experimental'],
    capture: 'SIGNAL CAPTURE // 2024'
  },

  'SIG-006': {
    id: 'SIG-006',
    name: 'This Person Does Not Exist',
    tagline: 'AI-generated photorealistic human portraits that have never existed.',
    screenshot: 'assets/neal-fun-preview.jpg',
    url: 'https://thispersondoesnotexist.com',
    creator: 'Philip Wang (StyleGAN by NVIDIA)',
    year: '2019',
    status: 'Active',
    category: 'AI',
    tech: 'StyleGAN, Deep Learning, GPU Cloud Inference',
    description: 'Every time you refresh, a generative adversarial network synthesizes a hyper-realistic human portrait from pure computational noise. None of the people shown have ever lived.',
    why: 'A milestone demonstration of generative AI that stunned the world in 2019, sparking global conversations about synthetic media, digital identity, and technological realism.',
    bestFor: [
      'AI and machine learning researchers',
      'Philosophers examining synthetic realism and identity',
      'Tech history buffs tracking generative AI breakthroughs',
      'Visual artists studying generative facial synthesis'
    ],
    notableFeatures: [
      { title: 'Single-Refresh Inference', desc: 'generates an entirely new human portrait on every reload' },
      { title: '1024x1024 High Resolution', desc: 'deep synthetic skin pores, iris refractions, and hair strands' },
      { title: 'Generative Latent Space', desc: 'StyleGAN architecture sampling infinite facial distributions' },
      { title: 'Pure Minimalist Delivery', desc: 'no UI chrome — just raw computational generation' }
    ],
    metadata: {
      category: 'AI',
      score: 94,
      difficulty: 'Easy',
      time: '5 min'
    },
    tags: ['#ai', '#gan', '#machinelearning', '#portraits', '#synthetic'],
    capture: 'SIGNAL CAPTURE // 2024'
  },

  'SIG-007': {
    id: 'SIG-007',
    name: 'Earth Nullschool',
    tagline: 'Mesmerizing real-time interactive visualization of global weather and currents.',
    screenshot: 'assets/earth-nullschool-preview.jpg',
    url: 'https://earth.nullschool.net',
    creator: 'Cameron Beccario',
    year: '2013',
    status: 'Active',
    category: 'Visualization',
    tech: 'WebGL, D3.js, GFS Weather Models, Oceanographic Data',
    description: 'A supercomputing visualizer that renders live global weather conditions, ocean currents, particulate matter, and atmospheric streams onto an interactive rotatable globe in real time.',
    why: 'Transforms dry meteorological numbers into hypnotic living art. Watching atmospheric rivers and jet streams wrap around the planet is both humbling and intellectually exhilarating.',
    bestFor: [
      'Science and meteorology enthusiasts tracking storms',
      'Data visualization engineers exploring WebGL rendering',
      'Educators teaching atmospheric science and ocean currents',
      'Anyone mesmerized by dynamic natural planetary systems'
    ],
    notableFeatures: [
      { title: 'Live Animated Vector Fields', desc: 'computes fluid particle paths over spherical topology' },
      { title: 'Multi-Atmospheric Slicing', desc: 'toggle between surface wind, jet stream, and stratosphere' },
      { title: 'Oceanographic Heatmaps', desc: 'sea surface temperatures, waves, and ocean currents' },
      { title: 'Custom Projection Geometry', desc: 'switch from orthographic globe to stereographic maps' }
    ],
    metadata: {
      category: 'Visualization',
      score: 97,
      difficulty: 'Intermediate',
      time: '20 min'
    },
    tags: ['#weather', '#globe', '#science', '#webgl', '#data', '#visualization'],
    capture: 'SIGNAL CAPTURE // 2024'
  }
};

// ─── Exploration Tracking Engine ───
const EXPLORATION_STORAGE_KEY = 'atlas_explored_signals_v2';
const TOTAL_SIGNALS = 1284;
const INITIAL_EXPLORED_BASE = 18;

function getExploredSet() {
  try {
    const raw = localStorage.getItem(EXPLORATION_STORAGE_KEY);
    if (!raw) {
      // Seed default 18 explored signals (SIG-001 + 17 historical index records)
      const base = ['SIG-001'];
      for (let i = 1; i <= 17; i++) {
        base.push('SIG-ARCH-' + String(i).padStart(3, '0'));
      }
      localStorage.setItem(EXPLORATION_STORAGE_KEY, JSON.stringify(base));
      return new Set(base);
    }
    return new Set(JSON.parse(raw));
  } catch (e) {
    return new Set(['SIG-001']);
  }
}

function recordExploredSignal(signalId) {
  try {
    const set = getExploredSet();
    if (!set.has(signalId)) {
      set.add(signalId);
      localStorage.setItem(EXPLORATION_STORAGE_KEY, JSON.stringify([...set]));
    }
    updateExplorationStatUI(set.size);
  } catch (e) {
    updateExplorationStatUI(INITIAL_EXPLORED_BASE);
  }
}

function updateExplorationStatUI(count) {
  const countEl = document.querySelector('#explored-count');
  const barEl = document.querySelector('#explored-bar');
  if (countEl) {
    countEl.textContent = count;
  }
  if (barEl) {
    const percent = Math.min(100, Math.max(1.4, (count / TOTAL_SIGNALS) * 100));
    barEl.style.width = percent.toFixed(2) + '%';
  }
}

// ─── Render Signal Dossier ───
function renderSignal(signalId) {
  const data = SIGNALS_DB[signalId] || SIGNALS_DB['SIG-001'];
  if (!data) return;

  // Breadcrumb & IDs
  const breadcrumb = document.querySelector('.breadcrumb-current');
  if (breadcrumb) breadcrumb.textContent = data.id;

  const dossierId = document.querySelector('.dossier-id');
  if (dossierId) dossierId.textContent = data.id;

  // Screenshot & Capture Overlay
  const screenshotImg = document.querySelector('.dossier-screenshot img');
  if (screenshotImg) {
    screenshotImg.src = data.screenshot;
    screenshotImg.alt = `${data.name} website screenshot`;
  }
  const captureOverlay = document.querySelector('.screenshot-overlay span');
  if (captureOverlay) captureOverlay.textContent = data.capture;

  // Visit External Link
  const visitBtn = document.querySelector('.dossier-visit-btn');
  if (visitBtn) {
    visitBtn.href = data.url;
  }

  // Sidebar Fields
  const sidebarFields = document.querySelectorAll('.sidebar-field strong');
  if (sidebarFields.length >= 5) {
    sidebarFields[0].textContent = data.creator;
    sidebarFields[1].textContent = data.year;
    sidebarFields[2].textContent = data.status;
    sidebarFields[3].textContent = data.category;
    sidebarFields[4].textContent = data.tech;
  }

  // Main Dossier Right Column
  const title = document.querySelector('.dossier-title');
  if (title) title.textContent = data.name;

  const tagline = document.querySelector('.dossier-tagline');
  if (tagline) tagline.textContent = data.tagline;

  const sections = document.querySelectorAll('.dossier-right .dossier-section');
  if (sections.length >= 4) {
    // Description
    const pDesc = sections[0].querySelector('p');
    if (pDesc) pDesc.textContent = data.description;

    // Why It's Interesting
    const pWhy = sections[1].querySelector('p');
    if (pWhy) pWhy.textContent = data.why;

    // Best For
    const ulBest = sections[2].querySelector('ul');
    if (ulBest) {
      ulBest.innerHTML = data.bestFor.map(item => `<li>${item}</li>`).join('');
    }

    // Notable Features
    const ulFeat = sections[3].querySelector('ul');
    if (ulFeat) {
      ulFeat.innerHTML = data.notableFeatures.map(feat => `<li><strong>${feat.title}</strong> — ${feat.desc}</li>`).join('');
    }
  }

  // Metadata Cards
  const metaCards = document.querySelectorAll('.dossier-metadata .meta-card strong');
  if (metaCards.length >= 4) {
    metaCards[0].textContent = data.metadata.category;
    metaCards[1].textContent = data.metadata.score;
    metaCards[2].textContent = data.metadata.difficulty;
    metaCards[3].textContent = data.metadata.time;
  }

  // Tags
  const tagsContainer = document.querySelector('.dossier-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = data.tags.map(tag => `<span class="dossier-tag">${tag}</span>`).join('');
  }

  // Document Title
  document.title = `ATLAS / ${data.id} — ${data.name}`;

  // Record exploration
  recordExploredSignal(data.id);
}

// ─── Setup Continue Exploring & Jump Logic ───
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
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

  // Detect signal ID from URL
  const params = new URLSearchParams(window.location.search);
  const currentSignalId = params.get('id') || 'SIG-001';
  renderSignal(currentSignalId);

  // Initialize Stat UI
  const exploredSet = getExploredSet();
  updateExplorationStatUI(exploredSet.size);

  // Random Signal Button Logic
  const randomBtn = document.querySelector('#random-signal-btn');
  randomBtn?.addEventListener('click', () => {
    const allIds = Object.keys(SIGNALS_DB);
    const available = allIds.filter(id => id !== currentSignalId);
    const chosenId = available[Math.floor(Math.random() * available.length)] || 'SIG-002';

    // Animated trigger effect
    randomBtn.style.background = 'var(--red)';
    randomBtn.style.color = '#000';

    // Subtle page fade effect
    document.body.style.transition = 'opacity .25s ease';
    document.body.style.opacity = '0.4';

    setTimeout(() => {
      window.location.href = `signal.html?id=${chosenId}`;
    }, 280);
  });

  // Make entire continue exploring cards clickable
  const exploreCards = document.querySelectorAll('.explore-card');
  exploreCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let anchor tag handle directly
      const link = card.querySelector('.explore-visit-btn');
      if (link) {
        link.click();
      }
    });
  });
});
