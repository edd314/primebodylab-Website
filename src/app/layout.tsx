import type {ReactNode} from 'react';
import '@/styles/globals.css';

export const metadata = {
  metadataBase: new URL('https://www.primebodylab.de'),
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
