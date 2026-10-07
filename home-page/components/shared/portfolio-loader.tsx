'use client';

import { useEffect, useRef } from 'react';
import { mountPortfolioLoader } from '@/public/scripts/portfolio-loader.js';

export function PortfolioLoader() {
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loader.current) return mountPortfolioLoader(loader.current);
  }, []);

  return (
    <div
      ref={loader}
      className="portfolio-loader"
      role="status"
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
        <div
          className="portfolio-loader-meter"
          role="progressbar"
          aria-label="Portfolio loading progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
        >
          <span className="portfolio-loader-fill" />
        </div>
      </div>
    </div>
  );
}
