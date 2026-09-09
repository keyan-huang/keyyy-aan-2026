import site from '@/public/content/site.json';
import { Artwork } from './artwork';

export function SiteFooter() {
  return (
    <footer className="site-footer home-footer" id="connect">
      <div className="footer-inner">
        <Artwork src={`/${site.footerImage}`} className="footer-balloon" />
        <div className="contact-content">
          <h2>{site.footerMessage}</h2>
          <div className="contact-links">
            <a
              className="contact linkedin"
              href={site.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a className="contact email" href={`mailto:${site.contact.email}`}>
              Email
            </a>
            <span className="contact resume" aria-label="Resume coming soon">
              Resume
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
