(function initAudioSceneSync() {
  const audio = document.getElementById('storyAudio');
  const stage = document.querySelector('.stage-inner');
  const panelRing = stage?.querySelector('.panel-ring');
  const panels = stage?.querySelectorAll('.narrative-panel');
  if (!audio || !panelRing || !panels?.length) return;

  const count = panels.length;
  const angleStep = 360 / count;

  const sceneTimeline = [
    { start: 0, end: 20 },
    { start: 20, end: 40 },
    { start: 40, end: 60 },
    { start: 60, end: 80 },
    { start: 80, end: 100 },
    { start: 100, end: 120 },
    { start: 120, end: 140 },
    { start: 140, end: 161 },
  ];

  let currentScene = -1;

  function updateScene(time) {
    let nextScene = -1;
    for (let i = 0; i < sceneTimeline.length; i++) {
      if (time >= sceneTimeline[i].start && time < sceneTimeline[i].end) {
        nextScene = i;
        break;
      }
    }

    if (nextScene === -1 || nextScene === currentScene) return;

    currentScene = nextScene;

    const rotation = -(angleStep * currentScene);
    panelRing.style.transform = `rotate(${rotation}deg)`;

    panels.forEach((panel, i) => {
      panel.classList.remove('scene-active', 'scene-adjacent');

      const counterRotation = -rotation;
      panel.style.transform = `rotate(${counterRotation}deg)`;

      if (i === currentScene) {
        panel.classList.add('scene-active');
      } else {
        const nextIdx = (currentScene + 1) % count;
        const prevIdx = (currentScene - 1 + count) % count;
        if (i === nextIdx || i === prevIdx) {
          panel.classList.add('scene-adjacent');
        }
      }
    });
  }

  audio.addEventListener('timeupdate', () => updateScene(audio.currentTime));
  audio.addEventListener('play', () => updateScene(audio.currentTime));

  audio.addEventListener('ended', () => {
    panelRing.style.transform = 'rotate(0deg)';
    panels.forEach((panel, i) => {
      panel.classList.remove('scene-active', 'scene-adjacent');
      panel.style.transform = 'rotate(0deg)';
    });
    currentScene = -1;
  });

  updateScene(0);

  setTimeout(() => {
    audio.play().catch(() => {
      audio.style.display = '';
    });
  }, 1000);
})();
