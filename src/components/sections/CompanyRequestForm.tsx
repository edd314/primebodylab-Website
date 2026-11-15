'use client';

import {useMemo, useState} from 'react';
import type {Companies, Locale} from '@/content/schema';
import {computeCompanyQuote} from '@/lib/pricing';

type Props = {
  locale: Locale;
  companies: Companies;
  ratePerMinute: number;
  whatsappBaseUrl: string;
};

/**
 * The full configurator + lead form on /companies. Shares its pricing math
 * with the homepage teaser (CompanyCalculator) via computeCompanyQuote, but
 * adds the optional commitment lever and the contact fields needed to turn
 * a quote into an actual request. Submitting never "books" anything — it
 * only prepares a WhatsApp message, since corporate arrangements here are
 * set up by a short call, not an instant self-serve slot.
 */
export function CompanyRequestForm({locale, companies, ratePerMinute, whatsappBaseUrl}: Props) {
  const {calculator, requestPage} = companies;

  const [employees, setEmployees] = useState(calculator.defaultEmployees);
  const [minutes, setMinutes] = useState(calculator.minuteOptions[0]);
  const [frequencyId, setFrequencyId] = useState(calculator.frequencyOptions[0].id);
  const [commitmentId, setCommitmentId] = useState(calculator.commitmentOptions[0].id);

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const frequency = calculator.frequencyOptions.find((option) => option.id === frequencyId)!;
  const commitment = calculator.commitmentOptions.find((option) => option.id === commitmentId)!;

  const {total, perHead} = useMemo(
    () =>
      computeCompanyQuote({
        employees,
        minutes,
        ratePerMinute,
        extraDiscountPercent: frequency.extraDiscountPercent,
        commitmentDiscountPercent: commitment.extraDiscountPercent,
      }),
    [employees, minutes, ratePerMinute, frequency, commitment],
  );

  const message = useMemo(() => {
    const lines =
      locale === 'de'
        ? [
            `Firmenanfrage – ${companyName || '(Unternehmen)'}`,
            `Ansprechpartner: ${contactName || '-'}`,
            `E-Mail: ${email || '-'}`,
            phone ? `Telefon: ${phone}` : null,
            '',
            `Mitarbeitende pro Termin: ${employees}`,
            `Dauer pro Person: ${minutes} Min`,
            `Rhythmus: ${frequency.label.de}`,
            `Vorab-Festlegung: ${commitment.label.de}`,
            `Geschätzt: ${currency.format(total)} pro Team-Tag (${currency.format(perHead)} pro Person)`,
          ]
        : [
            `Corporate request – ${companyName || '(Company)'}`,
            `Contact: ${contactName || '-'}`,
            `Email: ${email || '-'}`,
            phone ? `Phone: ${phone}` : null,
            '',
            `Employees per session: ${employees}`,
            `Duration per person: ${minutes} min`,
            `Rhythm: ${frequency.label.en}`,
            `Upfront commitment: ${commitment.label.en}`,
            `Estimated: ${currency.format(total)} per team day (${currency.format(perHead)} per person)`,
          ];
    return lines.filter((line): line is string => line !== null).join('\n');
  }, [locale, companyName, contactName, email, phone, employees, minutes, frequency, commitment, currency, total, perHead]);

  const whatsappHref = `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);

    // Best-effort backup record — the request is already fully usable via
    // WhatsApp even if this fails (no Mailchimp configured, network error,
    // etc.), so failures here are swallowed rather than shown to the visitor.
    fetch('/api/corporate-lead', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        companyName,
        contactName,
        email,
        phone,
        employees,
        minutes,
        frequency: frequency.label.de,
        commitment: commitment.label.de,
        total,
        perHead,
      }),
    }).catch(() => {});
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the message is already visible in the
      // confirmation panel for manual copying.
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-7 text-center sm:p-10" data-testid="company-request-confirmation">
        <h2 className="font-display text-2xl">{requestPage.confirmation.heading[locale]}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{requestPage.confirmation.body[locale]}</p>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-forest px-7 py-3 text-sm font-medium text-bone transition-opacity hover:opacity-90"
        >
          {requestPage.confirmation.whatsappButtonLabel[locale]}
        </a>

        <div className="mt-6 text-left">
          <pre className="whitespace-pre-wrap rounded-lg border border-dashed border-line bg-bone p-4 text-xs leading-relaxed text-ink">
            {message}
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 rounded-full border border-line px-5 py-2 text-xs font-semibold text-ink transition-colors hover:border-sage"
          >
            {copied ? requestPage.confirmation.copiedLabel[locale] : requestPage.confirmation.copyButtonLabel[locale]}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-surface p-7 sm:p-10" data-testid="company-request-form">
      <label className="flex items-center justify-between text-xs font-semibold text-ink/85">
        <span>{calculator.employeesLabel[locale]}</span>
        <span>{employees}</span>
      </label>
      <input
        type="range"
        min={calculator.minEmployees}
        max={calculator.maxEmployees}
        value={employees}
        onChange={(event) => setEmployees(Number(event.target.value))}
        className="mt-2 w-full accent-sage"
        aria-label={calculator.employeesLabel[locale]}
      />

      <p className="mt-5 text-xs font-semibold text-ink/85">{calculator.durationLabel[locale]}</p>
      <div className="mt-2 flex gap-2">
        {calculator.minuteOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMinutes(option)}
            aria-pressed={minutes === option}
            className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
              minutes === option ? 'border-sage bg-sage text-ink' : 'border-line text-muted hover:border-sage'
            }`}
          >
            {option} {locale === 'de' ? 'Min' : 'min'}
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs font-semibold text-ink/85">{calculator.frequencyLabel[locale]}</p>
      <div className="mt-2 flex gap-2">
        {calculator.frequencyOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFrequencyId(option.id)}
            aria-pressed={frequencyId === option.id}
            className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
              frequencyId === option.id ? 'border-sage bg-sage text-ink' : 'border-line text-muted hover:border-sage'
            }`}
          >
            {option.label[locale]}
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs font-semibold text-ink/85">
        {locale === 'de' ? 'Vorab-Festlegung (optional)' : 'Upfront commitment (optional)'}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {calculator.commitmentOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setCommitmentId(option.id)}
            aria-pressed={commitmentId === option.id}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              commitmentId === option.id ? 'border-sage bg-sage text-ink' : 'border-line text-muted hover:border-sage'
            }`}
          >
            {option.label[locale]}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-8 border-t border-line pt-6">
        <div>
          <span className="block font-display text-2xl text-sage italic">{currency.format(total)}</span>
          <span className="text-[11px] text-muted">{calculator.totalLabel[locale]}</span>
        </div>
        <div>
          <span className="block font-display text-2xl text-sage italic">{currency.format(perHead)}</span>
          <span className="text-[11px] text-muted">{calculator.perHeadLabel[locale]}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6">
        <input
          type="text"
          required
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          placeholder={requestPage.form.companyNameLabel[locale]}
          className="rounded-full border border-line bg-bone px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-sage focus:outline-none"
        />
        <input
          type="text"
          required
          value={contactName}
          onChange={(event) => setContactName(event.target.value)}
          placeholder={requestPage.form.contactNameLabel[locale]}
          className="rounded-full border border-line bg-bone px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-sage focus:outline-none"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={requestPage.form.emailLabel[locale]}
          className="rounded-full border border-line bg-bone px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-sage focus:outline-none"
        />
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder={`${requestPage.form.phoneLabel[locale]} ${requestPage.form.phoneOptionalNote[locale]}`}
          className="rounded-full border border-line bg-bone px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-sage focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-forest px-7 py-3 text-sm font-medium text-bone transition-opacity hover:opacity-90"
      >
        {requestPage.form.submitLabel[locale]}
      </button>
      <p className="mt-3 text-[11px] text-muted">{requestPage.form.privacyNote[locale]}</p>
    </form>
  );
}
