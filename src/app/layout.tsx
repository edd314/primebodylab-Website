import type {ReactNode} from 'react';
import {bodyFont, displayFont} from '@/lib/fonts';
import '@/styles/globals.css';

export const metadata = {
  metadataBase: new URL('https://www.primebodylab.de'),
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="de" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-bone text-ink antialiased">{children}</body>
    </html>
  );
}
