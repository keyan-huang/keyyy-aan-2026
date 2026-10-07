'use client';

import { useEffect, useRef } from 'react';
import { mountPortfolioLoader } from '@/public/scripts/portfolio-loader.js';

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
        {/* oxlint-disable-next-line next/no-img-element -- This critical logo must render before app hydration. */}
        <img
          className="portfolio-loader-logo"
          src="/images/portfolio-loader-logo.png"
          alt=""
          width="96"
          height="96"
        />
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
