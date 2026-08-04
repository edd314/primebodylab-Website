import {ImageResponse} from 'next/og';

export const alt = 'PrimeBodyLab — Massage & Sports Recovery in Pfaffenhofen';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0A0A0A',
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
            color: '#F5F5F0',
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
            color: '#D7FF3D',
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
            color: '#9A9A93',
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
