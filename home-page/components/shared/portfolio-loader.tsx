'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { mountPortfolioLoader } from '@/public/scripts/portfolio-loader.js';

const loaderArtwork = [
  '/images/loader-stack/cursor.png?v=2x',
  '/images/loader-stack/balloon.png?v=2x',
  '/images/loader-stack/sunflower.png?v=2x',
  '/images/loader-stack/geoshape.png?v=2x',
  '/images/loader-stack/apron.png?v=2x',
] as const;

export function PortfolioLoader() {
  const loader = useRef<HTMLOutputElement>(null);

  useEffect(() => {
    if (loader.current) return mountPortfolioLoader(loader.current);
  }, []);

  return (
    <output
      ref={loader}
      className="portfolio-loader"
      aria-label="Loading portfolio"
    >
      <div className="portfolio-loader-content">
        <div className="portfolio-loader-art-stage" aria-hidden="true">
          {loaderArtwork.map((src, index) => (
            // oxlint-disable-next-line next/no-img-element -- Small dedicated loader assets render before hydration.
            <img
              className="portfolio-loader-swap-image"
              src={src}
              alt=""
              width="180"
              height="180"
              loading="eager"
              decoding="async"
              style={
                {
                  '--portfolio-loader-art-index': index,
                } as CSSProperties
              }
              key={src}
            />
          ))}
        </div>
        <div className="portfolio-loader-bar" aria-hidden="true">
          <span className="portfolio-loader-fill" />
        </div>
        <progress
          className="portfolio-loader-meter"
          aria-label="Portfolio loading progress"
          max="100"
          value="0"
        >
          0%
        </progress>
      </div>
    </output>
  );
}
