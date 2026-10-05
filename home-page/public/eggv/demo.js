const video = document.getElementById('demo-video');
const button = document.querySelector('[data-demo-toggle]');
const surface = document.querySelector('[data-demo-surface]');
const statusMessage = document.querySelector('[data-demo-status]');

if (
  !(video instanceof HTMLVideoElement) ||
  !(button instanceof HTMLButtonElement) ||
  !(surface instanceof HTMLButtonElement) ||
  !(statusMessage instanceof HTMLElement)
) {
  throw new Error(
    'EggV demo is missing its video, playback controls, or status element.',
  );
}

function syncControls() {
  const paused = video.paused || video.ended;
  button.textContent = paused ? 'Resume' : 'Pause';
  surface.setAttribute('aria-label', paused ? 'Resume demo' : 'Pause demo');
  button.disabled = Boolean(video.error);
  surface.disabled = Boolean(video.error);
}

function reportPlaybackError(error) {
  statusMessage.textContent = video.error
    ? 'Unable to load the demo. Please reload the page to try again.'
    : 'Playback could not start. Select Resume to try again.';
  statusMessage.hidden = false;
  console.error('Unable to play the EggV demo:', error);
  syncControls();
}

function resume() {
  statusMessage.hidden = true;
  video.play().catch((error) => {
    // Pausing while play() is pending deliberately cancels that request.
    if (
      error instanceof DOMException &&
      error.name === 'AbortError' &&
      video.paused &&
      !video.error
    ) {
      return;
    }
    reportPlaybackError(error);
  });
}

function togglePlayback() {
  if (video.paused) resume();
  else video.pause();
}

button.addEventListener('click', togglePlayback);
surface.addEventListener('click', togglePlayback);
video.addEventListener('play', syncControls);
video.addEventListener('pause', syncControls);
video.addEventListener('ended', syncControls);
video.addEventListener('error', () => reportPlaybackError(video.error));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
reducedMotion.addEventListener('change', (event) => {
  if (event.matches) video.pause();
});

video.controls = false;
video.muted = true;
button.hidden = false;
surface.hidden = false;
syncControls();
if (!reducedMotion.matches) resume();
