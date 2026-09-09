export function mountContactMenu(container, site) {
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'nav-contact';
  trigger.textContent = 'Contact';
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-expanded', 'false');
  const menu = document.createElement('div');
  menu.className = 'contact-menu';
  menu.id = `contact-menu-${crypto.randomUUID()}`;
  menu.popover = 'auto';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'Contact Keyan');
  trigger.setAttribute('aria-controls', menu.id);
  let dismissTimer;

  const entries = [
    {
      kind: 'linkedin',
      symbol: 'in',
      label: 'LinkedIn',
      detail: 'Connect professionally',
      href: site.contact.linkedin,
    },
    {
      kind: 'email',
      symbol: 'E',
      label: 'Email me',
      detail: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
    { kind: 'resume', symbol: 'R', label: 'Resume', detail: 'Coming soon' },
  ];
  const items = entries.map((entry) => {
    const item = document.createElement(entry.href ? 'a' : 'button');
    item.className = 'contact-menu-item';
    item.setAttribute('role', 'menuitem');
    item.tabIndex = -1;
    if (entry.href) {
      item.setAttribute('href', entry.href);
      if (entry.kind === 'linkedin') {
        item.setAttribute('target', '_blank');
        item.setAttribute('rel', 'noopener noreferrer');
      }
    } else {
      item.setAttribute('type', 'button');
      item.setAttribute('aria-disabled', 'true');
    }
    const symbol = document.createElement('span');
    symbol.className = `contact-color contact-color-${entry.kind}`;
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = entry.symbol;
    const text = document.createElement('span');
    const label = document.createElement('strong');
    label.textContent = entry.label;
    const detail = document.createElement('small');
    detail.textContent = entry.detail;
    text.append(label, detail);
    item.append(symbol, text);
    item.addEventListener('click', (event) => {
      if (!entry.href) event.preventDefault();
      else menu.hidePopover();
    });
    menu.append(item);
    return item;
  });

  const position = () => {
    if (!menu.matches(':popover-open')) return;
    const anchor = trigger.getBoundingClientRect();
    const bounds = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(16, Math.min(anchor.right - bounds.width, innerWidth - bounds.width - 16))}px`;
    menu.style.top = `${Math.max(16, Math.min(anchor.bottom + 14, innerHeight - bounds.height - 16))}px`;
  };
  const open = () => {
    clearTimeout(dismissTimer);
    if (!menu.matches(':popover-open')) menu.showPopover();
    position();
  };
  const close = () => {
    clearTimeout(dismissTimer);
    if (menu.matches(':popover-open')) menu.hidePopover();
  };
  const scheduleClose = () => {
    clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => {
      if (!trigger.matches(':hover') && !menu.matches(':hover') && !menu.contains(document.activeElement)) close();
    }, 180);
  };
  menu.addEventListener('toggle', () => {
    const open = menu.matches(':popover-open');
    trigger.setAttribute('aria-expanded', String(open));
    if (open) {
      position();
      if (document.activeElement === trigger) items[0].focus();
    }
  });
  trigger.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') open();
  });
  trigger.addEventListener('pointerleave', scheduleClose);
  trigger.addEventListener('click', () => {
    if (menu.matches(':popover-open')) close();
    else open();
  });
  menu.addEventListener('pointerenter', () => clearTimeout(dismissTimer));
  menu.addEventListener('pointerleave', scheduleClose);
  trigger.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    open();
    items[event.key === 'ArrowDown' ? 0 : items.length - 1].focus();
  });
  menu.addEventListener('keydown', (event) => {
    const current = items.indexOf(document.activeElement);
    let next;
    if (event.key === 'ArrowDown') next = (current + 1) % items.length;
    if (event.key === 'ArrowUp')
      next = (current - 1 + items.length) % items.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = items.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      items[next].focus();
    }
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      menu.hidePopover();
      trigger.focus();
    }
  });
  container.append(trigger);
  document.body.append(menu);
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, true);
  return () => {
    clearTimeout(dismissTimer);
    window.removeEventListener('resize', position);
    window.removeEventListener('scroll', position, true);
    trigger.remove();
    menu.remove();
  };
}
