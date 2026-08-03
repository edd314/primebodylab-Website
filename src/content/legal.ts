import {site} from './site';
import {legalSchema, type Legal} from './schema';

/**
 * The Impressum is composed from `site` so it can never drift out of sync with
 * the footer. Privacy and Terms are transcribed from the owner's existing
 * /terms-conditions-and-privacy-policy page.
 *
 * The "Hosting and third-party services" section is NEW — it describes this
 * site's actual setup (Vercel hosting, click-to-load Acuity) which the old
 * Squarespace policy does not cover. It is flagged in docs/client-questions.md
 * for Eddie to confirm.
 */

const imprintDe = `Angaben gemäß § 5 DDG

${site.ownerName}
PrimeBodyLab
${site.street}
${site.postcode} ${site.city}
Deutschland

Kontakt
Telefon: ${site.phone}
E-Mail: ${site.email}

Steuernummer
${site.taxId}

Verantwortlich für den Inhalt
${site.ownerName}, Anschrift wie oben.`;

const imprintEn = `Information pursuant to § 5 DDG

${site.ownerName}
PrimeBodyLab
${site.street}
${site.postcode} ${site.city}
Germany

Contact
Phone: ${site.phone}
Email: ${site.email}

Tax number
${site.taxId}

Responsible for content
${site.ownerName}, address as above.`;

const privacyEn = `1. General Information

This policy explains how we handle your personal data when you visit our website. Personal data is any data that can identify you personally.

2. Data Collection on Our Website

• Cookies: Our website may use cookies to improve your browsing experience. You can disable these in your browser settings.
• Contact Form: If you send us an inquiry via email or a contact form, we store your details to process the request. We do not share this information without your consent.
• Server Log Files: The website provider automatically collects and stores information that your browser transmits to us (e.g., IP address, time of request).

3. Your Rights

You have the right to request information about your stored personal data at any time, free of charge. You also have the right to request that it be corrected, blocked, or deleted.

4. Hosting and Third-Party Services

This website is hosted by Vercel Inc. Server log files, including your IP address, are processed by the host in order to deliver the site.

Fonts used on this site are served from our own server. No connection is made to Google Fonts or any other external font provider.

Booking is handled by Acuity Scheduling. The booking calendar is not loaded when you open the booking page. It loads only after you actively press the button to load it, at which point your data is transmitted to Acuity. If you do not press that button, no connection to Acuity is made.`;

const privacyDe = `1. Allgemeine Hinweise

Diese Erklärung informiert darüber, wie wir mit deinen personenbezogenen Daten umgehen, wenn du unsere Website besuchst. Personenbezogene Daten sind alle Daten, mit denen du persönlich identifiziert werden kannst.

2. Datenerfassung auf unserer Website

• Cookies: Unsere Website kann Cookies verwenden, um dein Surferlebnis zu verbessern. Du kannst diese in den Einstellungen deines Browsers deaktivieren.
• Kontaktformular: Wenn du uns eine Anfrage per E-Mail oder über ein Kontaktformular sendest, speichern wir deine Angaben zur Bearbeitung der Anfrage. Wir geben diese Informationen nicht ohne deine Einwilligung weiter.
• Server-Logfiles: Der Websiteanbieter erhebt und speichert automatisch Informationen, die dein Browser an uns übermittelt (z. B. IP-Adresse, Zeitpunkt der Anfrage).

3. Deine Rechte

Du hast jederzeit das Recht, unentgeltlich Auskunft über deine gespeicherten personenbezogenen Daten zu verlangen. Außerdem hast du das Recht, deren Berichtigung, Sperrung oder Löschung zu verlangen.

4. Hosting und Dienste von Dritten

Diese Website wird von Vercel Inc. gehostet. Server-Logfiles einschließlich deiner IP-Adresse werden vom Hoster verarbeitet, um die Website auszuliefern.

Die auf dieser Website verwendeten Schriftarten werden von unserem eigenen Server ausgeliefert. Es wird keine Verbindung zu Google Fonts oder einem anderen externen Schriftanbieter hergestellt.

Die Terminbuchung erfolgt über Acuity Scheduling. Der Buchungskalender wird beim Aufrufen der Buchungsseite nicht geladen. Er wird erst geladen, nachdem du aktiv auf die entsprechende Schaltfläche geklickt hast — zu diesem Zeitpunkt werden deine Daten an Acuity übertragen. Klickst du nicht darauf, wird keine Verbindung zu Acuity hergestellt.`;

const termsEn = `1. Scope of Services

These terms apply to all consultations and studio services provided by Eddie.

2. Appointments and Cancellations

Appointments are binding. If you need to cancel or reschedule, please do so at least 24 hours in advance for studio sessions, or 48 hours in advance for mobile (in-home) sessions. Late cancellations may be subject to a cancellation fee. Coaching plans follow their own cancellation terms, communicated separately.

3. Payment Terms

Payment is due immediately following the service unless otherwise agreed. We accept payment via Revolut, bank transfer, or cash. All prices are final.

4. Liability

Liability is limited to intent and gross negligence. We are not responsible for personal items brought into the studio.`;

const termsDe = `1. Leistungsumfang

Diese Bedingungen gelten für alle Beratungen und Studioleistungen von Eddie.

2. Termine und Stornierungen

Termine sind verbindlich. Wenn du einen Termin absagen oder verschieben möchtest, tu dies bitte mindestens 24 Stunden im Voraus bei Studio-Terminen bzw. 48 Stunden im Voraus bei mobilen Terminen (bei dir zu Hause). Bei verspäteter Absage kann eine Stornogebühr anfallen. Für Coaching-Pläne gelten eigene Stornierungsbedingungen, die separat mitgeteilt werden.

3. Zahlungsbedingungen

Die Zahlung ist unmittelbar nach der Leistung fällig, sofern nichts anderes vereinbart wurde. Wir akzeptieren Zahlungen per Revolut, Überweisung oder bar. Alle Preise sind Endpreise.

4. Haftung

Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Für mitgebrachte persönliche Gegenstände wird keine Haftung übernommen.`;

const data: Legal = {
  imprint: {de: imprintDe, en: imprintEn},
  privacy: {de: privacyDe, en: privacyEn},
  terms: {de: termsDe, en: termsEn},
};

export const legal = legalSchema.parse(data);
