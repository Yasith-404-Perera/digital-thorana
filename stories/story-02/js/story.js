document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (e) => {
    const prev = document.querySelector('.slide-arrow.prev');
    const next = document.querySelector('.slide-arrow.next');
    if (e.key === 'ArrowLeft')  prev?.click();
    if (e.key === 'ArrowRight') next?.click();
  });

  document.querySelectorAll('.slide img, .slide video').forEach(media => {
    const src = media.getAttribute('src') || '';
    if (src && src !== 'PLACEHOLDER' && !src.startsWith('PLACEHOLDER')) {
      const placeholder = media.closest('.slide')?.querySelector('.slide-placeholder');
      if (placeholder) placeholder.remove();
      media.style.display = 'block';
    }
  });

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

  const video = document.getElementById('storyVideo');
  const container = document.getElementById('storyVideoContainer');
  const overlay = document.getElementById('videoEndOverlay');
  const replayBtn = document.getElementById('replayBtn');

  if (video && container && overlay && replayBtn) {
    container.classList.add('visible');
    video.addEventListener('ended', () => {
      overlay.classList.add('visible');
    });
    replayBtn.addEventListener('click', () => {
      overlay.classList.remove('visible');
      video.currentTime = 0;
      video.play();
    });
  }
});
