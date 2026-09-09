const rows = {
  navigation: [
    { image: 'imgCursor1.png', label: 'Explore my work', text: 'Go check out my very cool projects!', href: '#work', color: 'blue' },
    { image: 'imgBallon2.png', label: 'Explore my experiments', text: 'See what I love to explore.', href: '#fun', color: 'blue' },
    { image: 'imgSunflower1.png', label: 'About Keyan', text: 'Learn more about me.', href: '#me', color: 'blue' },
    { image: 'imgGeoshape2.png', label: 'Open Contact menu', text: "Let's connect!", color: 'blue' },
  ],
  quotes: [
    { image: 'imgApron1.png', label: 'Teamwork quote', text: 'Keyan is such a team player. We could not have completed this project without her dedication and effort.', source: 'Previous teammate', color: 'orange' },
    { image: 'imgBike1.png', label: 'Systems thinking quote', text: 'I trusted Keyan with our most complex systems projects. Her systematic thinking gave me confidence that she would see them through.', source: 'Team manager', color: 'green' },
    { image: 'imgWaterpot2.png', label: 'Creativity quote', text: 'Keyan brings such a fun, creative spirit. I am always impressed by what she makes with her hands: a talented artist and designer.', source: 'College professor', color: 'pink' },
    { image: 'imgShovel1.png', label: 'Research quote', text: 'Keyan asks the right questions at the right moments. Her research helped us move this project forward and bring it to completion.', source: 'Product manager', color: 'purple' },
  ],
};

export function mountArtRow(container, kind) {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const bubble = document.createElement('div');
  bubble.className = 'art-bubble';
  bubble.id = `art-bubble-${crypto.randomUUID()}`;
  bubble.setAttribute('role', 'tooltip');
  bubble.hidden = true;
  document.body.append(bubble);
  let active = null;
  let dismissTimer;

  const hide = () => {
    clearTimeout(dismissTimer);
    active?.classList.remove('art-active');
    active?.removeAttribute('aria-describedby');
    active = null;
    bubble.hidden = true;
  };
  const position = () => {
    if (!active) return;
    const anchor = active.getBoundingClientRect();
    const bounds = bubble.getBoundingClientRect();
    const left = Math.max(16, Math.min(anchor.left + anchor.width / 2 - bounds.width / 2, innerWidth - bounds.width - 16));
    const aboveTop = anchor.top - bounds.height - 18;
    const navigationBottom = document.querySelector('.navigation')?.getBoundingClientRect().bottom ?? 0;
    const above = aboveTop >= navigationBottom + 12;
    bubble.dataset.side = above ? 'above' : 'below';
    bubble.style.left = `${left}px`;
    bubble.style.top = `${Math.max(16, Math.min(above ? aboveTop : anchor.bottom + 18, innerHeight - bounds.height - 16))}px`;
    bubble.style.setProperty('--pointer-left', `${Math.max(22, Math.min(anchor.left + anchor.width / 2 - left, bounds.width - 30))}px`);
  };
  const show = (trigger, entry) => {
    hide();
    active = trigger;
    bubble.className = `art-bubble art-bubble-${entry.color}`;
    const text = document.createElement('p');
    text.textContent = entry.text;
    bubble.replaceChildren(text);
    if (entry.source) {
      const source = document.createElement('small');
      source.textContent = `${entry.source} / Draft placeholder quote`;
      bubble.append(source);
    }
    bubble.hidden = false;
    trigger.classList.add('art-active');
    trigger.setAttribute('aria-describedby', bubble.id);
    position();
  };
  const scheduleHide = () => {
    clearTimeout(dismissTimer);
    dismissTimer = setTimeout(hide, 180);
  };
  for (const entry of rows[kind]) {
    const trigger = document.createElement(entry.href ? 'a' : 'button');
    trigger.className = 'art-trigger';
    trigger.setAttribute('aria-label', entry.label);
    if (entry.href) trigger.href = entry.href;
    else trigger.type = 'button';
    if (kind === 'navigation' && !entry.href) trigger.setAttribute('aria-haspopup', 'menu');
    const image = document.createElement('img');
    image.src = `/images/${entry.image}`;
    image.alt = '';
    image.className = 'art';
    image.width = 1000;
    image.height = 1000;
    image.decoding = 'async';
    trigger.append(image);
    trigger.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') show(trigger, entry);
    }, options);
    trigger.addEventListener('pointerleave', scheduleHide, options);
    trigger.addEventListener('focus', () => show(trigger, entry), options);
    trigger.addEventListener('blur', scheduleHide, options);
    trigger.addEventListener('click', () => {
      if (kind === 'quotes') {
        show(trigger, entry);
      } else {
        hide();
        if (!entry.href) {
          const contact = document.querySelector('.nav-contact');
          contact?.focus();
          const menu = contact && document.getElementById(contact.getAttribute('aria-controls'));
          if (menu && !menu.matches(':popover-open')) contact.click();
        }
      }
    }, options);
    container.append(trigger);
  }
  bubble.addEventListener('pointerenter', () => clearTimeout(dismissTimer), options);
  bubble.addEventListener('pointerleave', scheduleHide, options);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') hide();
  }, options);
  document.addEventListener('pointerdown', event => {
    if (!container.contains(event.target) && !bubble.contains(event.target)) hide();
  }, options);
  window.addEventListener('scroll', hide, { ...options, capture: true });
  window.addEventListener('resize', hide, options);
  return () => {
    hide();
    controller.abort();
    bubble.remove();
    container.replaceChildren();
  };
}