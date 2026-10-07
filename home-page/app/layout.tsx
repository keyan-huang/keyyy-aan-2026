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
      <head>
        <link
          rel="preload"
          href="/images/portfolio-loader-logo.png"
          as="image"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js','portfolio-loading');",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
