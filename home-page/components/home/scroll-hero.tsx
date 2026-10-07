'use client';

import { useEffect, useRef } from 'react';
import { ResponsiveImage } from '@/components/shared/responsive-image';
import { homeContent } from '@/content/home';
import { imageSizes } from '@/public/scripts/responsive-images.js';
import { mountHeroScrollStory } from '@/public/scripts/hero-scroll-story.js';

const storyArtwork = [
  {
    src: '/images/imgCursor1.png',
    x: 0.92,
    y: 0.88,
    size: 130,
    rotate: -8,
  },
  {
    src: '/images/imgApron1.png',
    x: 0.08,
    y: 0.1,
    size: 152,
    rotate: -3,
  },
  {
    src: '/images/imgBrushes2.png',
    x: 0.29,
    y: 0.04,
    size: 130,
    rotate: 5,
  },
  {
    src: '/images/imgBinoculars1.png',
    x: 0.71,
    y: 0.04,
    size: 124,
    rotate: -4,
  },
  {
    src: '/images/imgBike1.png',
    x: 0.5,
    y: 0,
    size: 155,
    rotate: 4,
  },
  {
    src: '/images/imgPot2.png',
    x: 0.5,
    y: 0.98,
    size: 134,
    rotate: -4,
  },
  {
    src: '/images/imgSunflower1.png',
    x: 0.92,
    y: 0.5,
    size: 150,
    rotate: 0,
  },
  {
    src: '/images/imgGeoshape2.png',
    x: 0.08,
    y: 0.5,
    size: 142,
    rotate: -8,
  },
  {
    src: '/images/imgWaterpot2.png',
    x: 0.71,
    y: 0.9,
    size: 138,
    rotate: 4,
  },
  {
    src: '/images/imgSewingmachine1.png',
    x: 0.92,
    y: 0.1,
    size: 145,
    rotate: -2,
  },
  {
    src: '/images/imgShovel1.png',
    x: 0.08,
    y: 0.88,
    size: 120,
    rotate: -2,
  },
  {
    src: '/images/imgSpoon1.png',
    x: 0.29,
    y: 0.9,
    size: 124,
    rotate: 2,
  },
] as const;

const emphasisPattern = new RegExp(
  `(${homeContent.introduction.headingEmphasis
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})`,
);

export function ScrollHero() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    if (section.current) return mountHeroScrollStory(section.current);
  }, []);

  return (
    <section
      ref={section}
      className="intro hero-story"
      aria-label="Introduction"
    >
      <div className="hero-story-track">
        <div className="hero-story-sticky">
          <div className="hero-story-copy">
            <div className="hero-story-heading">
              <p className="availability">
                <span className="availability-dot" aria-hidden="true" />
                {homeContent.introduction.availability}
              </p>
              <h1>
                {homeContent.introduction.heading
                  .split('\n')
                  .map((line) => (
                    <span className="hero-line" key={line}>
                      {line.split(emphasisPattern).map((part, partIndex) =>
                        homeContent.introduction.headingEmphasis.some(
                          (phrase) => phrase === part,
                        ) ? (
                          <strong className="hero-emphasis" key={partIndex}>
                            {part}
                          </strong>
                        ) : (
                          part
                        ),
                      )}
                    </span>
                  ))}
              </h1>
            </div>
            <p className="hero-story-summary">
              {homeContent.introduction.summary}
            </p>
          </div>
          {storyArtwork.map((artwork) => (
            <div
              className="hero-story-art"
              data-rotate={artwork.rotate}
              data-size={artwork.size}
              data-x={artwork.x}
              data-y={artwork.y}
              key={artwork.src}
              aria-hidden="true"
            >
              <ResponsiveImage
                className="hero-story-image"
                src={artwork.src}
                alt=""
                sizes={imageSizes.illustration}
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
