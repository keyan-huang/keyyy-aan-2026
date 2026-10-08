const organicTargets = [
  { center: 0.1, y: 0.05, size: 104, rotate: -4 },
  { center: 0.9, y: 0.035, size: 104, rotate: 5 },
  { center: 0.07, y: 0.23, size: 90, rotate: 3 },
  { center: 0.93, y: 0.215, size: 90, rotate: -4 },
  { center: 0.05, y: 0.41, size: 110, rotate: -3 },
  { center: 0.95, y: 0.395, size: 110, rotate: 4 },
  { center: 0.05, y: 0.59, size: 100, rotate: 5 },
  { center: 0.95, y: 0.575, size: 100, rotate: -5 },
  { center: 0.07, y: 0.77, size: 106, rotate: -4 },
  { center: 0.93, y: 0.755, size: 106, rotate: 3 },
  { center: 0.1, y: 0.95, size: 88, rotate: 4 },
  { center: 0.9, y: 0.935, size: 88, rotate: -3 },
];

export function mountHeroScrollStory(section) {
  const track = section.querySelector('.hero-story-track');
  const stage = section.querySelector('.hero-story-sticky');
  const heading = stage.querySelector('.hero-story-heading');
  const summary = stage.querySelector('.hero-story-summary');
  const items = [...stage.querySelectorAll('.hero-story-art')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const listenerOptions = { signal: controller.signal };
  let revealQueue = Promise.resolve();

  const queueReveal = (item) => {
    revealQueue = revealQueue.then(
      () =>
        new Promise((resolve) => {
          if (!controller.signal.aborted)
            item.classList.add('hero-story-art--ready');
          setTimeout(resolve, 70);
        }),
    );
  };

  items.forEach((item, index) => {
    const image = item.querySelector('img');
    const reveal = () => {
      item.style.backgroundImage = `url("${image.currentSrc || image.src}")`;
      queueReveal(item);
    };
    item.style.setProperty('--hero-float-x', index % 2 ? '-2px' : '2px');
    item.style.setProperty('--hero-float-delay', `${-index * 0.37}s`);
    item.style.setProperty(
      '--hero-float-duration',
      `${5.2 + (index % 4) * 0.55}s`,
    );
    if (image.complete && image.naturalWidth) reveal();
    else {
      image.addEventListener('load', reveal, listenerOptions);
      image.addEventListener(
        'error',
        () => {
          console.error(
            'Hero artwork failed to load.',
            image.currentSrc || image.src,
          );
        },
        listenerOptions,
      );
    }
  });

  const clamp = (value, minimum = 0, maximum = 1) =>
    Math.min(maximum, Math.max(minimum, value));
  const mix = (start, end, progress) =>
    start + (end - start) * progress;

  const render = () => {
    if (stage.offsetParent === null) return;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
    const travel = Math.max(track.offsetHeight - height, 1);
    const rawProgress = clamp(
      (stickyTop - track.getBoundingClientRect().top) / travel,
    );
    const transitionProgress = clamp(rawProgress / 0.65);
    const smoothProgress =
      transitionProgress *
      transitionProgress *
      (3 - 2 * transitionProgress);
    const progress = reducedMotion.matches
      ? Number(transitionProgress >= 0.5)
      : smoothProgress;
    const mobile = width < 700;
    const summaryProgress = clamp((progress - 0.38) / 0.42);
    const balanceOffset = height * 0.0085;

    heading.style.opacity = String(1 - summaryProgress);
    summary.style.opacity = String(summaryProgress);
    stage.dataset.state =
      progress > 0.8
        ? 'revealed'
        : progress > 0.1
          ? 'revealing'
          : 'scattered';

    items.forEach((item, index) => {
      const sourceSize =
        Number.parseFloat(item.dataset.size) * (mobile ? 0.52 : 1);
      const sourceX = clamp(
        Number.parseFloat(item.dataset.x) * width - sourceSize / 2,
        0,
        width - sourceSize,
      );
      const sourceY =
        Number.parseFloat(item.dataset.y) * (height - sourceSize) +
        balanceOffset;
      const target = organicTargets[index];
      const finalSize = target.size * (mobile ? 0.55 : 1);
      const targetX = mobile
        ? index % 2
          ? width - finalSize - 4
          : 4
        : target.center * width - finalSize / 2;
      const targetY = target.y * (height - finalSize) + balanceOffset;
      const size = mix(sourceSize, finalSize, progress);
      const x = mix(sourceX, targetX, progress);
      const y = mix(sourceY, targetY, progress);
      const rotation = mix(
        Number.parseFloat(item.dataset.rotate),
        target.rotate,
        progress,
      );

      item.style.width = `${size}px`;
      item.style.height = `${size}px`;
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.rotate = `${rotation}deg`;
    });
  };

  const observer = new ResizeObserver(render);
  observer.observe(stage);
  observer.observe(track);
  addEventListener('scroll', render, {
    ...listenerOptions,
    passive: true,
  });
  reducedMotion.addEventListener('change', render, listenerOptions);
  render();

  return () => {
    controller.abort();
    observer.disconnect();
  };
}
