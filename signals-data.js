// ATLAS — Shared Signals Dataset
// Single source of truth for Discovery Console, Signal Archive, Featured Signals, and Signal Detail.

export const SIGNALS = [
  {
    id: 'SIG-001',
    name: 'Neal.fun',
    tagline: 'Playful interactive experiments that make learning feel like playing.',
    description: 'Playful interactive experiments and educational web experiences.',
    screenshot: 'assets/neal-fun-preview.jpg',
    url: 'https://neal.fun',
    creator: 'Neal Agarwal',
    year: 2019,
    status: 'Active',
    category: 'Interactive',
    filterCategories: ['interactive', 'experiment'],
    tech: 'JavaScript, HTML5, Canvas',
    tags: ['experiments', 'education', 'visual', 'interactive', 'creative', 'fun'],
    editorsPick: true,
    fullDescription: 'Neal.fun is a collection of interactive web experiments created by Neal Agarwal. Each project transforms complex topics — from the size of the universe to the history of money — into intuitive, visually rich experiences you can explore in your browser. No downloads, no sign-ups. Just click and discover.',
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
    metadata: { category: 'Interactive', score: 98, difficulty: 'Beginner', time: '10 min' },
    capture: 'SIGNAL CAPTURE // 2024'
  },
  {
    id: 'SIG-002',
    name: 'Radio Garden',
    tagline: 'Listen to live radio stations broadcast from anywhere on planet Earth.',
    description: 'Listen to live radio stations anywhere on Earth via an interactive globe.',
    screenshot: 'assets/radio-garden-preview.jpg',
    url: 'https://radio.garden',
    creator: 'Studio Puckey & Moniker',
    year: 2016,
    status: 'Active',
    category: 'Exploration',
    filterCategories: ['tool', 'interactive'],
    tech: 'WebGL, Three.js, Live Audio Streams',
    tags: ['radio', 'globe', 'live', 'audio', 'culture', 'music'],
    editorsPick: true,
    fullDescription: 'Radio Garden allows listeners to explore processes of broadcasting and hearing by interacting with a 3D globe covered with live radio signals. Spin the planet and drop in on local transmissions across thousands of cities.',
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
    metadata: { category: 'Exploration', score: 96, difficulty: 'Easy', time: '25 min' },
    capture: 'SIGNAL CAPTURE // 2024'
  },
  {
    id: 'SIG-003',
    name: 'Window Swap',
    tagline: "Open a random stranger's window from around the world.",
    description: "Open a random stranger's window from around the world.",
    screenshot: 'assets/window-swap-preview.jpg',
    url: 'https://www.window-swap.com',
    creator: 'Sonali Ranjit & Vaishnav Balasubramaniam',
    year: 2020,
    status: 'Active',
    category: 'Lifestyle',
    filterCategories: ['interactive', 'experiment'],
    tech: 'HTML5 Video, React, Cloud Hosting',
    tags: ['windows', 'travel', 'random', 'lifestyle', 'video', 'ambient'],
    editorsPick: false,
    fullDescription: "Window Swap is a quarantine project turned global phenomenon that lets you gaze out of someone else's window somewhere in the world, accompanied by ambient audio recorded at the scene.",
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
    metadata: { category: 'Lifestyle', score: 93, difficulty: 'Passive', time: '15 min' },
    capture: 'SIGNAL CAPTURE // 2024'
  },
  {
    id: 'SIG-004',
    name: 'Zoomquilt',
    tagline: 'Infinite collaborative zoom artwork with surreal transitions.',
    description: 'Infinite zoom artwork with surreal transitions.',
    screenshot: 'assets/zoomquilt-preview.jpg',
    url: 'https://zoomquilt.org',
    creator: 'Nikolaus Baumgarten & Illustrators',
    year: 2004,
    status: 'Active',
    category: 'Art',
    filterCategories: ['art', 'retro'],
    tech: 'HTML5 Canvas, Dynamic Scaling, Raster Tile Engine',
    tags: ['art', 'infinite', 'surreal', 'canvas', 'psychedelic', 'illustration'],
    editorsPick: true,
    fullDescription: 'Zoomquilt is an ongoing collaborative digital painting project initiated in 2004 where illustrators from around the world connect intricate surreal scenes into a seamless, endlessly zooming fantasy loop.',
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
    metadata: { category: 'Art', score: 95, difficulty: 'Passive', time: '12 min' },
    capture: 'SIGNAL CAPTURE // 2024'
  },
  {
    id: 'SIG-005',
    name: 'Pointer Pointer',
    tagline: 'Finds a photo pointing exactly at your cursor in real time.',
    description: 'Finds a photo pointing exactly at your cursor.',
    screenshot: 'assets/pointer-pointer-preview.jpg',
    url: 'https://pointerpointer.com',
    creator: 'Studio Moniker',
    year: 2012,
    status: 'Active',
    category: 'Fun',
    filterCategories: ['game', 'interactive', 'experiment'],
    tech: 'JavaScript, Coordinate Mapping, Custom Image DB',
    tags: ['cursor', 'photos', 'game', 'fun', 'interactive', 'humor'],
    editorsPick: false,
    fullDescription: 'Place your cursor anywhere on the screen and stay still. Within moments, the page locates an archived photograph of a person pointing their finger with uncanny accuracy directly at that spot.',
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
    metadata: { category: 'Fun', score: 91, difficulty: 'Beginner', time: '5 min' },
    capture: 'SIGNAL CAPTURE // 2024'
  },
  {
    id: 'SIG-006',
    name: 'This Person Does Not Exist',
    tagline: 'AI-generated photorealistic human portraits that have never existed.',
    description: "AI-generated human faces that don't exist.",
    screenshot: 'assets/thispersondoesnotexist-preview.png',
    url: 'https://thispersondoesnotexist.com',
    creator: 'Philip Wang (StyleGAN by NVIDIA)',
    year: 2019,
    status: 'Active',
    category: 'AI',
    filterCategories: ['ai', 'experiment'],
    tech: 'StyleGAN, Deep Learning, GPU Cloud Inference',
    tags: ['ai', 'gan', 'faces', 'machinelearning', 'portraits', 'synthetic'],
    editorsPick: true,
    fullDescription: 'Every time you refresh, a generative adversarial network synthesizes a hyper-realistic human portrait from pure computational noise. None of the people shown have ever lived.',
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
    metadata: { category: 'AI', score: 94, difficulty: 'Easy', time: '5 min' },
    capture: 'SIGNAL CAPTURE // 2024'
  },
  {
    id: 'SIG-007',
    name: 'Earth Nullschool',
    tagline: 'Mesmerizing real-time interactive visualization of global weather and currents.',
    description: 'Real-time interactive visualization of global weather and ocean currents.',
    screenshot: 'assets/earth-nullschool-preview.jpg',
    url: 'https://earth.nullschool.net',
    creator: 'Cameron Beccario',
    year: 2013,
    status: 'Active',
    category: 'Visualization',
    filterCategories: ['tool', 'interactive'],
    tech: 'WebGL, D3.js, GFS Weather Models, Oceanographic Data',
    tags: ['weather', 'globe', 'science', 'webgl', 'data', 'visualization'],
    editorsPick: false,
    fullDescription: 'A supercomputing visualizer that renders live global weather conditions, ocean currents, particulate matter, and atmospheric streams onto an interactive rotatable globe in real time.',
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
    metadata: { category: 'Visualization', score: 97, difficulty: 'Intermediate', time: '20 min' },
    capture: 'SIGNAL CAPTURE // 2024'
  }
];

// Build a lookup map by ID for quick access (used by signal-detail.js)
export const SIGNALS_BY_ID = {};
SIGNALS.forEach(s => { SIGNALS_BY_ID[s.id] = s; });

// Category filter definitions — maps filter key to matching logic
export const FILTER_CATEGORIES = [
  { key: 'all',         label: 'ALL' },
  { key: 'portfolio',   label: 'PORTFOLIOS' },
  { key: 'interactive', label: 'INTERACTIVE' },
  { key: 'ai',          label: 'AI' },
  { key: 'tool',        label: 'TOOLS' },
  { key: 'game',        label: 'GAMES' },
  { key: 'art',         label: 'ART' },
  { key: 'opensource',   label: 'OPEN SOURCE' },
  { key: 'retro',       label: 'RETRO' },
  { key: 'experiment',  label: 'EXPERIMENTS' }
];
