import Image from 'next/image';
import type { CSSProperties } from 'react';
import site from '@/public/content/site.json';

export function SiteFooter() {
  return (
    <footer className="site-footer home-footer" id="connect">
      <div className="footer-inner">
        <div className="contact-content">
          <h2>{site.footerMessage}</h2>
          <p className="footer-description">{site.footerDescription}</p>
          <p className="footer-availability">
            <span className="footer-status-dot" aria-hidden="true" />
            Open to opportunity
          </p>
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
        <div className="footer-art-stage" aria-hidden="true">
          {site.footerArt.map((src, index) => (
            <Image
              className="footer-swap-image"
              src={`/${src}`}
              alt=""
              width={1000}
              height={1000}
              unoptimized
              key={src}
              style={{ '--footer-art-index': index } as CSSProperties}
            />
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2026 Keyan Huang. All rights reserved. Designed with love and passion
          by a curious mind.
        </p>
      </div>
    </footer>
  );
}
