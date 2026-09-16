(async () => {
  const script = document.currentScript;
  if (!(script instanceof HTMLScriptElement)) return;

  const configUrl = new URL('../content/site.json', script.src);
  const response = await fetch(configUrl);
  if (!response.ok) {
    throw new Error(
      `Unable to load shared site configuration: ${response.status}`,
    );
  }
  const site = await response.json();
  const root = document.body.dataset.siteRoot || '/';
  const fromRoot = (path) => `${root}${path}`;

  if (document.querySelector('.case-study')) {
    const backToTop = document.createElement('button');
    backToTop.className = 'case-study-back-to-top';
    backToTop.type = 'button';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = `
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>`;

    const updateBackToTop = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 320);
    };

    backToTop.addEventListener('click', () => {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth';
      window.scrollTo({ top: 0, behavior });
    });
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('pageshow', updateBackToTop);
    document.body.append(backToTop);
    updateBackToTop();
  }

  const headerMount = document.querySelector('[data-site-header]');
  if (headerMount) {
    const header = document.createElement('header');
    header.className = 'navigation';

    const logoLink = document.createElement('a');
    logoLink.href = root;
    logoLink.setAttribute('aria-label', `${site.name} homepage`);
    const logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = fromRoot(site.logo);
    logo.alt = '';
    logoLink.append(logo);

    const navigation = document.createElement('nav');
    navigation.setAttribute('aria-label', 'Main navigation');
    for (const item of site.navigation) {
      const link = document.createElement('a');
      link.href = `${root}#${item.section}`;
      link.textContent = item.label;
      navigation.append(link);
    }
    const { mountContactMenu } = await import(
      new URL('./contact-menu.js', script.src).href
    );
    mountContactMenu(navigation, site);
    header.append(logoLink, navigation);
    headerMount.replaceWith(header);
  }

  const footerMount = document.querySelector('[data-site-footer]');
  if (footerMount) {
    const art = site.footerArt
      .map(
        (src, index) =>
          `<img class="footer-swap-image" style="--footer-art-index:${index}" src="${fromRoot(src)}" alt="">`,
      )
      .join('');
    const footer = document.createElement('footer');
    footer.className = 'site-footer home-footer';
    footer.id = 'connect';
    footer.innerHTML = `
      <div class="footer-inner">
        <div class="contact-content">
          <h2>${site.footerMessage}</h2>
          <p class="footer-description">${site.footerDescription}</p>
          <p class="footer-availability"><span class="footer-status-dot" aria-hidden="true"></span>Open to opportunity</p>
          <div class="contact-links">
            <a class="contact linkedin" href="${site.contact.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a class="contact email" href="mailto:${site.contact.email}">Email</a>
            <a class="contact resume" href="${site.contact.resumeUrl}" target="_blank" rel="noopener noreferrer" aria-label="View resume (PDF, opens in a new tab)">Resume</a>
          </div>
        </div>
        <div class="footer-art-stage" aria-hidden="true">${art}</div>
      </div>
      <div class="footer-bottom"><p class="footer-copyright">© 2026 Keyan Huang. All rights reserved. Designed with love and passion by a curious mind.</p></div>`;
    footerMount.replaceWith(footer);
  }
})().catch((error) => {
  console.error('Unable to render the shared site shell.', error);
});
