export function mountPortfolioLoader(loader) {
  const meter = loader.querySelector('.portfolio-loader-meter');
  const fill = loader.querySelector('.portfolio-loader-fill');
  const criticalImages = [
    ...document.querySelectorAll(
      '.portfolio-loader-logo, .navigation .logo, .hero-story .hero-story-image',
    ),
  ];
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const startedAt = performance.now();
  const minimumDuration = 500;
  const resources = criticalImages.length + 1;
  let active = true;
  let settled = 0;
  let dismissed = false;
  let dismissTimer;
  let hideTimer;

  document.documentElement.classList.add('portfolio-loading');

  const update = () => {
    if (!active) return;
    const value = Math.round((settled / resources) * 100);
    meter.setAttribute('aria-valuenow', String(value));
    fill.style.width = `${value}%`;
  };

  const dismiss = () => {
    if (!active || dismissed || settled < resources) return;
    dismissed = true;
    const delay = Math.max(0, minimumDuration - (performance.now() - startedAt));
    dismissTimer = setTimeout(() => {
      if (!active) return;
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
      hideTimer = setTimeout(finish, 400);
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    }, delay);
  };

  const markSettled = () => {
    if (!active) return;
    settled += 1;
    update();
    dismiss();
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

  document.fonts.ready.then(markSettled);
  const timeout = setTimeout(() => {
    if (!active || settled >= resources) return;
    console.error(
      'Portfolio loader: critical resources timed out.',
      resources - settled,
    );
    settled = resources;
    update();
    dismiss();
  }, 15000);
  update();

  return () => {
    active = false;
    controller.abort();
    clearTimeout(timeout);
    clearTimeout(dismissTimer);
    clearTimeout(hideTimer);
    document.documentElement.classList.remove('portfolio-loading');
  };
}
