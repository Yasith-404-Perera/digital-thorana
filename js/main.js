/* ============================================================
   DIGITAL THORANA — main.js
   Particle system + lotus interactions
   ============================================================ */

/* ── Current year in footer ── */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ============================================================
   PARTICLE SYSTEM
   Particles drift upward and outward from the lotus centre.
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, cx, cy;
  const PARTICLE_COUNT = 55;
  const particles = [];

  /* Particle colours — gold, saffron, white, ruby */
  const COLOURS = [
    'rgba(245,200,66,',   // gold
    'rgba(224,123,16,',   // saffron
    'rgba(255,240,200,',  // warm white
    'rgba(200,146,42,',   // deep gold
    'rgba(192,57,43,',    // ruby
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2;
    cy = H / 2;
  }

  function randomParticle() {
    const angle  = Math.random() * Math.PI * 2;
    const speed  = 0.3 + Math.random() * 0.8;
    const size   = 1.5 + Math.random() * 3.5;
    const colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    const life   = 0.6 + Math.random() * 0.4; // starting alpha
    const radius = 20 + Math.random() * 80;    // starting distance from centre

    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      vx: Math.cos(angle) * speed * (0.4 + Math.random()),
      vy: Math.sin(angle) * speed * (0.4 + Math.random()) - (0.5 + Math.random() * 0.5),
      size,
      colour,
      alpha: life,
      decay: 0.004 + Math.random() * 0.006,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
    };
  }

  /* Seed initial particles */
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = randomParticle();
    p.alpha = Math.random(); // stagger starting opacity
    particles.push(p);
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      /* Update */
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.4;
      p.y += p.vy;
      p.alpha -= p.decay;

      /* Reset when faded */
      if (p.alpha <= 0) {
        Object.assign(particles[i], randomParticle());
        continue;
      }

      /* Draw */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.colour + p.alpha + ')';
      ctx.fill();

      /* Soft glow ring on larger particles */
      if (p.size > 3) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.colour + (p.alpha * 0.15) + ')';
        ctx.fill();
      }
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  tick();
})();

/* ============================================================
   PETAL RIPPLE on click — brief flash before navigation
   ============================================================ */
document.querySelectorAll('.petal-card').forEach(card => {
  card.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    e.preventDefault();

    /* Visual flash */
    this.style.transition = 'transform 0.15s ease';
    this.style.transform  = 'translate(-50%, -50%) scale(1.15)';

    setTimeout(() => {
      window.location.href = href;
    }, 200);
  });
});