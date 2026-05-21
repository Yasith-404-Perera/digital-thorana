/* ============================================================
   story-01 / js / story.js
   Wessantara Jataka — story-specific JS
   (Slideshow is already handled by shared lights.js initSlideshow)
   Add any story-specific interactivity here.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ── Keyboard navigation for slideshow ── */
  document.addEventListener('keydown', (e) => {
    const prev = document.querySelector('.slide-arrow.prev');
    const next = document.querySelector('.slide-arrow.next');
    if (e.key === 'ArrowLeft')  prev?.click();
    if (e.key === 'ArrowRight') next?.click();
  });

  /* ── Lazy-load real images when team uploads them ──
     When a slide's <img> has a real src (not PLACEHOLDER),
     remove the .slide-placeholder sibling.
  ── */
  document.querySelectorAll('.slide img, .slide video').forEach(media => {
    const src = media.getAttribute('src') || '';
    if (src && src !== 'PLACEHOLDER' && !src.startsWith('PLACEHOLDER')) {
      const placeholder = media.closest('.slide')?.querySelector('.slide-placeholder');
      if (placeholder) placeholder.remove();
      media.style.display = 'block';
    }
  });

  /* ── Touch / swipe support ── */
  const slideshow = document.querySelector('.story-slideshow');
  let touchStartX = 0;
  slideshow?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  slideshow?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      const btn = dx < 0
        ? document.querySelector('.slide-arrow.next')
        : document.querySelector('.slide-arrow.prev');
      btn?.click();
    }
  }, { passive: true });
});