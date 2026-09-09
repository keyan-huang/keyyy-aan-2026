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
    <section className="hobby-scroll" ref={section} aria-label="Keyan's creative interests">
      <section className="hobby-viewport" aria-label="Hobby gallery" aria-keyshortcuts="ArrowLeft ArrowRight Home End">
        <div className="hobbies">
          {images.map(({ src, label }) => (
            <div className="hobby-card" key={src}>
              <Image className="art" src={src} alt={label} width={1000} height={1000} loading="lazy" unoptimized />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}