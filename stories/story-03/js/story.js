document.addEventListener('DOMContentLoaded', () => {
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
