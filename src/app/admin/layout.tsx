// src/app/admin/layout.tsx
import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import Link from 'next/link';
import {bodyFont, displayFont} from '@/lib/fonts';
import {hasAdminSession} from '@/lib/crm/adminAuth';
import {logout} from './actions';

export const metadata: Metadata = {
  robots: {index: false, follow: false},
  appleWebApp: {
    capable: true,
    title: 'PrimeBodyLab Admin',
    statusBarStyle: 'default',
  },
};

export default async function AdminLayout({children}: {children: ReactNode}) {
  // Only show the admin header (with its Log out button) to a logged-in
  // session, so the login page doesn't offer a logout to logged-out visitors.
  const loggedIn = await hasAdminSession();

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-bone text-ink antialiased">
        {loggedIn && (
          <header className="flex items-center justify-between border-b border-line px-6 py-4">
            <Link href="/admin" className="font-display text-lg">
              PrimeBodyLab Admin
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm text-muted transition-colors hover:text-ink">
                Log out
              </button>
            </form>
          </header>
        )}
        <main className="px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
