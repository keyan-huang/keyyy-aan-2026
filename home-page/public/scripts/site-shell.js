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
  document.querySelector('[data-site-header]')?.replaceWith(header);

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.id = 'contact';
  footer.innerHTML = `
    <div class="footer-inner">
      <img class="footer-balloon" src="${fromRoot(site.footerImage)}" alt="">
      <div class="contact-content">
        <h2>${site.footerMessage}</h2>
        <div class="contact-links">
          <a class="contact linkedin" href="${site.contact.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a class="contact email" href="mailto:${site.contact.email}">Email</a>
          <span class="contact resume" aria-label="Resume coming soon">Resume</span>
        </div>
      </div>
    </div>`;
  document.querySelector('[data-site-footer]')?.replaceWith(footer);
})().catch((error) => {
  console.error('Unable to render the shared site shell.', error);
});
