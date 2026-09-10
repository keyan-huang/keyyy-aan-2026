export function mountGalleryTilt(gallery) {
  if (!gallery) return () => {};

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const cards = [...gallery.querySelectorAll('.photo-card')];
  const frames = new WeakMap();

  const reset = card => {
    const frame = frames.get(card);
    if (frame) cancelAnimationFrame(frame);
    frames.delete(card);
    card.classList.remove('is-tilting');
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  for (const card of cards) {
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const previous = frames.get(card);
      if (previous) cancelAnimationFrame(previous);
      frames.set(card, requestAnimationFrame(() => {
        frames.delete(card);
        const bounds = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        card.classList.add('is-tilting');
        card.style.setProperty('--tilt-x', `${((0.5 - y) * 9).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${((x - 0.5) * 9).toFixed(2)}deg`);
      }));
    }, options);
    card.addEventListener('pointerleave', () => reset(card), options);
    card.addEventListener('pointercancel', () => reset(card), options);
  }

  const resetAll = () => cards.forEach(reset);
  finePointer.addEventListener('change', resetAll, options);
  reducedMotion.addEventListener('change', resetAll, options);

  return () => {
    resetAll();
    controller.abort();
  };
}
