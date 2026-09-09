'use client';

import { useEffect, useRef } from 'react';
import site from '@/public/content/site.json';
import { mountContactMenu } from '@/public/scripts/contact-menu.js';

export function ContactMenu() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) return mountContactMenu(container.current, site);
  }, []);

  return <div className="contact-menu-mount" ref={container} />;
}
