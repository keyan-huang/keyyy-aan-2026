export function mountHobbyScroll(section) {
  const viewport = section.querySelector('.hobby-viewport');
  const track = section.querySelector('.hobbies');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let travel = 0;
  let frame = 0;

  const update = () => {
    frame = 0;
    if (preference.matches || !travel) return;
    const top = parseFloat(getComputedStyle(viewport).top) || 0;
    viewport.scrollLeft = Math.max(0, Math.min(travel, top - section.getBoundingClientRect().top));
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const measure = () => {
    section.classList.toggle('scroll-driven', !preference.matches);
    travel = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    section.style.height = preference.matches ? '' : `${viewport.clientHeight + travel}px`;
    if (preference.matches) viewport.scrollLeft = 0;
    schedule();
  };
  viewport.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const distance = viewport.clientWidth * 0.75;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? travel : viewport.scrollLeft + (event.key === 'ArrowRight' ? distance : -distance);
    const destination = Math.max(0, Math.min(travel, next));
    if (preference.matches) viewport.scrollTo({ left: destination, behavior: 'auto' });
    else {
      const top = parseFloat(getComputedStyle(viewport).top) || 0;
      window.scrollTo({ top: scrollY + section.getBoundingClientRect().top - top + destination, behavior: 'instant' });
    }
  }, options);
  window.addEventListener('scroll', schedule, { ...options, passive: true });
  preference.addEventListener('change', measure, options);
  const observer = new ResizeObserver(measure);
  observer.observe(viewport);
  observer.observe(track);
  measure();
  return () => {
    controller.abort();
    observer.disconnect();
    cancelAnimationFrame(frame);
    section.classList.remove('scroll-driven');
    section.style.height = '';
  };
}