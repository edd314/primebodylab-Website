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
 *
 * The Terms cancellation clause, the Gift Vouchers clause and the Widerrufsrecht
 * (right of withdrawal) section are also NEW — see docs/client-questions.md.
 * These are unreviewed drafts and must be checked by a lawyer / a service such
 * as eRecht24 or IT-Recht Kanzlei before being treated as final: an imprecise
 * Storno-/Widerruf clause is a common Abmahnung target in Germany.
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

2. Cancellation, Rescheduling and No-Shows

Appointments are binding. You may cancel or reschedule free of charge up to 24 hours before the appointment for studio sessions, or up to 48 hours before for mobile (in-home) sessions.

For later cancellations or if you do not attend (no-show), the full price (100%) of the booked service is charged or non-refundable. For mobile appointments, a share of the travel costs may additionally be charged if the therapist had already set off at the time of cancellation.

If PrimeBodyLab has to cancel or reschedule an appointment at short notice, you may choose between a full refund or an alternative appointment on the original terms.

Coaching plans follow their own cancellation terms, communicated to you separately.

3. Payment Terms

Payment is due immediately following the service unless otherwise agreed. We accept payment via Revolut, bank transfer, or cash. All prices are final.

4. Gift Vouchers

Gift vouchers are valid from the date of purchase until the end of the third year following the purchase (statutory limitation period). Cash payout of the voucher value, including of any remaining balance, is excluded. Vouchers are transferable to another person but cannot be combined with other offers or discounts.

5. Right of Withdrawal

You have the right to withdraw from this contract within fourteen days without giving any reason. The withdrawal period is fourteen days from the day the contract is concluded.

To exercise the right of withdrawal, you must inform us (${site.ownerName}, PrimeBodyLab, ${site.street}, ${site.postcode} ${site.city}, ${site.email}, ${site.phone}) of your decision to withdraw from this contract by an unequivocal statement (e.g. by email).

Consequences of withdrawal: If you withdraw from this contract, we will reimburse all payments received from you without undue delay and at the latest within fourteen days of the day on which we receive notification of your withdrawal.

If you requested that the service begin during the withdrawal period, you must pay us a reasonable amount corresponding to the proportion of the service already provided up to the point of withdrawal, compared with the full scope of the services agreed in the contract. The right of withdrawal expires early once we have fully performed the service with your express consent.

6. Liability

Liability is limited to intent and gross negligence. We are not responsible for personal items brought into the studio.`;

const termsDe = `1. Leistungsumfang

Diese Bedingungen gelten für alle Beratungen und Studioleistungen von Eddie.

2. Stornierung, Terminänderung und Nichterscheinen

Termine sind verbindlich. Eine kostenfreie Absage oder Verschiebung ist möglich bis spätestens 24 Stunden vor Terminbeginn bei Studio-Terminen bzw. 48 Stunden vor Terminbeginn bei mobilen Terminen (bei dir zu Hause).

Bei späterer Absage oder bei Nichterscheinen (No-Show) wird der volle Preis (100 %) der gebuchten Leistung in Rechnung gestellt bzw. nicht erstattet. Bei mobilen Terminen kann zusätzlich ein Anfahrtskostenanteil berechnet werden, sofern die Anfahrt zum Zeitpunkt der Absage bereits angetreten wurde.

Muss PrimeBodyLab einen Termin kurzfristig absagen oder verschieben, erhältst du nach Wahl eine volle Rückerstattung oder einen alternativen Termin zu den ursprünglichen Konditionen.

Für Coaching-Pläne gelten eigene Stornierungsbedingungen, die dir separat mitgeteilt werden.

3. Zahlungsbedingungen

Die Zahlung ist unmittelbar nach der Leistung fällig, sofern nichts anderes vereinbart wurde. Wir akzeptieren Zahlungen per Revolut, Überweisung oder bar. Alle Preise sind Endpreise.

4. Gutscheine

Gutscheine sind ab Kaufdatum bis zum Ende des dritten auf den Kauf folgenden Jahres gültig (gesetzliche Verjährungsfrist). Eine Barauszahlung des Gutscheinwerts, auch von Restbeträgen, ist ausgeschlossen. Gutscheine sind auf andere Personen übertragbar, jedoch nicht mit anderen Aktionen oder Rabatten kombinierbar.

5. Widerrufsrecht

Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.

Um dein Widerrufsrecht auszuüben, musst du uns (${site.ownerName}, PrimeBodyLab, ${site.street}, ${site.postcode} ${site.city}, ${site.email}, ${site.phone}) mittels einer eindeutigen Erklärung (z. B. per E-Mail) über deinen Entschluss, diesen Vertrag zu widerrufen, informieren.

Folgen des Widerrufs: Wenn du diesen Vertrag widerrufst, erstatten wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag, an dem die Mitteilung über deinen Widerruf bei uns eingegangen ist.

Hast du verlangt, dass die Dienstleistung bereits innerhalb der Widerrufsfrist beginnen soll, zahlst du uns einen angemessenen Betrag, der dem Anteil der bis zu deinem Widerruf bereits erbrachten Leistung im Vergleich zum Gesamtumfang der vertraglich vereinbarten Leistungen entspricht. Das Widerrufsrecht erlischt vorzeitig, wenn wir die Dienstleistung mit deiner ausdrücklichen Zustimmung vollständig erbracht haben.

6. Haftung

Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Für mitgebrachte persönliche Gegenstände wird keine Haftung übernommen.`;

const data: Legal = {
  imprint: {de: imprintDe, en: imprintEn},
  privacy: {de: privacyDe, en: privacyEn},
  terms: {de: termsDe, en: termsEn},
};

export const legal = legalSchema.parse(data);
