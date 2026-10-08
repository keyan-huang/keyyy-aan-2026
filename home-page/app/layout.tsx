import type { Metadata } from 'next';
import './globals.css';

import site from '@/public/content/site.json';

const loaderCriticalStyles = `
  html { background: #fff; color-scheme: light; }
  body { background: #fff; }
  .portfolio-loader { display: none; }
  .js .portfolio-loader:not([hidden]) {
    position: fixed;
    z-index: 1000;
    inset: 0;
    display: grid;
    place-items: center;
    background: #fff;
    opacity: 1;
    visibility: visible;
    transition:
      opacity 700ms cubic-bezier(0.4, 0, 0.2, 1),
      visibility 0s linear 700ms;
  }
  html.portfolio-loading,
  html.portfolio-loading body { overflow: hidden; }
  .portfolio-loader-content {
    display: grid;
    justify-items: center;
    gap: 28px;
    width: min(280px, calc(100vw - 48px));
  }
  .portfolio-loader-art-stage {
    position: relative;
    width: 180px;
    height: 180px;
  }
  .portfolio-loader-swap-image {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    animation: portfolio-loader-art-swap 5s infinite both;
    animation-delay: calc(var(--portfolio-loader-art-index) * 1s - 0.2s);
  }
  .portfolio-loader-bar {
    width: 100%;
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: #dfe7f1;
  }
  .portfolio-loader-fill {
    display: block;
    width: 0;
    height: 100%;
    border-radius: inherit;
    background: #0c6cd1;
  }
  .portfolio-loader-meter {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  @keyframes portfolio-loader-art-swap {
    0% { opacity: 0; transform: translateY(18px) rotate(-7deg) scale(0.88); }
    4% { opacity: 1; transform: translateY(0) rotate(2deg) scale(1.04); }
    8% { opacity: 1; transform: translateY(0) rotate(-1deg) scale(1); }
    18% { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
    22% { opacity: 0; transform: translateY(-16px) rotate(6deg) scale(0.94); }
    100% { opacity: 0; transform: translateY(-16px) rotate(6deg) scale(0.94); }
  }
  @media (prefers-reduced-motion: reduce) {
    .portfolio-loader-swap-image { animation: none; opacity: 0; }
    .portfolio-loader-swap-image:first-child { opacity: 1; transform: none; }
  }
`;

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
        <meta name="color-scheme" content="light" />
        <style dangerouslySetInnerHTML={{ __html: loaderCriticalStyles }} />
        <link
          rel="preload"
          href="/images/loader-stack/cursor.png?v=2x"
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
