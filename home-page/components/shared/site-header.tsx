import site from '@/public/content/site.json';
import { imageSizes } from '@/public/scripts/responsive-images.js';
import { ContactMenu } from './contact-menu';
import { ResponsiveImage } from './responsive-image';

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#work">
        Skip to selected projects
      </a>
      <header className="navigation">
        <a href="#top" aria-label="Back to top">
          <ResponsiveImage
            className="art logo"
            src={`/${site.logo}`}
            alt=""
            sizes={imageSizes.logo}
            loading="eager"
          />
        </a>
        <nav aria-label="Main navigation">
          {site.navigation.map((item) => (
            <a href={`#${item.section}`} key={item.section}>
              {item.label}
            </a>
          ))}
          <ContactMenu />
        </nav>
      </header>
    </>
  );
}
