import {ImageResponse} from 'next/og';

export const alt = 'PrimeBodyLab — Massage & Sports Recovery in Pfaffenhofen';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

/**
 * Colors below are hardcoded, not read from the @theme tokens in globals.css —
 * next/og's ImageResponse renders via Satori outside the CSS cascade, so it
 * can't consume CSS custom properties. If the palette changes again, update
 * these to match src/styles/globals.css by hand.
 */

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F7F1E7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 900,
            color: '#2B2116',
            letterSpacing: -2,
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
          }}
        >
          PrimeBodyLab
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 36,
            fontWeight: 700,
            color: '#6B4A31',
            textTransform: 'uppercase',
            letterSpacing: 4,
            fontFamily: 'sans-serif',
          }}
        >
          Massage & Sports Recovery
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            fontSize: 28,
            color: '#6E6049',
            fontFamily: 'sans-serif',
          }}
        >
          Pfaffenhofen · Studio & Mobil
        </div>
      </div>
    ),
    {...size},
  );
}
