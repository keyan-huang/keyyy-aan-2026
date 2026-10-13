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

  // Settle only within the two hero states. The last direction wins so the
  // artwork continues with the user's momentum instead of falling back to the
  // nearest state. A short custom animation avoids the pause and long easing
  // tail of the browser's generic smooth-scroll behavior.
  let settleTimer;
  let snapping = false;
  let snapFrame;
  let lastScrollY = window.scrollY;
  let lastDirection = 0;

  const getHeroBounds = () => {
    const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
    const travel = Math.max(track.offsetHeight - stage.clientHeight, 1);
    const start =
      window.scrollY + track.getBoundingClientRect().top - stickyTop;
    return { start, finish: start + travel * 0.65 };
  };

  const cancelSnap = () => {
    if (snapFrame) cancelAnimationFrame(snapFrame);
    snapFrame = undefined;
    snapping = false;
  };

  const animateSnap = (destination) => {
    const origin = window.scrollY;
    const distance = destination - origin;
    if (Math.abs(distance) < 2 || reducedMotion.matches) {
      window.scrollTo(0, Math.max(0, destination));
      return;
    }

    snapping = true;
    const startedAt = performance.now();
    const duration = clamp(145 + Math.abs(distance) * 0.16, 170, 285);

    const step = (now) => {
      if (!snapping || controller.signal.aborted) return;
      const elapsed = clamp((now - startedAt) / duration);
      const eased = 1 - (1 - elapsed) ** 3;
      window.scrollTo(0, origin + distance * eased);
      if (elapsed < 1) {
        snapFrame = requestAnimationFrame(step);
      } else {
        snapFrame = undefined;
        snapping = false;
      }
    };

    snapFrame = requestAnimationFrame(step);
  };

  const settleHero = () => {
    if (snapping || controller.signal.aborted) return;
    const { start, finish } = getHeroBounds();
    const current = window.scrollY;
    // Do not pull the user back into the hero after they've scrolled past it.
    if (current < start - 8 || current > finish + 60) return;
    const destination =
      lastDirection > 0
        ? finish
        : lastDirection < 0
          ? start
          : current < (start + finish) / 2
            ? start
            : finish;
    animateSnap(destination);
  };
  const scheduleSettle = () => {
    if (snapping) return;
    clearTimeout(settleTimer);
    // One missed animation frame is enough to treat the gesture as released.
    // This keeps the snap visually attached to the user's existing momentum.
    settleTimer = setTimeout(settleHero, 18);
  };
  const handleScroll = () => {
    const current = window.scrollY;
    const delta = current - lastScrollY;
    if (!snapping && Math.abs(delta) > 0.5) {
      lastDirection = Math.sign(delta);
    }
    lastScrollY = current;
    render();
    scheduleSettle();
  };
  const handleWheel = (event) => {
    if (snapping) cancelSnap();
    if (Math.abs(event.deltaY) > 0.5) lastDirection = Math.sign(event.deltaY);
  };
  const handleTouchStart = () => {
    if (snapping) cancelSnap();
  };

  const observer = new ResizeObserver(render);
  observer.observe(stage);
  observer.observe(track);
  addEventListener('scroll', handleScroll, {
    ...listenerOptions,
    passive: true,
  });
  addEventListener('scrollend', settleHero, listenerOptions);
  addEventListener('wheel', handleWheel, {
    ...listenerOptions,
    passive: true,
  });
  addEventListener('touchstart', handleTouchStart, {
    ...listenerOptions,
    passive: true,
  });
  reducedMotion.addEventListener('change', render, listenerOptions);
  render();

  return () => {
    controller.abort();
    clearTimeout(settleTimer);
    cancelSnap();
    observer.disconnect();
  };
}
