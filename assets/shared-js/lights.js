/* ============================================================
   DIGITAL THORANA — lights.js  (shared)
   Animated chasing bulb lights along the frame border
   ============================================================ */

(function initLights() {
  const canvas = document.getElementById('lightsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const BORDER = 18;          // must match CSS --frame-border
  const BULB_SPACING = 28;    // px between each bulb
  const BULB_RADIUS  = 5;     // bulb dot radius
  const CHASE_SPEED  = 3;     // frames between advancing the lit group
  const GROUP_SIZE   = 4;     // how many consecutive bulbs are lit
  const COLOURS = ['#f5c842', '#e07b10', '#c0392b', '#1a8a7a', '#ffffff', '#f5c842'];

  let W, H;
  let bulbs = [];
  let offset = 0;
  let frameCount = 0;

  function buildPath() {
    bulbs = [];

    // Top edge → right
    for (let x = BORDER; x < W - BORDER; x += BULB_SPACING) {
      bulbs.push({ x, y: BORDER / 2 });
    }
    // Right edge → down
    for (let y = BORDER; y < H - BORDER; y += BULB_SPACING) {
      bulbs.push({ x: W - BORDER / 2, y });
    }
    // Bottom edge ← left
    for (let x = W - BORDER; x > BORDER; x -= BULB_SPACING) {
      bulbs.push({ x, y: H - BORDER / 2 });
    }
    // Left edge ↑ up
    for (let y = H - BORDER; y > BORDER; y -= BULB_SPACING) {
      bulbs.push({ x: BORDER / 2, y });
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildPath();
  }

  function drawBulb(x, y, lit, colourIndex) {
    const colour = COLOURS[colourIndex % COLOURS.length];

    if (lit) {
      // Glow halo
      const grad = ctx.createRadialGradient(x, y, 0, x, y, BULB_RADIUS * 4);
      grad.addColorStop(0,   colour.replace(')', ', 0.6)').replace('#', 'rgba(').replace(
        /rgba\(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i,
        (_, r, g, b) => `rgba(${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)}`
      ));
      // Simpler approach:
      ctx.beginPath();
      ctx.arc(x, y, BULB_RADIUS * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(colour, 0.25);
      ctx.fill();

      // Bright centre
      ctx.beginPath();
      ctx.arc(x, y, BULB_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = colour;
      ctx.shadowColor = colour;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Specular highlight
      ctx.beginPath();
      ctx.arc(x - 1.5, y - 1.5, BULB_RADIUS * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fill();
    } else {
      // Dim bulb
      ctx.beginPath();
      ctx.arc(x, y, BULB_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(60,30,20,0.8)';
      ctx.strokeStyle = 'rgba(100,60,30,0.5)';
      ctx.lineWidth = 0.8;
      ctx.fill();
      ctx.stroke();
    }
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    frameCount++;
    if (frameCount % CHASE_SPEED === 0) {
      offset = (offset + 1) % bulbs.length;
    }

    for (let i = 0; i < bulbs.length; i++) {
      const b = bulbs[i];
      // A bulb is "lit" if it's in the current chasing window
      const lit = ((i - offset + bulbs.length) % bulbs.length) < GROUP_SIZE;
      const colourIndex = Math.floor(i / GROUP_SIZE);
      drawBulb(b.x, b.y, lit, colourIndex);
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  tick();
})();


/* ============================================================
   SHARED SLIDESHOW LOGIC
   Call initSlideshow() after DOM ready.
   ============================================================ */
function initSlideshow(intervalMs = 5000) {
  const slides     = document.querySelectorAll('.slide');
  const dots       = document.querySelectorAll('.slide-dot');
  const prevBtn    = document.querySelector('.slide-arrow.prev');
  const nextBtn    = document.querySelector('.slide-arrow.next');

  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), intervalMs);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });
  prevBtn?.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startTimer(); });

  goTo(0);
  startTimer();
}

document.addEventListener('DOMContentLoaded', () => initSlideshow(5500));