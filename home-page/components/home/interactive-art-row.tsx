'use client';

import { useEffect, useRef } from 'react';
import { mountArtRow } from '@/public/scripts/art-interactions.js';

export function InteractiveArtRow({ kind }: { kind: 'navigation' | 'quotes' }) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (container.current) return mountArtRow(container.current, kind);
  }, [kind]);
  return <div ref={container} className={`art-row ${kind === 'navigation' ? 'first-row' : 'second-row'}`} />;
}