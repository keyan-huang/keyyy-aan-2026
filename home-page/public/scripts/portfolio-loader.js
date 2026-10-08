export function mountPortfolioLoader(loader) {
  const meter = loader.querySelector('.portfolio-loader-meter');
  const fill = loader.querySelector('.portfolio-loader-fill');
  const criticalImages = [
    ...document.querySelectorAll(
      '.portfolio-loader-swap-image, .navigation .logo, .hero-story .hero-story-image',
    ),
  ];
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const startedAt = performance.now();
  const minimumDuration = 2600;
  const resources = criticalImages.length + 1;
  let active = true;
  let settled = 0;
  let dismissed = false;
  let hideTimer;

  document.documentElement.classList.add('portfolio-loading');

  const update = (value) => {
    meter.value = value;
    fill.style.width = `${value}%`;
    const rounded = Math.floor(value);
    meter.textContent = `${rounded}%`;
  };

  const dismiss = () => {
    if (!active || dismissed || settled < resources) return;
    dismissed = true;
    clearInterval(progressTimer);
    loader.classList.add('portfolio-loader--complete');
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    document.documentElement.classList.remove('portfolio-loading');
    const finish = () => {
      clearTimeout(hideTimer);
      loader.hidden = true;
    };
    loader.addEventListener('transitionend', finish, {
      ...options,
      once: true,
    });
    hideTimer = setTimeout(finish, 800);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
  };

  const markSettled = () => {
    if (!active) return;
    settled += 1;
  };

  criticalImages.forEach((image) => {
    let imageSettled = false;
    const settleImage = () => {
      if (imageSettled) return;
      imageSettled = true;
      markSettled();
    };
    if (image.complete) {
      if (!image.naturalWidth) {
        console.error(
          'Portfolio loader: critical image failed.',
          image.currentSrc || image.src,
        );
      }
      settleImage();
      return;
    }
    image.addEventListener('load', settleImage, { ...options, once: true });
    image.addEventListener(
      'error',
      () => {
        console.error(
          'Portfolio loader: critical image failed.',
          image.currentSrc || image.src,
        );
        settleImage();
      },
      { ...options, once: true },
    );
  });

  void document.fonts.ready.then(markSettled);

  const animateProgress = () => {
    if (!active) return;
    const now = performance.now();
    const timeProgress = Math.min(
      100,
      ((now - startedAt) / minimumDuration) * 100,
    );
    const resourceProgress = (settled / resources) * 100;
    const displayedProgress = Math.min(timeProgress, resourceProgress);
    update(displayedProgress);
    if (timeProgress >= 100 && settled >= resources) {
      update(100);
      dismiss();
    }
  };

  const timeout = setTimeout(() => {
    if (!active || settled >= resources) return;
    console.error(
      'Portfolio loader: critical resources timed out.',
      resources - settled,
    );
    settled = resources;
  }, 15000);
  update(0);
  const progressTimer = setInterval(animateProgress, 50);
  animateProgress();

  return () => {
    active = false;
    controller.abort();
    clearTimeout(timeout);
    clearTimeout(hideTimer);
    clearInterval(progressTimer);
    document.documentElement.classList.remove('portfolio-loading');
  };
}
