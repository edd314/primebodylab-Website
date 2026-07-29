import type {ReactNode} from 'react';
import '@/styles/globals.css';

export const metadata = {
  metadataBase: new URL('https://www.primebodylab.de'),
};

/**
 * The [locale] layout renders <html> and <body>, because the lang attribute and
 * the font variables both depend on the resolved locale. This root layout exists
 * only to load global CSS and set metadataBase.
 */
export default function RootLayout({children}: {children: ReactNode}) {
  return children;
}
