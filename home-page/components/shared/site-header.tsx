import site from '@/public/content/site.json';
import { Artwork } from './artwork';
import { ContactMenu } from './contact-menu';

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#work">
        Skip to selected projects
      </a>
      <header className="navigation">
        <a href="#top" aria-label="Back to top">
          <Artwork src={`/${site.logo}`} className="logo" />
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
