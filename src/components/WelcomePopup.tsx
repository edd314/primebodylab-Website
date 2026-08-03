'use client';

import {useEffect, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {welcomePopup} from '@/content/welcomePopup';
import type {Locale} from '@/content/schema';

const STORAGE_KEY = 'pbl-welcome-popup-dismissed';
const SHOW_DELAY_MS = 1200;

/**
 * First-visit-only offer popup. Uses localStorage, not IP/visitor tracking —
 * nothing here is sent anywhere, so it doesn't trigger the cookie-consent
 * requirement the rest of the site was built to avoid. The email itself IS
 * sent to /api/subscribe on submit, which adds it to Mailchimp with status
 * "pending" — Mailchimp's own confirmation email covers German double
 * opt-in. The discount code still shows immediately regardless of whether
 * they confirm; only the ongoing mailing-list subscription is gated on that.
 */
export function WelcomePopup({locale}: {locale: Locale}) {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') dismiss();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(false);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });
      if (!response.ok) throw new Error('subscribe failed');

      localStorage.setItem(STORAGE_KEY, '1');
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-heading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-line bg-surface p-7">
        <button
          type="button"
          onClick={dismiss}
          aria-label={locale === 'de' ? 'Schließen' : 'Close'}
          className="absolute top-4 right-4 text-muted transition-colors hover:text-ink"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center">
            <h2 id="welcome-popup-heading" className="font-display text-2xl">
              {welcomePopup.confirmHeading[locale]}
            </h2>
            <p className="mt-3 text-sm text-muted">{welcomePopup.confirmBody[locale]}</p>
            <p className="mt-4 rounded-lg border border-dashed border-line bg-bone py-3 text-center font-display text-xl tracking-[0.15em] text-sage">
              {welcomePopup.discountCode}
            </p>
            <Link
              href="/book"
              onClick={dismiss}
              className="mt-6 inline-block rounded-full bg-forest px-7 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              {welcomePopup.bookLabel[locale]}
            </Link>
          </div>
        ) : (
          <>
            <h2 id="welcome-popup-heading" className="font-display text-2xl text-balance">
              {welcomePopup.heading[locale]}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{welcomePopup.body[locale]}</p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={welcomePopup.emailPlaceholder[locale]}
                className="rounded-full border border-line bg-bone px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-sage focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-forest px-7 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {welcomePopup.submitLabel[locale]}
              </button>
            </form>

            {error && (
              <p role="alert" className="mt-3 text-center text-xs text-sage">
                {welcomePopup.errorMessage[locale]}
              </p>
            )}

            <button
              type="button"
              onClick={dismiss}
              className="mt-4 w-full text-center text-xs text-muted underline-offset-2 hover:underline"
            >
              {welcomePopup.dismissLabel[locale]}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
