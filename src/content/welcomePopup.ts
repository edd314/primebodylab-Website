import {welcomePopupSchema} from './schema';

/**
 * `discountCode` is a placeholder. It only works if Eddie creates a matching
 * coupon in Acuity (Scheduling → Coupons) — this text alone applies no
 * discount. Swap the value once that coupon exists.
 */
export const welcomePopup = welcomePopupSchema.parse({
  heading: {
    de: 'Willkommen bei PrimeBodyLab',
    en: 'Welcome to PrimeBodyLab',
  },
  body: {
    de: 'Trag dich ein und sichere dir 15 % Rabatt auf deinen ersten Termin.',
    en: 'Sign up and get 15% off your first appointment.',
  },
  emailPlaceholder: {
    de: 'Deine E-Mail-Adresse',
    en: 'Your email address',
  },
  submitLabel: {de: 'Rabatt sichern', en: 'Claim Discount'},
  dismissLabel: {de: 'Nein, danke', en: 'No thanks'},
  confirmHeading: {de: 'Geschafft!', en: "You're in!"},
  confirmBody: {
    de: 'Gib diesen Code bei deiner Buchung an:',
    en: 'Use this code when you book:',
  },
  bookLabel: {de: 'Jetzt buchen', en: 'Book Now'},
  errorMessage: {
    de: 'Da ist etwas schiefgelaufen. Bitte versuche es später erneut.',
    en: 'Something went wrong. Please try again later.',
  },
  discountCode: 'WELCOME15',
});
