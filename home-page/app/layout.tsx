import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Keyan — A curious designer', icons: { icon: '/images/imgImage81.png' }, description: 'A curious product designer turning complex problems into clear, human experiences. Selected projects, design experiments, and a little about Keyan.' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="en"><body>{children}</body></html>;}
