'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { mountHobbyScroll } from '@/public/scripts/hobby-scroll.js';

export function HobbyGallery({ images }: { images: readonly { src: string; label: string }[] }) {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    if (section.current) return mountHobbyScroll(section.current);
  }, []);
  return (
    <section className="hobby-scroll" ref={section} aria-label="Life beyond the screen">
      <section className="hobby-viewport" aria-label="A gallery of Keyan's life and creative interests" aria-keyshortcuts="ArrowLeft ArrowRight Home End" tabIndex={0}>
        <div className="hobbies">
          {images.map(({ src, label }) => (
            <figure className="hobby-card photo-card" key={src}>
              <Image src={src} alt={label} width={1800} height={1350} loading="lazy" unoptimized />
            </figure>
          ))}
        </div>
      </section>
    </section>
  );
}