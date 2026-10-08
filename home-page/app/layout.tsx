import type { Metadata } from 'next';
import './globals.css';

import site from '@/public/content/site.json';

export const metadata: Metadata = {
  title: site.title,
  icons: { icon: `/${site.logo}` },
  description: site.description,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
